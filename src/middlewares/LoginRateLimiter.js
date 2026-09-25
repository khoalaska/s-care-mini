import { rateLimit } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Thêm dòng này để chỉ đếm số lần đăng nhập sai
  message: {
    message: "Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.",
  },
});
