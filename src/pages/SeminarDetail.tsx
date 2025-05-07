import { useEffect, useState } from "react";
import { useLocation } from "react-router"; // Gunakan useLocation alih-alih useParams
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js";

interface Seminar {
  id: number;
  student?: {
    name: string;
    nim: string;
  };
  title?: string;
  time?: string;
  advisors: { lecturerName?: string; lecturerNIP?: string }[];
  assessors: { lecturerName?: string; lecturerNIP?: string }[];
  type: string;
}

const SeminarDetail = () => {
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Ambil location untuk query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("id"); // Ambil parameter id dari URL

  // Salt untuk hashing (harus sama dengan di SeminarInvitation)
  const SALT = import.meta.env.VITE_QR_HASH_SALT ;

  // Fungsi untuk menghasilkan hash dari seminar.id
  const generateQrHash = (seminarId: number): string => {
    return CryptoJS.SHA256(`${seminarId}${SALT}`).toString(CryptoJS.enc.Hex);
  };

  

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        // Pisahkan token menjadi hash dan id (dengan prefix 'su')
        const [hash, obfuscatedId] = token.split(":");
        if (!hash || !obfuscatedId) {
          throw new Error("Format token tidak valid");
        }

        // Hapus prefix 'su' untuk mendapatkan id asli
        const idStr = obfuscatedId.startsWith("su")
          ? obfuscatedId.slice(2)
          : obfuscatedId;
        const id = parseInt(idStr);
        if (isNaN(id)) {
          throw new Error("ID seminar tidak valid");
        }

        // Validasi hash
        const expectedHash = generateQrHash(id);
        if (hash !== expectedHash) {
          throw new Error("Hash tidak valid");
        }

        const response = await axios.get(`http://localhost:5500/api/seminars/${id}`);
        setSeminar(response.data.seminar);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Gagal memuat data seminar");
        setLoading(false);
      }
    };
    fetchSeminar();
  }, [token]);

  if (loading) {
    return <div className="container mx-auto p-4">Memuat...</div>;
  }

  if (error || !seminar) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Seminar tidak ditemukan"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })} pukul ${date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })} WIB`;
  };

  const capitalizeWords = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const seminarType = seminar.type ;


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Animasi fade in + scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="bg-white shadow-lg rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary-800">
              Detail Seminar {capitalizeWords(seminarType)}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">Informasi lengkap terkait seminar mahasiswa</p>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Data Mahasiswa */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-700">Informasi Mahasiswa</h3>
              <div>
                <p className="text-sm text-gray-500">Nama Mahasiswa</p>
                <p className="text-lg font-medium text-primary-900">{seminar.student?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">NIM</p>
                <p className="text-lg font-medium text-primary-900">{seminar.student?.nim || "N/A"}</p>
              </div>
            </div>

            {/* Data Penelitian */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-700">Informasi Penelitian</h3>
              <div>
                <p className="text-sm text-gray-500">Judul Penelitian</p>
                <p className="text-lg font-medium text-primary-900">{seminar.title || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipe Seminar</p>
                <p className="text-lg font-medium text-primary-900">{capitalizeWords(seminarType)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Waktu Seminar</p>
                <p className="text-lg font-medium text-primary-900">
                  {seminar.time ? formatDateTime(seminar.time) : "Belum ditentukan"}
                </p>
              </div>
            </div>

            {/* Pembimbing */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-700">Dosen Pembimbing</h3>
              <ul className="list-disc list-inside text-primary-900">
                {seminar.advisors.length > 0 ? (
                  seminar.advisors.map((advisor, index) => (
                    <li key={index}>{advisor.lecturerName || advisor.lecturerNIP || "N/A"}</li>
                  ))
                ) : (
                  <li>Belum ditentukan</li>
                )}
              </ul>
            </div>

            {/* Penguji */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary-700">Dosen Penguji</h3>
              <ul className="list-disc list-inside text-primary-900">
                {seminar.assessors.length > 0 ? (
                  seminar.assessors.map((assessor, index) => (
                    <li key={index}>{assessor.lecturerName || assessor.lecturerNIP || "N/A"}</li>
                  ))
                ) : (
                  <li>Belum ditentukan</li>
                )}
              </ul>
            </div>

            {/* Status Seminar */}
            <div className="md:col-span-2">
              <Alert className="flex items-center gap-4 bg-primary-50 border-primary-200 p-4 rounded-md">
                <CheckCircle2 className="h-6 w-6 text-primary-600" />
                <div>
                  <AlertTitle className="text-primary-800 font-bold">Status Seminar</AlertTitle>
                  <AlertDescription className="text-primary-700">
                    Surat Undangan Seminar <span className="font-semibold">SAH</span>
                  </AlertDescription>
                </div>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SeminarDetail;