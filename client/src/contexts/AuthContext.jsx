import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/authApi";

// 1. Tạo Context (bảng thông báo trống)
const AuthContext = createContext(null);

// 2. Tạo Provider (người quản lý bảng thông báo)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { userId, role }
  const [loading, setLoading] = useState(true); // Đang kiểm tra token

  // Khi app mở lên, kiểm tra xem đã có token cũ trong localStorage chưa
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Có token → gọi API /auth/me để lấy thông tin user
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token hết hạn hoặc sai → xóa đi
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Hàm login: lưu token + cập nhật user
  const loginAction = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Hàm logout: xóa token + xóa user
  const logoutAction = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 3. Cung cấp data cho toàn bộ app
  return (
    <AuthContext.Provider
      value={{ user, loading, login: loginAction, logout: logoutAction }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 4. Hook tiện ích — dùng ở bất kỳ component nào: const { user, logout } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
}
