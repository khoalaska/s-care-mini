import express from "express";
import authRoutes from "./routes/AuthRoutes.js";
import apartmentRoutes from "./routes/ApartmentRoutes.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/apartments", apartmentRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

export default app;