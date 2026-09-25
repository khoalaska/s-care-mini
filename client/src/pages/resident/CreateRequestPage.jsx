import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest, uploadImages } from "../../api/requestApi";
import { Card, CardHeader, CardTitle, CardContent, Button, Select } from "../../components/ui";

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ type: "ELECTRIC", priority: "MEDIUM", description: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 3) {
      alert("Tối đa 3 ảnh");
      e.target.value = "";
      return;
    }
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await createRequest(formData);
      const newRequestId = res.data.request.id;

      if (files.length > 0) {
        const data = new FormData();
        files.forEach((file) => data.append("images", file));
        await uploadImages(newRequestId, data);
      }

      alert("Tạo yêu cầu thành công!");
      navigate(`/resident/requests/${newRequestId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi tạo yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "ELECTRIC", label: "Hệ thống điện" },
    { value: "WATER", label: "Hệ thống nước & Cấp thoát" },
    { value: "CLEANING", label: "Vệ sinh môi trường" },
    { value: "SECURITY", label: "An ninh trật tự" },
    { value: "OTHER", label: "Khác" },
  ];

  const priorityOptions = [
    { value: "LOW", label: "Thấp - Không gấp" },
    { value: "MEDIUM", label: "Trung bình - Cần xử lý trong ngày" },
    { value: "HIGH", label: "Cao - Khẩn cấp / Nguy hiểm" },
  ];

  return (
    <div className="relative pt-8 px-8 pb-10 min-h-screen">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-black font-black uppercase text-sm tracking-widest inline-flex items-center gap-2 transition-colors">
          &larr; TRỞ VỀ TRANG TRƯỚC
        </button>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <h1 className="text-2xl font-black text-black tracking-widest uppercase">Tạo Yêu Cầu Bảo Trì</h1>
        </div>
      
      {error && <div className="text-sm font-bold text-red-700 bg-red-50 border-l-4 border-red-700 p-3">{error}</div>}

      <Card className="rounded-none border-2 border-black">
        <CardHeader className="bg-gray-200 border-b-2 border-black py-2">
          <CardTitle>Biểu Mẫu Yêu Cầu</CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="LOẠI SỰ CỐ"
                options={typeOptions}
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              />
              <Select
                label="MỨC ĐỘ ƯU TIÊN"
                options={priorityOptions}
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">MÔ TẢ CHI TIẾT</label>
              <textarea
                required
                rows="5"
                className="w-full border-2 border-gray-400 p-3 text-sm text-black focus:outline-none focus:border-black placeholder:text-gray-500"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả rõ tình trạng sự cố (Ví dụ: Bóng đèn hành lang tầng 3 bị cháy...)"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-1">ĐÍNH KÈM HÌNH ẢNH (Tối đa 3)</label>
              <div className="border-2 border-dashed border-gray-400 p-4 bg-gray-50 flex flex-col items-start gap-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer bg-black text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  TẢI ẢNH LÊN
                </label>
                <div className="text-sm font-bold text-gray-700">
                  {files.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {files.map((f, idx) => (
                        <li key={idx}>{f.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-gray-500">Chưa có ảnh nào được chọn.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-black flex justify-end gap-4 mt-6">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-none border border-gray-400 text-black uppercase font-bold">
                Hủy bỏ
              </Button>
              <Button type="submit" variant="primary" disabled={loading} className="rounded-none border-2 border-black text-white uppercase font-black tracking-widest px-8">
                {loading ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
