import { Router, Request, Response } from "express";
import User from "../models/user";
import { Feedback } from "../models/feedback"; 
import Result from "../models/result";

const router = Router();

/* =========================
   Public Endpoints
========================= */

/* Stats */
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const activeStudents = await User.countDocuments({ isStudent: true });
    const totalExams = await Result.distinct("examId").countDocuments(); // optional
    const totalResults = await Result.countDocuments();
    const passedResults = await Result.countDocuments({ percentage: { $gte: 50 } });
    const successRate = totalResults ? Math.round((passedResults / totalResults) * 100) : 0;

    const stats = [
      { value: activeStudents, label: "Active Students", suffix: "+" },
      { value: totalExams, label: "Exams Created", suffix: "+" },
      { value: successRate, label: "Success Rate", suffix: "%" },
      { value: 24, label: "Availability", suffix: "/7" }, 
    ];

    res.status(200).json({ stats });
  } catch (error) {
    console.error("Fetch stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* Testimonials */
router.get("/testimonials", async (_req: Request, res: Response) => {
  try {
    const testimonials = await Feedback.find();
    res.status(200).json({ testimonials });
  } catch (error) {
    console.error("Fetch testimonials error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
