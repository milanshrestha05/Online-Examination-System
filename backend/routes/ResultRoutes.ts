import { Router, Request, Response } from "express";
import Result from "../models/result";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/* =========================
   Protected Endpoints
========================= */

/* Get all results for logged-in user */
router.get("/", verifyToken, async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const results = await Result.find({ userId }).sort({ completedAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    console.error("Fetch results error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* Get a specific result by ID (optional) */
router.get("/:id", verifyToken, async (req: any, res: Response) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) return res.status(404).json({ message: "Result not found" });
    res.status(200).json(result);
  } catch (error) {
    console.error("Fetch result by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
