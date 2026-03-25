import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const DataPage = lazy(() => import("./pages/DataPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const LogsPage = lazy(() => import("./pages/LogsPage"));

export default function App() {
  return (
    <Suspense fallback={<div className="centered">Loading page...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data"
          element={
            <ProtectedRoute>
              <DataPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <LogsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
