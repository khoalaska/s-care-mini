import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// roles: mảng các role được phép vào, ví dụ ["MANAGER"] hoặc ["RESIDENT", "TECHNICIAN"]
export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Đang load thông tin user → hiện loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  // Chưa login → về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Login rồi nhưng sai role → về trang chủ theo role
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Hợp lệ → hiển thị nội dung trang
  return children;
}
