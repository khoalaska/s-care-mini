import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Components
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import LoginPage from "./pages/LoginPage";

import RequestListPage from "./pages/manager/RequestListPage";
import RequestDetailPage from "./pages/manager/RequestDetailPage";

import MyRequestsPage from "./pages/resident/MyRequestsPage";
import ResidentRequestDetailPage from "./pages/resident/RequestDetailPage";
import CreateRequestPage from "./pages/resident/CreateRequestPage";

import AssignedRequestsPage from "./pages/technician/AssignedRequestsPage";
import TechRequestDetailPage from "./pages/technician/RequestDetailPage";

import ApartmentListPage from "./pages/manager/ApartmentListPage";
import DashboardPage from "./pages/manager/DashboardPage";
import CreateTechnicianPage from "./pages/manager/CreateTechnicianPage";
import RegisterPage from "./pages/RegisterPage";

// Placeholder pages — sẽ code sau ở từng pha
function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
        <p className="text-gray-500 mt-2">Đang phát triển...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* === TRANG CÔNG KHAI === */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* === MANAGER ROUTES === */}
      <Route
        element={
          <PrivateRoute roles={["MANAGER"]}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/manager" element={<Navigate to="/manager/requests" replace />} />
        <Route path="/manager/requests" element={<RequestListPage />} />
        <Route path="/manager/requests/:id" element={<RequestDetailPage />} />
        <Route path="/manager/apartments" element={<ApartmentListPage />} />
        <Route path="/manager/create-technician" element={<CreateTechnicianPage />} />
      </Route>

      {/* === RESIDENT ROUTES === */}
      <Route
        element={
          <PrivateRoute roles={["RESIDENT"]}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/resident/requests" element={<MyRequestsPage />} />
        <Route path="/resident/requests/:id" element={<ResidentRequestDetailPage />} />
        <Route path="/resident/create-request" element={<CreateRequestPage />} />
      </Route>

      {/* === TECHNICIAN ROUTES === */}
      <Route
        element={
          <PrivateRoute roles={["TECHNICIAN"]}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/technician/requests" element={<AssignedRequestsPage />} />
        <Route path="/technician/requests/:id" element={<TechRequestDetailPage />} />
      </Route>

      {/* === REDIRECT MẶC ĐỊNH === */}
      {/* Nếu vào "/" → tự redirect theo role, hoặc về login */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={
                user.role === "MANAGER"
                  ? "/manager"
                  : user.role === "RESIDENT"
                    ? "/resident/requests"
                    : "/technician/requests"
              }
              replace
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
