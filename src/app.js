import express from "express";
import authRoutes from "./routes/AuthRoutes.js";
import apartmentRoutes from "./routes/ApartmentRoutes.js";
import requestRoutes from "./routes/RequestRoutes.js";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/requests", requestRoutes);
app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

export default app;
