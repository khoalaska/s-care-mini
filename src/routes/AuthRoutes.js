import express from "express";
import { register } from "../controllers/AuthController.js";
import { login } from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { createTechnician, getTechnicians } from "../controllers/AuthController.js";
import { refreshAccessToken } from "../controllers/AuthController.js";
import { loginRateLimiter } from "../middlewares/LoginRateLimiter.js";

const router = express.Router();

router.post("/register", register);

router.post(
  "/technician",
  authMiddleware,
  roleMiddleware("MANAGER"),
  createTechnician,
);

router.post("/login", loginRateLimiter, login);
router.post("/refresh", refreshAccessToken);

router.get("/me", authMiddleware, (req, res) => {
  res.json(req.user);
});

router.get("/technicians", authMiddleware, roleMiddleware("MANAGER"), getTechnicians);

export default router;
