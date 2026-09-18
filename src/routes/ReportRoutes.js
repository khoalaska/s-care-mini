import express from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { getRequestReport } from "../controllers/ReportController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Report route is working",
  });
});

router.get(
  "/requests",
  authMiddleware,
  roleMiddleware("MANAGER"),
  getRequestReport,
);

export default router;
