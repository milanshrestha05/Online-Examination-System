import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();

/* Middleware */
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());

/* Routes */
app.use("/api/auth", authRoutes);

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

const PORT = process.env.PORT || 5000;

/* Start Server After DB Connect */
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
