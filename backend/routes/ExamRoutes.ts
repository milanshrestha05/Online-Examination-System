import { Router, Request, Response } from "express";
import Exam from "../models/exam";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/* =========================
   Public / Protected Endpoints
========================= */

/**
 * GET /api/exams
 * Fetch all active exams (summary only)
 */
router.get("/", verifyToken, async (_req: Request, res: Response) => {
  try {
    // Only select summary fields for listing
    const exams = await Exam.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("_id title description category difficulty duration totalQuestions totalPoints isActive");

    res.status(200).json(exams);
  } catch (error) {
    console.error("Fetch exams error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/exams/:id
 * Fetch single exam by ID (including questions)
 */
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("Fetch exam by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/exams
 * Create a new exam (admin only)
 */
router.post("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    console.error("Create exam error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/exams/:id
 * Update an existing exam (admin only)
 */
router.put("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.status(200).json(exam);
  } catch (error) {
    console.error("Update exam error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/exams/:id
 * Delete an exam (admin only)
 */
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    console.error("Delete exam error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PATCH /api/exams/:id/toggle
 * Toggle exam active/inactive (admin only)
 */
router.patch("/:id/toggle", verifyToken, async (req: Request, res: Response) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    exam.isActive = !exam.isActive;
    await exam.save();

    res.status(200).json(exam);
  } catch (error) {
    console.error("Toggle exam error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
