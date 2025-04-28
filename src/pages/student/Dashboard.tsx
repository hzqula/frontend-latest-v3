import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  CalendarDays,
  FileText,
  Clock,
  University,
  PenTool,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import StudentLayout from "../../components/layouts/StudentLayout";

// Define types for our data
interface Advisor {
  name: string;
  nip: string;
}

interface Assessor {
  name: string;
  nip: string;
}

interface Seminar {
  status: "DRAFT" | "SUBMITTED" | "SCHEDULED" | "COMPLETED";
  date: string | null;
  title: string;
  room: string | null;
}

interface StudentData {
  name: string;
  nim: string;
  proposalSeminar: Seminar;
  finalSeminar: Seminar;
  advisors: Advisor[];
  assessors: Assessor[];
}

const StudentDashboard = () => {
  // This would come from your API/backend in a real application
  const studentData: StudentData = {
    name: "John Doe",
    nim: "12345678",
    proposalSeminar: {
      status: "COMPLETED", // DRAFT, SUBMITTED, SCHEDULED, COMPLETED
      date: "2023-10-15T10:00:00",
      title: "Implementation of Machine Learning in Healthcare",
      room: "RPL",
    },
    finalSeminar: {
      status: "SUBMITTED", // DRAFT, SUBMITTED, SCHEDULED, COMPLETED
      date: null,
      title: "Implementation of Machine Learning in Healthcare",
      room: null,
    },
    advisors: [
      { name: "Dr. Jane", nip: "987654321" },
      { name: "Prof. Robert", nip: "123456789" },
    ],
    assessors: [
      { name: "Dr. Smith", nip: "987654321" },
      { name: "Prof. Johnson", nip: "123456789" },
    ],
  };

  // Helper function to format date
  const formatDate = (dateString: string | number | Date | null) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to format time
  const formatTime = (dateString: string | number | Date | null) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeminarStatusBadge = (status: string) => {
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
          <Badge variant="outline" className="bg-back text-green-800">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <StudentLayout>
      <div className="container mx-auto p-4">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {studentData.name}
            </h1>
            <p className="text-muted-foreground bg-p">NIM: {studentData.nim}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link to="/seminar-proposal">
                <FileText className="mr-2 h-4 w-4" />
                Proposal Seminar
              </Link>
            </Button>
            <Button asChild>
              <Link to="/seminar-hasil">
                <BookOpen className="mr-2 h-4 w-4" />
                Final Seminar
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[200px]">
          {/* Proposal Seminar */}
          <Card className="h-full bg-primary-50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  Proposal Seminar
                </CardTitle>
                {getSeminarStatusBadge(studentData.proposalSeminar.status)}
              </div>
              <CardDescription className="line-clamp-1">
                {studentData.proposalSeminar.title || "No title submitted yet"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 text-sm">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm truncate">
                    {studentData.proposalSeminar.date
                      ? new Date(
                          studentData.proposalSeminar.date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not scheduled yet"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground text-sm" />
                  {formatTime(studentData.proposalSeminar.date) || "TBD"}
                </div>
                <div className="flex items-center">
                  <University className="h-4 w-4 mr-2 text-muted-foreground" />
                  {studentData.proposalSeminar.room || "TBD"}
                </div>
                <div className="flex items-center">
                  <PenTool className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {studentData.proposalSeminar.status === "COMPLETED"
                      ? "Completed"
                      : studentData.proposalSeminar.status === "SCHEDULED"
                      ? "Scheduled"
                      : "Not completed yet"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/seminar-proposal">
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Final Seminar */}
          <Card className="h-full bg-primary-50">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">
                  Final Seminar
                </CardTitle>
                {getSeminarStatusBadge(studentData.finalSeminar.status)}
              </div>
              <CardDescription className="line-clamp-1">
                {studentData.finalSeminar.title || "No title submitted yet"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 text-sm">
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm truncate">
                    {studentData.finalSeminar.date
                      ? new Date(
                          studentData.finalSeminar.date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not scheduled yet"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground text-sm" />
                  {formatTime(studentData.finalSeminar.date) || "TBD"}
                </div>
                <div className="flex items-center">
                  <University className="h-4 w-4 mr-2 text-muted-foreground" />
                  {studentData.finalSeminar.room || "TBD"}
                </div>
                <div className="flex items-center">
                  <PenTool className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">
                    {studentData.finalSeminar.status === "COMPLETED"
                      ? "Completed"
                      : studentData.finalSeminar.status === "SCHEDULED"
                      ? "Scheduled"
                      : "Not completed yet"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/seminar-hasil">
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Advisors */}
          <Card className="h-full overflow-auto bg-primary-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Your Advisors
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 text-sm space-y-4">
              {studentData.advisors.map((advisor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {advisor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{advisor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        NIP: {advisor.nip}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Contact
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Assessors */}
          <Card className="h-full overflow-auto bg-primary-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Your Assessors
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2 text-sm space-y-4">
              {studentData.assessors.map((assessor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {assessor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{assessor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        NIP: {assessor.nip}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Contact
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
