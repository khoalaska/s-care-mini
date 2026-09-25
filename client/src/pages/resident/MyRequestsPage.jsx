import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { getRequests } from "../../api/requestApi";
import StatusBadge from "../../components/StatusBadge";
import { PRIORITY_LABELS, PRIORITY_COLORS, TYPE_LABELS, formatDate } from "../../utils/constants";
import { Button, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from "../../components/ui";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getRequests({ page, limit: 10 });
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
  }, [page]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b-2 border-black pb-2">
        <h1 className="text-2xl font-black text-black tracking-widest uppercase">YÊU CẦU CỦA TÔI</h1>
        <Link to="/resident/create-request">
          <Button variant="primary" className="rounded-none font-bold uppercase">
            + TẠO YÊU CẦU MỚI
          </Button>
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Mã YC</TableHeader>
            <TableHeader>Loại</TableHeader>
            <TableHeader>Ưu tiên</TableHeader>
            <TableHeader>Trạng thái</TableHeader>
            <TableHeader>Ngày tạo</TableHeader>
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
              <TableCell colSpan="6" className="text-center py-4 font-bold text-gray-500">Bạn chưa tạo yêu cầu nào.</TableCell>
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
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-gray-600 text-sm">
                  {formatDate(req.created_at)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-right">
                  <Link to={`/resident/requests/${req.id}`} className="text-blue-700 font-bold hover:underline uppercase text-sm">
                    Xem
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
