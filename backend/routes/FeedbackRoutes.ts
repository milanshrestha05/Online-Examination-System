import { Router, Request, Response } from "express";
import { Feedback } from "../models/feedback";

const router = Router();

/**
 * POST /api/feedback
 * Save feedback
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, role, email, quote, rating } = req.body;

    if (!name || !role || !email || !quote || !rating) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      name,
      role,
      email,
      quote,
      rating,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

/**
 * GET /api/feedback
 * Fetch feedback (testimonials)
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch feedback" });
  }
});

export default router;
