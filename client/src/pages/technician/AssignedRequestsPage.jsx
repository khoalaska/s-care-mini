import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { getRequests } from "../../api/requestApi";
import StatusBadge from "../../components/StatusBadge";
import { PRIORITY_LABELS, PRIORITY_COLORS, TYPE_LABELS, formatDate } from "../../utils/constants";
import { Select, Button, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui";

export default function AssignedRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ASSIGNED"); // Mặc định xem việc mới

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getRequests({ page, limit: 10, status: statusFilter || undefined });
      setRequests(res.data.requests);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "ASSIGNED", label: "Việc mới (Chờ xử lý)" },
    { value: "IN_PROGRESS", label: "Đang xử lý" },
    { value: "DONE", label: "Đã xong" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-2">
        <h1 className="text-2xl font-black text-black tracking-widest uppercase">VIỆC ĐƯỢC GIAO</h1>
        <div className="w-full sm:w-56">
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

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Mã YC</TableHeader>
            <TableHeader>Loại</TableHeader>
            <TableHeader>Ưu tiên</TableHeader>
            <TableHeader>Trạng thái</TableHeader>
            <TableHeader>Ngày giao</TableHeader>
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
              <TableCell colSpan="6" className="text-center py-4 font-bold text-gray-500">Không có công việc nào.</TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <tr key={req.id} className="hover:bg-blue-50 transition-colors border-b border-gray-300">
                <td className="px-2 py-2 whitespace-nowrap font-bold text-black">#{req.id}</td>
                <td className="px-2 py-2 whitespace-nowrap text-black">{TYPE_LABELS[req.type]}</td>
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
                <td className="px-2 py-2 whitespace-nowrap text-gray-600 text-sm">
                  {formatDate(req.updatedAt || req.created_at)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-right">
                  <Link to={`/technician/requests/${req.id}`} className="text-blue-700 font-bold hover:underline uppercase text-sm">
                    Xử lý
                  </Link>
                </td>
              </tr>
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
              className="rounded-none border border-black font-bold uppercase"
            >
              Trước
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-none border border-black font-bold uppercase"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
