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

interface Seminar {
  status: "DRAFT" | "SUBMITTED" | "SCHEDULED" | "COMPLETED";
  date: string | null;
  title: string;
}

interface UpcomingSeminar {
  type: "PROPOSAL" | "HASIL";
  date: string;
  room: string;
}

interface StudentData {
  name: string;
  nim: string;
  proposalSeminar: Seminar;
  finalSeminar: Seminar;
  advisors: Advisor[];
  upcomingSeminar: UpcomingSeminar | null;
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
    },
    finalSeminar: {
      status: "SUBMITTED", // DRAFT, SUBMITTED, SCHEDULED, COMPLETED
      date: null,
      title: "Implementation of Machine Learning in Healthcare",
    },
    advisors: [
      { name: "Dr. Jane Smith", nip: "987654321" },
      { name: "Prof. Robert Johnson", nip: "123456789" },
    ],
    upcomingSeminar: {
      type: "HASIL",
      date: "2023-11-20T13:00:00",
      room: "Room 301",
    },
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

        {/* Grid Layout - 4 columns with 200px row height */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Proposal Seminar - Spans 1 column */}
          <Card className="h-full">
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
            <CardContent className="pb-2">
              <div className="space-y-2">
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

          {/* Final Seminar - Spans 1 column */}
          <Card className="h-full">
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
            <CardContent className="pb-2">
              <div className="space-y-2">
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

          {/* Register Seminar - Spans 1 column */}
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Register Seminar
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Register for your proposal or final seminar
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seminar-proposal">Proposal</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/seminar-hasil">Final</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Upload Documents - Spans 1 column */}
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                Upload required documents for your seminars
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Upload Documents
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming Seminar - Spans 2 columns */}
          {studentData.upcomingSeminar && (
            <Card className="bg-primary/5 border-primary/20 md:col-span-2 h-full">
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  Upcoming Seminar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {studentData.upcomingSeminar.type === "PROPOSAL"
                          ? "Proposal Seminar"
                          : "Final Seminar"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(
                          studentData.upcomingSeminar.date
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(
                          studentData.upcomingSeminar.date
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-muted-foreground"
                      >
                        <path d="M3 3h18v18H3z"></path>
                      </svg>
                      <span className="text-sm">
                        {studentData.upcomingSeminar.room}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Prepare for Seminar</Button>
              </CardFooter>
            </Card>
          )}

          {/* Advisors - Spans 2 columns */}
          <Card className="md:col-span-2 h-full overflow-auto">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Your Advisors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.advisors.map((advisor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
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
              </div>
            </CardContent>
          </Card>

          {/* Check Requirements - Spans 1 column */}
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                Check Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">
                View all requirements for your seminars
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Requirements
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
