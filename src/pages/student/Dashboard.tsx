"use client";

import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useApiData } from "../../hooks/useApiData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { CalendarDays, Clock, University, ChevronRight } from "lucide-react";
import StudentLayout from "../../components/layouts/StudentLayout";

const StudentDashboard = () => {
  const { user, token } = useAuth();

  // Fetch seminar data for the logged-in student
  const seminarsQuery = useApiData({
    type: "seminarProposalByStudentNIM",
    param: user?.profile?.nim,
  });

  // Add console log to debug API response
  console.log("API Response:", seminarsQuery.data);

  const isLoading = seminarsQuery.isLoading;
  const isError = seminarsQuery.isError;

  if (isLoading || !token || !user) {
    return (
      <StudentLayout>
        <div className="container mx-auto p-4">
          <div className="text-center text-muted-foreground py-10">
            Memuat data...
          </div>
        </div>
      </StudentLayout>
    );
  }

  if (isError) {
    return (
      <StudentLayout>
        <div className="container mx-auto p-4">
          <div className="text-center text-red-600 py-10">
            Gagal memuat data: {seminarsQuery.error?.message || "Unknown error"}
            <br />
            <Button
              variant="outline"
              onClick={() => seminarsQuery.refetch()}
              className="mt-4"
            >
              Coba Lagi
            </Button>
          </div>
        </div>
      </StudentLayout>
    );
  }

  // Process the API response data
  const seminarsData = seminarsQuery.data || [];

  // Check if we have any seminars
  const hasSeminars = Array.isArray(seminarsData)
    ? seminarsData.length > 0
    : seminarsData && Object.keys(seminarsData).length > 0;

  // Add debug check for data structure
  if (!hasSeminars) {
    console.log("No seminar data found:", seminarsQuery.data);
  }

  // Find proposal and final seminars
  // If seminarsData is an array, find seminars by type
  let proposalSeminar = null;
  let finalSeminar = null;

  if (Array.isArray(seminarsData)) {
    proposalSeminar = seminarsData.find(
      (seminar) => seminar.type === "PROPOSAL"
    );
    finalSeminar = seminarsData.find((seminar) => seminar.type === "FINAL");
  } else if (seminarsData && typeof seminarsData === "object") {
    // If it's a single object, check its type
    if (seminarsData.type === "PROPOSAL") {
      proposalSeminar = seminarsData;
    } else if (seminarsData.type === "FINAL") {
      finalSeminar = seminarsData;
    }
  }

  // Helper function to format date
  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (dateString: string | number | Date) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeminarStatusBadge = (status: any) => {
    switch (status) {
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-slate-100">
            Draft
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Submitted
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            Scheduled
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              Selamat Datang,{" "}
              {user.profile?.name ||
                (proposalSeminar || finalSeminar)?.student?.name ||
                ""}
              !
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              NIM:{" "}
              {user.profile?.nim ||
                (proposalSeminar || finalSeminar)?.student?.nim ||
                ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Proposal Seminar Card */}
          {proposalSeminar ? (
            <Card className="h-full flex flex-col bg-primary-50">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-lg font-medium">
                    Seminar Proposal
                  </CardTitle>
                  <div className="mt-1 sm:mt-0">
                    {getSeminarStatusBadge(proposalSeminar.status)}
                  </div>
                </div>
                <span className="mt-1 font-bold">
                  {proposalSeminar.title || "No title submitted yet"}
                </span>
              </CardHeader>
              <CardContent className="pb-4 text-sm flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 pt-6">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">
                      {proposalSeminar.time
                        ? formatDate(proposalSeminar.time)
                        : "Not scheduled yet"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm">
                      {proposalSeminar.time
                        ? formatTime(proposalSeminar.time)
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <University className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">
                      {proposalSeminar.room || "TBD"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 mt-auto">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seminar-proposal">
                    Lihat Seminar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full bg-primary-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Seminar Proposal
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center min-h-[150px]">
                <p className="text-center text-muted-foreground font-medium">
                  Anda belum mendaftar seminar ini.
                </p>
              </CardContent>
              <CardFooter className="pt-10">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seminar-proposal">
                    Daftar Seminar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Final Seminar Card */}
          {finalSeminar ? (
            <Card className="h-full flex flex-col bg-primary-50">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-lg font-medium">
                    Seminar Hasil
                  </CardTitle>
                  <div className="mt-1 sm:mt-0">
                    {getSeminarStatusBadge(finalSeminar.status)}
                  </div>
                </div>
                <span className="mt-1 font-bold">
                  {finalSeminar.title || "No title submitted yet"}
                </span>
              </CardHeader>
              <CardContent className="pb-4 text-sm flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 pt-6">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">
                      {finalSeminar.time
                        ? formatDate(finalSeminar.time)
                        : "Not scheduled yet"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm">
                      {finalSeminar.time
                        ? formatTime(finalSeminar.time)
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <University className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm truncate">
                      {finalSeminar.room || "TBD"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 mt-auto">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seminar-hasil">
                    Lihat Seminar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full bg-primary-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  Seminar Hasil
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center min-h-[150px]">
                <p className="text-center text-muted-foreground font-medium">
                  Anda belum mendaftar seminar ini.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seminar-hasil">
                    Daftar Seminar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Advisors */}
          <Card className="h-full bg-primary-50 mb-5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Dosen Pembimbing
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 text-sm space-y-4">
              {/* Get advisors from either seminar if available */}
              {(proposalSeminar?.advisors || finalSeminar?.advisors)?.length >
              0 ? (
                (proposalSeminar?.advisors || finalSeminar?.advisors || []).map(
                  (advisor: any, index: any) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-medium">
                            {advisor.lecturer?.name
                              ? advisor.lecturer.name.charAt(0)
                              : "?"}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {advisor.lecturer?.name || "No name"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            NIP:{" "}
                            {advisor.lecturer?.nip ||
                              advisor.lecturerNIP ||
                              "No NIP"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto mt-2 sm:mt-0 bg-primary-200 text-white hover:bg-primary-600"
                        onClick={() => {
                          const phoneNumber =
                            advisor.lecturer?.phoneNumber ||
                            advisor.lecturerNIP;
                          if (phoneNumber) {
                            // Format phone number: remove spaces, ensure it starts with country code
                            let formattedNumber = phoneNumber.replace(
                              /\s+/g,
                              ""
                            );
                            if (formattedNumber.startsWith("0")) {
                              formattedNumber =
                                "62" + formattedNumber.substring(1);
                            } else if (
                              !formattedNumber.startsWith("+") &&
                              !formattedNumber.startsWith("62")
                            ) {
                              formattedNumber = "62" + formattedNumber;
                            }

                            // Open WhatsApp with the phone number
                            window.open(
                              `https://wa.me/${formattedNumber}`,
                              "_blank"
                            );
                          } else {
                            alert(
                              "No phone number available for this examiner"
                            );
                          }
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.074 4.894C17.2122 3.03989 14.6915 1.99924 12.064 2C6.59798 2 2.12998 6.437 2.12998 11.904C2.12998 13.672 2.57998 15.344 3.44798 16.887L2.03198 22L7.33798 20.65C8.78498 21.421 10.425 21.871 12.097 21.871C17.531 21.839 21.967 17.401 21.967 11.904C21.967 9.267 20.939 6.791 19.074 4.894ZM12.032 20.167C10.5461 20.1593 9.09023 19.748 7.81998 18.977L7.49798 18.785L4.37898 19.588L5.24798 16.566L5.05498 16.244C4.24306 14.9178 3.80908 13.3949 3.79998 11.84C3.79998 7.306 7.46498 3.64 12.031 3.64C14.218 3.64 16.276 4.509 17.819 6.052C18.5869 6.8203 19.1954 7.73285 19.6093 8.73717C20.0232 9.74148 20.2345 10.8177 20.231 11.904C20.295 16.503 16.565 20.168 12.031 20.168M16.565 13.995C16.308 13.866 15.118 13.255 14.829 13.223C14.604 13.126 14.411 13.094 14.282 13.352C14.153 13.609 13.639 14.123 13.51 14.316C13.382 14.445 13.253 14.509 12.964 14.348C12.706 14.22 11.934 13.995 10.97 13.094C10.23 12.451 9.71598 11.647 9.61998 11.358C9.49098 11.101 9.58698 11.004 9.74798 10.843C9.87698 10.715 10.006 10.586 10.102 10.393C10.231 10.265 10.231 10.136 10.359 9.975C10.488 9.847 10.391 9.654 10.327 9.525C10.231 9.397 9.77998 8.175 9.55498 7.66C9.36198 7.146 9.13698 7.242 9.00898 7.242H8.55898C8.42898 7.242 8.10898 7.274 7.91498 7.564C7.68998 7.821 7.04698 8.432 7.04698 9.654C7.04698 10.876 7.91498 12.001 8.07698 12.226C8.20498 12.355 9.84498 14.895 12.289 15.988C12.867 16.245 13.317 16.406 13.703 16.535C14.282 16.728 14.829 16.663 15.247 16.631C15.729 16.599 16.694 16.052 16.919 15.441C17.112 14.895 17.112 14.348 17.047 14.251C16.983 14.188 16.79 14.091 16.565 13.995Z"
                            fill="#14AE5C"
                          />
                        </svg>
                      </Button>
                    </div>
                  )
                )
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  Belum ada dosen pembimbing yang ditetapkan
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assessors */}
          <Card className="h-full bg-primary-50 mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Dosen Penguji
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 text-sm space-y-4">
              {/* Get assessors from either seminar if available */}
              {(proposalSeminar?.assessors || finalSeminar?.assessors)?.length >
              0 ? (
                (
                  proposalSeminar?.assessors ||
                  finalSeminar?.assessors ||
                  []
                ).map((assessor: any, index: any) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium">
                          {assessor.lecturer?.name
                            ? assessor.lecturer.name.charAt(0)
                            : "?"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">
                          {assessor.lecturer?.name || "No name"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          NIP:{" "}
                          {assessor.lecturer?.nip ||
                            assessor.lecturerNIP ||
                            "No NIP"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full sm:w-auto mt-2 sm:mt-0 bg-primary-200 text-white hover:bg-primary-600"
                      onClick={() => {
                        const phoneNumber =
                          assessor.lecturer?.phoneNumber ||
                          assessor.lecturerNIP;
                        if (phoneNumber) {
                          // Format phone number: remove spaces, ensure it starts with country code
                          let formattedNumber = phoneNumber.replace(/\s+/g, "");
                          if (formattedNumber.startsWith("0")) {
                            formattedNumber =
                              "62" + formattedNumber.substring(1);
                          } else if (
                            !formattedNumber.startsWith("+") &&
                            !formattedNumber.startsWith("62")
                          ) {
                            formattedNumber = "62" + formattedNumber;
                          }

                          // Open WhatsApp with the phone number
                          window.open(
                            `https://wa.me/${formattedNumber}`,
                            "_blank"
                          );
                        } else {
                          alert("No phone number available for this examiner");
                        }
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.074 4.894C17.2122 3.03989 14.6915 1.99924 12.064 2C6.59798 2 2.12998 6.437 2.12998 11.904C2.12998 13.672 2.57998 15.344 3.44798 16.887L2.03198 22L7.33798 20.65C8.78498 21.421 10.425 21.871 12.097 21.871C17.531 21.839 21.967 17.401 21.967 11.904C21.967 9.267 20.939 6.791 19.074 4.894ZM12.032 20.167C10.5461 20.1593 9.09023 19.748 7.81998 18.977L7.49798 18.785L4.37898 19.588L5.24798 16.566L5.05498 16.244C4.24306 14.9178 3.80908 13.3949 3.79998 11.84C3.79998 7.306 7.46498 3.64 12.031 3.64C14.218 3.64 16.276 4.509 17.819 6.052C18.5869 6.8203 19.1954 7.73285 19.6093 8.73717C20.0232 9.74148 20.2345 10.8177 20.231 11.904C20.295 16.503 16.565 20.168 12.031 20.168M16.565 13.995C16.308 13.866 15.118 13.255 14.829 13.223C14.604 13.126 14.411 13.094 14.282 13.352C14.153 13.609 13.639 14.123 13.51 14.316C13.382 14.445 13.253 14.509 12.964 14.348C12.706 14.22 11.934 13.995 10.97 13.094C10.23 12.451 9.71598 11.647 9.61998 11.358C9.49098 11.101 9.58698 11.004 9.74798 10.843C9.87698 10.715 10.006 10.586 10.102 10.393C10.231 10.265 10.231 10.136 10.359 9.975C10.488 9.847 10.391 9.654 10.327 9.525C10.231 9.397 9.77998 8.175 9.55498 7.66C9.36198 7.146 9.13698 7.242 9.00898 7.242H8.55898C8.42898 7.242 8.10898 7.274 7.91498 7.564C7.68998 7.821 7.04698 8.432 7.04698 9.654C7.04698 10.876 7.91498 12.001 8.07698 12.226C8.20498 12.355 9.84498 14.895 12.289 15.988C12.867 16.245 13.317 16.406 13.703 16.535C14.282 16.728 14.829 16.663 15.247 16.631C15.729 16.599 16.694 16.052 16.919 15.441C17.112 14.895 17.112 14.348 17.047 14.251C16.983 14.188 16.79 14.091 16.565 13.995Z"
                          fill="#14AE5C"
                        />
                      </svg>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  Belum ada dosen penguji yang ditetapkan
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
