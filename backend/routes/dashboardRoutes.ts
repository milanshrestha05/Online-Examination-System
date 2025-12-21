import { Router, Request, Response } from "express";
import Exam from "../models/exam";
import Result from "../models/result";
import User from "../models/user";
import { Feedback } from "../models/feedback"; // Import Feedback model
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/* =========================
   Public Endpoints
========================= */

/* Stats */
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    // Count active students
    const activeStudents = await User.countDocuments({ isStudent: true });

    // Count total exams
    const totalExams = await Exam.countDocuments();

    // Calculate success rate: % of results with >= 50% score
    const totalResults = await Result.countDocuments();
    const passedResults = await Result.countDocuments({ percentage: { $gte: 50 } });
    const successRate = totalResults ? Math.round((passedResults / totalResults) * 100) : 0;

    const stats = [
      { value: activeStudents, label: "Active Students", suffix: "+" },
      { value: totalExams, label: "Exams Created", suffix: "+" },
      { value: successRate, label: "Success Rate", suffix: "%" },
      { value: 24, label: "Availability", suffix: "/7" }, // static
    ];

    // Return stats object to match frontend expectations
    res.status(200).json({ stats });
  } catch (error) {
    console.error("Fetch stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* Testimonials */
router.get("/testimonials", async (_req: Request, res: Response) => {
  try {
    // Fetch testimonials from the Feedback collection
    const testimonials = await Feedback.find();
    res.status(200).json({ testimonials });
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================
   Protected Endpoints
========================= */

/* Get all exams */
router.get("/exams", verifyToken, async (_req: Request, res: Response) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.status(200).json({ exams });
  } catch (error) {
    console.error("Fetch exams error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* Get all results for logged-in user */
router.get("/results", verifyToken, async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const results = await Result.find({ userId }).sort({ completedAt: -1 });
    res.status(200).json({ results });
  } catch (error) {
    console.error("Fetch results error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
