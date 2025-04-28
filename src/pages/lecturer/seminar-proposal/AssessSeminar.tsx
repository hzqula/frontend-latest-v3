import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useApiData } from "../../../hooks/useApiData";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import LecturerLayout from "../../../components/layouts/LecturerLayout";
import { Badge } from "../../../components/ui/badge";

interface Seminar {
  id: number;
  title: string;
  student: { name: string; nim: string; profilePicture: string };
  time: string;
  room: string;
  advisors: {
    lecturer: { name: string; nip: string; profilePicture: string };
  }[];
  assessors: {
    lecturer: { name: string; nip: string; profilePicture: string };
  }[];
}

const AssessSeminarProposal = () => {
  const { seminarId } = useParams<{ seminarId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const seminarQuery = useApiData({
    type: "seminarById",
    id: seminarId ? parseInt(seminarId) : undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [scores, setScores] = useState({
    writingScore: "",
    presentationScore: "",
    titleScore: "",
    guidanceScore: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (seminarQuery.data && user?.profile?.nip) {
      const seminar = seminarQuery.data;
      const advisorMatch = seminar.advisors.some(
        (advisor: any) => advisor.lecturer.nip === user.profile.nip
      );
      setIsAdvisor(advisorMatch);
    }
  }, [seminarQuery.data, user?.profile?.nip]);

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

  const handleScoreChange = (criterion: keyof typeof scores, value: string) => {
    if (value === "") {
      setScores((prev) => ({
        ...prev,
        [criterion]: "",
      }));
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setScores((prev) => ({
        ...prev,
        [criterion]: clampedValue.toString(),
      }));
    }
  };

  const calculateAverage = () => {
    const { writingScore, presentationScore, titleScore } = scores;
    const writing = parseFloat(writingScore) || 0; // Penyajian Makalah / Presentasi (25%)
    const presentation = parseFloat(presentationScore) || 0; // Penguasaan Materi (40%)
    const title = parseFloat(titleScore) || 0; // Karakteristik Mahasiswa (35%)

    // Weighted average: (score * weight) / total weight
    const weightedAverage =
      writing * 0.25 + // 25%
      presentation * 0.4 + // 35%
      title * 0.35; // 40%

    return weightedAverage.toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const requiredScores = [
      scores.writingScore,
      scores.presentationScore,
      scores.titleScore,
    ];

    if (isAdvisor) {
      requiredScores.push(scores.guidanceScore);
    }

    for (const score of requiredScores) {
      const numScore = parseFloat(score);
      if (isNaN(numScore) || numScore < 0 || numScore > 100) {
        toast.error("Setiap nilai harus antara 0 sampai 100.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        writingScore: parseFloat(scores.writingScore),
        presentationScore: parseFloat(scores.presentationScore),
        titleScore: parseFloat(scores.titleScore),
      };

      if (isAdvisor) {
        payload.guidanceScore = parseFloat(scores.guidanceScore);
      }

      await axios.post(
        `http://localhost:5500/api/seminars/${seminarId}/assess`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubmitted(true);
      toast.success("Berhasil menilai seminar!");
      setTimeout(() => {
        navigate("/seminar-proposal", { state: { fromAssessment: true } });
      }, 2000);
    } catch (error: any) {
      const message =
        error.response?.data?.error ||
        "Terjadi kesalahan saat menilai seminar.";
      toast.error(message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || !token || user.role !== "LECTURER") {
    navigate("/login");
    return null;
  }

  if (seminarQuery.isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-muted-foreground py-10">
          Memuat data...
        </div>
      </div>
    );
  }

  if (seminarQuery.isError || !seminarQuery.data) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-600 py-10">
          Gagal memuat data seminar atau seminar tidak ditemukan.
        </div>
      </div>
    );
  }

  const seminar: Seminar = seminarQuery.data;

  return (
    <LecturerLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-heading font-black mb-3 text-primary-800">
          Penilaian Seminar Proposal
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {submitted && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 mb-6 p-4 bg-green-50 text-green-800 rounded-lg">
              <p className="font-medium">Penilaian Berhasil Disimpan</p>
              <p>
                Penilaian telah berhasil disimpan. Anda akan segera dialihkan.
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="col-span-1 sm:col-span-2 lg:col-span-4 space-y-6"
          >
            {/* Seminar Details Card */}
            <Card className="bg-white col-span-1 sm:col-span-2 lg:col-span-4 overflow-hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-primary opacity-100"></div>
                <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

                <CardHeader className="relative z-10">
                  <div className="flex justify-between items-center gap-4">
                    <img
                      src={
                        seminar.student.profilePicture
                          ? seminar.student.profilePicture
                          : "https://robohash.org/mail@ashallendesign.co.uk"
                      }
                      alt="student-image"
                      className="w-12 h-12 border rounded-full bg-white"
                    />
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-medium text-primary-foreground">
                          Mahasiswa
                        </p>
                        <p className="text-2xl font-heading font-black text-primary-foreground">
                          {seminar.student.name}
                        </p>
                      </div>
                      <Badge className="bg-primary-foreground text-primary">
                        {seminar.student.nim}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </div>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Seminar Details */}
                <div className="flex justify-between items-center md:col-span-2">
                  <div>
                    <p className="text-xs uppercase -mb-1 font-medium text-primary-600">
                      Judul Penelitian
                    </p>
                    <p className="text-xl font-heading font-bold text-primary-800">
                      {seminar.title}
                    </p>
                    <p className="text-sm text-primary-600">
                      {formatDate(seminar.time)} • Jam{" "}
                      {formatTime(seminar.time)}
                    </p>
                  </div>
                  <Badge className="relative z-10 bg-primary text-primary-foreground">
                    {seminar.room}
                  </Badge>
                </div>

                {/* Profil Pembimbing */}
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium text-primary-600">
                    Pembimbing
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    {seminar.advisors.map((advisor, index) => (
                      <div
                        key={index}
                        className="border rounded-md group flex items-center gap-4 px-4 py-2 border-primary-200 bg-primary-50 relative overflow-hidden flex-1"
                      >
                        <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-primary-300 transition-transform duration-300 ease-in-out group-hover:-translate-x-4 group-hover:-translate-y-4 group-hover:scale-150"></div>
                        <img
                          src={
                            advisor.lecturer.profilePicture
                              ? advisor.lecturer.profilePicture
                              : `https://robohash.org/${advisor.lecturer.name}`
                          }
                          alt="advisor-image"
                          className="w-12 h-12 border rounded-full bg-white"
                        />
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col justify-center">
                            <p className="text-lg font-heading font-bold text-primary-800">
                              {advisor.lecturer.name}
                            </p>
                          </div>
                          <Badge className="relative z-10">
                            {advisor.lecturer.nip}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profil Penguji */}
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium text-primary-600">
                    Penguji
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    {seminar.assessors.map((assessor, index) => (
                      <div
                        key={index}
                        className="border rounded-md group flex items-center gap-4 px-4 py-2 border-primary-200 bg-primary-50 relative overflow-hidden flex-1"
                      >
                        <div className="absolute -right-6 -top-6 w-16 h-16 rounded-full bg-primary-300 transition-transform duration-300 ease-in-out group-hover:-translate-x-4 group-hover:-translate-y-4 group-hover:scale-150"></div>
                        <img
                          src={
                            assessor.lecturer.profilePicture
                              ? assessor.lecturer.profilePicture
                              : `https://robohash.org/${assessor.lecturer.name}`
                          }
                          alt="assessor-image"
                          className="w-12 h-12 border rounded-full bg-white"
                        />
                        <div className="flex justify-between items-center w-full">
                          <div className="flex flex-col justify-center">
                            <p className="text-lg font-heading font-bold text-primary-800">
                              {assessor.lecturer.name}
                            </p>
                          </div>
                          <Badge className="relative z-10">
                            {assessor.lecturer.nip}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Assessment Criteria Card */}
              <Card className="bg-white col-span-1 sm:col-span-2 lg:col-span-2 overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary opacity-100"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

                  <CardHeader className="relative z-10">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-heading font-black text-primary-foreground">
                          Kriteria Penilaian
                        </CardTitle>
                        <CardDescription className="text-sm text-primary-foreground">
                          Beri nilai pada skala 0-100 untuk setiap kriteria
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="space-y-8 p-6">
                  {/* Writing Score */}
                  <div className="">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <Label
                        htmlFor="writing-score"
                        className="text-lg font-medium font-heading text-primary-800"
                      >
                        Penyajian Makalah / Presentasi{" "}
                        <span className="font-bold">(25%)</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="writing-score"
                          type="number"
                          className="w-20 text-right font-bold border-primary-400"
                          min="0"
                          max="100"
                          value={scores.writingScore}
                          onChange={(e) =>
                            handleScoreChange("writingScore", e.target.value)
                          }
                          disabled={isSubmitting}
                          required
                        />
                        <span className="text-sm font-bold text-primary-600">
                          / 100
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-primary-800 w-4/5">
                      Kejelasan materi yang disampaikan, Sikap, kejelasan{" "}
                      <span className="italic">vokal</span> dan{" "}
                      <span className="italic">body</span>{" "}
                      <span className="italic">language</span>, Interaksi dan
                      komunikasi, Tampilan /{" "}
                      <span className="italic">design</span> materi presentasi
                    </p>
                  </div>

                  {/* Presentation Score */}
                  <div className="">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <Label
                        htmlFor="presentation-score"
                        className="text-lg font-medium font-heading text-primary-800"
                      >
                        Penguasaan Materi{" "}
                        <span className="font-bold">(40%)</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="presentation-score"
                          type="number"
                          className="w-20 text-right font-bold border-primary-400"
                          min="0"
                          max="100"
                          value={scores.presentationScore}
                          onChange={(e) =>
                            handleScoreChange(
                              "presentationScore",
                              e.target.value
                            )
                          }
                          disabled={isSubmitting}
                          required
                        />
                        <span className="text-sm font-bold text-primary-600">
                          / 100
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-primary-800 w-4/5">
                      Kemampuan menjawab dan kualitas jawaban
                    </p>
                  </div>

                  {/* Title Score */}
                  <div className="">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <Label
                        htmlFor="title-score"
                        className="text-lg font-medium font-heading text-primary-800"
                      >
                        Karakteristik Mahasiswa{" "}
                        <span className="font-bold">(40%)</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="title-score"
                          type="number"
                          className="w-20 text-right font-bold border-primary-400"
                          min="0"
                          max="100"
                          value={scores.titleScore}
                          onChange={(e) =>
                            handleScoreChange("titleScore", e.target.value)
                          }
                          disabled={isSubmitting}
                          required
                        />
                        <span className="text-sm font-bold text-primary-600">
                          / 100
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-primary-800 w-3/4">
                      Kerajinan / kemauan berusaha, inisiatif dan mengembangkan
                      pola pikir, adab kesopanan dan tepat waktu
                    </p>
                  </div>

                  {/* Guidance Score (hanya untuk pembimbing) */}
                  {isAdvisor && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <Label
                          htmlFor="guidance-score"
                          className="text-lg font-medium font-heading text-primary-800"
                        >
                          4. Kualitas Bimbingan
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            id="guidance-score"
                            type="number"
                            className="w-20 text-right font-bold border-primary-400"
                            min="0"
                            max="100"
                            value={scores.guidanceScore}
                            onChange={(e) =>
                              handleScoreChange("guidanceScore", e.target.value)
                            }
                            disabled={isSubmitting}
                            required
                          />
                          <span className="text-sm font-bold text-primary-600">
                            /100
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-primary-600 ml-4">
                        Menilai proses bimbingan, keteraturan konsultasi, dan
                        kemajuan penelitian.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="bg-white col-span-1 sm:col-span-2 lg:col-span-2 overflow-hidden">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary opacity-100"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

                  <CardHeader className="relative z-10">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-heading font-black text-primary-foreground">
                          Ringkasan Penilaian
                        </CardTitle>
                        <CardDescription className="text-sm text-primary-foreground">
                          Hasil kalkulasi dari nilai yang diinputkan berdasarkan
                          persentase
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Penyajian (25%)
                      </p>
                      <p className="text-2xl font-bold text-primary-700 mt-1">
                        {(
                          (parseFloat(scores.writingScore) || 0) * 0.25
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Penguasaan (40%)
                      </p>
                      <p className="text-2xl font-bold text-primary-700 mt-1">
                        {(
                          (parseFloat(scores.presentationScore) || 0) * 0.4
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Karakteristik (35%)
                      </p>
                      <p className="text-2xl font-bold text-primary-700 mt-1">
                        {((parseFloat(scores.titleScore) || 0) * 0.35).toFixed(
                          1
                        )}
                      </p>
                    </div>
                    {isAdvisor && (
                      <div className="flex flex-col items-center">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Bimbingan
                        </p>
                        <p className="text-2xl font-bold text-primary-700 mt-1">
                          {scores.guidanceScore || "0"}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-center justify-center mt-8">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Total Skor
                    </p>
                    <div className="relative flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center">
                        <div className="text-xl font-heading font-black text-primary-800">
                          {calculateAverage()}
                        </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            className="text-gray-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray="263.89"
                            strokeDashoffset={
                              263.89 -
                              (263.89 * parseFloat(calculateAverage())) / 100
                            }
                            className="text-primary-600 transition-all duration-500"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6">
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      className="border-primary-400 text-primary-foreground w-[25%]"
                      onClick={() => navigate("/seminar-proposal")}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary-600 text-white hover:bg-primary-700 w-[75%]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Menyimpan..." : "Submit Penilaian"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </LecturerLayout>
  );
};

export default AssessSeminarProposal;
