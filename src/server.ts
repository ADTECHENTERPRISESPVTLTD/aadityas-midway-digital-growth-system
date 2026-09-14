import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db";
import { errorHandler, notFound } from "./middleware/error";
import {
  authRoutes, menuRoutes, orderRoutes, bookingRoutes,
  offerRoutes, customerRoutes, reviewRoutes, analyticsRoutes, adminRoutes
} from "./routes";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({
  origin: process.env.CLIENT_URL?.split(",") || true,
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Aaditya's Midway API is running",
    version: "1.0.0"
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });
