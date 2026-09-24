import { stringify } from "csv-stringify/sync";

export const reportToCsv = (report) => {
  const rows = [];

  rows.push(["BÁO CÁO YÊU CẦU CƯ DÂN"]);
  rows.push(["Từ ngày", report.period.from || "Tất cả"]);
  rows.push(["Đến ngày", report.period.to || "Tất cả"]);
  rows.push([]);

  rows.push(["TỔNG QUAN"]);
  rows.push(["Chỉ số", "Giá trị"]);
  rows.push(["Tổng yêu cầu", report.summary.totalRequests]);
  rows.push(["Quá hạn", report.summary.overdueRequests]);
  rows.push(["Tỷ lệ quá hạn", `${report.summary.overdueRate}%`]);
  rows.push([]);

  rows.push(["THEO TRẠNG THÁI"]);
  rows.push(["Trạng thái", "Số lượng"]);

  for (const item of report.byStatus) {
    rows.push([item.status, item.count]);
  }

  rows.push([]);

  rows.push(["THEO LOẠI"]);
  rows.push(["Loại", "Số lượng"]);

  for (const item of report.byType) {
    rows.push([item.type, item.count]);
  }

  rows.push([]);

  rows.push(["THỜI GIAN XỬ LÝ TRUNG BÌNH"]);
  rows.push(["Loại", "Số giờ trung bình"]);

  for (const item of report.avgProcessingTimeByType) {
    rows.push([item.type, Number(item.average_hours).toFixed(2)]);
  }

  rows.push([]);

  rows.push(["TOP TECHNICIAN"]);
  rows.push(["ID", "Họ tên", "Số yêu cầu hoàn thành"]);

  for (const item of report.topTechnicians) {
    rows.push([item.id, item.full_name, item.completed_requests]);
  }

  return stringify(rows);
};
