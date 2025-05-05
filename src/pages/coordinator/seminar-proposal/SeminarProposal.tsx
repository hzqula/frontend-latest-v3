"use client";

import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useApiData } from "../../../hooks/useApiData";
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
import SeminarsSubmittedTable from "./SeminarsSubmittedTable";
import SeminarsCompletedTable from "./SeminarsCompletedTable";

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
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScheduledSeminars = scheduledSeminars.filter(
    (seminar: any) =>
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCompletedSeminars = completedSeminars.filter(
    (seminar: any) =>
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-heading font-black text-primary-800">
          Seminar Proposal
        </h1>
        <p>Kelola seminar proposal mahasiswa</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="col-span-1 sm:col-span-2 lg:col-span-4 overflow-hidden pt-2 pr-1"
        >
          <div className="flex gap-4 items-center w-full mb-4 justify-between">
            <TabsList className="bg-primary">
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
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-primary-600" />
              <Input
                type="search"
                placeholder="Cari seminar berdasarkan judul penelitian | nama | nim"
                className="w-full pl-8 border-primary-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tab: Diajukan (SUBMITTED) */}
          <TabsContent value="submitted">
            <SeminarsSubmittedTable
              seminars={filteredSubmittedSeminars}
              formatDate={formatDate}
              formatTime={formatTime}
              onSchedule={openScheduleModal}
              onViewDetails={openDetailsModal}
            />
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
            <SeminarsCompletedTable
              seminars={filteredCompletedSeminars}
              formatDate={formatDate}
              formatTime={formatTime}
              onViewDetails={openDetailsModal}
            />
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
