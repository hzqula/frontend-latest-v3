import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { useApiData } from "../../../hooks/useApiData";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import LecturerLayout from "../../../components/layouts/LecturerLayout";

interface Seminar {
  id: number;
  title: string;
  student: { name: string; nim: string };
  time: string;
  room: string;
  advisors: { lecturer: { name: string; nip: string } }[];
  assessors: { lecturer: { name: string; nip: string } }[];
}

const AssessSeminarProposal = () => {
  // Pindahkan semua Hooks ke bagian atas
  const { seminarId } = useParams<{ seminarId: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const seminarQuery = useApiData({
    type: "seminarById",
    id: seminarId ? parseInt(seminarId) : undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [formData, setFormData] = useState({
    writingScore: "",
    presentationScore: "",
    titleScore: "",
    guidanceScore: "",
    feedback: "",
  });

  // Hook useEffect untuk menentukan peran dosen
  useEffect(() => {
    if (seminarQuery.data && user?.profile?.nip) {
      const seminar = seminarQuery.data;
      const advisorMatch = seminar.advisors.some(
        (advisor: any) => advisor.lecturer.nip === user.profile.nip
      );
      setIsAdvisor(advisorMatch);
    }
  }, [seminarQuery.data, user?.profile?.nip]);

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

  // Fungsi untuk submit penilaian
  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validasi input untuk skor yang wajib
    const requiredScores = [
      formData.writingScore,
      formData.presentationScore,
      formData.titleScore,
    ];

    // Tambahkan guidanceScore ke validasi jika dosen adalah pembimbing
    if (isAdvisor) {
      requiredScores.push(formData.guidanceScore);
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
        writingScore: parseFloat(formData.writingScore),
        presentationScore: parseFloat(formData.presentationScore),
        titleScore: parseFloat(formData.titleScore),
        feedback: formData.feedback || undefined,
      };

      // Hanya sertakan guidanceScore jika dosen adalah pembimbing
      if (isAdvisor) {
        payload.guidanceScore = parseFloat(formData.guidanceScore);
      }

      await axios.post(
        `http://localhost:5500/api/seminars/${seminarId}/assess`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Berhasil menilai seminar!");
      navigate("/seminar-proposal", { state: { fromAssessment: true } });
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

  // Logika render setelah semua Hooks dipanggil
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

  console.log("Seminar Id: ", seminarId);
  console.log("Is Advisor: ", isAdvisor);

  return (
    <LecturerLayout>
      <div className="container mx-auto p-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-heading font-black text-primary-800">
              Penilaian Seminar Proposal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-800">
                  Mahasiswa
                </h3>
                <p className="text-primary-800">
                  {seminar.student.name} ({seminar.student.nim})
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-800">
                  Judul Penelitian
                </h3>
                <p className="text-primary-800">{seminar.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-800">
                  Jadwal Seminar
                </h3>
                <p className="text-primary-800">
                  {formatDate(seminar.time)} {formatTime(seminar.time)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-800">
                  Tempat Seminar
                </h3>
                <p className="text-primary-800">{seminar.room || "TBD"}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-800">
                  Pembimbing
                </h3>
                <ul className="list-disc pl-5">
                  {seminar.advisors.map((advisor, index) => (
                    <li key={index} className="text-primary-800">
                      {advisor.lecturer.name} ({advisor.lecturer.nip})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-primary-800">
                  Penguji
                </h3>
                <ul className="list-disc pl-5">
                  {seminar.assessors.map((assessor, index) => (
                    <li key={index} className="text-primary-800">
                      {assessor.lecturer.name} ({assessor.lecturer.nip})
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="writingScore" className="text-primary-800">
                  Skor Penulisan (0-100)
                </Label>
                <Input
                  id="writingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.writingScore}
                  onChange={(e) =>
                    setFormData({ ...formData, writingScore: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="border-primary-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="presentationScore" className="text-primary-800">
                  Skor Presentasi (0-100)
                </Label>
                <Input
                  id="presentationScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.presentationScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      presentationScore: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                  className="border-primary-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="titleScore" className="text-primary-800">
                  Skor Judul (0-100)
                </Label>
                <Input
                  id="titleScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.titleScore}
                  onChange={(e) =>
                    setFormData({ ...formData, titleScore: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="border-primary-400"
                  required
                />
              </div>
              {isAdvisor && (
                <div>
                  <Label htmlFor="guidanceScore" className="text-primary-800">
                    Skor Bimbingan (0-100)
                  </Label>
                  <Input
                    id="guidanceScore"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.guidanceScore}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        guidanceScore: e.target.value,
                      })
                    }
                    disabled={isSubmitting}
                    className="border-primary-400"
                    required
                  />
                </div>
              )}
              <div>
                <Label htmlFor="feedback" className="text-primary-800">
                  Feedback (Opsional)
                </Label>
                <Input
                  id="feedback"
                  type="text"
                  value={formData.feedback}
                  onChange={(e) =>
                    setFormData({ ...formData, feedback: e.target.value })
                  }
                  disabled={isSubmitting}
                  className="border-primary-400"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="border-primary-400 text-primary-800"
                  onClick={() => navigate("/seminar-proposal")}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button
                  className="bg-primary-600 text-white hover:bg-primary-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Submit Penilaian"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LecturerLayout>
  );
};

export default AssessSeminarProposal;
