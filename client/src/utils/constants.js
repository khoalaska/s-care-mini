export const STATUS_LABELS = {
  NEW: "Mới",
  ASSIGNED: "Đã giao",
  IN_PROGRESS: "Đang xử lý",
  DONE: "Hoàn thành",
  CLOSED: "Đã đóng",
  REJECTED: "Từ chối",
  CANCELLED: "Đã hủy",
};

export const STATUS_COLORS = {
  NEW: "text-green-600",
  ASSIGNED: "text-amber-600",
  IN_PROGRESS: "text-blue-700",
  DONE: "text-emerald-600",
  CLOSED: "text-gray-800",
  REJECTED: "text-red-600",
  CANCELLED: "text-gray-500",
};

export const PRIORITY_LABELS = {
  LOW: "Thấp",
  MEDIUM: "Vừa",
  HIGH: "Cao",
};

export const PRIORITY_COLORS = {
  LOW: "text-slate-500",
  MEDIUM: "text-amber-600 font-medium",
  HIGH: "text-rose-600 font-semibold",
};

export const TYPE_LABELS = {
  ELECTRIC: "Điện",
  WATER: "Nước",
  CLEANING: "Vệ sinh",
  SECURITY: "An ninh",
  OTHER: "Khác",
};

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};
