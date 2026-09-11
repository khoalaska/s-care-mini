import express from "express";
import { register } from "../controllers/AuthController.js";
import { login } from "../controllers/AuthController.js";
import { authMiddleware }   from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/RoleMiddleware.js";
import { createTechnician } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register); 

router.post("/technician", authMiddleware, roleMiddleware("MANAGER"), createTechnician );

router.post("/login", login);



router.get("/me", authMiddleware, (req, res) =>{
    res.json(req.user);
});

export default router;