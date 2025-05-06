"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApiData } from "../../hooks/useApiData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  CalendarDays,
  FileText,
  Users,
  CheckCircle2,
  Calendar,
  Search,
  CopyCheck,
  Copy,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import CoordinatorLayout from "../../components/layouts/CoordinatorLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ScrollArea } from "../../components/ui/scroll-area";
import { PaginatedChart } from "./PaginatedChart";

const CoordinatorDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("tinjauan");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const studentsQuery = useApiData({ type: "students" });
  const seminarsQuery = useApiData({ type: "seminars" });

  const isLoading = studentsQuery.isLoading || seminarsQuery.isLoading;
  const isError = studentsQuery.isError || seminarsQuery.isError;

  if (isLoading || !token || !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-muted-foreground py-10">
          Memuat data...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-600 py-10">
          Gagal memuat data. Silakan coba lagi nanti.
        </div>
      </div>
    );
  }

  const students = studentsQuery.data || [];
  const seminars = seminarsQuery.data || [];

  // Hitung statistik seminar berdasarkan status
  const submittedSeminars = seminars.filter(
    (seminar: any) => seminar.status === "SUBMITTED"
  );
  const scheduledSeminars = seminars.filter(
    (seminar: any) => seminar.status === "SCHEDULED"
  );
  const filteredCompletedSeminars = seminars.filter((seminar: any) => {
    // First filter by completion status
    const isCompleted = seminar.status === "COMPLETED";

    // Then filter by search query (title, student name, or NIM)
    const matchesSearch =
      searchQuery.trim() === "" ||
      (seminar.title &&
        seminar.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (seminar.student?.name &&
        seminar.student.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())) ||
      (seminar.studentNIM &&
        seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()));

    // Then filter by seminar type
    const matchesType = statusFilter === "all" || seminar.type === statusFilter;

    return isCompleted && matchesSearch && matchesType;
  });

  const seminarTypes = ["PROPOSAL", "HASIL"];
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const filteredStudents = students.filter(
    (student: any) =>
      student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      student.nim.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (typeof student.semester === "string" &&
        student.semester.toLowerCase().includes(searchStudent.toLowerCase())) ||
      (typeof student.semester === "number" &&
        student.semester.toString().includes(searchStudent))
  );

  // Process seminars data for trend chart
  const processSeminarTrends = () => {
    // Create a map of months for the last 6 months
    const months: {
      month: string;
      date: Date;
      proposal: number;
      hasil: number;
    }[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString("id-ID", { month: "short" });
      months.push({
        month: monthName,
        date: month,
        proposal: 0,
        hasil: 0,
      });
    }

    // Count seminars by month and type
    seminars.forEach((seminar: any) => {
      // Use time field for scheduled seminars (from the API)
      if (!seminar.time) return;

      const seminarDate = new Date(seminar.time);
      const monthData = months.find(
        (m) =>
          m.date.getMonth() === seminarDate.getMonth() &&
          m.date.getFullYear() === seminarDate.getFullYear()
      );

      if (monthData) {
        if (seminar.type === "PROPOSAL") {
          monthData.proposal += 1;
        } else if (seminar.type === "HASIL") {
          monthData.hasil += 1;
        }
      }
    });

    // Return just the formatted data for the chart
    return months.map((m) => ({
      month: m.month,
      proposal: m.proposal,
      hasil: m.hasil,
    }));
  };

  // Create the data for the seminar trends chart
  const seminarTrends = processSeminarTrends();

  // Generate completion rate data based on seminars
  const processCompletionRate = () => {
    const months: {
      month: string;
      date: Date;
      completed: number;
      total: number;
    }[] = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString("id-ID", { month: "short" });
      months.push({
        month: monthName,
        date: month,
        completed: 0,
        total: 0,
      });
    }

    // Count completed vs total seminars by month
    seminars.forEach((seminar: any) => {
      if (!seminar.scheduleDate) return;

      const seminarDate = new Date(seminar.scheduleDate);
      const monthData = months.find(
        (m) =>
          m.date.getMonth() === seminarDate.getMonth() &&
          m.date.getFullYear() === seminarDate.getFullYear()
      );

      if (monthData) {
        monthData.total += 1;
        if (seminar.status === "COMPLETED") {
          monthData.completed += 1;
        }
      }
    });

    // Calculate completion rate as percentage
    return months.map((m) => ({
      month: m.month,
      rate: m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0,
    }));
  };

  // Create the data for completion rate chart
  const completionRate = processCompletionRate();

  // Generate data for lecturer/student distribution
  const generateLecturerStudentData = () => {
    const lecturerMap = new Map();

    // Count students per lecturer from seminar data - using advisors
    seminars.forEach((seminar: { advisors: any[] }) => {
      if (seminar.advisors && seminar.advisors.length > 0) {
        // Each advisor in the seminar counts as one supervision
        seminar.advisors.forEach((advisor) => {
          if (advisor.lecturer && advisor.lecturer.name) {
            const lecturerName = advisor.lecturer.name;
            if (!lecturerMap.has(lecturerName)) {
              lecturerMap.set(lecturerName, 0);
            }
            // Increment the count for this lecturer
            lecturerMap.set(lecturerName, lecturerMap.get(lecturerName) + 1);
          }
        });
      }
    });

    // Convert map to array format for chart
    const chartData = Array.from(lecturerMap.entries())
      .map(([dosen, mahasiswa]) => ({ dosen, mahasiswa }))
      .sort((a, b) => b.mahasiswa - a.mahasiswa); // Sort from most to least students

    return chartData;
  };

  // Generate data for lecturer/student distribution as assessors
  const generateAssessorDistributionData = () => {
    const assessorMap = new Map();

    // Count students per lecturer from seminar data - using assessors
    seminars.forEach((seminar: { assessors: any[] }) => {
      if (seminar.assessors && seminar.assessors.length > 0) {
        // Each assessor in the seminar counts as one examination
        seminar.assessors.forEach((assessor) => {
          if (assessor.lecturer && assessor.lecturer.name) {
            const lecturerName = assessor.lecturer.name;
            if (!assessorMap.has(lecturerName)) {
              assessorMap.set(lecturerName, 0);
            }
            // Increment the count for this lecturer as assessor
            assessorMap.set(lecturerName, assessorMap.get(lecturerName) + 1);
          }
        });
      }
    });

    // Convert map to array format for chart
    const assessorChartData = Array.from(assessorMap.entries())
      .map(([dosen, mahasiswa]) => ({ dosen, mahasiswa }))
      .sort((a, b) => b.mahasiswa - a.mahasiswa); // Sort from most to least students

    return assessorChartData;
  };

  // Create data for lecturer-student distribution chart (as advisors)
  const advisorChartData = generateLecturerStudentData();

  // Create data for lecturer-student distribution chart (as assessorss)
  const assessorChartData = generateAssessorDistributionData();

  // Fungsi untuk menyalin nomor telepon
  const handleCopy = (phoneNumber: string, studentId: string) => {
    navigator.clipboard
      .writeText(phoneNumber)
      .then(() => {
        setCopied(studentId);

        // Reset status copied setelah 2 detik
        setTimeout(() => {
          setCopied(null);
        }, 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin teks: ", err);
      });
  };

  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fungsi untuk format waktu
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CoordinatorLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary-800">
              Coordinator Dashboard
            </h1>
            <p className="text-primary-600">
              Selamat datang, {user.profile?.name}!
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-primary-600" />
              <Input
                type="search"
                placeholder="Cari seminar..."
                className="w-full md:w-[200px] pl-8 border-primary-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary-700">
              <Calendar className="mr-2 h-4 w-4" />
              Lihat Kalender
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(80px,_auto)] gap-4 mb-6">
          <Card className="bg-radial-[at_380%_380%] from-primary-600 from-80% to-20% to-primary-800 border-primary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                Diajukan
              </CardTitle>
              <CardDescription className="text-primary-foreground text-sm">
                Menunggu untuk dijadwalkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-5xl -my-1 font-bold text-primary-foreground font-heading">
                  {submittedSeminars.length}
                </div>
                <div className="p-2 bg-primary rounded-full border-primary-foreground border">
                  <FileText className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary-400 text-primary-700 hover:bg-accent"
              >
                Lihat Pengajuan Seminar
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-radial-[at_380%_380%] from-primary-600 from-80% to-20% to-primary-800 border-primary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                Dijadwalkan
              </CardTitle>
              <CardDescription className="text-primary-foreground text-sm">
                Menunggu untuk dinilai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-5xl -my-1 font-bold text-primary-foreground font-heading">
                  {scheduledSeminars.length}
                </div>
                <div className="p-2 bg-primary rounded-full border-primary-foreground border">
                  <CalendarDays className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary-400 text-primary-700 hover:bg-accent"
              >
                Lihat Jadwal Seminar
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-radial-[at_380%_380%] from-primary-600 from-80% to-20% to-primary-800 border-primary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                Mahasiswa
              </CardTitle>
              <CardDescription className="text-primary-foreground text-sm">
                Yang telah terdaftar di sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-5xl -my-1 font-bold text-primary-foreground font-heading">
                  {students.length}
                </div>
                <div className="p-2 bg-primary rounded-full border-primary-foreground border">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-primary-400 text-primary-700 hover:bg-accent"
                onClick={() => setActiveTab("mahasiswa")}
              >
                Lihat Mahasiswa
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-radial-[at_380%_380%] from-primary-600 from-80% to-20% to-primary-800 border-primary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                Selesai
              </CardTitle>
              <CardDescription className="text-primary-foreground text-sm">
                Telah selesai dinilai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-5xl -my-1 font-bold text-primary-foreground font-heading">
                  {filteredCompletedSeminars.length}
                </div>
                <div className="p-2 bg-primary rounded-full border-primary-foreground border">
                  <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full border-primary-400 text-primary-700 hover:bg-accent"
                onClick={() => setActiveTab("selesai")}
              >
                Lihat Riwayat Seminar
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-primary">
            <TabsTrigger
              value="tinjauan"
              className={`text-primary-foreground ${
                activeTab === "tinjauan" ? "text-primary-800" : ""
              }`}
            >
              Tinjauan
            </TabsTrigger>
            <TabsTrigger
              value="mahasiswa"
              className={`text-primary-foreground ${
                activeTab === "mahasiswa" ? "text-primary-800" : ""
              }`}
            >
              Mahasiswa
            </TabsTrigger>
            <TabsTrigger
              value="selesai"
              className={`text-primary-foreground ${
                activeTab === "selesai" ? "text-primary-800" : ""
              }`}
            >
              Selesai
            </TabsTrigger>
          </TabsList>

          {/* tinjauan Tab - Now using a 4-column grid with minmax 200px */}
          <TabsContent value="tinjauan">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-6">
              <Card className="bg-white sm:col-span-4 overflow-hidden">
                <CardHeader className="bg-primary">
                  <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                    Tren Seminar
                  </CardTitle>
                  <CardDescription className="text-primary-foreground text-sm">
                    Jumlah seminar dalam satu bulan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={seminarTrends}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="proposal"
                          name="Seminar Proposal"
                          fill="var(--color-primary-600)"
                        />
                        <Bar
                          dataKey="hasil"
                          name="Seminar Hasil"
                          fill="var(--color-primary-400)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Chart Pembimbing - Menggunakan PaginatedChart */}
              <div className="sm:col-span-2">
                <PaginatedChart
                  data={advisorChartData}
                  title="Pembagian Mahasiswa Per Pembimbing"
                  description="Jumlah mahasiswa bimbingan per dosen"
                />
              </div>

              {/* Chart Penguji - Menggunakan PaginatedChart */}
              <div className="sm:col-span-2">
                <PaginatedChart
                  data={assessorChartData}
                  title="Pembagian Mahasiswa Per Penguji"
                  description="Jumlah mahasiswa yang diuji per dosen"
                />
              </div>
            </div>
          </TabsContent>

          {/* New mahasiswa Tab */}
          <TabsContent value="mahasiswa">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
                      Mahasiswa
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Telah terdaftar di sistem
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-3 h-4 w-4 text-primary-600" />
                      <Input
                        type="search"
                        placeholder="Cari mahasiswa..."
                        className="w-full md:w-[200px] pl-8 border-primary-400"
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-6">
                {/* Desktop View */}
                <div className="hidden md:block rounded-sm overflow-x-auto border border-primary">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-primary text-primary-foreground font-heading font-medium text-xs lg:text-sm">
                        <th className="p-3 lg:p-4 w-[30%]">Mahasiswa</th>
                        <th className="p-3 lg:p-4 w-[30%]">NIM</th>
                        <th className="p-3 lg:p-4 w-[20%]">Semester</th>
                        <th className="p-3 lg:p-4 w-[20%]">No. HP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student: any) => {
                          return (
                            <tr
                              key={student.id}
                              className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                            >
                              <td className="p-3 lg:p-4">
                                <div className="font-medium">
                                  {student.name}
                                </div>
                              </td>
                              <td className="p-3 lg:p-4">{student.nim}</td>
                              <td className="p-3 lg:p-4">{student.semester}</td>
                              <td className="p-3 lg:p-4">
                                {student.phoneNumber}
                                <button
                                  onClick={() =>
                                    handleCopy(student.phoneNumber, student.id)
                                  }
                                  className="ml-4 p-1 text-xs text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-300 rounded"
                                  aria-label="Copy phone number"
                                >
                                  {copied === student.id ? (
                                    <span className="flex items-center">
                                      <CopyCheck className="h-3.5 w-3.5 mr-1" />
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <Copy className="h-3.5 w-3.5 mr-1" />
                                    </span>
                                  )}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-primary-600"
                          >
                            Tidak ada seminar proposal yang dijadwalkan untuk
                            Anda bimbing.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-3 sm:space-y-4">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student: any) => {
                        return (
                          <div
                            key={student.id}
                            className="border border-primary rounded-sm p-2 sm:p-3 text-primary-800 shadow-sm"
                          >
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                              <div className="space-y-2 sm:space-y-3">
                                <div>
                                  <h3 className="text-xs font-bold text-primary-600">
                                    Nama
                                  </h3>
                                  <p className="font-medium text-xs sm:text-sm break-words line-clamp-2 sm:line-clamp-none">
                                    {student.name}
                                  </p>
                                </div>
                                <div>
                                  <h3 className="text-xs font-bold text-primary-600">
                                    Semester
                                  </h3>
                                  <p className="text-xs sm:text-sm">
                                    {student.semester}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                <div className="space-y-2 sm:space-y-3">
                                  <div>
                                    <h3 className="text-xs font-bold text-primary-600">
                                      NIM
                                    </h3>
                                    <p className="font-medium text-xs sm:text-sm break-words line-clamp-2 sm:line-clamp-none">
                                      {student.nim}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="text-xs font-bold text-primary-600">
                                      No. HP
                                    </h3>
                                    <div className="flex items-center">
                                      <p className="text-xs sm:text-sm">
                                        {student.phoneNumber}
                                      </p>
                                      <button
                                        onClick={() =>
                                          handleCopy(
                                            student.phoneNumber,
                                            student.id
                                          )
                                        }
                                        className="ml-2 p-1 text-xs text-primary-600 hover:text-primary-800 focus:outline-none focus:ring-1 focus:ring-primary-300 rounded"
                                        aria-label="Copy phone number"
                                      >
                                        {copied === student.id ? (
                                          <CopyCheck className="h-3.5 w-3.5" />
                                        ) : (
                                          <Copy className="h-3.5 w-3.5" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="border border-primary rounded-sm p-3 text-center text-primary-600 text-xs sm:text-sm">
                        Tidak ada seminar proposal yang dijadwalkan untuk Anda
                        bimbing.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* selesai Seminars Tab */}
          <TabsContent value="selesai">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-primary-700">
                      Riwayat Seminar
                    </CardTitle>
                    <CardDescription className="text-primary-600">
                      Seminar yang telah selesai dinilai
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-3 h-4 w-4 text-primary-600" />
                      <Input
                        type="search"
                        placeholder="Cari seminar..."
                        className="w-full md:w-[200px] pl-8 border-primary-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select
                      defaultValue="all"
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[180px] border-primary-400">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {seminarTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {capitalize(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-6">
                {/* Desktop View */}
                <div className="hidden md:block rounded-sm overflow-x-auto border border-primary">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-primary text-primary-foreground font-heading font-medium text-xs lg:text-sm">
                        <th className="p-3 lg:p-4 w-[30%]">Judul Penelitian</th>
                        <th className="p-3 lg:p-4 w-[20%]">Mahasiswa</th>
                        <th className="p-3 lg:p-4 w-[15%]">Jadwal Seminar</th>
                        <th className="p-3 lg:p-4 w-[10%]">Tempat</th>
                        <th className="p-3 lg:p-4 w-[10%]">Jenis Seminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompletedSeminars.length > 0 ? (
                        filteredCompletedSeminars.map((seminar: any) => (
                          <tr
                            key={seminar.id}
                            className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                          >
                            <td className="p-3 lg:p-4">
                              <div className="font-medium">{seminar.title}</div>
                            </td>
                            <td className="p-3 lg:p-4">
                              <div className="font-medium text-primary-800">
                                {seminar.student?.name || "N/A"}
                              </div>
                              <div className="text-sm text-primary-600">
                                {seminar.studentNIM}
                              </div>
                            </td>
                            <td className="p-3 lg:p-4">
                              <div>{formatDate(seminar.time)}</div>
                              <div className="text-sm text-primary-600">
                                {formatTime(seminar.time)} WIB
                              </div>
                            </td>
                            <td className="p-3 lg:p-4">
                              {seminar.room || "TBD"}
                            </td>
                            <td className="p-3 lg:p-4">
                              <Badge
                                variant="outline"
                                className="mt-1 text-primary-800"
                              >
                                {seminar.type}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-primary-600"
                          >
                            Tidak ada seminar yang telah selesai.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-3 sm:space-y-4">
                    {filteredCompletedSeminars.length > 0 ? (
                      filteredCompletedSeminars.map((seminar: any) => (
                        <div
                          key={seminar.id}
                          className="border border-primary rounded-sm p-2 sm:p-3 text-primary-800 shadow-sm"
                        >
                          <div className="space-y-2 sm:space-y-3">
                            <div>
                              <h3 className="text-xs font-bold text-primary-600">
                                Judul
                              </h3>
                              <p className="font-medium text-xs sm:text-sm break-words line-clamp-2 sm:line-clamp-none">
                                {seminar.title}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Mahasiswa
                                </h3>
                                <p className="text-xs sm:text-sm truncate">
                                  {seminar.student?.name || "N/A"}
                                </p>
                                <p className="text-xs text-primary-600">
                                  {seminar.studentNIM}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Tanggal & Waktu
                                </h3>
                                <p className="text-xs sm:text-sm">
                                  {formatDate(
                                    seminar.time || seminar.createdAt
                                  )}
                                </p>
                                <p className="text-xs text-primary-600">
                                  {seminar.time
                                    ? formatTime(seminar.time)
                                    : "TBD"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Ruangan
                                </h3>
                                <p className="text-xs sm:text-sm">
                                  {seminar.room || "TBD"}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Jenis Seminar
                                </h3>
                                <p className="text-xs sm:text-sm">
                                  <Badge
                                    variant="outline"
                                    className="mt-1 text-primary-800"
                                  >
                                    {seminar.type}
                                  </Badge>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-primary rounded-sm p-3 text-center text-primary-600 text-xs sm:text-sm">
                        Tidak ada seminar yang telah selesai.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CoordinatorLayout>
  );
};

export default CoordinatorDashboard;
