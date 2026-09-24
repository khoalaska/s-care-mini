import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Khi frontend gọi /api/auth/login
      // Vite sẽ tự chuyển thành http://localhost:3000/auth/login
      // → Tránh lỗi CORS (trình duyệt chặn request khác domain/port)
      "/api": {
        target: "http://localhost:3000",
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // Ảnh upload cũng proxy về backend
      "/uploads": {
        target: "http://localhost:3000",
      },
    },
  },
});
