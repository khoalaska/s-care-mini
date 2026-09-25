import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";
import { Card, CardContent, Input, Button } from "../components/ui";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone_number: "", password: "", full_name: "", apartment_code: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi đăng ký. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-widest uppercase text-black">
            S-Care Mini
          </h2>
          <p className="mt-2 text-sm text-gray-700 font-bold border-t-2 border-black inline-block pt-2">
            ĐĂNG KÝ TÀI KHOẢN CƯ DÂN
          </p>
        </div>

        <Card className="border-2 border-black bg-white rounded-none">
          <CardContent className="p-8">
            {error && (
              <div className="mb-6 p-4 border-l-4 border-red-700 bg-red-50 text-red-800 text-sm font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Họ và Tên"
                type="text"
                placeholder="VD: Nguyễn Văn A"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                required
              />
              
              <Input
                label="Số điện thoại"
                type="tel"
                placeholder="VD: 0912345678"
                value={formData.phone_number}
                onChange={e => setFormData({...formData, phone_number: e.target.value})}
                required
              />
              
              <Input
                label="Mã Căn Hộ"
                type="text"
                placeholder="VD: A101"
                value={formData.apartment_code}
                onChange={e => setFormData({...formData, apartment_code: e.target.value})}
                required
              />
              
              <Input
                label="Mật khẩu"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full text-base font-bold uppercase tracking-wider border-2 border-black rounded-none"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm font-bold text-gray-700">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-700 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
