import express from "express";
import { register } from "../controllers/AuthController.js";
import { login } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/register", register); 

router.post("/login", login);

export default router;