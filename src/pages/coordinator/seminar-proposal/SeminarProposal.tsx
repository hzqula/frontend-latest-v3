"use client";

import { useState } from "react";
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
  const filteredSubmittedSeminars = submittedSeminars.filter(
    (seminar: any) =>
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScheduledSeminars = scheduledSeminars.filter(
    (seminar: any) =>
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedSeminars = completedSeminars.filter(
    (seminar: any) =>
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-heading font-black text-primary-800">
              Seminar Proposal
            </h1>
            <p className="text-primary">Kelola seminar proposal mahasiswa</p>
          </div>
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
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          {/* Tab: Diajukan (SUBMITTED) */}
          <TabsContent value="submitted">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
                      Pengajuan Seminar Proposal
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Seminar proposal yang menunggu dijadwalkan
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm overflow-hidden border border-primary">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground font-heading">
                    <div className="col-span-5">Judul</div>
                    <div className="col-span-2">Mahasiswa</div>
                    <div className="col-span-2">Tanggal Diajukan</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-2 text-center">Aksi</div>
                  </div>
                  <div className="divide-y">
                    {filteredSubmittedSeminars.length > 0 ? (
                      filteredSubmittedSeminars.map((seminar: any) => (
                        <div
                          key={seminar.id}
                          className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                        >
                          <div className="col-span-5">
                            <div className="font-bold">{seminar.title}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="font-medium text-primary-800">
                              {seminar.student?.name || "N/A"}
                            </div>
                            <div className="text-sm text-primary">
                              {seminar.studentNIM}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-sm text-primary-800">
                              {formatDate(seminar.createdAt)}
                            </div>
                            <div className="text-xs text-primary">
                              {formatTime(seminar.createdAt)}
                            </div>
                          </div>
                          <div className="col-span-1 text-center">
                            {getStatusBadge(seminar.status)}
                          </div>
                          <div className="col-span-2 text-right space-x-2">
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary-700"
                              onClick={() => openScheduleModal(seminar)}
                            >
                              Jadwalkan
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-primary-400 text-primary-700"
                              onClick={() => openDetailsModal(seminar)}
                            >
                              Lihat
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-primary-600">
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
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
                      Seminar Proposal Selesai
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Seminar proposal yang telah selesai
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm overflow-hidden border border-primary">
                  <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b bg-primary text-primary-foreground">
                    <div className="col-span-4">Judul</div>
                    <div className="col-span-2">Mahasiswa</div>
                    <div className="col-span-2">Tanggal & Waktu</div>
                    <div className="col-span-1">Ruangan</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-2 text-center">Aksi</div>
                  </div>
                  <div className="divide-y">
                    {filteredCompletedSeminars.length > 0 ? (
                      filteredCompletedSeminars.map((seminar: any) => (
                        <div
                          key={seminar.id}
                          className="grid grid-cols-12 gap-2 p-4 items-center text-primary-800"
                        >
                          <div className="col-span-4">
                            <div className="font-medium">{seminar.title}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="font-medium text-primary-800">
                              {seminar.student?.name || "N/A"}
                            </div>
                            <div className="text-sm text-primary">
                              {seminar.studentNIM}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <div>{formatDate(seminar.time)}</div>
                            <div className="text-sm text-primary-600">
                              {formatTime(seminar.time)}
                            </div>
                          </div>
                          <div className="col-span-1">
                            {seminar.room || "TBD"}
                          </div>
                          <div className="col-span-1 text-center">
                            {getStatusBadge(seminar.status)}
                          </div>
                          <div className="col-span-2 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-primary-400 text-primary-700"
                              onClick={() => openDetailsModal(seminar)}
                            >
                              Lihat
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-primary-600">
                        Tidak ada seminar proposal yang selesai ditemukan.
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
