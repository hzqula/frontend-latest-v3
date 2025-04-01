import { RouteObject } from "react-router";
// import Landing from "../pages/landing/Landing";
// import Galeri from "../pages/landing/Galeri";
// import FormatPenulisanTA from "../pages/landing/FormatPenulisanTa";
// import SOP from "../pages/landing/SOP";
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";
// imporfrom "../component;

import Dashboard from "../pages/redirect/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import SeminarProposal from "../pages/redirect/SeminarProposal";
import SeminarProposalDetail from "../pages/coordinator/SeminarProposalDetail";
// import SeminarProposal from "../pages/users/SeminarProposal";
// import SeminarHasil from "../pages/users/SeminarHasil";
// import DataMahasiswa from "../pages/users/coordinator/DataMahasiswa";
// import DataDosen from "../pages/users/coordinator/DataDosen";
// import RiwayatSeminarProposal from "../pages/users/coordinator/riwayat-seminar/SeminarProposal";
// import RiwayatSeminarHasil from "../pages/users/coordinator/riwayat-seminar/SeminarHasil";
// import MahasiswaBimbinganSeminarProposal from "../pages/users/lecturer/seminar-proposal/MahasiswaBimbingan";
// import MahasiswaDiujiSeminarProposal from "../pages/users/lecturer/seminar-proposal/MahasiswaDiuji";
// import MahasiswaBimbinganSeminarHasil from "../pages/users/lecturer/seminar-hasil/MahasiswaBimbingan";
// import MahasiswaDiujiSeminarHasil from "../pages/users/lecturer/seminar-hasil/MahasiswaDiuji";
// import ForgotPassword from "../pages/auth/ForgotPassword";
// import SeminarForm from "../pages/users/student/seminar-proposal/RegisterSeminar";
// import SeminarProposalM from "../pages/users/student/SeminarProposal";
// import SecurityPage from "../pages/users/coordinator/Security";

export const publicRoutes: RouteObject[] = [
  // { path: "/", element: <Landing /> },
  // { path: "/galeri", element: <Galeri /> },
  // { path: "/panduan/format-penulisan-ta", element: <FormatPenulisanTA /> },
  // { path: "/panduan/sop", element: <SOP /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  // { path: "/reset-password", element: <ForgotPassword /> },

  // { path: "/seminar-form", element: <SeminarForm /> },
];

export const privateRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/seminar-proposal",
    element: <SeminarProposal />,
  },
  {
    path: "/dashboard-student",
    element: <StudentDashboard />,
  },
  {
    path: "/seminar-proposal-detail",
    element: <SeminarProposalDetail />,
  },
];
