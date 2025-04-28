"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useApiData } from "../../../hooks/useApiData";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../components/ui/alert";
import { Badge } from "../../../components/ui/badge";
import ResearchDetailsModal from "./ResearchDetail";
import DocumentUploadModal from "./DocumentUpload";
import StudentLayout from "../../../components/layouts/StudentLayout";
import { Stepper } from "../../../components/ui/stepper";
import { Link } from "react-router";
import SeminarInvitation from "../../../components/SeminarInvitation";

export interface Seminar {
  id: number | null;
  title: string;
  student?: {
    nim: string;
    name: string;
  } | null;
  status: "DRAFT" | "SUBMITTED" | "SCHEDULED" | "COMPLETED" | null;
  advisors: { lecturerNIP: string; lecturerName?: string }[];
  documents: Record<
    string,
    { uploaded: boolean; fileName?: string; fileURL?: string }
  >;
  time: string | null;
  room: string | null;
  assessors: { lecturerNIP: string; lecturerName?: string }[];
}

const StudentSeminarProposal = () => {
  const [currentStep, setCurrentStep] = useState<string>("step1");
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const { user, token } = useAuth();
  const lecturersQuery = useApiData({ type: "lecturers" });
  const lecturers = lecturersQuery.data || [];
  const seminarQuery = useApiData({
    type: "seminarByStudentNIM",
    param: user?.profile.nim,
  });

  const [seminar, setSeminar] = useState<Seminar>({
    id: null,
    title: "",
    student: null,
    status: null,
    advisors: [],

    documents: {
      THESIS_PROPOSAL: { uploaded: false },
      ADVISOR_AVAILABILITY: { uploaded: false },
      KRS: { uploaded: false },
      ADVISOR_ASSISTANCE: { uploaded: false },
      SEMINAR_ATTENDANCE: { uploaded: false },
    },
    time: null,
    room: null,
    assessors: [],
  });

  const requiredDocuments = [
    {
      id: "THESIS_PROPOSAL",
      name: "Proposal Tugas Akhir",
    },
    {
      id: "ADVISOR_AVAILABILITY",
      name: "Kesediaan Pembimbing",
    },
    {
      id: "KRS",
      name: "Kartu Rencana Studi",
    },
    {
      id: "ADVISOR_ASSISTANCE",
      name: "Asistensi Pembimbing",
    },
    {
      id: "SEMINAR_ATTENDANCE",
      name: "Kehadiran Seminar",
    },
  ];

  const [researchDetailsModalOpen, setResearchDetailsModalOpen] =
    useState(false);
  const [documentUploadModalOpen, setDocumentUploadModalOpen] = useState(false);
  const [shouldPrint, setShouldPrint] = useState(false);

  if (!user || !user.profile?.nim) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const seminarData = seminarQuery.data;
    console.log("Fetch Seminar Data:", seminarData);

    if (seminarData) {
      setSeminar({
        id: seminarData.id,
        title: seminarData.title,
        student: seminarData.student,
        status: seminarData.status,
        advisors: seminarData.advisors.map((a: any) => ({
          lecturerNIP: a.lecturerNIP,
          lecturerName: a.lecturer?.name,
        })),
        documents: {
          THESIS_PROPOSAL: {
            uploaded: !!seminarData.documents.find(
              (d: any) => d.documentType === "THESIS_PROPOSAL"
            ),
            fileName: seminarData.documents.find(
              (d: any) => d.documentType === "THESIS_PROPOSAL"
            )?.fileName,
            fileURL: seminarData.documents.find(
              (d: any) => d.documentType === "THESIS_PROPOSAL"
            )?.fileURL,
          },
          ADVISOR_AVAILABILITY: {
            uploaded: !!seminarData.documents.find(
              (d: any) => d.documentType === "ADVISOR_AVAILABILITY"
            ),
            fileName: seminarData.documents.find(
              (d: any) => d.documentType === "ADVISOR_AVAILABILITY"
            )?.fileName,
            fileURL: seminarData.documents.find(
              (d: any) => d.documentType === "ADVISOR_AVAILABILITY"
            )?.fileURL,
          },
          KRS: {
            uploaded: !!seminarData.documents.find(
              (d: any) => d.documentType === "KRS"
            ),
            fileName: seminarData.documents.find(
              (d: any) => d.documentType === "KRS"
            )?.fileName,
            fileURL: seminarData.documents.find(
              (d: any) => d.documentType === "KRS"
            )?.fileURL,
          },
          ADVISOR_ASSISTANCE: {
            uploaded: !!seminarData.documents.find(
              (d: any) => d.documentType === "ADVISOR_ASSISTANCE"
            ),
            fileName: seminarData.documents.find(
              (d: any) => d.documentType === "ADVISOR_ASSISTANCE"
            )?.fileName,
            fileURL: seminarData.documents.find(
              (d: any) => d.documentType === "ADVISOR_ASSISTANCE"
            )?.fileURL,
          },
          SEMINAR_ATTENDANCE: {
            uploaded: !!seminarData.documents.find(
              (d: any) => d.documentType === "SEMINAR_ATTENDANCE"
            ),
            fileName: seminarData.documents.find(
              (d: any) => d.documentType === "SEMINAR_ATTENDANCE"
            )?.fileName,
            fileURL: seminarData.documents.find(
              (d: any) => d.documentType === "SEMINAR_ATTENDANCE"
            )?.fileURL,
          },
        },
        time: seminarData.time,
        room: seminarData.room,
        assessors: seminarData.assessors.map((a: any) => ({
          lecturerNIP: a.lecturerNIP,
          lecturerName: a.lecturer?.name,
        })),
      });

      if (seminarData.status === "DRAFT") setCurrentStep("step1");
      else if (seminarData.status === "SUBMITTED") setCurrentStep("step2");
      else if (seminarData.status === "SCHEDULED") setCurrentStep("step3");
    }
  }, [seminarQuery.data, documentUploadModalOpen]);

  console.log("Seminar", seminar);
  console.log("Dospem: ", seminar.advisors);

  const handleResearchDetailsSubmit = async (data: {
    researchTitle: string;
    advisor1: string;
    advisor2?: string;
  }) => {
    try {
      const advisorNIPs = [data.advisor1];
      if (data.advisor2) advisorNIPs.push(data.advisor2);

      console.log("ID Seminar:", seminar);
      console.log("Data: ", data);

      const endpoint = seminar.id
        ? `http://localhost:5500/api/seminars/${seminar.id}`
        : "http://localhost:5500/api/seminars/proposal-register";
      const method = seminar.id ? "put" : "post";

      const requestData = {
        title: data.researchTitle,
        advisorNIPs,
        ...(method === "post" && { studentNIM: user.profile.nim }),
      };

      console.log("Request Data:", {
        method,
        url: endpoint,
        data: requestData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const response = await axios({
        method,
        url: endpoint,
        data: requestData,
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Server Response:", response.data);

      const newSeminarId = response.data.seminar.id;
      setSeminar((prev) => ({
        ...prev,
        id: newSeminarId,
        title: data.researchTitle,
        advisors: [
          {
            lecturerNIP: data.advisor1,
            lecturerName:
              lecturers.find((l: any) => l.nip === data.advisor1)?.name || "",
          },
          ...(data.advisor2
            ? [
                {
                  lecturerNIP: data.advisor2,
                  lecturerName:
                    lecturers.find((l: any) => l.nip === data.advisor2)?.name ||
                    "",
                },
              ]
            : []),
        ],
        status: "DRAFT",
        student:
          method === "post"
            ? { nim: user.profile.nim!, name: user.profile.name || "" }
            : prev.student,
      }));
      setResearchDetailsModalOpen(false);
      setCurrentStep("step2");
      toast.success(
        method === "put"
          ? "Detail seminar berhasil diperbarui!"
          : "Detail seminar berhasil didaftarkan!"
      );

      seminarQuery.refetch();
    } catch (error: any) {
      console.error("Error updating seminar:", error.response?.data || error);
      toast.error(
        "Failed to update: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDocumentUpload = async (
    documents: Record<string, File | null>
  ) => {
    if (!seminar.id) {
      toast.error(
        "ID seminar tidak ditemukan, selesaikan detail seminar terlebih dahulu."
      );
      return;
    }

    try {
      const requiredDocs = [
        "THESIS_PROPOSAL",
        "ADVISOR_AVAILABILITY",
        "KRS",
        "ADVISOR_ASSISTANCE",
        "SEMINAR_ATTENDANCE",
      ];

      for (const docType of requiredDocs) {
        const file = documents[docType];
        if (file instanceof File) {
          const uploadFormData = new FormData();
          uploadFormData.append("seminarId", String(seminar.id));
          uploadFormData.append("documentType", docType);
          uploadFormData.append("file", file);

          const method = seminar.documents[docType].uploaded ? "put" : "post";
          const endpoint =
            "http://localhost:5500/api/seminars/proposal-documents";

          const response = await axios({
            method,
            url: endpoint,
            data: uploadFormData,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("Upload Response:", response.data);

          setSeminar((prev) => ({
            ...prev,
            documents: {
              ...prev.documents,
              [docType]: {
                uploaded: true,
                fileName: response.data.seminarDocument.fileName,
                fileURL: response.data.seminarDocument.fileURL,
              },
            },
            status: "SUBMITTED",
          }));
        }
      }
      setDocumentUploadModalOpen(false);
      setCurrentStep("step3");
      toast.success("Dokumen berhasil diunggah!");

      seminarQuery.refetch();
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error);
      toast.error(
        "Gagal mengunggah dokumen: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const allDocumentsUploaded = () =>
    Object.values(seminar.documents).every((doc) => doc.uploaded);

  const getStatusBadge = (step: string) => {
    const currentStepNum = Number.parseInt(currentStep.replace("step", ""));
    const stepNum = Number.parseInt(step.replace("step", ""));
    if (stepNum < maxStepReached) {
      return (
        <Badge className="bg-primary-100 text-primary-800 border-primary-400">
          Sudah
        </Badge>
      );
    } else if (stepNum === currentStepNum) {
      return (
        <Badge className="bg-primary-200 text-primary-800 border-primary-400 border-2">
          Belum
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-white text-primary-800 border-primary-300">
          Pending
        </Badge>
      );
    }
  };

  const isScheduled = seminar.status === "SCHEDULED";

  const steps = [
    "Detail Seminar",
    "Upload Dokumen",
    "Undangan Seminar",
    "Berita Acara",
  ];
  const currentStepIndex = parseInt(currentStep.replace("step", ""), 10);

  const handleNextStep = () => {
    const nextStepNum = currentStepIndex + 1;
    if (nextStepNum <= steps.length) {
      if (currentStep === "step1" && !seminar.title) {
        toast.error("Silakan masukkan detail seminar terlebih dahulu.");
        return;
      }
      if (currentStep === "step2" && !allDocumentsUploaded()) {
        toast.error(
          "Silakan upload semua dokumen yang dibutuhkan terlebih dahulu."
        );
        return;
      }
      setCurrentStep(`step${nextStepNum}`);
      setMaxStepReached((prev) => Math.max(prev, nextStepNum));
    }
  };

  const handlePrevStep = () => {
    const prevStepNum = currentStepIndex - 1;
    if (prevStepNum >= 1) {
      setCurrentStep(`step${prevStepNum}`);
    }
  };

  const handlePrintInvitation = () => {
    setShouldPrint(true);
  };

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

  return (
    <StudentLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-heading font-black mb-3 text-primary-800">
          Pendaftaran Seminar Proposal
        </h1>
        <Stepper
          steps={steps}
          currentStep={currentStepIndex}
          className="mb-8"
        />

        {seminarQuery.isLoading && <div>Loading seminar data...</div>}
        {seminarQuery.error && (
          <div>
            Error loading seminar: {(seminarQuery.error as Error).message}
          </div>
        )}

        {currentStep === "step1" && (
          <Card className="bg-white sm:col-span-2 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-primary opacity-100"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

              <CardHeader className="relative z-10 ">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                    Detail Seminar
                  </CardTitle>
                  {getStatusBadge("step3")}
                </div>
                <CardDescription className="text-primary-foreground text-sm">
                  Masukkan judul penelitian dan dosen pembimbing Anda.
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent>
              {seminar.title ? (
                <div className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Judul Penelitian
                    </h3>
                    <p className="text-primary-800 text-lg font-bold">
                      {seminar.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Dosen Pembimbing I
                    </h3>
                    <div>
                      <div>
                        <p className="text-primary-800 text-lg font-bold">
                          {seminar.advisors[0]?.lecturerName}
                        </p>
                        <p className="text-primary-800 text-lg font-bold">
                          {seminar.advisors[0]?.lecturerNIP}
                        </p>
                      </div>
                    </div>
                  </div>
                  {seminar.advisors[1] && (
                    <div>
                      <h3 className="text-sm font-bold font-heading text-primary">
                        Dosen Pembimbing II
                      </h3>
                      <p className="text-primary-800 text-lg font-bold">
                        {seminar.advisors[1]?.lecturerName}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-primary-600 mb-4">
                    Silakan masukkan detail seminar terlebih dahulu untuk
                    diproses.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="space-x-2">
                <Button
                  onClick={() => setResearchDetailsModalOpen(true)}
                  disabled={seminar.status === "SCHEDULED"}
                  variant="outline"
                  className="border-2 border-primary text-primary-800"
                >
                  {seminar.title
                    ? "Perbarui Detail Seminar"
                    : "Masukkan Detail Seminar"}
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary-700 text-primary-foreground"
                >
                  Lanjut
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {currentStep === "step2" && (
          <Card className="bg-white overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-primary opacity-100"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

              <CardHeader className="relative z-10 ">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                    Dokumen yang Dibutuhkan
                  </CardTitle>
                  {getStatusBadge("step3")}
                </div>
                <CardDescription className="text-primary-foreground text-sm">
                  Upload semua dokumen yang dibutuhkan untuk seminar proposal.
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent>
              {allDocumentsUploaded() ? (
                <div className="space-y-4 mt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary-600" />
                    <p className="text-primary-800">
                      Semua dokumen yang dibutuhkan sudah berhasil diunggah.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(seminar.documents).map(([key, doc]) => {
                      const reqDoc = requiredDocuments.find(
                        (d) => d.id === key
                      );
                      return (
                        <div key={key} className="flex flex-col">
                          <h1 className="font-bold text-lg font-heading text-primary-800">
                            {reqDoc ? reqDoc.name : key}
                          </h1>
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-primary-600" />
                            <span className="text-sm text-primary-800">
                              {doc.uploaded ? doc.fileName : "Belum diunggah"}
                            </span>
                            {doc.uploaded && doc.fileURL && (
                              <Button
                                variant="link"
                                size="sm"
                                className="text-primary-600 hover:text-primary-800 p-0"
                              >
                                <Link
                                  to={doc.fileURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Lihat File
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-8 mt-4 text-center">
                  <Upload className="h-12 w-12 text-primary-800 mx-auto mb-4" />
                  <p className="text-primary-600 mb-4">
                    Silakan upload semua dokumen yang dibutuhkan, untuk
                    diproses.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="secondary"
                onClick={handlePrevStep}
                className="border-primary-400 text-primary-700 hover:bg-accent hover:text-accent-foreground"
              >
                Kembali
              </Button>
              <div className="space-x-2">
                <Button
                  onClick={() => setDocumentUploadModalOpen(true)}
                  disabled={seminar.status === "SCHEDULED"}
                  variant="outline"
                  className="border-2 border-primary text-primary-800"
                >
                  {allDocumentsUploaded()
                    ? "Perbarui Dokumen"
                    : "Unggah Dokumen"}
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary-700 text-primary-foreground"
                >
                  Lanjut
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {currentStep === "step3" && (
          <Card className="bg-white overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-primary opacity-100"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>

              <CardHeader className="relative z-10 ">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                    Undangan Seminar
                  </CardTitle>
                  {getStatusBadge("step3")}
                </div>
                <CardDescription className="text-primary-foreground text-sm">
                  Lihat detail seminar Anda dan unduh undangan seminar setelah
                  jadwal ditentukan.
                </CardDescription>
              </CardHeader>
            </div>
            <CardContent>
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Mahasiswa
                    </h3>
                    <div className="flex flex-col">
                      <p className="text-primary-800 -mb-2 text-lg font-bold">
                        {seminar.student?.name}
                      </p>
                      <p className="text-primary-800 font-bold">
                        NIM:{" "}
                        <span className="text-primary-400 font-medium">
                          {seminar.student?.nim}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Judul Penelitian
                    </h3>
                    <p className="text-primary-800 text-lg font-bold">
                      {seminar.title}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Dosen Pembimbing I
                    </h3>
                    <div className="flex flex-col">
                      <p className="text-primary-800 -mb-2 text-lg font-bold">
                        {seminar.advisors[0]?.lecturerName}
                      </p>
                      <p className="text-primary-800 font-bold">
                        NIP:{" "}
                        <span className="text-primary-400 font-medium">
                          {seminar.advisors[0]?.lecturerNIP}
                        </span>
                      </p>
                    </div>
                  </div>
                  {seminar.advisors[1] && (
                    <div>
                      <h3 className="text-sm font-bold font-heading text-primary">
                        Dosen Pembimbing II
                      </h3>
                      <div className="flex flex-col">
                        <p className="text-primary-800 -mb-2 text-lg font-bold">
                          {seminar.advisors[1]?.lecturerName}
                        </p>
                        <p className="text-primary-800 font-bold">
                          NIP:{" "}
                          <span className="text-primary-400 font-medium">
                            {seminar.advisors[1]?.lecturerNIP}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Waktu
                    </h3>
                    <p className="text-primary-800 text-lg font-bold">
                      {seminar.time
                        ? `${formatDate(seminar.time)} • ${formatTime(
                            seminar.time
                          )}`
                        : "Belum ditentukan"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Ruangan
                    </h3>
                    <p className="text-primary-800 text-lg font-bold">
                      {seminar.room || "Belum ditentukan"}
                    </p>
                  </div>
                </div>
                <h3 className="text-sm font-bold font-heading text-primary">
                  Dosen Penguji
                </h3>
                {seminar.assessors.length > 0 ? (
                  <ul>
                    {seminar.assessors.map((assessor, index) => (
                      <li
                        key={index}
                        className="text-primary-800 text-lg font-bold"
                      >
                        {assessor.lecturerName || assessor.lecturerNIP}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-primary-800 text-lg font-bold">
                    Belum ditentukan
                  </p>
                )}
                <Alert className="bg-primary-50 border-primary-200">
                  <AlertCircle className="h-4 w-4 text-primary-600" />
                  <AlertTitle className="text-primary-800">
                    Informasi
                  </AlertTitle>
                  <AlertDescription className="text-primary-700">
                    Undangan seminar akan tersedia setelah koordinator
                    menentukan jadwal dan penguji.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="secondary"
                onClick={handlePrevStep}
                className="border-primary-400 text-primary-700 hover:bg-accent hover:text-accent-foreground"
              >
                Kembali
              </Button>
              <div className="space-x-2">
                <Button
                  onClick={handlePrintInvitation}
                  disabled={seminar.status !== "SCHEDULED"}
                  variant="outline"
                  className="border-2 border-primary text-primary-800"
                >
                  Unduh Undangan
                </Button>
                <Button
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary-700 text-primary-foreground"
                >
                  Lanjut
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {currentStep === "step4" && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-primary-700">
                Registration Complete
              </CardTitle>
              <CardDescription className="text-primary-600">
                Your proposal seminar registration has been submitted
                successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-primary-100 p-3 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-primary-800">
                  Thank You!
                </h3>
                <p className="text-primary-600 mb-6 max-w-md">
                  Your proposal seminar registration has been submitted and is
                  now being processed by the coordinator.
                </p>
                <div className="bg-primary-50 p-4 rounded-lg mb-6 w-full max-w-md border-primary-200">
                  <p className="font-medium text-primary-800">
                    Registration ID:{" "}
                    <span className="font-mono">{seminar.id || "N/A"}</span>
                  </p>
                  <p className="text-sm text-primary-600">
                    Please keep this ID for your reference.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/dashboard")}
                  className="border-primary-400 text-primary-700 hover:bg-accent hover:text-accent-foreground"
                >
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStepIndex === 1 || isScheduled}
                className="border-primary-400 text-primary-700 hover:bg-accent hover:text-accent-foreground"
              >
                Back
              </Button>
              <Button
                onClick={handleNextStep}
                disabled={true}
                className="bg-primary hover:bg-primary-700 text-primary-foreground"
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        )}

        <ResearchDetailsModal
          open={researchDetailsModalOpen}
          onOpenChange={setResearchDetailsModalOpen}
          onSubmit={handleResearchDetailsSubmit}
          initialData={{
            researchTitle: seminar.title,
            advisor1: seminar.advisors[0]?.lecturerNIP,
            advisor2: seminar.advisors[1]?.lecturerNIP || "",
          }}
        />
        <DocumentUploadModal
          open={documentUploadModalOpen}
          onOpenChange={setDocumentUploadModalOpen}
          onSubmit={handleDocumentUpload}
          initialData={Object.fromEntries(
            Object.entries(seminar.documents).map(([key, _]) => [key, null])
          )}
          uploadedStatus={Object.fromEntries(
            Object.entries(seminar.documents).map(([key, doc]) => [
              key,
              doc.uploaded,
            ])
          )}
        />
      </div>
      <SeminarInvitation
        seminar={seminar}
        shouldPrint={shouldPrint}
        onPrintComplete={() => setShouldPrint(false)}
      />
    </StudentLayout>
  );
};

export default StudentSeminarProposal;
