import axios from "axios";

// Tạo 1 instance axios riêng cho app
// Mọi request sẽ tự động thêm prefix /api
// Ví dụ: axiosClient.get("/auth/me") → GET /api/auth/me → Vite proxy → GET localhost:3000/auth/me
const axiosClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// === REQUEST INTERCEPTOR ===
// Trước mỗi request, tự gắn JWT token vào header (nếu có)
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === RESPONSE INTERCEPTOR ===
// Sau mỗi response, kiểm tra lỗi
axiosClient.interceptors.response.use(
  (response) => response, // Thành công → trả về bình thường
  (error) => {
    // Token hết hạn hoặc sai → đá về trang login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
