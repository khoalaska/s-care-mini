import express from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import {
  createRequest,
  getRequests,
  uploadImages,
  updateStatus,
  assignRequest,
} from "../controllers/RequestController.js";
import upload from "../middlewares/UploadMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("RESIDENT"),
  createRequest,
);
router.get(
  "/",
  authMiddleware,
  roleMiddleware("MANAGER", "RESIDENT", "TECHNICIAN"),
  getRequests,
);
router.post(
  "/:id/images",
  authMiddleware,
  roleMiddleware("RESIDENT"),
  upload.array("images", 3),
  uploadImages,
);
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("MANAGER", "RESIDENT", "TECHNICIAN"),
  updateStatus,
);
router.patch(
  "/:id/assign",
  authMiddleware,
  roleMiddleware("MANAGER"),
  assignRequest,
);

export default router;
