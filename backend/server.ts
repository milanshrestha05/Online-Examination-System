import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import feedbackRoutes from "./routes/FeedbackRoutes";

dotenv.config();

const app = express();

/* =========================
   Middleware
========================= */
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());

/* =========================
   Routes
========================= */
app.use("/api/auth", authRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/feedback", feedbackRoutes);

/* Health Check */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "API running" });
});

/* 404 Handler */
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

/* Global Error Handler */
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

/* =========================
   Connect to DB & Start Server
========================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
