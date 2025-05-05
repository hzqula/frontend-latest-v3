"use client";

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { useAuth } from "../../../context/AuthContext";
import { useApiData } from "../../../hooks/useApiData";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import CoordinatorLayout from "../../../components/layouts/CoordinatorLayout";
import SchedulingModal from "./Scheduling";
import SeminarsScheduledTable from "./SeminarsScheduledTable";
import SeminarDetailsModal from "./SeminarDetailModal";

const CoordinatorSeminarProposal = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("submitted");
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const seminarsQuery = useApiData({ type: "seminars" });
  const lecturersQuery = useApiData({ type: "lecturers" });
  const isLoading = seminarsQuery.isLoading || lecturersQuery.isLoading;
  const isError = seminarsQuery.isError || lecturersQuery.isError;

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

  const seminars = seminarsQuery.data || [];
  const lecturers = lecturersQuery.data || [];

  // Filter seminars berdasarkan status dan hanya untuk seminar proposal
  const submittedSeminars = seminars.filter(
    (seminar: any) =>
      seminar.status === "SUBMITTED" && seminar.type === "PROPOSAL"
  );
  const scheduledSeminars = seminars.filter(
    (seminar: any) =>
      seminar.status === "SCHEDULED" && seminar.type === "PROPOSAL"
  );
  const completedSeminars = seminars.filter(
    (seminar: any) =>
      seminar.status === "COMPLETED" && seminar.type === "PROPOSAL"
  );

  // Filter seminars berdasarkan pencarian
  const filteredSubmittedSeminars = submittedSeminars.filter((seminar: any) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = statusFilter === "all" || seminar.type === statusFilter;
    return matchesSearch && matchesType;
  });

  const filteredScheduledSeminars = scheduledSeminars.filter((seminar: any) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = statusFilter === "all" || seminar.type === statusFilter;
    return matchesSearch && matchesType;
  });
  const filteredCompletedSeminars = completedSeminars.filter((seminar: any) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = statusFilter === "all" || seminar.type === statusFilter;
    return matchesSearch && matchesType;
  });

  // Fungsi untuk format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fungsi untuk format waktu
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fungsi untuk badge status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-primary-200 text-primary-800">
            Diajukan
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="bg-primary-300 text-primary-800">
            Dijadwalkan
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-primary-400 text-primary-800">
            Selesai
          </Badge>
        );
      default:
        return <Badge variant="outline">Tidak Diketahui</Badge>;
    }
  };

  // Fungsi untuk membuka modal penjadwalan
  const openScheduleModal = (seminar: any) => {
    setSelectedSeminar(seminar);
    setScheduleModalOpen(true);
  };

  // Fungsi untuk membuka modal detail
  const openDetailsModal = (seminar: any) => {
    setSelectedSeminar(seminar);
    setDetailsModalOpen(true);
  };

  return (
    <CoordinatorLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-primary-800">
              Seminar Proposal
            </h1>
            <p className="text-primary">Kelola seminar proposal mahasiswa</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-primary-600" />
            <Input
              type="search"
              placeholder="Cari seminar..."
              className="w-full sm:w-[200px] pl-8 border-primary-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs - Scrollable on small screens */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto pb-2">
            <TabsList className="grid grid-cols-3 mb-6 bg-primary">
              <TabsTrigger
                value="submitted"
                className={`text-primary-foreground ${
                  activeTab === "submitted" ? "text-primary-800" : ""
                }`}
              >
                Diajukan ({submittedSeminars.length})
              </TabsTrigger>
              <TabsTrigger
                value="scheduled"
                className={`text-primary-foreground ${
                  activeTab === "scheduled" ? "text-primary-800" : ""
                }`}
              >
                Dijadwalkan ({scheduledSeminars.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className={`text-primary-foreground ${
                  activeTab === "completed" ? "text-primary-800" : ""
                }`}
              >
                Selesai ({completedSeminars.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab: Diajukan (SUBMITTED) */}
          <TabsContent value="submitted">
            <Card className="bg-white">
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl -mb-1 font-heading font-black text-primary-800">
                      Pengajuan Seminar Proposal
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-primary">
                      Seminar proposal yang menunggu dijadwalkan
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="px-3 sm:px-6 pb-6">
                {/* Desktop View */}
                <div className="hidden md:block rounded-sm overflow-x-auto border border-primary">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-primary text-primary-foreground font-heading font-medium text-xs lg:text-sm">
                        <th className="p-3 lg:p-4 w-[35%]">Judul</th>
                        <th className="p-3 lg:p-4 w-[20%]">Mahasiswa</th>
                        <th className="p-3 lg:p-4 w-[20%]">Tanggal Diajukan</th>
                        <th className="p-3 lg:p-4 w-[15%] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmittedSeminars.length > 0 ? (
                        filteredSubmittedSeminars.map((seminar: any) => (
                          <tr
                            key={seminar.id}
                            className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                          >
                            <td className="p-3 lg:p-4 font-bold">
                              {seminar.title}
                            </td>
                            <td className="p-3 lg:p-4">
                              <div className="font-medium">
                                {seminar.student?.name || "N/A"}
                              </div>
                              <div className="text-sm text-primary">
                                {seminar.studentNIM}
                              </div>
                            </td>
                            <td className="p-3 lg:p-4">
                              <div>{formatDate(seminar.createdAt)}</div>
                              <div className="text-xs text-primary">
                                {formatTime(seminar.createdAt)} WIB
                              </div>
                            </td>
                            <td className="p-3 lg:p-4 text-center space-x-1 lg:space-x-2">
                              <Button
                                size="sm"
                                className="bg-primary text-white hover:bg-primary-700 text-xs px-2 py-1 h-8"
                                onClick={() => openScheduleModal(seminar)}
                              >
                                Jadwalkan
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-primary-600"
                          >
                            Tidak ada pengajuan seminar proposal yang ditemukan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-4">
                    {filteredSubmittedSeminars.length > 0 ? (
                      filteredSubmittedSeminars.map((seminar: any) => (
                        <div
                          key={seminar.id}
                          className="border border-primary rounded-sm p-3 text-primary-800"
                        >
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-xs font-bold text-primary-600">
                                Judul
                              </h3>
                              <p className="font-medium text-sm break-words">
                                {seminar.title}
                              </p>
                            </div>
                            <div className="flex flex-col xs:flex-row xs:justify-between gap-2">
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Mahasiswa
                                </h3>
                                <p className="text-sm">
                                  {seminar.student?.name || "N/A"}
                                </p>
                                <p className="text-xs text-primary-600">
                                  {seminar.studentNIM}
                                </p>
                              </div>
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Tanggal Diajukan
                                </h3>
                                <p className="text-sm">
                                  {formatDate(seminar.createdAt)}
                                </p>
                                <p className="text-xs text-primary-600">
                                  {formatTime(seminar.createdAt)} WIB
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col xs:flex-row gap-2 pt-1">
                              <Button
                                size="sm"
                                className="w-full bg-primary text-white hover:bg-primary-700 text-xs"
                                onClick={() => openScheduleModal(seminar)}
                              >
                                Jadwalkan
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-primary rounded-sm p-4 text-center text-primary-600 text-sm">
                        Tidak ada pengajuan seminar proposal yang ditemukan.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Dijadwalkan (SCHEDULED) */}
          <TabsContent value="scheduled">
            <SeminarsScheduledTable
              seminars={filteredScheduledSeminars}
              formatDate={formatDate}
              formatTime={formatTime}
              onViewDetails={openDetailsModal}
            />
          </TabsContent>

          {/* Tab: Selesai (COMPLETED) */}
          <TabsContent value="completed">
            <Card className="bg-white">
              <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl -mb-1 font-heading font-black text-primary-800">
                      Seminar Proposal Selesai
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-primary">
                      Seminar proposal yang telah selesai
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-3 sm:px-6 pb-6">
                {/* Desktop View */}
                <div className="hidden md:block rounded-sm overflow-x-auto border border-primary">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-primary text-primary-foreground font-heading font-medium text-xs lg:text-sm">
                        <th className="p-3 lg:p-4 w-[35%]">Judul</th>
                        <th className="p-3 lg:p-4 w-[20%]">Mahasiswa</th>
                        <th className="p-3 lg:p-4 w-[20%]">Tanggal & Waktu</th>
                        <th className="p-3 lg:p-4 w-[20%]">Tempat</th>
                        <th className="p-3 lg:p-4 w-[15%] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompletedSeminars.filter(
                        (seminar: any) => seminar.status === "COMPLETED"
                      ).length > 0 ? (
                        filteredCompletedSeminars
                          .filter(
                            (seminar: any) => seminar.status === "COMPLETED"
                          )
                          .map((seminar: any) => (
                            <tr
                              key={seminar.id}
                              className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                            >
                              <td className="p-3 lg:p-4 font-bold">
                                {seminar.title}
                              </td>
                              <td className="p-3 lg:p-4">
                                <div className="font-medium">
                                  {seminar.student?.name || "N/A"}
                                </div>
                                <div className="text-sm text-primary">
                                  {seminar.studentNIM}
                                </div>
                              </td>
                              <td className="p-3 lg:p-4">
                                <div>
                                  {formatDate(
                                    seminar.time || seminar.createdAt
                                  )}
                                </div>
                                <div className="text-xs text-primary">
                                  {seminar.time
                                    ? formatTime(seminar.time)
                                    : "TBD"}{" "}
                                  WIB
                                </div>
                              </td>
                              <td className="p-3 lg:p-4">
                                <div className="font-medium">
                                  {seminar.room || "TBD"}
                                </div>
                              </td>
                              <td className="p-3 lg:p-4 text-center space-x-1 lg:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-primary-400 text-primary-700 text-xs px-2 py-1 h-8"
                                  onClick={() => openDetailsModal(seminar)}
                                >
                                  Lihat
                                </Button>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-primary-600"
                          >
                            Tidak ada seminar proposal yang sudah diselesaikan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-4">
                    {filteredCompletedSeminars.length > 0 ? (
                      filteredCompletedSeminars.map((seminar: any) => (
                        <div
                          key={seminar.id}
                          className="border border-primary rounded-sm p-3 text-primary-800"
                        >
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-xs font-bold text-primary-600">
                                Judul
                              </h3>
                              <p className="font-medium text-sm break-words">
                                {seminar.title}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Mahasiswa
                                </h3>
                                <p className="text-sm">
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
                                <p className="text-sm">
                                  {formatDate(
                                    seminar.time || seminar.createdAt
                                  )}
                                </p>
                                <p className="text-xs text-primary-600">
                                  {seminar.time
                                    ? formatTime(seminar.time)
                                    : "TBD"}{" "}
                                  WIB
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                              <div>
                                <h3 className="text-xs font-bold text-primary-600">
                                  Tempat
                                </h3>
                                <p className="text-sm">
                                  {seminar.room || "TBD"}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col xs:flex-row gap-2 pt-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-primary-400 text-primary-700 text-xs px-2 py-1 h-8"
                                onClick={() => openDetailsModal(seminar)}
                              >
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="border border-primary rounded-sm p-4 text-center text-primary-600 text-sm">
                        Tidak ada seminar proposal yang sudah diselesaikan.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Penjadwalan */}
        {selectedSeminar && (
          <SchedulingModal
            open={scheduleModalOpen}
            onOpenChange={setScheduleModalOpen}
            seminar={selectedSeminar}
            lecturers={lecturers}
            token={token}
            onScheduleSuccess={seminarsQuery.refetch}
          />
        )}

        {/* Modal Detail Seminar */}
        {selectedSeminar && (
          <SeminarDetailsModal
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
            seminar={selectedSeminar}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        )}
      </div>
    </CoordinatorLayout>
  );
};

export default CoordinatorSeminarProposal;
