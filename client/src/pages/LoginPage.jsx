import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Giải mã JWT payload (phần giữa) để lấy { userId, role }
  // JWT có 3 phần ngăn bởi dấu chấm: header.payload.signature
  const decodeToken = (token) => {
    const payload = token.split(".")[1]; // Lấy phần payload
    const decoded = atob(payload); // Giải mã base64
    return JSON.parse(decoded); // Parse thành object
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload trang
    setError("");
    setLoading(true);

    try {
      const res = await loginApi(phoneNumber, password);
      const token = res.data.access_token;

      // Giải mã token để lấy thông tin user
      const userData = decodeToken(token);

      // Lưu vào AuthContext
      login(token, userData);

      // Redirect theo role
      switch (userData.role) {
        case "MANAGER":
          navigate("/manager");
          break;
        case "RESIDENT":
          navigate("/resident/requests");
          break;
        case "TECHNICIAN":
          navigate("/technician/requests");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">S-Care Mini</h1>
          <p className="text-gray-500 mt-2">
            Hệ thống tiếp nhận yêu cầu cư dân
          </p>
        </div>

        {/* Hiện lỗi nếu có */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {/* Form đăng nhập */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="0900000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Link đăng ký */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký cư dân
          </Link>
        </p>
      </div>
    </div>
  );
}
