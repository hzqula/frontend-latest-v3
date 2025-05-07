import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import StudentSeminarHasil from "../student/seminar-hasil/SeminarHasil";
import CoordinatorSeminarHasil from "../coordinator/seminar-hasil/SeminarHasil";
import LecturerSeminarHasil from "../lecturer/seminar-hasil/SeminarHasil";
import AssessSeminarHasil from "../lecturer/seminar-hasil/AssessSeminar";

enum UserRole {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
  COORDINATOR = "COORDINATOR",
}

const SeminarHasil: React.FC = () => {
  const { token, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Bentar...</p>
      </div>
    );
  }

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  switch (userRole) {
    case UserRole.STUDENT:
      return <StudentSeminarHasil/>;
    case UserRole.COORDINATOR:
      return <CoordinatorSeminarHasil/>;
    case UserRole.LECTURER:
      return <LecturerSeminarHasil/>;
    case UserRole.LECTURER:
      return <AssessSeminarHasil />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default SeminarHasil;