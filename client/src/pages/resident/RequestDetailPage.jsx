import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequestById, updateStatus } from "../../api/requestApi";
import StatusBadge from "../../components/StatusBadge";
import { PRIORITY_LABELS, PRIORITY_COLORS, TYPE_LABELS, formatDate } from "../../utils/constants";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../../components/ui";

export default function ResidentRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const res = await getRequestById(id);
      setRequest(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus, confirmMsg) => {
    if (!window.confirm(confirmMsg)) return;
    setActionLoading(true);
    try {
      await updateStatus(id, newStatus);
      alert("Cập nhật thành công!");
      fetchRequest();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật trạng thái");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-gray-500 py-10 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-rose-500 bg-rose-50 p-4 rounded">{error}</div>;
  if (!request) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 pt-4">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black font-bold uppercase text-sm tracking-widest inline-flex items-center gap-2">
          ← [ QUAY LẠI ]
        </button>
      </div>
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-black tracking-widest uppercase">YÊU CẦU #{request.id}</h1>
          <StatusBadge status={request.status} />
        </div>
      </div>

      <Card className="border-2 border-black rounded-none bg-white">
        <CardHeader className="bg-gray-200 border-b-2 border-black py-2">
          <CardTitle>NỘI DUNG YÊU CẦU</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="border-l-4 border-black pl-3">
              <p className="text-xs font-bold text-gray-700 uppercase mb-1">Loại yêu cầu</p>
              <p className="font-black text-black uppercase">{TYPE_LABELS[request.type]}</p>
            </div>
            <div className="border-l-4 border-black pl-3">
              <p className="text-xs font-bold text-gray-700 uppercase mb-1">Mức ưu tiên</p>
              <p className={`font-black uppercase ${PRIORITY_COLORS[request.priority]}`}>{PRIORITY_LABELS[request.priority]}</p>
            </div>
            <div className="border-l-4 border-black pl-3">
              <p className="text-xs font-bold text-gray-700 uppercase mb-1">Ngày tạo</p>
              <p className="font-black text-black">{formatDate(request.created_at)}</p>
            </div>
          </div>

          <hr className="border-2 border-black" />

          <div>
            <p className="text-xs font-bold text-black uppercase border-b-2 border-black pb-1 mb-2">MÔ TẢ CHI TIẾT</p>
            <div className="text-gray-900 whitespace-pre-wrap text-base leading-relaxed">
              "{request.description}"
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">HÌNH ẢNH ĐÍNH KÈM ({request.images?.length || 0}/3)</p>
            {request.images && request.images.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {request.images.map(img => (
                  <a key={img.id} href={img.image_url} target="_blank" rel="noreferrer" className="shrink-0 block border-2 border-black hover:border-gray-500 transition-colors">
                    <img src={img.image_url} alt="Proof" className="h-40 w-40 object-cover" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm font-bold text-gray-500 italic">Không có hình ảnh đính kèm</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hành động của cư dân */}
      {request.status === "NEW" && (
        <Card className="border-2 border-black bg-gray-50 rounded-none">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
            <p className="text-black text-sm font-bold uppercase tracking-wider">LƯU Ý: BẠN CÓ THỂ HỦY YÊU CẦU NÀY VÌ CHƯA ĐƯỢC XỬ LÝ.</p>
            <Button 
              variant="danger" 
              className="rounded-none border-2 border-red-800 font-bold tracking-widest px-6"
              onClick={() => handleStatusChange("CANCELLED", "Bạn chắc chắn muốn hủy yêu cầu này?")} 
              disabled={actionLoading}
            >
              HỦY YÊU CẦU
            </Button>
          </CardContent>
        </Card>
      )}

      {request.status === "DONE" && (
        <Card className="border-2 border-black bg-gray-50 rounded-none">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5">
            <p className="text-black text-sm font-bold uppercase tracking-wider">KTV ĐÃ HOÀN THÀNH. HÃY KIỂM TRA & ĐÓNG YÊU CẦU.</p>
            <Button 
              className="bg-green-700 hover:bg-green-800 text-white rounded-none border-2 border-black font-bold tracking-widest px-6" 
              onClick={() => handleStatusChange("CLOSED", "Xác nhận đóng yêu cầu?")} 
              disabled={actionLoading}
            >
              ĐÓNG YÊU CẦU
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
