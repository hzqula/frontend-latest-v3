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
import SeminarDetailsModal from "./SeminarDetailsModal";
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
  const refetch = seminarsQuery.refetch; // Ambil fungsi refetch dari useApiData

  // Refetch data saat kembali dari halaman penilaian
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

  // Filter seminars berdasarkan status SCHEDULED dan tipe PROPOSAL
  const scheduledSeminars = seminars.filter(
    (seminar: any) =>
      seminar.status === "SCHEDULED" && seminar.type === "PROPOSAL"
  );

  // Seminar yang dibimbing (advised) oleh dosen ini
  const advisedSeminars = scheduledSeminars.filter((seminar: any) =>
    seminar.advisors.some(
      (advisor: any) => advisor.lecturer?.nip === user.profile.nip
    )
  );

  // Seminar yang diuji (assessed) oleh dosen ini
  const assessedSeminars = scheduledSeminars.filter((seminar: any) =>
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

  // Fungsi untuk membuka modal detail
  const openDetailsModal = (seminar: any) => {
    setSelectedSeminar(seminar);
    setDetailsModalOpen(true);
  };

  // Fungsi untuk mengecek apakah seminar sudah terlaksana
  const canAssessSeminar = (seminarTime: string) => {
    const currentDate = new Date();
    const seminarDate = new Date(seminarTime);
    return currentDate > seminarDate;
  };

  // Fungsi untuk mengecek apakah seminar sudah dinilai oleh dosen ini
  const hasBeenAssessed = (seminar: any) => {
    if (!seminar.assessments || seminar.assessments.length === 0) {
      console.log(`No assessments for seminar ${seminar.id}`);
      return false;
    }
    console.log(`Assessments for seminar ${seminar.id}:`, seminar.assessments);
    console.log("Current lecturer NIP:", user.profile.nip);
    return seminar.assessments.some((assessment: any) => {
      console.log("Assessment lecturerNIP:", assessment.lecturerNIP);
      return assessment.lecturerNIP === user.profile.nip;
    });
  };

  // Fungsi untuk navigasi dengan state
  const handleAssessNavigation = (seminarId: number) => {
    navigate(`/seminar-proposal/assess/${seminarId}`, {
      state: { fromAssessment: true },
    });
  };

  return (
    <LecturerLayout>
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
          <TabsList className="grid grid-cols-2 mb-6 bg-primary">
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

          {/* Tab: Dibimbing */}
          <TabsContent value="advised">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
                      Seminar Proposal Dibimbing
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Seminar proposal yang Anda bimbing
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm overflow-x-auto border border-primary">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-primary text-primary-foreground font-heading font-medium">
                        <th className="p-4 w-[30%]">Judul Penelitian</th>
                        <th className="p-4 w-[20%]">Mahasiswa</th>
                        <th className="p-4 w-[15%]">Jadwal Seminar</th>
                        <th className="p-4 w-[10%]">Tempat</th>
                        <th className="p-4 w-[10%] text-center">Keterangan</th>
                        <th className="p-4 w-[15%] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdvisedSeminars.length > 0 ? (
                        filteredAdvisedSeminars.map((seminar: any) => {
                          const isAssessed = hasBeenAssessed(seminar);
                          return (
                            <tr
                              key={seminar.id}
                              className="border-b border-primary-200 text-primary-800"
                            >
                              <td className="p-4">
                                <div className="font-medium">
                                  {seminar.title}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-medium text-primary-800">
                                  {seminar.student?.name || "N/A"}
                                </div>
                                <div className="text-sm text-primary-600">
                                  {seminar.studentNIM}
                                </div>
                              </td>
                              <td className="p-4">
                                <div>{formatDate(seminar.time)}</div>
                                <div className="text-sm text-primary-600">
                                  {formatTime(seminar.time)}
                                </div>
                              </td>
                              <td className="p-4">{seminar.room || "TBD"}</td>
                              <td className="p-4">
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
                              <td className="p-4 text-center space-x-2">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Diuji */}
          <TabsContent value="assessed">
            <Card className="bg-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-800">
                      Seminar Proposal Diuji
                    </CardTitle>
                    <CardDescription className="text-primary">
                      Seminar proposal yang Anda uji
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-sm overflow-x-auto border border-primary">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-primary text-primary-foreground font-heading font-medium">
                        <th className="p-4 w-[30%]">Judul Penelitian</th>
                        <th className="p-4 w-[20%]">Mahasiswa</th>
                        <th className="p-4 w-[15%]">Jadwal Seminar</th>
                        <th className="p-4 w-[10%]">Tempat</th>
                        <th className="p-4 w-[10%]">Keterangan</th>
                        <th className="p-4 w-[15%] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssessedSeminars.length > 0 ? (
                        filteredAssessedSeminars.map((seminar: any) => {
                          const isAssessed = hasBeenAssessed(seminar);
                          return (
                            <tr
                              key={seminar.id}
                              className="border-b border-primary-200 text-primary-800"
                            >
                              <td className="p-4">
                                <div className="font-medium">
                                  {seminar.title}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="font-medium text-primary-800">
                                  {seminar.student?.name || "N/A"}
                                </div>
                                <div className="text-sm text-primary-600">
                                  {seminar.studentNIM}
                                </div>
                              </td>
                              <td className="p-4">
                                <div>{formatDate(seminar.time)}</div>
                                <div className="text-sm text-primary-600">
                                  {formatTime(seminar.time)}
                                </div>
                              </td>
                              <td className="p-4">{seminar.room || "TBD"}</td>
                              <td className="p-4">
                                {isAssessed ? (
                                  <Badge className="bg-success text-primary-foreground border-primary-400 border-2">
                                    Sudah
                                  </Badge>
                                ) : (
                                  <Badge className="bg-destructive text-primary-foreground border-primary-400 border-2">
                                    Belum
                                  </Badge>
                                )}
                              </td>
                              <td className="p-4 text-center space-x-2">
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
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-4 text-center text-primary-600"
                          >
                            Tidak ada seminar proposal yang dijadwalkan untuk
                            Anda uji.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
    </LecturerLayout>
  );
};

export default LecturerSeminarProposal;
