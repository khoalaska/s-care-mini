import express from "express";
import { authMiddleware }   from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { createRequest,
    getRequests,
    uploadImages
 } from "../controllers/RequestController.js";
 import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("RESIDENT"), createRequest);
router.get("/", authMiddleware, roleMiddleware("MANAGER", "RESIDENT", "TECHNICIAN"), getRequests);
router.post("/:id/images", authMiddleware, roleMiddleware("RESIDENT"), upload.array("images", 3), uploadImages);


export default router;
