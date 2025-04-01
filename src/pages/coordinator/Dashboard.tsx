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
  Clock,
  FileText,
  Users,
  UserCheck,
  CheckCircle2,
  Calendar,
  PlusCircle,
  ClipboardList,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
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

const CoordinatorDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
  const completedSeminars = seminars.filter(
    (seminar: any) => seminar.status === "COMPLETED"
  );

  // Filter seminars berdasarkan status dan pencarian
  const filteredUpcomingSeminars = scheduledSeminars.filter(
    (seminar: any) =>
      (statusFilter === "all" || seminar.status === statusFilter) &&
      (seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredNewSubmissions = submittedSeminars.filter(
    (submission: any) =>
      (statusFilter === "all" ||
        submission.type.toUpperCase() === statusFilter) &&
      (submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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

  // Fungsi untuk badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-primary-100 text-primary-800">
            Draft
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-primary-200 text-primary-800">
            Submitted
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="bg-primary-300 text-primary-800">
            Scheduled
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-primary-400 text-primary-800">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
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
                onClick={() => setActiveTab("submissions")}
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
                onClick={() => setActiveTab("upcoming")}
              >
                Lihat Jadwal Seminar
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
                  {completedSeminars.length}
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
              >
                Lihat Riwayat Seminar
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
              >
                Lihat Mahasiswa
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-primary">
            <TabsTrigger
              value="overview"
              className={`text-primary-foreground ${
                activeTab === "overview" ? "text-primary-800" : ""
              }`}
            >
              Tinjauan
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className={`text-primary-foreground ${
                activeTab === "submissions" ? "text-primary-800" : ""
              }`}
            >
              Diajukan
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className={`text-primary-foreground ${
                activeTab === "upcoming" ? "text-primary-800" : ""
              }`}
            >
              Mendatang
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Now using a 4-column grid with minmax 200px */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(200px,auto)] gap-6">
              {/* Upcoming Seminars Preview - spans 2 columns */}
              <Card className="bg-white sm:col-span-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-primary-700">
                      Upcoming Seminars
                    </CardTitle>
                    <CardDescription className="text-primary-600">
                      Next {scheduledSeminars.length} scheduled seminars
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUpcomingSeminars
                      .slice(0, 3)
                      .map((seminar: any) => (
                        <div
                          key={seminar.id}
                          className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  seminar.type === "PROPOSAL"
                                    ? "outline"
                                    : "secondary"
                                }
                                className="text-xs text-primary-800"
                              >
                                {seminar.type}
                              </Badge>
                              <span className="text-sm font-medium text-primary-800">
                                {formatDate(seminar.time || seminar.createdAt)}
                              </span>
                            </div>
                            <h4 className="font-medium mt-1 line-clamp-1 text-primary-800">
                              {seminar.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-primary-600">
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {seminar.studentNIM}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {seminar.time
                                  ? formatTime(seminar.time)
                                  : "TBD"}
                              </div>
                              <div className="flex items-center">
                                <FileText className="h-3 w-3 mr-1" />
                                {seminar.room || "TBD"}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary-700"
                          >
                            Details
                          </Button>
                        </div>
                      ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-primary-400 text-primary-700 hover:bg-accent"
                    onClick={() => setActiveTab("upcoming")}
                  >
                    View All Scheduled Seminars
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-white sm:col-span-2 overflow-hidden">
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
                          name="Proposal Seminars"
                          fill="var(--color-primary-600)"
                        />
                        <Bar
                          dataKey="result"
                          name="Result Seminars"
                          fill="var(--color-primary-400)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Completion Rate Chart - spans 2 columns */}
              <Card className="bg-white sm:col-span-2">
                <CardHeader>
                  <CardTitle className="text-primary-700">
                    Seminar Completion Rate
                  </CardTitle>
                  <CardDescription className="text-primary-600">
                    Percentage of seminars completed successfully
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={completionRate}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          name="Completion Rate (%)"
                          stroke="var(--color-primary-700)"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Student Distribution - spans full width (4 columns) */}
              <Card className="bg-white sm:col-span-4">
                <CardHeader>
                  <CardTitle className="text-primary-700">
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-primary-600">
                    Latest actions in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredUpcomingSeminars
                      .slice(0, 4)
                      .map((seminar: any, index: number) => (
                        <div
                          key={`activity-${index}`}
                          className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0"
                        >
                          <div className="p-2 bg-primary-100 rounded-full">
                            {index % 2 === 0 ? (
                              <CalendarDays className="h-5 w-5 text-primary-700" />
                            ) : (
                              <FileText className="h-5 w-5 text-primary-700" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-800">
                              {index % 2 === 0
                                ? "Seminar Scheduled"
                                : "New Submission"}
                            </h4>
                            <p className="text-sm text-primary-600">
                              {seminar.title.substring(0, 40)}
                              {seminar.title.length > 40 ? "..." : ""}
                            </p>
                          </div>
                          <div className="ml-auto text-right">
                            <div className="text-sm font-medium text-primary-800">
                              {formatDate(seminar.time || seminar.createdAt)}
                            </div>
                            <div className="text-xs text-primary-600">
                              {formatTime(seminar.time || seminar.createdAt)}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upcoming Seminars Tab */}
          <TabsContent value="upcoming">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-primary-700">
                      Upcoming Seminars
                    </CardTitle>
                    <CardDescription className="text-primary-600">
                      All scheduled seminars
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px] border-primary-400">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Schedule New
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm overflow-hidden border border-primary">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground">
                    <div className="col-span-5">Title</div>
                    <div className="col-span-2">Student</div>
                    <div className="col-span-2">Date & Time</div>
                    <div className="col-span-1">Room</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-center">Actions</div>
                  </div>
                  <div className="divide-y">
                    {filteredUpcomingSeminars.length > 0 ? (
                      filteredUpcomingSeminars.map((seminar: any) => (
                        <div
                          key={seminar.id}
                          className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                        >
                          <div className="col-span-5">
                            <div className="font-medium">{seminar.title}</div>
                            <Badge
                              variant={
                                seminar.type === "PROPOSAL"
                                  ? "outline"
                                  : "secondary"
                              }
                              className="mt-1 text-primary-800"
                            >
                              {seminar.type}
                            </Badge>
                          </div>
                          <div className="col-span-2">{seminar.studentNIM}</div>
                          <div className="col-span-2">
                            <div>
                              {formatDate(seminar.time || seminar.createdAt)}
                            </div>
                            <div className="text-sm text-primary-600">
                              {seminar.time ? formatTime(seminar.time) : "TBD"}
                            </div>
                          </div>
                          <div className="col-span-1">
                            {seminar.room || "TBD"}
                          </div>
                          <div className="col-span-1">
                            {getStatusBadge(seminar.status)}
                          </div>
                          <div className="col-span-1 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary-700"
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-primary-600">
                        No seminars found matching your search.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Submissions Tab */}
          <TabsContent value="submissions">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
                      Pengajuan
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Seminar yang menunggu dijadwalkan
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px] border-primary-400">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="PROPOSAL">Proposal</SelectItem>
                        <SelectItem value="RESULT">Result</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm overflow-hidden border border-primary">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground">
                    <div className="col-span-5">Judul</div>
                    <div className="col-span-2">Mahasiswa</div>
                    <div className="col-span-2">Tanggal Diajukan</div>
                    <div className="col-span-1 text-center">Jenis</div>
                    <div className="col-span-2 text-center">Aksi</div>
                  </div>
                  <div className="divide-y">
                    {filteredNewSubmissions.length > 0 ? (
                      filteredNewSubmissions.map((submission: any) => (
                        <div
                          key={submission.id}
                          className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                        >
                          <div className="col-span-5">
                            <div className="font-bold">{submission.title}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="font-medium text-primary-800">
                              {submission.student.name}
                            </div>
                            <div className="text-sm text-primary">
                              {submission.studentNIM}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-sm text-primary-800">
                              {formatDate(submission.createdAt)}
                            </div>
                            <div className="text-xs text-primary">
                              {formatTime(submission.createdAt)}
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Badge
                              variant={
                                submission.type === "PROPOSAL"
                                  ? "outline"
                                  : "secondary"
                              }
                              className="text-primary-800"
                            >
                              {submission.type}
                            </Badge>
                          </div>
                          <div className="col-span-2 text-right space-x-2">
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary-700"
                            >
                              Schedule
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-primary-400 text-primary-700"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-primary-600">
                        No submissions found matching your search.
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

// Mock data tetap untuk chart (bisa diganti dengan API jika tersedia)
const seminarTrends = [
  { month: "Jan", proposal: 4, result: 2 },
  { month: "Feb", proposal: 3, result: 5 },
  { month: "Mar", proposal: 6, result: 3 },
  { month: "Apr", proposal: 8, result: 4 },
  { month: "May", proposal: 5, result: 7 },
  { month: "Jun", proposal: 9, result: 5 },
  { month: "Jul", proposal: 7, result: 8 },
  { month: "Aug", proposal: 10, result: 6 },
  { month: "Sep", proposal: 8, result: 9 },
  { month: "Oct", proposal: 12, result: 7 },
  { month: "Nov", proposal: 9, result: 10 },
  { month: "Dec", proposal: 6, result: 8 },
];

const completionRate = [
  { month: "Jan", rate: 75 },
  { month: "Feb", rate: 68 },
  { month: "Mar", rate: 82 },
  { month: "Apr", rate: 91 },
  { month: "May", rate: 84 },
  { month: "Jun", rate: 88 },
  { month: "Jul", rate: 90 },
  { month: "Aug", rate: 85 },
  { month: "Sep", rate: 92 },
  { month: "Oct", rate: 95 },
  { month: "Nov", rate: 89 },
  { month: "Dec", rate: 78 },
];
