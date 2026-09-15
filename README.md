# S-Care Mini

Hệ thống tiếp nhận & xử lý yêu cầu cư dân tòa nhà.

## Cách chạy

```bash
git clone https://github.com/khoalaska/s-care-mini.git
cd s-care-mini
docker compose up --build
```

App chạy tại `http://localhost:3000`. Tài liệu API: import file `s-care-mini.postman_collection.json` vào Postman.

### Tài khoản mẫu (password: 123456)

| Vai trò    | SĐT                     |
| ---------- | ----------------------- |
| MANAGER    | 0900000001              |
| TECHNICIAN | 0900000002, 0900000003  |
| RESIDENT   | 0900000004 → 0900000008 |

Seed tạo sẵn 10 căn hộ, 20 yêu cầu ở nhiều trạng thái, lịch sử và notification mẫu.

## Sơ đồ kiến trúc

```
Request → requestLogger → express.json() → Route → authMiddleware (JWT) → roleMiddleware → Controller → Service → Model → MySQL
                                                                                                                        │
Response ← errorMiddleware (xử lý lỗi tập trung) ← Controller ← Service ←─────────────────────────────────────────────┘
```

```
src/
├── routes/        # Khai báo endpoint + gắn middleware
├── controllers/   # Nhận request, gọi service, trả response
├── services/      # Business logic, validate
├── models/        # Sequelize models + associations
├── middlewares/    # Auth, role, error handler, logger, upload
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

| #   | Yêu cầu                     | Trạng thái      | Lý do (nếu chưa xong)              |
| --- | --------------------------- | --------------- | ---------------------------------- |
| A1  | Xác thực & phân quyền       | hoàn thành      |                                    |
| A2  | Căn hộ & cư dân             | hoàn thành      |                                    |
| A3  | Yêu cầu (Request)           | hoàn thành      |                                    |
| A4  | Vòng đời trạng thái         | hoàn thành      |                                    |
| A5  | Phân công & xử lý đồng thời | hoàn thành      |                                    |
| A6  | SLA & leo thang             | hoàn thành      |                                    |
| A7  | Báo cáo cho manager         | chưa hoàn thành | ưu tiên A1–A6 trước, hết thời gian |
| A8  | Chất lượng kỹ thuật         | hoàn thành      |                                    |
| A9  | Kiểm thử Jest               | hoàn thành      |                                    |

## Những gì chưa làm được (Thành thật khai báo)

- **A7 (Báo cáo thống kê):** Do dồn thời gian xử lý các logic chính (vòng đời yêu cầu, xử lý đồng thời, SLA) nên chưa kịp làm phần này. Dữ liệu và bảng cơ sở đã có đủ nhưng chưa viết query tổng hợp thống kê.
- **A8 (Chất lượng kỹ thuật):**
  - **Chưa chuẩn hóa toàn bộ lỗi:** Nhiều chỗ trong service vẫn đang quăng `throw new Error(...)` thay vì dùng class `AppError` đã tạo. Việc này khiến API thỉnh thoảng trả về HTTP 500 thay vì 400 (Bad Request). Do không còn đủ thời gian test lại toàn bộ luồng nên quyết định để nguyên thay vì sửa vội vàng.
  - **Validate thủ công:** Hiện đang dùng các câu lệnh `if/else` thủ công để validate đầu vào thay vì dùng thư viện như Joi hay Zod.
- **Phần B (Nâng cao):** Bỏ qua hoàn toàn do chưa hoàn thành 100% Phần A.
