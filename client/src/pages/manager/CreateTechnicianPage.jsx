import { useState } from "react";
import { createTechnician } from "../../api/authApi";
import { Link } from "react-router-dom";
import { Input, Button, Card, CardHeader, CardTitle, CardContent } from "../../components/ui";

export default function CreateTechnicianPage() {
  const [formData, setFormData] = useState({ phone_number: "", password: "", full_name: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await createTechnician(formData);
      setSuccess("Tạo tài khoản Kỹ thuật viên thành công!");
      setFormData({ phone_number: "", password: "", full_name: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo tài khoản");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative pt-8 px-8 pb-10 min-h-screen">
      <div className="mb-6">
        <Link to="/manager/requests" className="text-gray-500 hover:text-black font-black uppercase text-sm tracking-widest inline-flex items-center gap-2 transition-colors">
          &larr; TRỞ VỀ TRANG TRƯỚC
        </Link>
      </div>
      <div className="max-w-xl mx-auto">
        <Card className="border-2 border-black rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <CardHeader className="bg-black text-white py-5 rounded-none border-b-0">
          <CardTitle className="text-white text-center text-xl tracking-widest font-black uppercase">
            TẠO TÀI KHOẢN KTV
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6 border-t-2 border-black">
          {error && <div className="text-sm font-bold text-red-700 border-2 border-red-700 bg-red-50 p-3 uppercase tracking-wider">{error}</div>}
          {success && <div className="text-sm font-bold text-green-800 border-2 border-green-800 bg-green-50 p-3 uppercase tracking-wider">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2 tracking-wide">Họ và Tên</label>
              <Input
                required
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="rounded-none border-2 border-black focus:ring-0 focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2 tracking-wide">Số điện thoại</label>
              <Input
                required
                type="text"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="10 chữ số..."
                className="rounded-none border-2 border-black focus:ring-0 focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2 tracking-wide">Mật khẩu</label>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Tối thiểu 6 ký tự..."
                className="rounded-none border-2 border-black focus:ring-0 focus:border-black"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white rounded-none border-2 border-black font-bold tracking-widest uppercase mt-6 py-3"
            >
              {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
