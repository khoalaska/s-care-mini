import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequestById, updateStatus } from "../../api/requestApi";
import StatusBadge from "../../components/StatusBadge";
import { PRIORITY_LABELS, PRIORITY_COLORS, TYPE_LABELS, formatDate } from "../../utils/constants";
import { Button, Card, CardHeader, CardTitle, CardContent } from "../../components/ui";

export default function TechRequestDetailPage() {
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

  const handleStatusChange = async (newStatus) => {
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
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black font-bold uppercase text-sm tracking-widest inline-flex items-center gap-2">
          ← [ QUAY LẠI ]
        </button>
      </div>
      <div className="flex items-center justify-between border-b-2 border-black pb-3">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-black tracking-widest uppercase">XỬ LÝ YÊU CẦU #{request.id}</h1>
          <StatusBadge status={request.status} />
          {request.is_overdue && (
             <span className="text-xs font-black text-red-700 border-2 border-red-700 px-2 py-0.5 uppercase tracking-wider">
               QUÁ HẠN
             </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 border-black">
            <CardHeader className="bg-gray-200 border-b-2 border-black">
              <CardTitle>CHI TIẾT SỰ CỐ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-l-4 border-black pl-3">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-1">Loại yêu cầu</p>
                  <p className="font-black text-black uppercase">{TYPE_LABELS[request.type]}</p>
                </div>
                <div className="border-l-4 border-black pl-3">
                  <p className="text-xs font-bold text-gray-700 uppercase mb-1">Mức ưu tiên</p>
                  <p className={`font-black uppercase ${PRIORITY_COLORS[request.priority]}`}>{PRIORITY_LABELS[request.priority]}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-black uppercase border-b-2 border-black pb-1 mb-2">MÔ TẢ</p>
                <div className="text-gray-900 whitespace-pre-wrap text-base leading-relaxed">
                  "{request.description}"
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-black uppercase border-b-2 border-black pb-1 mb-3">HÌNH ẢNH ĐÍNH KÈM ({request.images?.length || 0}/3)</p>
                {request.images && request.images.length > 0 ? (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {request.images.map((img) => (
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
        </div>

        {/* Right Column: Actions & Contact */}
        <div className="space-y-6 w-full">
          {/* Technician Actions */}
          {request.status === "ASSIGNED" && (
            <Card className="border-2 border-black bg-gray-50">
              <CardHeader className="bg-black text-white border-b-0">
                <CardTitle className="text-white">TIẾP NHẬN CÔNG VIỆC</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 border-t-2 border-black">
                <p className="text-sm font-bold text-black">Bấm xác nhận để bắt đầu tính thời gian xử lý sự cố.</p>
                <Button 
                  className="w-full rounded-none border-2 border-black text-white bg-black hover:bg-gray-800 tracking-wider font-bold uppercase" 
                  onClick={() => handleStatusChange("IN_PROGRESS")}
                  disabled={actionLoading}
                >
                  BẮT ĐẦU XỬ LÝ
                </Button>
              </CardContent>
            </Card>
          )}

          {request.status === "IN_PROGRESS" && (
            <Card className="border-2 border-black bg-gray-50">
              <CardHeader className="bg-black text-white border-b-0">
                <CardTitle className="text-white">BÁO CÁO HOÀN THÀNH</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 border-t-2 border-black">
                <p className="text-sm font-bold text-black">Xác nhận công việc đã được giải quyết xong.</p>
                <Button 
                  className="w-full bg-green-700 hover:bg-green-800 text-white rounded-none border-2 border-black font-bold tracking-widest" 
                  onClick={() => handleStatusChange("DONE")}
                  disabled={actionLoading}
                >
                  ĐÃ HOÀN THÀNH
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-black">
            <CardHeader className="bg-white border-b-2 border-black">
              <CardTitle>THÔNG TIN LIÊN HỆ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cư dân báo sự cố</p>
                <p className="font-black text-black text-lg">{request.creator?.full_name}</p>
                <p className="text-sm font-bold text-gray-700 font-mono mt-1">{request.creator?.phone_number}</p>
              </div>
              <hr className="border-2 border-black" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Căn hộ</p>
                <p className="font-black text-black text-lg">{request.creator?.apartment_id}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black bg-gray-100">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-1">Hạn xử lý (SLA)</p>
                <p className={`text-sm font-black ${request.is_overdue ? 'text-red-700' : 'text-black'}`}>
                  {formatDate(request.due_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
