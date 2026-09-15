import express from "express";
import { authMiddleware }   from "../middlewares/AuthMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { createApartment, getApartments, updateApartment, deleteApartment } from "../controllers/ApartmentController.js";

const router = express.Router();

router.post("/create", authMiddleware, roleMiddleware("MANAGER"), createApartment);
router.get("/", authMiddleware, roleMiddleware("MANAGER"), getApartments);
router.delete("/:id", authMiddleware, roleMiddleware("MANAGER"), deleteApartment);

router.patch(
    "/:id",
    authMiddleware,
    roleMiddleware("MANAGER"),
    updateApartment
);

export default router;



