import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Menu items theo từng role
const menuByRole = {
  MANAGER: [
    { label: "Dashboard", path: "/manager", icon: "📊" },
    { label: "Yêu cầu", path: "/manager/requests", icon: "📋" },
    { label: "Căn hộ", path: "/manager/apartments", icon: "🏠" },
    { label: "Tạo KTV", path: "/manager/create-technician", icon: "👷" },
  ],
  RESIDENT: [
    { label: "Yêu cầu của tôi", path: "/resident/requests", icon: "📋" },
    { label: "Tạo yêu cầu", path: "/resident/create-request", icon: "➕" },
  ],
  TECHNICIAN: [
    { label: "Việc được giao", path: "/technician/requests", icon: "📋" },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menus = menuByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* === SIDEBAR === */}
      {/* Mobile: ẩn mặc định, hiện khi bấm nút ☰ */}
      {/* Desktop (md:): luôn hiện, width cố định 64 (256px) */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block`}
      >
        {/* Logo / Tên app */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">S-Care Mini</h1>
          {/* Nút đóng sidebar trên mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Menu items */}
        <nav className="p-4 space-y-1">
          {menus.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay khi sidebar mở trên mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white shadow-sm">
          {/* Nút mở sidebar trên mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600 text-2xl"
          >
            ☰
          </button>

          <div className="hidden md:block" />

          {/* User info + Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.role}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Nội dung trang — React Router sẽ nhét component trang con vào đây */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
