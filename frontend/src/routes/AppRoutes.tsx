import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "../context/AuthContext";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import TopicManagement from "../pages/TopicManagement";
import ClassManagement from "../pages/ClassManagement";
import AttendanceSystem from "../pages/AttendanceSystem";
import AssignmentManagement from "../pages/AssignmentManagement";
import AssessmentSystem from "../pages/AssessmentSystem";
import AssessmentDetails from "../pages/AssessmentDetails";
import CreatorStudio from "../pages/CreatorStudio";
import Reports from "../pages/Reports";
import GrievanceHandling from "../pages/GrievanceHandling";
import ChatSystem from "../pages/ChatSystem";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Notifications from "../pages/Notifications";

import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "notifications",
        element: <Notifications />,
      },

      {
        path: "topics",
        element: <TopicManagement />,
      },

      {
        path: "classes",
        element: <ClassManagement />,
      },

      {
        path: "attendance",
        element: <AttendanceSystem />,
      },

      {
        path: "assignments",
        element: <AssignmentManagement />,
      },

      {
        path: "assessments",
        element: <AssessmentSystem />,
      },

      {
        path: "assessments/:id",
        element: <AssessmentDetails />,
      },

      {
        path: "creator",
        element: <CreatorStudio />,
      },

      {
        path: "reports",
        element: <Reports />,
      },

      {
        path: "grievances",
        element: <GrievanceHandling />,
      },

      {
        path: "chat",
        element: <ChatSystem />,
      },
    ],
  },
]);

const AppRoutes: React.FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRoutes;
