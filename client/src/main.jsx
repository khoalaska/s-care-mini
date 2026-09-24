import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./index.css";

// BrowserRouter: cho phép dùng URL routing (ví dụ /login, /manager/requests)
// AuthProvider: cung cấp thông tin đăng nhập cho toàn bộ app
// App: component chính chứa tất cả routes
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
