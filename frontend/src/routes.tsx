import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./app/components/Layout";
// ✅ CORRECT
import { Login } from "./app/pages/Login";
import { EmployeeDashboard } from "./app/pages/EmployeeDashboard";
import { MarkAttendance } from "./app/pages/MarkAttendance";
import { AttendanceHistory } from "./app/pages/AttendanceHistory";
import { AdminDashboard } from "./app/pages/AdminDashboard";
import { EmployeeManagement } from "./app/pages/EmployeeManagement";
import { RecordsReports } from "./app/pages/RecordsReports";

// 🔐 AUTH CHECK FUNCTION
const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

// 🔐 PROTECTED ROUTE WRAPPER
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// 🔐 PREVENT LOGIN IF ALREADY LOGGED IN
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  return !isAuthenticated() ? children : <Navigate to="/app/dashboard" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // 🔓 PUBLIC ROUTE (LOGIN)
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  // 🔐 PROTECTED ROUTES
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <EmployeeDashboard /> },
      { path: "mark-attendance", element: <MarkAttendance /> },
      { path: "history", element: <AttendanceHistory /> },
      { path: "admin-dashboard", element: <AdminDashboard /> },
      { path: "employees", element: <EmployeeManagement /> },
      { path: "reports", element: <RecordsReports /> },
    ],
  },

  // ❌ INVALID ROUTE
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);