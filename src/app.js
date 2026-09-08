import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

export default app;