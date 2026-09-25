import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { getRequests } from "../../api/requestApi";
import { getRequestReport } from "../../api/reportApi";
import StatusBadge from "../../components/StatusBadge";
import { PRIORITY_LABELS, PRIORITY_COLORS, TYPE_LABELS, formatDate, STATUS_LABELS } from "../../utils/constants";
import { Select, Button, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const PIE_COLORS = {
  NEW: "#16a34a", // text-green-600
  ASSIGNED: "#d97706", // text-amber-600
  IN_PROGRESS: "#1d4ed8", // text-blue-700
  DONE: "#059669", // text-emerald-600
  CLOSED: "#1f2937", // text-gray-800
  REJECTED: "#dc2626", // text-red-600
  CANCELLED: "#6b7280", // text-gray-500
};

export default function RequestListPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const [report, setReport] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getRequests({ page, limit: 10, status: statusFilter || undefined });
      setRequests(res.data.requests);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      setError("Không thể tải danh sách yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    try {
      const res = await getRequestReport();
      setReport(res.data);
    } catch (err) {
      console.error("Không thể tải report");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  useEffect(() => {
    fetchReport();
  }, []);

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "NEW", label: "Mới" },
    { value: "ASSIGNED", label: "Đã giao" },
    { value: "IN_PROGRESS", label: "Đang xử lý" },
    { value: "DONE", label: "Hoàn thành" },
    { value: "CLOSED", label: "Đã đóng" },
    { value: "REJECTED", label: "Từ chối" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  // Prepare chart data
  let statusData = [];
  if (report) {
    statusData = report.byStatus.map(item => ({
      name: STATUS_LABELS[item.status],
      value: item.count,
      color: PIE_COLORS[item.status] || "#999"
    }));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* LEFT COLUMN: LIST */}
      <div className="lg:w-3/4 space-y-4 w-full">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <h1 className="text-2xl font-bold text-black uppercase tracking-wider">Danh sách Yêu cầu</h1>
          <div className="w-48">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              options={statusOptions}
            />
          </div>
        </div>

        {error && <div className="text-sm text-red-600 font-bold">{error}</div>}

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Mã YC</TableHeader>
              <TableHeader>Loại</TableHeader>
              <TableHeader>Ngày tạo</TableHeader>
              <TableHeader>Ưu tiên</TableHeader>
              <TableHeader>Trạng thái</TableHeader>
              <TableHeader className="text-right">Hành động</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-4 font-bold text-gray-500">Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center py-4 font-bold text-gray-500">Không có dữ liệu</TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <Fragment key={req.id}>
                  {/* Dòng chính */}
                  <tr className="hover:bg-blue-50 transition-colors border-t border-gray-300">
                    <td className="px-2 py-2 whitespace-nowrap font-bold text-black">#{req.id}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-black">{TYPE_LABELS[req.type]}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-gray-600">{formatDate(req.created_at)}</td>
                    <td className={`px-2 py-2 whitespace-nowrap ${PRIORITY_COLORS[req.priority]}`}>
                      {PRIORITY_LABELS[req.priority]}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} />
                        {req.is_overdue && (
                          <span className="text-xs font-bold text-red-600 uppercase">
                            [QUÁ HẠN]
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-right">
                      <Link to={`/manager/requests/${req.id}`} className="text-blue-700 font-bold hover:underline uppercase text-sm">
                        Xem
                      </Link>
                    </td>
                  </tr>
                </Fragment>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center py-4 border-t border-gray-300">
            <span className="text-sm font-bold text-gray-700">
              Trang {page} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trước
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: STATS */}
      <div className="lg:w-1/4 w-full bg-white border-2 border-black p-4 space-y-6">
        <h2 className="text-lg font-bold text-black border-b-2 border-black pb-1 uppercase tracking-wide">Báo Cáo (30 Ngày)</h2>
        
        {report ? (
          <>
            <div className="space-y-3">
              <div className="flex justify-between items-end border-b border-gray-300 pb-1">
                <span className="text-sm font-bold text-gray-700">Tổng yêu cầu</span>
                <span className="text-xl font-black text-black">{report.summary.totalRequests}</span>
              </div>
              <div className="flex justify-between items-end border-b border-gray-300 pb-1">
                <span className="text-sm font-bold text-red-700">Quá hạn</span>
                <span className="text-xl font-black text-red-700">{report.summary.overdueRequests}</span>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-black mb-2 uppercase border-b border-gray-300 pb-1">Trạng thái</p>
              <div className="h-[200px] w-full">
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={statusData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        innerRadius={40}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '0px', border: '1px solid black', fontSize: '12px', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-xs italic text-gray-500">Chưa có dữ liệu</p>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-bold text-black mb-2 uppercase border-b border-gray-300 pb-1">TOP HOÀN THÀNH</p>
              <ul className="text-sm space-y-2 pt-1">
                {report.topTechnicians.length === 0 && <li className="text-gray-500 italic">Trống</li>}
                {report.topTechnicians.map((tech, idx) => (
                  <li key={tech.id} className="flex justify-between border-b border-dashed border-gray-300 pb-1">
                    <span className="text-gray-800">{idx + 1}. {tech.full_name}</span>
                    <span className="font-bold text-black">{tech.completed_requests}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-sm italic text-gray-500 font-bold">Đang tải báo cáo...</p>
        )}
      </div>
    </div>
  );
}
