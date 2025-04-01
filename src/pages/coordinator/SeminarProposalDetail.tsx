"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { DocumentCard } from "../../components/ui/document-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  CalendarDays,
  Clock,
  FileText,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ClockIcon,
} from "lucide-react";
import { format } from "date-fns";
import CoordinatorLayout from "../../components/layouts/CoordinatorLayout";

// Define types for our data
interface Lecturer {
  nip: string;
  name: string;
  phoneNumber: string;
  profilePicture: string;
}

interface Advisor {
  id: number;
  seminarID: number;
  lecturerNIP: string;
  lecturer: Lecturer;
}

interface Student {
  nim: string;
  name: string;
  phoneNumber: string;
  profilePicture: string;
}

interface Document {
  documentType: string;
  fileName: string;
  fileURL: string;
}

interface Seminar {
  id: number;
  type: string;
  title: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  folderId: string;
  studentNIM: string;
  time: string | null;
  room: string | null;
  student: Student;
  advisors: Advisor[];
  assessors: Advisor[];
  documents: Document[];
}

interface SeminarResponse {
  success: boolean;
  seminar: Seminar;
  message: string;
}

const SeminarProposalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("details");

  useEffect(() => {
    const fetchSeminarProposalDetail = async () => {
      try {
        setLoading(true);

        // In a real application, this would be an API call
        // For now, we'll simulate it with the provided data
        const response: SeminarResponse = {
          success: true,
          seminar: {
            id: 34,
            type: "PROPOSAL",
            title: "ubahin lu coba",
            status: "SUBMITTED",
            createdAt: "2025-03-26T03:09:46.115Z",
            updatedAt: "2025-03-26T03:09:46.115Z",
            folderId: "15jFBtRBOXwyL0kCfPwdgUGvbXQwtwSH7",
            studentNIM: "2007125625",
            time: null,
            room: null,
            student: {
              nim: "2007125625",
              name: "M. Farhan Munif",
              phoneNumber: "08123456789",
              profilePicture:
                "https://res.cloudinary.com/ddbmdyhz6/image/upload/v1742880374/profile-pictures/1742880373401-73buxq.jpg",
            },
            advisors: [
              {
                id: 70,
                seminarID: 34,
                lecturerNIP: "987654321",
                lecturer: {
                  nip: "987654321",
                  name: "Muhammad",
                  phoneNumber: "08198765432",
                  profilePicture: "https://example.com/lecturer1.jpg",
                },
              },
              {
                id: 71,
                seminarID: 34,
                lecturerNIP: "987654322",
                lecturer: {
                  nip: "987654322",
                  name: "Faruq",
                  phoneNumber: "08198765433",
                  profilePicture: "https://example.com/lecturer2.jpg",
                },
              },
            ],
            assessors: [],
            documents: [
              {
                documentType: "THESIS_PROPOSAL",
                fileName:
                  "[Proposal Tugas Akhir] M. Farhan Munif - 2007125625.pdf",
                fileURL:
                  "https://drive.google.com/file/d/1TFACBHjO7ZjIFpCBrXVlEU41yQ0OzYV-/view?usp=drivesdk",
              },
              {
                documentType: "ADVISOR_AVAILABILITY",
                fileName:
                  "[Kesediaan Pembimbing] M. Farhan Munif -  2007125625.pdf",
                fileURL:
                  "https://drive.google.com/file/d/1XDe1uIS3GPKkuCxMnXsUAw8GqnHXK5s8/view?usp=drivesdk",
              },
              {
                documentType: "KRS",
                fileName:
                  "[Kartu Rencana Studi] M. Farhan Munif - 2007125625.pdf",
                fileURL:
                  "https://drive.google.com/file/d/1cpOYM_0WB-Pq4bNUyK0QcW88lAeRgG-4/view?usp=drivesdk",
              },
              {
                documentType: "ADVISOR_ASSISTANCE",
                fileName:
                  "[Asistensi Pembimbing] M. Farhan Munif - 2007125625.pdf",
                fileURL:
                  "https://drive.google.com/file/d/1BL5gxte7wFR07sVe2QUIAMN8SmDGbNTp/view?usp=drivesdk",
              },
              {
                documentType: "SEMINAR_ATTENDANCE",
                fileName:
                  "[Kehadiran Seminar] M. Farhan Munif - 2007125625.pdf",
                fileURL:
                  "https://drive.google.com/file/d/1N3B2PoHVUdTWZ18luUy1ryMSbR5rxpBw/view?usp=drivesdk",
              },
            ],
          },
          message: "Berhasil mengambil detail seminar",
        };

        if (response.success) {
          setSeminar(response.seminar);
        } else {
          setError("Failed to fetch seminar details");
        }
      } catch (err) {
        setError("An error occurred while fetching seminar details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeminarProposalDetail();
  }, [id]);

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Draft
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-primary-100 text-primary-800">
            Submitted
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="bg-warning-100 text-warning-800">
            Scheduled
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-success-100 text-success-800">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Function to format document type
  const formatDocumentType = (type: string) => {
    const typeMap: Record<string, string> = {
      THESIS_PROPOSAL: "Thesis Proposal",
      ADVISOR_AVAILABILITY: "Advisor Availability",
      KRS: "Study Plan Card (KRS)",
      ADVISOR_ASSISTANCE: "Advisor Assistance",
      SEMINAR_ATTENDANCE: "Seminar Attendance",
    };

    return (
      typeMap[type] ||
      type
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ")
    );
  };

  // Function to get document icon color
  const getDocumentIconColor = (type: string) => {
    const colorMap: Record<string, string> = {
      THESIS_PROPOSAL: "text-primary-600",
      ADVISOR_AVAILABILITY: "text-success-600",
      KRS: "text-warning-600",
      ADVISOR_ASSISTANCE: "text-secondary-600",
      SEMINAR_ATTENDANCE: "text-primary-600",
    };

    return colorMap[type] || "text-primary-600";
  };

  // Function to get file type from filename
  const getFileType = (fileName: string) => {
    if (fileName.toLowerCase().endsWith(".pdf")) return "application/pdf";
    if (
      fileName.toLowerCase().endsWith(".doc") ||
      fileName.toLowerCase().endsWith(".docx")
    )
      return "application/msword";
    if (
      fileName.toLowerCase().endsWith(".xls") ||
      fileName.toLowerCase().endsWith(".xlsx")
    )
      return "application/excel";
    return "application/octet-stream";
  };

  // Function to open document in new tab
  const openDocument = (url: string) => {
    window.open(url, "_blank");
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-primary">
            Loading seminar details...
          </div>
        </div>
      </div>
    );
  }

  if (error || !seminar) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Failed to load seminar details. Please try again later."}
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <CoordinatorLayout>
      <div className="container mx-auto p-4">
        {/* Header with back button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mb-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight font-heading">
              {seminar.type === "PROPOSAL" ? "Proposal" : "Final"} Seminar
              Details
            </h1>
            <p className="text-muted-foreground">ID: {seminar.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(seminar.status)}
            {seminar.status === "SUBMITTED" && (
              <Badge
                variant="outline"
                className="bg-warning-50 text-warning-700 border-warning-200"
              >
                <ClockIcon className="mr-1 h-3 w-3" />
                Awaiting Schedule
              </Badge>
            )}
          </div>
        </div>

        {/* Main content with tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="details">Seminar Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Seminar Information */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Seminar Information</CardTitle>
                  <CardDescription>Details about the seminar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Title
                    </h3>
                    <p className="text-lg font-medium">{seminar.title}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Type
                      </h3>
                      <Badge
                        variant={
                          seminar.type === "PROPOSAL" ? "outline" : "secondary"
                        }
                        className="mt-1"
                      >
                        {seminar.type === "PROPOSAL"
                          ? "Proposal Seminar"
                          : "Final Seminar"}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Status
                      </h3>
                      {getStatusBadge(seminar.status)}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        Submission Date
                      </h3>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {format(new Date(seminar.createdAt), "MMMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    {seminar.time && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Scheduled Time
                        </h3>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {format(
                              new Date(seminar.time),
                              "MMMM d, yyyy 'at' h:mm a"
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {seminar.room && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">
                          Room
                        </h3>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{seminar.room}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {!seminar.time && seminar.status === "SUBMITTED" && (
                    <Alert className="mt-4 bg-warning-50 border-warning-200">
                      <AlertCircle className="h-4 w-4 text-warning-600" />
                      <AlertTitle className="text-warning-800">
                        Awaiting Schedule
                      </AlertTitle>
                      <AlertDescription className="text-warning-700">
                        Your seminar has been submitted and is waiting to be
                        scheduled by the coordinator.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Student Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Student</CardTitle>
                  <CardDescription>Student information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary-100">
                      <AvatarImage
                        src={seminar.student.profilePicture}
                        alt={seminar.student.name}
                      />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {getInitials(seminar.student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{seminar.student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        NIM: {seminar.student.nim}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {seminar.student.phoneNumber}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advisors */}
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Advisors</CardTitle>
                  <CardDescription>Thesis advisors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {seminar.advisors.map((advisor, index) => (
                      <div
                        key={advisor.id}
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                      >
                        <Avatar className="h-14 w-14 border-2 border-primary-100">
                          <AvatarImage
                            src={advisor.lecturer.profilePicture}
                            alt={advisor.lecturer.name}
                          />
                          <AvatarFallback className="bg-primary-100 text-primary-700">
                            {getInitials(advisor.lecturer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Badge
                            variant="outline"
                            className="mb-1 bg-primary-50 text-primary-700"
                          >
                            Advisor {index + 1}
                          </Badge>
                          <h3 className="font-medium">
                            {advisor.lecturer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            NIP: {advisor.lecturer.nip}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {advisor.lecturer.phoneNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Submitted Documents</CardTitle>
                <CardDescription>
                  Documents uploaded for this seminar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {seminar.documents.map((document, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-accent/10 transition-colors"
                    >
                      <DocumentCard
                        documentType={document.documentType}
                        fileName={document.fileName}
                        fileType={getFileType(document.fileName)}
                        iconColor={getDocumentIconColor(document.documentType)}
                        className="mb-3"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDocument(document.fileURL)}
                          className="w-full"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Document
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Seminar Timeline</CardTitle>
                <CardDescription>
                  Track the progress of your seminar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-l-2 border-primary-200 pl-6 py-2 ml-6">
                  {/* Submission */}
                  <div className="mb-8 relative">
                    <div className="absolute -left-[30px] p-1 rounded-full bg-primary">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-medium">Seminar Submitted</h3>
                    <p className="text-muted-foreground">
                      {format(
                        new Date(seminar.createdAt),
                        "MMMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                    <p className="mt-2">
                      You have successfully submitted your{" "}
                      {seminar.type.toLowerCase()} seminar request with all
                      required documents.
                    </p>
                  </div>

                  {/* Coordinator Review */}
                  <div className="mb-8 relative">
                    {seminar.status === "SUBMITTED" ? (
                      <div className="absolute -left-[30px] p-1 rounded-full bg-warning-500">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="absolute -left-[30px] p-1 rounded-full bg-primary">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <h3 className="text-lg font-medium">Coordinator Review</h3>
                    <p className="text-muted-foreground">
                      {seminar.status === "SUBMITTED"
                        ? "In Progress"
                        : "Completed on " +
                          format(new Date(seminar.updatedAt), "MMMM d, yyyy")}
                    </p>
                    <p className="mt-2">
                      {seminar.status === "SUBMITTED"
                        ? "Your submission is currently being reviewed by the coordinator."
                        : "The coordinator has reviewed and approved your seminar request."}
                    </p>
                  </div>

                  {/* Scheduling */}
                  <div className="mb-8 relative">
                    {seminar.status === "SUBMITTED" ||
                    seminar.status === "DRAFT" ? (
                      <div className="absolute -left-[30px] p-1 rounded-full bg-muted">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="absolute -left-[30px] p-1 rounded-full bg-primary">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <h3 className="text-lg font-medium">Seminar Scheduled</h3>
                    <p className="text-muted-foreground">
                      {seminar.time
                        ? format(
                            new Date(seminar.time),
                            "MMMM d, yyyy 'at' h:mm a"
                          )
                        : "Pending"}
                    </p>
                    <p className="mt-2">
                      {seminar.time
                        ? `Your seminar has been scheduled in ${seminar.room}.`
                        : "Your seminar will be scheduled after review."}
                    </p>
                  </div>

                  {/* Seminar Completion */}
                  <div className="relative">
                    {seminar.status === "COMPLETED" ? (
                      <div className="absolute -left-[30px] p-1 rounded-full bg-success-600">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="absolute -left-[30px] p-1 rounded-full bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <h3 className="text-lg font-medium">Seminar Completed</h3>
                    <p className="text-muted-foreground">
                      {seminar.status === "COMPLETED"
                        ? format(new Date(seminar.updatedAt), "MMMM d, yyyy")
                        : "Pending"}
                    </p>
                    <p className="mt-2">
                      {seminar.status === "COMPLETED"
                        ? "Your seminar has been successfully completed."
                        : "This step will be completed after your seminar is conducted."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </CoordinatorLayout>
  );
};

export default SeminarProposalDetail;
