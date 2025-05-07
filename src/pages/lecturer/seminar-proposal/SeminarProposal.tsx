// SeminarProposal.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useApiData } from "../../../hooks/useApiData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import LecturerLayout from "../../../components/layouts/LecturerLayout";
import SeminarDetailsModal from "../SeminarDetailsModal";
import { Badge } from "../../../components/ui/badge";

const LecturerSeminarProposal = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("advised");
  const [searchQuery, setSearchQuery] = useState("");
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState<any>(null);

  const seminarsQuery = useApiData({ type: "seminars" });
  const isLoading = seminarsQuery.isLoading;
  const isError = seminarsQuery.isError;
  const refetch = seminarsQuery.refetch;

  useEffect(() => {
    if (location.state?.fromAssessment) {
      refetch();
    }
  }, [location, refetch]);

  if (isLoading || !token || !user || !user.profile.nip) {
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

  const scheduledSeminars = seminars.filter(
    (seminar: any) =>
      seminar.status === "SCHEDULED" && seminar.type === "PROPOSAL"
  );

  const advisedSeminars = scheduledSeminars.filter((seminar: any) =>
    seminar.advisors.some(
      (advisor: any) => advisor.lecturer?.nip === user.profile.nip
    )
  );

  const assessedSeminars = scheduledSeminars.filter((seminar: any) =>
    seminar.assessors.some(
      (assessor: any) => assessor.lecturer?.nip === user.profile.nip
    )
  );

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openDetailsModal = (seminar: any) => {
    setSelectedSeminar(seminar);
    setDetailsModalOpen(true);
  };

  const canAssessSeminar = (seminarTime: string) => {
    const currentDate = new Date();
    const seminarDate = new Date(seminarTime);
    return currentDate > seminarDate;
  };

  const hasBeenAssessed = (seminar: any) => {
    if (!seminar.assessments || seminar.assessments.length === 0) {
      return false;
    }
    return seminar.assessments.some(
      (assessment: any) => assessment.lecturerNIP === user.profile.nip
    );
  };

  const handleAssessNavigation = (seminarId: number) => {
    navigate(`/seminar-proposal/assess/${seminarId}`, {
      state: { fromAssessment: true },
    });
  };

  return (
    <LecturerLayout>
      <div className="flex flex-col mb-4">
        <h1 className="text-4xl font-heading font-black text-primary-800">
          Seminar Proposal
        </h1>
        <p className="text-primary">
          {activeTab === "advised"
            ? "Kelola seminar proposal mahasiswa yang Anda bimbing"
            : "Kelola seminar proposal mahasiswa yang Anda uji"}
        </p>
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
                value="advised"
                className={`text-primary-foreground ${
                  activeTab === "advised" ? "text-primary-800" : ""
                }`}
              >
                Dibimbing ({advisedSeminars.length})
              </TabsTrigger>
              <TabsTrigger
                value="assessed"
                className={`text-primary-foreground ${
                  activeTab === "assessed" ? "text-primary-800" : ""
                }`}
              >
                Diuji ({assessedSeminars.length})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-primary-600" />
              <Input
                type="search"
                placeholder="Cari seminar..."
                className="w-full pl-8 border-primary-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="advised">
            <div className="rounded-sm overflow-x-auto border border-primary">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-primary text-primary-foreground font-heading font-medium">
                    <th className="p-4 w-[1%]">No.</th>
                    <th className="px-2 py-4 w-[30%]">Judul Penelitian</th>
                    <th className="px-2 py-4 w-[20%]">Mahasiswa</th>
                    <th className="p-4 w-[15%]">Jadwal Seminar</th>
                    <th className="p-4 w-[10%]">Tempat</th>
                    <th className="p-4 w-[9%] text-center">Keterangan</th>
                    <th className="p-4 w-[15%] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdvisedSeminars.length > 0 ? (
                    filteredAdvisedSeminars.map(
                      (seminar: any, index: number) => {
                        const isAssessed = hasBeenAssessed(seminar);
                        return (
                          <tr
                            key={seminar.id}
                            className="bg-white text-primary-800"
                          >
                            <td className="p-2">
                              <div className="font-medium text-center text-primary-800">
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="font-medium">{seminar.title}</div>
                            </td>
                            <td className="p-2">
                              <div className="font-medium text-primary-800">
                                {seminar.student?.name || "N/A"}
                              </div>
                              <div className="text-sm text-primary">
                                {seminar.studentNIM}
                              </div>
                            </td>
                            <td className="p-2">
                              <div>{formatDate(seminar.time)}</div>
                              <div className="text-sm text-primary">
                                {formatTime(seminar.time)}
                              </div>
                            </td>
                            <td className="p-2">{seminar.room || "TBD"}</td>
                            <td className="p-2">
                              <div className="flex justify-center items-center">
                                {isAssessed ? (
                                  <Badge className="bg-success text-primary-foreground border-primary-400 border-2">
                                    Sudah
                                  </Badge>
                                ) : (
                                  <Badge className="bg-destructive text-primary-foreground border-primary-400 border-2">
                                    Belum
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-2 text-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-primary-400 text-primary-700"
                                onClick={() => openDetailsModal(seminar)}
                              >
                                Lihat
                              </Button>
                              <Button
                                size="sm"
                                className={`${
                                  canAssessSeminar(seminar.time)
                                    ? "bg-primary-600 text-white hover:bg-primary-700"
                                    : "bg-primary-400 text-white opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!canAssessSeminar(seminar.time)}
                                onClick={() =>
                                  handleAssessNavigation(seminar.id)
                                }
                              >
                                Nilai
                              </Button>
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-primary-600"
                      >
                        Belum ada seminar proposal yang dijadwalkan untuk Anda
                        bimbing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="assessed">
            <div className="rounded-sm overflow-x-auto border border-primary">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-primary text-primary-foreground font-heading font-medium">
                    <th className="p-4 w-[1%]">No.</th>
                    <th className="px-2 py-4 w-[30%]">Judul Penelitian</th>
                    <th className="px-2 py-4 w-[20%]">Mahasiswa</th>
                    <th className="p-4 w-[15%]">Jadwal Seminar</th>
                    <th className="p-4 w-[10%]">Tempat</th>
                    <th className="p-4 w-[9%] text-center">Keterangan</th>
                    <th className="p-4 w-[15%] text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssessedSeminars.length > 0 ? (
                    filteredAssessedSeminars.map(
                      (seminar: any, index: number) => {
                        const isAssessed = hasBeenAssessed(seminar);
                        return (
                          <tr
                            key={seminar.id}
                            className="border-b border-primary-200 text-primary-800"
                          >
                            <td className="p-2">
                              <div className="font-medium text-center text-primary-800">
                                {index + 1}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="font-medium">{seminar.title}</div>
                            </td>
                            <td className="p-2">
                              <div className="font-medium text-primary-800">
                                {seminar.student?.name || "N/A"}
                              </div>
                              <div className="text-sm text-primary-600">
                                {seminar.studentNIM}
                              </div>
                            </td>
                            <td className="p-2">
                              <div>{formatDate(seminar.time)}</div>
                              <div className="text-sm text-primary-600">
                                {formatTime(seminar.time)}
                              </div>
                            </td>
                            <td className="p-2">{seminar.room || "TBD"}</td>
                            <td className="p-2">
                              <div className="flex justify-center items-center">
                                {isAssessed ? (
                                  <Badge className="bg-success text-primary-foreground border-primary-400 border-2">
                                    Sudah
                                  </Badge>
                                ) : (
                                  <Badge className="bg-destructive text-primary-foreground border-primary-400 border-2">
                                    Belum
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-2 text-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-primary-400 text-primary-700"
                                onClick={() => openDetailsModal(seminar)}
                              >
                                Lihat
                              </Button>
                              <Button
                                size="sm"
                                className={`${
                                  canAssessSeminar(seminar.time)
                                    ? "bg-primary-600 text-white hover:bg-primary-700"
                                    : "bg-primary-400 text-white opacity-50 cursor-not-allowed"
                                }`}
                                disabled={!canAssessSeminar(seminar.time)}
                                onClick={() =>
                                  handleAssessNavigation(seminar.id)
                                }
                              >
                                Nilai
                              </Button>
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-4 text-center text-primary-600"
                      >
                        Tidak ada seminar proposal yang dijadwalkan untuk Anda
                        bimbing.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

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
    </LecturerLayout>
  );
};

export default LecturerSeminarProposal;