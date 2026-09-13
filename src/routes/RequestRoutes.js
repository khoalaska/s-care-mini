import express from "express";
import { authMiddleware }   from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { createRequest,
    getRequests
 } from "../controllers/RequestController.js";

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("RESIDENT"), createRequest);
router.get("/", authMiddleware, roleMiddleware("MANAGER", "RESIDENT", "TECHNICIAN"), getRequests);

export default router;
