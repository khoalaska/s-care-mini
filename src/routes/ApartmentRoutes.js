import express from "express";
import { authMiddleware }   from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { createApartment, getApartments, updateApartment } from "../controllers/ApartmentController.js";

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("MANAGER"), createApartment);
router.get("/", authMiddleware, roleMiddleware("MANAGER"), getApartments);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("MANAGER"),
    updateApartment
);

export default router;



