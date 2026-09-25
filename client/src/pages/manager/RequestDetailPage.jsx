import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequestById, updateStatus, assignRequest } from "../../api/requestApi";
import { getTechnicians } from "../../api/authApi";
import StatusBadge from "../../components/StatusBadge";
import { PRIORITY_LABELS, PRIORITY_COLORS, TYPE_LABELS, formatDate } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card, CardHeader, CardTitle, CardContent, Select } from "../../components/ui";

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [note, setNote] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequest();
    if (user?.role === "MANAGER") {
      fetchTechnicians();
    }
  }, [id]);

  const fetchTechnicians = async () => {
    try {
      const res = await getTechnicians();
      setTechnicians(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách KTV:", err);
    }
  };

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

  const handleAssign = async () => {
    if (!technicianId) {
      alert("Vui lòng nhập ID Kỹ thuật viên");
      return;
    }
    setActionLoading(true);
    try {
      await assignRequest(id, parseInt(technicianId));
      alert("Phân công thành công!");
      fetchRequest();
      setTechnicianId("");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi phân công");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }
    setActionLoading(true);
    try {
      await updateStatus(id, "REJECTED", note);
      alert("Đã từ chối yêu cầu");
      fetchRequest();
      setNote("");
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
          <h1 className="text-3xl font-black text-black tracking-widest uppercase">YÊU CẦU #{request.id}</h1>
          <StatusBadge status={request.status} />
          {request.is_overdue && (
             <span className="text-xs font-black text-red-700 border-2 border-red-700 px-2 py-0.5 uppercase tracking-wider">
               QUÁ HẠN
             </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Info & Timeline */}
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

          <Card className="border-2 border-black">
            <CardHeader className="bg-gray-200 border-b-2 border-black">
              <CardTitle>LỊCH SỬ TRẠNG THÁI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {request.histories && request.histories.length > 0 ? (
                  request.histories.map((hist, idx) => (
                    <div key={hist.id} className="relative pl-6 border-l-2 border-black last:border-transparent pb-4">
                      <div className="absolute w-3 h-3 bg-black -left-[7px] top-1"></div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-bold text-sm text-black">{hist.updatedBy?.full_name || "Hệ thống"}</span>
                        <span className="text-gray-700 text-sm italic">đã đổi thành</span>
                        <StatusBadge status={hist.new_status} />
                      </div>
                      {hist.note && <p className="text-sm text-black border-l-2 border-gray-400 pl-3 italic mt-2">"{hist.note}"</p>}
                      <p className="text-xs font-bold text-gray-500 mt-2">{formatDate(hist.created_at)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-bold text-gray-500 italic">Chưa có lịch sử</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Meta & Actions */}
        <div className="space-y-6 w-full">
          {(request.status === "NEW" || request.status === "ASSIGNED") && user?.role === "MANAGER" && (
            <Card className="border-2 border-black bg-gray-50">
              <CardHeader className="bg-black text-white border-b-0">
                <h3 className="text-sm font-black uppercase tracking-widest">BẢNG ĐIỀU KHIỂN</h3>
              </CardHeader>
              <CardContent className="space-y-6 border-t-2 border-black">
                {request.status === "NEW" && (
                  <div className="space-y-3">
                    <p className="text-sm text-black font-bold uppercase tracking-wide">PHÂN CÔNG KTV</p>
                    <div className="flex gap-2">
                      <Select
                        options={[
                          { value: "", label: "Chọn KTV..." },
                          ...technicians.map(t => ({ value: t.id, label: `${t.full_name} (${t.phone_number})` }))
                        ]}
                        value={technicianId}
                        onChange={(e) => setTechnicianId(e.target.value)}
                        className="flex-1 rounded-none border-2 border-black"
                      />
                      <Button onClick={handleAssign} disabled={actionLoading} className="rounded-none border-2 border-black text-white bg-black hover:bg-gray-800 uppercase font-bold tracking-widest">
                        GIAO VIỆC
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 pt-4 border-t-2 border-black">
                  <p className="text-sm text-red-700 font-bold uppercase tracking-wide">TỪ CHỐI YÊU CẦU</p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border-2 border-black p-3 text-sm focus:outline-none placeholder:text-gray-500"
                    rows="2"
                    placeholder="Lý do từ chối..."
                  ></textarea>
                  <Button variant="danger" className="w-full rounded-none border-2 border-red-800 tracking-wider font-bold" onClick={handleReject} disabled={actionLoading}>
                    XÁC NHẬN TỪ CHỐI
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-black">
            <CardHeader className="bg-white border-b-2 border-black">
              <CardTitle>THÔNG TIN CƯ DÂN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cư dân</p>
                <p className="font-black text-black text-lg">{request.creator?.full_name || "N/A"}</p>
                <p className="text-sm font-bold text-gray-700">{request.creator?.phone_number}</p>
              </div>
              <hr className="border-2 border-black" />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Căn hộ</p>
                <p className="font-black text-black">{request.creator?.apartment_id || "Không rõ"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-black">
            <CardHeader className="bg-white border-b-2 border-black">
              <CardTitle>KỸ THUẬT VIÊN</CardTitle>
            </CardHeader>
            <CardContent>
              {request.assignee ? (
                <div className="space-y-1">
                  <p className="font-black text-black text-lg">{request.assignee.full_name}</p>
                  <p className="text-sm font-bold text-gray-700">ID: {request.assignee.id}</p>
                  <p className="text-sm font-bold text-gray-700">{request.assignee.phone_number}</p>
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-500 italic">Chưa phân công</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-black bg-gray-100">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase mb-1">Ngày tạo</p>
                <p className="text-sm font-black text-black">{formatDate(request.created_at)}</p>
              </div>
              <hr className="border-black border-dashed" />
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
