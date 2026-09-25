# S-Care Mini

Hệ thống tiếp nhận & xử lý yêu cầu cư dân tòa nhà. Bao gồm Backend (Node.js/Express) và Frontend (React/Vite).

## Cách chạy

```bash
git clone https://github.com/khoalaska/s-care-mini.git
cd s-care-mini
docker compose up --build
```

- **Backend (API)** chạy tại `http://localhost:3000`. Tài liệu API: import file `s-care-mini.postman_collection.json` vào Postman.
- **Frontend (Web App)** chạy tại `http://localhost:8080` (Khi chạy bằng Docker) hoặc `http://localhost:5173` (Nếu chạy `npm run dev` trong thư mục client).

### Tài khoản mẫu (password: 123456)

| Vai trò    | SĐT                     |
| ---------- | ----------------------- |
| MANAGER    | 0900000001              |
| TECHNICIAN | 0900000002, 0900000003  |
| RESIDENT   | 0900000004 → 0900000008 |

Seed tự động tạo sẵn các tài khoản, 10 căn hộ, 20 yêu cầu ở nhiều trạng thái, lịch sử và notification mẫu.

## Sơ đồ kiến trúc

```
Request → requestLogger → express.json() → Route → authMiddleware (JWT) → roleMiddleware → Controller → Service → Model → MySQL
                                                                                                                        │
Response ← errorMiddleware (xử lý lỗi tập trung) ← Controller ← Service ←─────────────────────────────────────────────┘
```

```text
src/
├── routes/        # Khai báo endpoint + gắn middleware
├── controllers/   # Nhận request, gọi service, trả response
├── services/      # Business logic, validate
├── models/        # Sequelize models + associations
├── middlewares/   # Auth, role, error handler, logger, upload
├── jobs/          # SLA job chạy mỗi 60s
├── seed/          # Script seed dữ liệu mẫu
└── utils/         # AppError class
```

## Giả định

- Phân trang: limit mặc định 10, tối đa 100 để tránh truy vấn quá lớn.
- Mã căn hộ format `[A-Z][0-9]{3,4}` (VD: A101, B1234).
- SĐT: đúng 10 chữ số. Password: tối thiểu 6 ký tự.
- Notification chỉ lưu DB, không gửi thật.

## Checklist

| #   | Yêu cầu                     | Trạng thái | Lý do (nếu chưa xong) |
| --- | --------------------------- | ---------- | --------------------- |
| A1  | Xác thực & phân quyền       | hoàn thành |                       |
| A2  | Căn hộ & cư dân             | hoàn thành |                       |
| A3  | Yêu cầu (Request)           | hoàn thành |                       |
| A4  | Vòng đời trạng thái         | hoàn thành |                       |
| A5  | Phân công & xử lý đồng thời | hoàn thành |                       |
| A6  | SLA & leo thang             | hoàn thành |                       |
| A7  | Báo cáo cho manager         | hoàn thành |                       |
| A8  | Chất lượng kỹ thuật         | hoàn thành |                       |
| A9  | Kiểm thử Jest               | hoàn thành |                       |

## Những gì chưa làm được

- **A8 (Chất lượng kỹ thuật):**
  - **Chưa chuẩn hóa toàn bộ lỗi:** Nhiều chỗ trong service vẫn đang quăng `throw new Error(...)` thay vì dùng class `AppError` đã tạo. Việc này khiến API thỉnh thoảng trả về HTTP 500 thay vì 400 (Bad Request). Do không còn đủ thời gian test lại toàn bộ luồng nên quyết định để nguyên thay vì sửa vội vàng.
  - **Validate thủ công:** Hiện đang dùng các câu lệnh `if/else` thủ công để validate đầu vào thay vì dùng thư viện như Joi hay Zod.
  - **Thông báo Real-time (Socket.io/WebSockets):** Hiện tại thông báo (Notification) mới chỉ được lưu vào Database chứ chưa được đẩy theo thời gian thực (real-time) tới giao diện người dùng. Cần phải F5 mới thấy thông báo mới.
- **Lưu trữ Cloud (AWS S3 / Cloudinary):** Ảnh đính kèm hiện tại chỉ đang được lưu cục bộ (local) bằng Multer trong thư mục `uploads/` của server, chưa đẩy lên các dịch vụ lưu trữ đám mây.
- **Gửi Email / SMS:** Chưa tích hợp các dịch vụ bên thứ 3 (như SendGrid, Twilio) để gửi email hay tin nhắn cho cư dân khi sự cố được giải quyết.
- **CI/CD Pipeline:** Chưa thiết lập luồng tự động kiểm thử và triển khai (như Github Actions).
