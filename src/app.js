import express from "express";
import authRoutes from "./routes/AuthRoutes.js";
import apartmentRoutes from "./routes/ApartmentRoutes.js";
import requestRoutes from "./routes/RequestRoutes.js";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import reportRoutes from "./routes/ReportRoutes.js";

const app = express();
app.use(requestLogger);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/apartments", apartmentRoutes);
app.use("/requests", requestRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/test", (req, res) => {
  res.json({
    message: "app is working",
  });
});

app.use("/reports", reportRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});
app.use(errorMiddleware);

export default app;
