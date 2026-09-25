import { useState, useEffect } from "react";
import { getRequestReport } from "../../api/reportApi";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { STATUS_LABELS, TYPE_LABELS } from "../../utils/constants";
import { Card, CardHeader, CardTitle, CardContent, Input } from "../../components/ui";

const PIE_COLORS = {
  NEW: "#0ea5e9", // sky-500
  ASSIGNED: "#f59e0b", // amber-500
  IN_PROGRESS: "#3b82f6", // blue-500
  DONE: "#10b981", // emerald-500
  CLOSED: "#9ca3af", // gray-400
  REJECTED: "#f43f5e", // rose-500
  CANCELLED: "#94a3b8", // slate-400
};

export default function DashboardPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getRequestReport(fromDate || undefined, toDate || undefined);
      setReport(res.data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate]);

  if (loading && !report) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Đang tải thống kê...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-md">
          <p className="text-rose-700 font-medium">{error}</p>
          <button onClick={fetchReport} className="mt-2 text-sm text-rose-600 hover:underline font-semibold">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  // Transform data for charts
  const statusData = report.byStatus.map(item => ({
    name: STATUS_LABELS[item.status],
    value: item.count,
    color: PIE_COLORS[item.status]
  }));

  const timeData = report.avgProcessingTimeByType.map(item => ({
    name: TYPE_LABELS[item.type],
    hours: parseFloat(item.average_hours || 0).toFixed(1)
  }));

  const hasStatusData = statusData.length > 0 && statusData.some(d => d.value > 0);
  const hasTimeData = timeData.length > 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tổng quan Hệ thống</h1>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <Input 
            type="date" 
            label="Từ ngày"
            value={fromDate} 
            onChange={e => setFromDate(e.target.value)} 
          />
          <Input 
            type="date" 
            label="Đến ngày"
            value={toDate} 
            onChange={e => setToDate(e.target.value)} 
          />
        </div>
      </div>

      {loading && report && (
        <div className="text-sm text-indigo-600 animate-pulse font-medium">
          Đang cập nhật dữ liệu...
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -mr-4 -mt-4"></div>
          <CardContent className="p-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tổng yêu cầu</p>
            <p className="text-3xl font-bold text-gray-900">{report.summary.totalRequests}</p>
          </CardContent>
        </Card>
        
        <Card className="border-rose-100 shadow-sm relative overflow-hidden bg-rose-50/20">
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-100 rounded-bl-full -mr-4 -mt-4"></div>
          <CardContent className="p-6">
            <p className="text-xs text-rose-600 uppercase tracking-wider font-semibold mb-1">Yêu cầu quá hạn</p>
            <p className="text-3xl font-bold text-rose-700">{report.summary.overdueRequests}</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-100 shadow-sm relative overflow-hidden bg-amber-50/20">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full -mr-4 -mt-4"></div>
          <CardContent className="p-6">
            <p className="text-xs text-amber-700 uppercase tracking-wider font-semibold mb-1">Tỷ lệ quá hạn</p>
            <p className="text-3xl font-bold text-amber-700">{report.summary.overdueRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ trạng thái */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái Yêu cầu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {hasStatusData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={statusData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100} 
                      innerRadius={60}
                      paddingAngle={2}
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 italic">Không có dữ liệu trong khoảng thời gian này</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Biểu đồ thời gian xử lý */}
        <Card>
          <CardHeader>
            <CardTitle>Thời gian xử lý trung bình (Giờ)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {hasTimeData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Giờ" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 italic">Không có dữ liệu để tính toán thời gian xử lý</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Technicians */}
      <Card>
        <CardHeader>
          <CardTitle>Top Kỹ thuật viên (Hoàn thành nhiều nhất)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.topTechnicians.length === 0 ? (
              <p className="text-gray-500 italic text-sm">Chưa có dữ liệu thống kê trong khoảng thời gian này.</p>
            ) : (
              report.topTechnicians.map((tech, index) => (
                <div key={tech.id} className="border border-gray-100 p-4 rounded flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg border border-indigo-200">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tech.full_name}</p>
                    <p className="text-sm text-gray-500 font-medium">{tech.completed_requests} việc hoàn thành</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
