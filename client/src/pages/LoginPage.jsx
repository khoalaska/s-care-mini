import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, Input, Button } from "../components/ui";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const decodeToken = (token) => {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi(phoneNumber, password);
      const token = res.data.access_token;
      const userData = decodeToken(token);

      login(token, userData);

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
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-widest uppercase text-black">
            S-Care Mini
          </h2>
          <p className="mt-2 text-sm text-gray-700 font-bold border-t-2 border-black inline-block pt-2">
            HỆ THỐNG QUẢN LÝ SỰ CỐ
          </p>
        </div>

        <Card className="border-2 border-black bg-white rounded-none">
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 p-4 border-l-4 border-red-700 bg-red-50 text-red-800 text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Số điện thoại"
                type="tel"
                placeholder="VD: 0901234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />

              <Input
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                className="w-full text-base font-bold uppercase tracking-wider border-2 border-black rounded-none"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm font-bold text-gray-700">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-700 hover:underline">
            Đăng ký cư dân
          </Link>
        </p>
      </div>
    </div>
  );
}
