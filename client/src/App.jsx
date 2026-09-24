import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Components
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import LoginPage from "./pages/LoginPage";

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

      {/* === MANAGER ROUTES === */}
      <Route
        element={
          <PrivateRoute roles={["MANAGER"]}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/manager" element={<PlaceholderPage title="Dashboard" />} />
        <Route path="/manager/requests" element={<PlaceholderPage title="Danh sách yêu cầu" />} />
        <Route path="/manager/apartments" element={<PlaceholderPage title="Quản lý căn hộ" />} />
        <Route path="/manager/create-technician" element={<PlaceholderPage title="Tạo tài khoản KTV" />} />
      </Route>

      {/* === RESIDENT ROUTES === */}
      <Route
        element={
          <PrivateRoute roles={["RESIDENT"]}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/resident/requests" element={<PlaceholderPage title="Yêu cầu của tôi" />} />
        <Route path="/resident/create-request" element={<PlaceholderPage title="Tạo yêu cầu mới" />} />
      </Route>

      {/* === TECHNICIAN ROUTES === */}
      <Route
        element={
          <PrivateRoute roles={["TECHNICIAN"]}>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path="/technician/requests" element={<PlaceholderPage title="Việc được giao" />} />
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
