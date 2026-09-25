import axiosClient from "./axiosClient";

// Đăng nhập → backend trả về { access_token: "..." }
export const login = (phone_number, password) => {
  return axiosClient.post("/auth/login", { phone_number, password });
};

// Đăng ký cư dân
export const register = (data) => {
  return axiosClient.post("/auth/register", data);
};

// Lấy thông tin user đang đăng nhập
export const getMe = () => {
  return axiosClient.get("/auth/me");
};

// Manager tạo tài khoản technician
export const createTechnician = (data) => {
  return axiosClient.post("/auth/technician", data);
};

// Lấy danh sách kỹ thuật viên
export const getTechnicians = () => {
  return axiosClient.get("/auth/technicians");
};
