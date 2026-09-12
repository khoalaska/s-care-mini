import express from "express";
import { authMiddleware }   from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { createApartment } from "../controllers/ApartmentController.js";

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("MANAGER"), createApartment);

export default router;

