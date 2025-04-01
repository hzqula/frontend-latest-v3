import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import {
  fetchLecturers,
  fetchSeminarById,
  fetchSeminars,
  fetchStudentByNIM,
  fetchLecturerByNIP,
  fetchStudents,
} from "../api/apiClient";

type DataType =
  | "students"
  | "studentByNIM"
  | "lecturers"
  | "lecturerByNIP"
  | "seminars"
  | "seminarById";

interface UseApiDataOptions {
  type: DataType;
  param?: string;
  id?: number;
}

export const useApiData = ({ type, param, id }: UseApiDataOptions) => {
  const { user, token } = useAuth();

  const queryFn = async () => {
    switch (type) {
      case "students":
        return fetchStudents();
      case "studentByNIM":
        if (!param) throw new Error("NIM harus ada");
        return fetchStudentByNIM(param);
      case "lecturers":
        return fetchLecturers();
      case "lecturerByNIP":
        if (!param) throw new Error("NIP harus ada");
        return fetchLecturerByNIP(param);
      case "seminars":
        return fetchSeminars();
      case "seminarById":
        if (!id) throw new Error("ID seminar harus ada");
        return fetchSeminarById(id);
      default:
        throw new Error("Tipe data tidak diketahui");
    }
  };

  return useQuery({
    queryKey: [type, param],
    queryFn,
    enabled: !!token && !!user,
    staleTime: 5 * 60 * 1000,
  });
};
