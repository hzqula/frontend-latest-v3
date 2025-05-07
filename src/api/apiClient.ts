import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5500/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Sesuaikan dengan AuthContext
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // Perbaiki typo dari 'comfig' ke 'config'
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      try {
        const { data } = await axios.post(
          "http://localhost:5500/api/auth/refresh",
          { refreshToken }
        );
        const newToken = data.token; // Sesuaikan dengan struktur respons backend
        localStorage.setItem("token", newToken); // Simpan token baru
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`; // Perbaiki typo 'Bearrer'
        return apiClient(originalRequest); // Ulangi request dengan token baru
      } catch (refreshError) {
        console.error("Gagal memperbarui token:", refreshError);
        // Logout pengguna jika refresh gagal (opsional)
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        window.location.href = "/login"; // Arahkan ke login
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Fungsi ekspor untuk mengambil data
export const fetchStudents = async () => {
  const response = await apiClient.get("/students");
  return response.data.students;
};

export const fetchStudentByNIM = async (nim: string) => {
  const response = await apiClient.get(`/students/${nim}`);
  return response.data.student;
};

export const fetchLecturers = async () => {
  const response = await apiClient.get("/lecturers");
  return response.data.lecturers;
};

export const fetchLecturerByNIP = async (nip: string) => {
  const response = await apiClient.get(`/lecturers/${nip}`);
  return response.data.lecturer;
};

export const fetchSeminars = async () => {
  const response = await apiClient.get("/seminars");
  return response.data.seminars;
};

export const fetchSeminarById = async (id: number) => {
  const response = await apiClient.get(`/seminars/${id}`);
  return response.data.seminar;
};
export const fetchSeminarProposalByStudentNIM = async (nim: string) => {
  const response = await apiClient.get(`/seminars/proposal/${nim}`);
  return response.data.seminar;
};
export const fetchSeminarResultByStudentNIM = async (nim: string) => {
  const response = await apiClient.get(`/seminars/result/${nim}`);
  return response.data.seminar;
};

export default apiClient;
