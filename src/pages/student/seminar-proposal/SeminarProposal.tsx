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
import ReviewSubmitModal from "./ReviewSubmit";
import StudentLayout from "../../../components/layouts/StudentLayout";
import { Stepper } from "../../../components/ui/stepper";

const StudentSeminarProposal = () => {
  const [currentStep, setCurrentStep] = useState<string>("step1");
  const [maxStepReached, setMaxStepReached] = useState<number>(1);
  const [seminarId, setSeminarId] = useState<number | null>(null);
  const { user, token } = useAuth();
  const lecturersQuery = useApiData({ type: "lecturers" });
  const lecturers = lecturersQuery.data || [];

  const [formData, setFormData] = useState({
    researchTitle: "",
    advisor1: "",
    advisor2: "",
    uploadedDocuments: {
      THESIS_PROPOSAL: null,
      ADVISOR_AVAILABILITY: null,
      KRS: null,
      ADVISOR_ASSISTANCE: null,
      SEMINAR_ATTENDANCE: null,
    } as Record<string, File | null>,
  });

  const [uploadedStatus, setUploadedStatus] = useState<Record<string, boolean>>(
    {
      THESIS_PROPOSAL: false,
      ADVISOR_AVAILABILITY: false,
      KRS: false,
      ADVISOR_ASSISTANCE: false,
      SEMINAR_ATTENDANCE: false,
    }
  );

  const [researchDetailsModalOpen, setResearchDetailsModalOpen] =
    useState(false);
  const [documentUploadModalOpen, setDocumentUploadModalOpen] = useState(false);
  const [reviewSubmitModalOpen, setReviewSubmitModalOpen] = useState(false);
  const [seminarStatus, setSeminarStatus] = useState<string | null>(null);

  if (!user || !user.profile?.nim) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    const fetchExistingSeminar = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5500/api/seminars/student/${user.profile.nim}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const seminar = response.data.seminar;
        if (seminar) {
          setSeminarId(seminar.id);
          setSeminarStatus(seminar.status);
          const uploadedDocs = seminar.documents.reduce(
            (acc: Record<string, boolean>, doc: any) => {
              acc[doc.documentType] = true;
              return acc;
            },
            { ...uploadedStatus }
          );
          setUploadedStatus(uploadedDocs);
          setFormData({
            researchTitle: seminar.title,
            advisor1: seminar.advisors[0]?.lecturerNIP || "",
            advisor2: seminar.advisors[1]?.lecturerNIP || "",
            uploadedDocuments: seminar.documents.reduce(
              (acc: Record<string, File | null>, doc: any) => {
                acc[doc.documentType] = null;
                return acc;
              },
              { ...formData.uploadedDocuments }
            ),
          });
          if (seminar.status === "DRAFT") setCurrentStep("step1");
          else if (seminar.status === "SUBMITTED") setCurrentStep("step2");
          else if (seminar.status === "SCHEDULED") setCurrentStep("step4");
        }
      } catch (error) {
        console.error("Failed to fetch seminar:", error);
      }
    };
    fetchExistingSeminar();
  }, [user.profile.nim, token]);

  const handleResearchDetailsSubmit = async (data: {
    researchTitle: string;
    advisor1: string;
    advisor2?: string;
  }) => {
    try {
      const advisorNIPs = [data.advisor1];
      if (data.advisor2) advisorNIPs.push(data.advisor2);

      const endpoint = seminarId
        ? `http://localhost:5500/api/seminars/${seminarId}`
        : "http://localhost:5500/api/seminars/proposal-register";
      const method = seminarId ? "put" : "post";

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

      if (!response.data || !response.data.data || !response.data.data.id) {
        throw new Error("ID Seminar tersebut tidak ditemukan");
      }

      setSeminarId(response.data.data.id);
      setFormData((prev) => ({
        ...prev,
        researchTitle: data.researchTitle,
        advisor1: data.advisor1,
        advisor2: data.advisor2 || "",
      }));
      setResearchDetailsModalOpen(false);
      setCurrentStep("step2");
      toast.success(
        seminarId
          ? "Detail seminar berhasil diupdate!"
          : "Detail seminar berhasil didaftarkan!"
      );
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
    if (!seminarId) {
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
          uploadFormData.append("seminarId", String(seminarId));
          uploadFormData.append("documentType", docType);
          uploadFormData.append("file", file);

          const method = uploadedStatus[docType] ? "put" : "post";
          const endpoint =
            "http://localhost:5500/api/seminars/proposal-documents";

          await axios({
            method,
            url: endpoint,
            data: uploadFormData,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          setUploadedStatus((prev) => ({ ...prev, [docType]: true }));
        }
      }

      setFormData((prev) => ({ ...prev, uploadedDocuments: documents }));
      setDocumentUploadModalOpen(false);
      setCurrentStep("step3");
      toast.success("Dokumen berhasil diunggah!");
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error);
      toast.error(
        "Gagal mengunggah dokumen: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setReviewSubmitModalOpen(false);
      setCurrentStep("step4");
      toast.success("Seminar proposal berhasil disubmit!");
    } catch (error: any) {
      toast.error(
        "Gagal submit: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const allDocumentsUploaded = () =>
    Object.values(uploadedStatus).every((status) => status === true);

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

  const isScheduled = seminarStatus === "SCHEDULED";

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
      if (currentStep === "step1" && !formData.researchTitle) {
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

        {currentStep === "step1" && (
          <Card className="bg-white sm:col-span-2 overflow-hidden">
            <CardHeader className="bg-primary">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                  Detail Seminar
                </CardTitle>
                {getStatusBadge("step1")}
              </div>
              <CardDescription className="text-primary-foreground text-sm">
                Masukkan judul penelitian dan dosen pembimbing Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formData.researchTitle ? (
                <div className="space-y-4 mt-6">
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Judul Penelitian
                    </h3>
                    <p className="text-primary-800 text-lg font-bold">
                      {formData.researchTitle}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-heading text-primary">
                      Dosen Pembimbing I
                    </h3>
                    <p className="text-primary-800 text-lg font-bold">
                      {lecturers.find((l: any) => l.nip === formData.advisor1)
                        ?.name || formData.advisor1}
                    </p>
                  </div>
                  {formData.advisor2 && (
                    <div>
                      <h3 className="text-sm font-bold font-heading text-primary">
                        Dosen Pembimbing II
                      </h3>
                      <p className="text-primary-800 text-lg font-bold">
                        {lecturers.find((l: any) => l.nip === formData.advisor2)
                          ?.name || formData.advisor2}
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
                  disabled={isScheduled}
                  variant="outline"
                  className="border-2 border-primary text-primary-800"
                >
                  {formData.researchTitle
                    ? "Perbarui Detail Seminar"
                    : "Masukkan Detail Seminar"}
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!formData.researchTitle || isScheduled}
                  className="bg-primary hover:bg-primary-700 text-primary-foreground"
                >
                  Lanjut
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {currentStep === "step2" && (
          <Card className="bg-white sm:col-span-2 overflow-hidden">
            <CardHeader className="bg-primary">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl -mb-1 font-heading font-black text-primary-foreground">
                  Dokumen yang Dibutuhkan
                </CardTitle>
                {getStatusBadge("step2")}
              </div>
              <CardDescription className="text-primary-foreground text-sm">
                Upload semua dokumen yang dibutuhkan untuk seminar proposal.
              </CardDescription>
            </CardHeader>
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
                    {Object.entries(uploadedStatus).map(([key, status]) => (
                      <div key={key} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary-600" />
                        <span className="text-sm text-primary-800">
                          {status ? "Dokumen telah diunggah" : "Belum diunggah"}
                        </span>
                      </div>
                    ))}
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
                disabled={currentStepIndex === 1 || isScheduled}
                className="border-primary-400 text-primary-700 hover:bg-accent hover:text-accent-foreground"
              >
                Kembali
              </Button>
              <div className="space-x-2">
                <Button
                  onClick={() => setDocumentUploadModalOpen(true)}
                  disabled={isScheduled}
                  variant="outline"
                  className="border-2 border-primary text-primary-800"
                >
                  {allDocumentsUploaded()
                    ? "Perbarui Dokumen"
                    : "Unggah Dokumen"}
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={!allDocumentsUploaded() || isScheduled}
                  className="bg-primary hover:bg-primary-700 text-primary-foreground"
                >
                  Lanjut
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {currentStep === "step3" && (
          <Card className="bg-white">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-primary-700">
                  Review & Submit
                </CardTitle>
                {getStatusBadge("step3")}
              </div>
              <CardDescription className="text-primary-600">
                Review your information before final submission.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4 border-primary-300">
                  <h3 className="font-medium mb-2 text-primary-700">
                    Research Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-primary-600">
                        Research Title
                      </p>
                      <p className="text-primary-800">
                        {formData.researchTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-600">
                        First Supervisor
                      </p>
                      <p className="text-primary-800">
                        {lecturers.find((l: any) => l.nip === formData.advisor1)
                          ?.name || formData.advisor1}
                      </p>
                    </div>
                    {formData.advisor2 && (
                      <div>
                        <p className="text-sm font-medium text-primary-600">
                          Second Supervisor
                        </p>
                        <p className="text-primary-800">
                          {lecturers.find(
                            (l: any) => l.nip === formData.advisor2
                          )?.name || formData.advisor2}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border rounded-lg p-4 border-primary-300">
                  <h3 className="font-medium mb-2 text-primary-700">
                    Uploaded Documents
                  </h3>
                  <ul className="space-y-2">
                    {Object.entries(uploadedStatus).map(([key, status]) => (
                      <li key={key} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary-600" />
                        <span className="text-primary-800">
                          {status ? "Dokumen telah diunggah" : "Belum diunggah"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Alert className="bg-primary-50 border-primary-200">
                  <AlertCircle className="h-4 w-4 text-primary-600" />
                  <AlertTitle className="text-primary-800">
                    Important Note
                  </AlertTitle>
                  <AlertDescription className="text-primary-700">
                    After submission, your registration will be reviewed by the
                    coordinator.
                  </AlertDescription>
                </Alert>
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
              <div className="space-x-2">
                <Button
                  onClick={() => setReviewSubmitModalOpen(true)}
                  disabled={isScheduled}
                  className="bg-primary hover:bg-primary-700 text-primary-foreground"
                >
                  Review & Submit
                </Button>
                <Button
                  onClick={handleNextStep}
                  disabled={isScheduled}
                  className="bg-primary hover:bg-primary-700 text-primary-foreground"
                >
                  Next
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
                    <span className="font-mono">{seminarId || "N/A"}</span>
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
            researchTitle: formData.researchTitle,
            advisor1: formData.advisor1,
            advisor2: formData.advisor2,
          }}
        />
        <DocumentUploadModal
          open={documentUploadModalOpen}
          onOpenChange={setDocumentUploadModalOpen}
          onSubmit={handleDocumentUpload}
          initialData={formData.uploadedDocuments}
          uploadedStatus={uploadedStatus}
        />
        <ReviewSubmitModal
          open={reviewSubmitModalOpen}
          onOpenChange={setReviewSubmitModalOpen}
          onSubmit={handleFinalSubmit}
          formData={formData}
        />
      </div>
    </StudentLayout>
  );
};

export default StudentSeminarProposal;
