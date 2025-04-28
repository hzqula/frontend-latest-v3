"use client";

import { Link } from "react-router";
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
  FileText,
  CheckCircle2,
  BookOpen,
  ClipboardList,
  ClipboardPenLine,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import LecturerLayout from "../../components/layouts/LecturerLayout";

const LecturerDashboard = () => {
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
  const scheduledSeminars = seminars.filter(
    (seminar: any) => seminar.status === "SCHEDULED"
  );
  const completedSeminars = seminars.filter(
    (seminar: any) => seminar.status === "COMPLETED"
  );

  const seminarTypes = ["PROPOSAL", "HASIL"];
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const filteredCompletedSeminars = completedSeminars.filter(
    (seminar: any) =>
      (statusFilter === "all" || seminar.type === statusFilter) &&
      (seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Modified code - don't filter by scheduledSeminars:
  const advisedSeminars = seminars.filter((seminar: any) =>
    seminar.advisors.some(
      (advisor: any) => advisor.lecturer?.nip === user.profile.nip
    )
  );

  // Modified code - don't filter by scheduledSeminars:
  const assessedSeminars = seminars.filter((seminar: any) =>
    seminar.assessors.some(
      (assessor: any) => assessor.lecturer?.nip === user.profile.nip
    )
  );

  // Filter berdasarkan pencarian
  const filteredAdvisedSeminars = advisedSeminars.filter(
    (seminar: any) =>
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssessedSeminars = assessedSeminars.filter(
    (seminar: any) =>
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase())
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
    <LecturerLayout>
      <div className="container mx-auto p-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {user.profile?.name}!
            </h1>
            <p className="text-muted-foreground bg-p">
              NIP: {user.profile?.nip}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/seminar-proposal">
                <BookOpen className="mr-2 h-4 w-4" />
                Seminar Proposal
              </Link>
            </Button>
            <Button asChild>
              <Link to="/seminar-hasil">
                <FileText className="mr-2 h-4 w-4" />
                Seminar Hasil
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(80px,_auto)] gap-4 mb-6">
          <Card className="bg-radial-[at_380%_380%] from-primary-600 from-80% to-20% to-primary-800 border-primary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                Dibimbing
              </CardTitle>
              <CardDescription className="text-primary-foreground text-sm">
                Menunggu untuk dinilai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-5xl -my-1 font-bold text-primary-foreground font-heading">
                  {
                    advisedSeminars.filter(
                      (seminar: any) => seminar.status === "SCHEDULED"
                    ).length
                  }
                </div>
                <div className="p-2 bg-primary rounded-full border-primary-foreground border">
                  <ClipboardList className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-primary-400 text-primary-700 hover:bg-accent"
                onClick={() => setActiveTab("overview")}
              >
                Lihat Mahasiswa Bimbingan
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-radial-[at_380%_380%] from-primary-600 from-80% to-20% to-primary-800 border-primary-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                Diuji
              </CardTitle>
              <CardDescription className="text-primary-foreground text-sm">
                Menunggu untuk dinilai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-5xl -my-1 font-bold text-primary-foreground font-heading">
                  {
                    assessedSeminars.filter(
                      (seminar: any) => seminar.status === "SCHEDULED"
                    ).length
                  }
                </div>
                <div className="p-2 bg-primary rounded-full border-primary-foreground border">
                  <ClipboardPenLine className="h-6 w-6 text-primary-foreground" />
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
                Lihat Mahasiswa Diuji
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
                onClick={() => setActiveTab("completed")}
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
              value="overview"
              className={`text-primary-foreground ${
                activeTab === "overview" ? "text-primary-800" : ""
              }`}
            >
              Dibimbing
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className={`text-primary-foreground ${
                activeTab === "submissions" ? "text-primary-800" : ""
              }`}
            >
              Diuji
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className={`text-primary-foreground ${
                activeTab === "completed" ? "text-primary-800" : ""
              }`}
            >
              Selesai
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Now using a 4-column grid with minmax 200px */}
          <TabsContent value="overview">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
                      Mahasiswa Dibimbing
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Seminar yang menunggu dinilai
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
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
              <CardContent>
                <div className="rounded-sm overflow-hidden border border-primary">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground">
                    <div className="col-span-5">Judul Penelitian</div>
                    <div className="col-span-2">Mahasiswa</div>
                    <div className="col-span-2">Jadwal Seminar</div>
                    <div className="col-span-1">Ruangan</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-center">Aksi</div>
                  </div>
                  <div className="divide-y">
                    {filteredAdvisedSeminars.filter(
                      (seminar: any) => seminar.status === "SCHEDULED"
                    ).length > 0 ? (
                      filteredAdvisedSeminars
                        .filter(
                          (seminar: any) => seminar.status === "SCHEDULED"
                        )
                        .map((seminar: any) => (
                          <div
                            key={seminar.id}
                            className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                          >
                            <div className="col-span-5">
                              <div className="font-medium">{seminar.title}</div>
                              <Badge
                                variant={seminar.type ? "outline" : "secondary"}
                                className="mt-1 text-primary-800"
                              >
                                {seminar.type}
                              </Badge>
                            </div>
                            <div className="col-span-2">
                              {seminar.student.name}
                            </div>
                            <div className="col-span-2">
                              <div>
                                {formatDate(seminar.time || seminar.createdAt)}
                              </div>
                              <div className="text-sm text-primary-600">
                                {seminar.time
                                  ? formatTime(seminar.time)
                                  : "TBD"}
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
                      Mahasiswa Diuji
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Seminar yang menunggu dinilai
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
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
              <CardContent>
                <div className="rounded-sm overflow-hidden border border-primary">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground">
                    <div className="col-span-5">Judul Penelitian</div>
                    <div className="col-span-2">Mahasiswa</div>
                    <div className="col-span-2">Jadwal Seminar</div>
                    <div className="col-span-1">Ruangan</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-center">Aksi</div>
                  </div>
                  <div className="divide-y">
                    {filteredAssessedSeminars.filter(
                      (seminar: any) => seminar.status === "SCHEDULED"
                    ).length > 0 ? (
                      filteredAssessedSeminars
                        .filter(
                          (seminar: any) => seminar.status === "SCHEDULED"
                        )
                        .map((seminar: any) => (
                          <div
                            key={seminar.id}
                            className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                          >
                            <div className="col-span-5">
                              <div className="font-medium">{seminar.title}</div>
                              <Badge
                                variant={seminar.type ? "outline" : "secondary"}
                                className="mt-1 text-primary-800"
                              >
                                {seminar.type}
                              </Badge>
                            </div>
                            <div className="col-span-2">
                              {seminar.student.name}
                            </div>
                            <div className="col-span-2">
                              <div>
                                {formatDate(seminar.time || seminar.createdAt)}
                              </div>
                              <div className="text-sm text-primary-600">
                                {seminar.time
                                  ? formatTime(seminar.time)
                                  : "TBD"}
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

          {/* Completed Seminars Tab */}
          <TabsContent value="completed">
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
                    <Select defaultValue="all" onValueChange={setStatusFilter}>
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

              <CardContent>
                <Tabs defaultValue="dibimbing" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6 bg-primary">
                    <TabsTrigger
                      value="dibimbing"
                      className="text-primary-foreground data-[state=active]:text-primary-800"
                    >
                      Dibimbing
                    </TabsTrigger>
                    <TabsTrigger
                      value="diuji"
                      className="text-primary-foreground data-[state=active]:text-primary-800"
                    >
                      Diuji
                    </TabsTrigger>
                  </TabsList>

                  {/* Dibimbing Tab */}
                  <TabsContent value="dibimbing">
                    <div className="rounded-sm overflow-hidden border border-primary">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground">
                        <div className="col-span-5">Judul Penelitian</div>
                        <div className="col-span-2">Mahasiswa</div>
                        <div className="col-span-2">Jadwal Seminar</div>
                        <div className="col-span-1">Ruangan</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1 text-center">Aksi</div>
                      </div>
                      <div className="divide-y">
                        {filteredAdvisedSeminars.filter(
                          (seminar: any) => seminar.status === "COMPLETED"
                        ).length > 0 ? (
                          filteredAdvisedSeminars
                            .filter(
                              (seminar: any) => seminar.status === "COMPLETED"
                            )
                            .map((seminar: any) => (
                              <div
                                key={seminar.id}
                                className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                              >
                                <div className="col-span-5">
                                  <div className="font-medium">
                                    {seminar.title}
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="mt-1 text-primary-800"
                                  >
                                    {seminar.type}
                                  </Badge>
                                </div>
                                <div className="col-span-2">
                                  {seminar.student?.name}
                                </div>
                                <div className="col-span-2">
                                  <div>
                                    {formatDate(
                                      seminar.time || seminar.createdAt
                                    )}
                                  </div>
                                  <div className="text-sm text-primary-600">
                                    {seminar.time
                                      ? formatTime(seminar.time)
                                      : "TBD"}
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
                            Tidak ada seminar dibimbing yang sudah diselesaikan.
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Diuji Tab */}
                  <TabsContent value="diuji">
                    <div className="rounded-sm overflow-hidden border border-primary">
                      <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground">
                        <div className="col-span-5">Judul Penelitian</div>
                        <div className="col-span-2">Mahasiswa</div>
                        <div className="col-span-2">Jadwal Seminar</div>
                        <div className="col-span-1">Ruangan</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1 text-center">Aksi</div>
                      </div>
                      <div className="divide-y">
                        {filteredAssessedSeminars.filter(
                          (seminar: any) => seminar.status === "COMPLETED"
                        ).length > 0 ? (
                          filteredAssessedSeminars
                            .filter(
                              (seminar: any) => seminar.status === "COMPLETED"
                            )
                            .map((seminar: any) => (
                              <div
                                key={seminar.id}
                                className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                              >
                                <div className="col-span-5">
                                  <div className="font-medium">
                                    {seminar.title}
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="mt-1 text-primary-800"
                                  >
                                    {seminar.type}
                                  </Badge>
                                </div>
                                <div className="col-span-2">
                                  {seminar.student?.name}
                                </div>
                                <div className="col-span-2">
                                  <div>
                                    {formatDate(
                                      seminar.time || seminar.createdAt
                                    )}
                                  </div>
                                  <div className="text-sm text-primary-600">
                                    {seminar.time
                                      ? formatTime(seminar.time)
                                      : "TBD"}
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
                            Tidak ada seminar diuji yang sudah diselesaikan.
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </LecturerLayout>
  );
};

export default LecturerDashboard;
