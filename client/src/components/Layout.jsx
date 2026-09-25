import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const menuByRole = {
  MANAGER: [
    { label: "Yêu cầu", path: "/manager/requests", icon: "📋" },
    { label: "Căn hộ", path: "/manager/apartments", icon: "🏠" },
    { label: "Kỹ thuật viên", path: "/manager/create-technician", icon: "👷" },
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menus = menuByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 font-sans">
      {/* === LEFT SIDEBAR === */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0a2540] text-gray-200 transform transition-transform duration-200 border-r border-[#0a2540]
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:block flex flex-col`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 bg-[#06182c]">
          <h1 className="text-lg font-bold text-white tracking-wide">S-Care Mini</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-0 overflow-y-auto">
          {menus.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/manager/requests' && location.pathname === '/manager');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors
                  ${
                    isActive
                      ? "bg-[#113a63] text-white border-l-4 border-blue-400 font-semibold"
                      : "text-gray-300 hover:bg-[#113a63] hover:text-white border-l-4 border-transparent"
                  }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* === MAIN CONTENT === */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-gray-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-600 hover:text-gray-900 border border-gray-300 p-1 rounded"
            >
              ☰
            </button>
            <div className="hidden md:flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Trạm Quản Lý S-Care
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Vai trò */}
            <span className="hidden sm:inline-flex items-center text-xs font-bold text-gray-500 uppercase tracking-widest px-2 py-0.5">
              {user?.role}
            </span>

            {/* Profile & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors border border-transparent hover:border-gray-300"
              >
                <div className="w-8 h-8 bg-[#0a2540] text-white flex items-center justify-center font-bold text-sm">
                  {user?.role?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium text-gray-800 hidden sm:block">
                  Tài khoản
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-md z-20 py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-bold text-gray-800">Thông tin</p>
                      <p className="text-xs text-gray-500 truncate">{user?.phone_number || "Không có sđt"}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-medium"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
