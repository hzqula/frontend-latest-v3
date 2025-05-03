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
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Combined filtering logic for advised seminars
  const filteredAdvisedSeminars = advisedSeminars.filter((seminar: any) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = statusFilter === "all" || seminar.type === statusFilter;
    return matchesSearch && matchesType;
  });

  // Combined filtering logic for assessed seminars
  const filteredAssessedSeminars = assessedSeminars.filter((seminar: any) => {
    const matchesSearch =
      seminar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.studentNIM.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seminar.student.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = statusFilter === "all" || seminar.type === statusFilter;
    return matchesSearch && matchesType;
  });

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
      <div className="container mx-auto p-4">
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
                        <th className="p-3 lg:p-4 w-[10%] text-center">
                          Keterangan
                        </th>
                        <th className="p-3 lg:p-4 w-[15%] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdvisedSeminars.length > 0 ? (
                        filteredAdvisedSeminars.map((seminar: any) => {
                          const isAssessed = hasBeenAssessed(seminar);
                          return (
                            <tr
                              key={seminar.id}
                              className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                            >
                              <td className="p-3 lg:p-4">
                                <div className="font-medium">
                                  {seminar.title}
                                </div>
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
                              <td className="p-3 lg:p-4 text-center">
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
                              <td className="p-3 lg:p-4 text-center space-x-1 lg:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-primary-400 text-primary-700 hover:bg-primary-100"
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

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-3 sm:space-y-4">
                    {filteredAdvisedSeminars.length > 0 ? (
                      filteredAdvisedSeminars.map((seminar: any) => {
                        const isAssessed = hasBeenAssessed(seminar);
                        return (
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
                                      : "TBD"} WIB
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
                                    Status
                                  </h3>
                                  <Badge className="text-xs px-2 py-0.5 bg-success text-primary-foreground border-primary-400 border">
                                    {isAssessed ? "Sudah" : "Belum"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex justify-end mt-2 space-x-1 sm:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-primary-400 text-primary-700 hover:bg-primary-100 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1.5"
                                  onClick={() => openDetailsModal(seminar)}
                                >
                                  Lihat
                                </Button>
                                <Button
                                  size="sm"
                                  className={`text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1.5 ${
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
                        <th className="p-3 lg:p-4 w-[10%] text-center">
                          Keterangan
                        </th>
                        <th className="p-3 lg:p-4 w-[15%] text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssessedSeminars.length > 0 ? (
                        filteredAssessedSeminars.map((seminar: any) => {
                          const isAssessed = hasBeenAssessed(seminar);
                          return (
                            <tr
                              key={seminar.id}
                              className="border-b border-primary-200 text-primary-800 text-xs lg:text-sm"
                            >
                              <td className="p-3 lg:p-4">
                                <div className="font-medium">
                                  {seminar.title}
                                </div>
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
                              <td className="p-3 lg:p-4 text-center">
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
                              <td className="p-3 lg:p-4 text-center space-x-1 lg:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-primary-400 text-primary-700 hover:bg-primary-100"
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

                {/* Mobile View */}
                <div className="md:hidden">
                  <div className="space-y-3 sm:space-y-4">
                    {filteredAssessedSeminars.length > 0 ? (
                      filteredAssessedSeminars.map((seminar: any) => {
                        const isAssessed = hasBeenAssessed(seminar);
                        return (
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
                                      : "TBD"} WIB
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
                                    Status
                                  </h3>
                                  <Badge className="text-xs px-2 py-0.5 bg-success text-primary-foreground border-primary-400 border">
                                    {isAssessed ? "Sudah" : "Belum"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex justify-end mt-2 space-x-1 sm:space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-primary-400 text-primary-700 hover:bg-primary-100 text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1.5"
                                  onClick={() => openDetailsModal(seminar)}
                                >
                                  Lihat
                                </Button>
                                <Button
                                  size="sm"
                                  className={`text-xs px-2 py-1 sm:text-sm sm:px-3 sm:py-1.5 ${
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
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="border border-primary rounded-sm p-3 text-center text-primary-600 text-xs sm:text-sm">
                        Tidak ada seminar proposal yang dijadwalkan untuk Anda
                        uji.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
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
