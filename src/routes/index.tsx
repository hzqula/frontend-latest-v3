import { RouteObject } from "react-router";

import Dashboard from "../pages/redirect/Dashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import SeminarProposal from "../pages/redirect/SeminarProposal";
import AssessSeminarProposal from "../pages/lecturer/seminar-proposal/AssessSeminar";

export const publicRoutes: RouteObject[] = [
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
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
    path: "/seminar-proposal/assess/:seminarId",
    element: <AssessSeminarProposal />, // Halaman penilaian seminar
  },
];
