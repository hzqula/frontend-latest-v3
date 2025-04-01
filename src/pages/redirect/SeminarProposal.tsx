import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import StudentSeminarProposal from "../student/seminar-proposal/SeminarProposal";
// import DashboardCoordinator from "./coordinator/DashboardCoordinator";
// import DashboardLecturer from "./lecturer/DashboardLecturer";
// import SeminarProposalStudent from "./student/SeminarProposalStudent";

enum UserRole {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  COORDINATOR = "COORDINATOR",
}

const SeminarProposal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      try {
        setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Terjadi kesalahan saat nge-parsing data", error);
      }
    }
    setIsLoading(false);
  }, []);

  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Bentar...</p>
      </div>
    );
  }

  switch (userData.role) {
    case UserRole.STUDENT:
      return <StudentSeminarProposal />;

    // case UserRole.LECTURER:
    //   return <DashboardLecturer />;

    // case UserRole.COORDINATOR:
    //   return <DashboardCoordinator />;

    default:
      return <Navigate to="/sign-in" replace />;
  }
};

export default SeminarProposal;
