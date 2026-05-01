import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./app/components/Layout";
import { Login } from "./app/pages/Login";
import { Signup } from "./app/pages/Signup";
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

const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// 🔐 PROTECTED ROUTE WRAPPER
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// 🔐 ROLE-BASED ROUTE WRAPPER
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const user = getUser();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== "admin") {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
};

const EmployeeRoute = ({ children }: { children: JSX.Element }) => {
  const user = getUser();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== "employee") {
    return <Navigate to="/app/admin-dashboard" replace />;
  }
  return children;
};

// 🔐 PREVENT LOGIN IF ALREADY LOGGED IN
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const user = getUser();
  if (!isAuthenticated()) {
    return children;
  }
  // Redirect to appropriate dashboard based on role
  return user?.role === "admin" ? (
    <Navigate to="/app/admin-dashboard" replace />
  ) : (
    <Navigate to="/app/dashboard" replace />
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // 🔓 PUBLIC ROUTES
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },

  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
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
      // Employee Routes
      { path: "dashboard", element: <EmployeeRoute><EmployeeDashboard /></EmployeeRoute> },
      { path: "mark-attendance", element: <EmployeeRoute><MarkAttendance /></EmployeeRoute> },
      { path: "history", element: <EmployeeRoute><AttendanceHistory /></EmployeeRoute> },
      
      // Admin Routes
      { path: "admin-dashboard", element: <AdminRoute><AdminDashboard /></AdminRoute> },
      { path: "employees", element: <AdminRoute><EmployeeManagement /></AdminRoute> },
      { path: "reports", element: <AdminRoute><RecordsReports /></AdminRoute> },
    ],
  },

  // ❌ INVALID ROUTE
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
