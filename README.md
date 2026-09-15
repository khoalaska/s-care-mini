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

## Những gì chưa làm được

- **A7 — Báo cáo:** Ưu tiên hoàn thành A1–A6 trước vì là phần nghiệp vụ chính. Khi xong thì không còn đủ thời gian cho phần query thống kê.
- **A8 — Sót lỗi nhỏ:** Một số chỗ trong service còn dùng `throw new Error()` thay vì `throw new AppError()` → client nhận 500 thay vì 400.
- **Phần B:** Chưa làm do Phần A chưa xong 100%.
