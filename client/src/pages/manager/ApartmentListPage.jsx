import { useState, useEffect } from "react";
import { getApartments, createApartment, updateApartment, deleteApartment } from "../../api/apartmentApi";
import { Button, Input, Select, Table, TableHead, TableHeader, TableBody, TableRow, TableCell, Card, CardHeader, CardTitle, CardContent } from "../../components/ui";

export default function ApartmentListPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ code: "", floor: "", area: "", status: "VACANT" });

  useEffect(() => {
    fetchApartments();
  }, [page]);

  const fetchApartments = async () => {
    setLoading(true);
    try {
      const res = await getApartments({ page, limit: 10 });
      setApartments(res.data.apartments);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateApartment(editingId, formData);
        alert("Cập nhật thành công!");
      } else {
        await createApartment(formData);
        alert("Tạo mới thành công!");
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ code: "", floor: "", area: "", status: "VACANT" });
      fetchApartments();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi lưu căn hộ");
    }
  };

  const handleEdit = (apt) => {
    setEditingId(apt.id);
    setFormData({ code: apt.code, floor: apt.floor, area: apt.area, status: apt.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa căn hộ này?")) return;
    try {
      await deleteApartment(id);
      alert("Xóa thành công!");
      fetchApartments();
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa căn hộ");
    }
  };

  const statusOptions = [
    { value: "VACANT", label: "Trống" },
    { value: "OCCUPIED", label: "Đã có người ở" },
    { value: "MAINTENANCE", label: "Đang bảo trì" },
  ];

  const getStatusDisplay = (status) => {
    switch(status) {
      case "VACANT": return <span className="font-bold text-green-700 uppercase">Trống</span>;
      case "OCCUPIED": return <span className="font-bold text-blue-700 uppercase">Đã thuê</span>;
      case "MAINTENANCE": return <span className="font-bold text-red-700 uppercase">Bảo trì</span>;
      default: return status;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center border-b-2 border-black pb-2">
        <h1 className="text-2xl font-black text-black tracking-widest uppercase">QUẢN LÝ CĂN HỘ</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ code: "", floor: "", area: "", status: "VACANT" });
          }}
          className="rounded-none font-bold uppercase border-2 border-black tracking-wider"
        >
          {showForm ? "[ X ]" : "+ THÊM CĂN HỘ"}
        </Button>
      </div>

      {showForm ? (
        <div className="flex justify-center items-center py-10">
          <Card className="border-2 border-black rounded-none w-full max-w-3xl">
            <CardHeader className="bg-black text-white py-4 rounded-none border-b-0">
              <CardTitle className="text-white text-center text-xl tracking-widest font-black uppercase">
                {editingId ? "SỬA CĂN HỘ" : "THÊM CĂN HỘ MỚI"}
              </CardTitle>
            </CardHeader>
            <CardContent className="border-t-2 border-black p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-black uppercase mb-2 tracking-wide">Mã căn (VD: A101)</label>
                    <Input required type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="rounded-none border-2 border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black uppercase mb-2 tracking-wide">Tầng</label>
                    <Input required type="number" value={formData.floor} onChange={(e) => setFormData({...formData, floor: e.target.value})} className="rounded-none border-2 border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black uppercase mb-2 tracking-wide">Diện tích (m2)</label>
                    <Input required type="number" step="0.1" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} className="rounded-none border-2 border-black" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-black uppercase mb-2 tracking-wide">Trạng thái</label>
                    <Select options={statusOptions} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="rounded-none border-2 border-black bg-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t-2 border-black">
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="rounded-none border-2 border-black font-bold uppercase tracking-widest px-6">HỦY BỎ</Button>
                  <Button type="submit" className="rounded-none border-2 border-black font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 px-6">LƯU CĂN HỘ</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Mã căn</TableHeader>
                <TableHeader>Tầng</TableHeader>
                <TableHeader>Diện tích</TableHeader>
                <TableHeader>Trạng thái</TableHeader>
                <TableHeader className="text-right">Hành động</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-4 font-bold text-gray-500">Đang tải...</TableCell>
                </TableRow>
              ) : apartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-4 font-bold text-gray-500">Chưa có dữ liệu</TableCell>
                </TableRow>
              ) : (
                apartments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-bold text-black text-lg">{apt.code}</TableCell>
                    <TableCell className="font-bold text-gray-700">Tầng {apt.floor}</TableCell>
                    <TableCell className="font-bold text-gray-700">{apt.area} m²</TableCell>
                    <TableCell>{getStatusDisplay(apt.status)}</TableCell>
                    <TableCell className="text-right space-x-4">
                      <button onClick={() => handleEdit(apt)} className="text-blue-700 font-bold hover:underline uppercase text-sm tracking-wider">
                        SỬA
                      </button>
                      <button onClick={() => handleDelete(apt.id)} className="text-red-700 font-bold hover:underline uppercase text-sm tracking-wider">
                        XÓA
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex justify-between items-center py-4 border-t-2 border-black">
              <span className="text-sm font-bold text-black uppercase tracking-wider">
                Trang {page} / {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-none border-2 border-black font-bold uppercase"
                >
                  TRƯỚC
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-none border-2 border-black font-bold uppercase"
                >
                  SAU
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
