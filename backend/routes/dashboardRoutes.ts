import { Router, Request, Response } from 'express';
import Exam from '../models/exam';
import Result from '../models/result';
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/* Get all exams */
router.get('/exams', verifyToken, async (req: Request, res: Response) => {
  try {
    const exams = await Exam.find().sort({ createdAt: -1 });
    res.status(200).json({ exams });
  } catch (error) {
    console.error('Fetch exams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* Get all results for logged-in user */
router.get('/results', verifyToken, async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const results = await Result.find({ userId }).sort({ completedAt: -1 });
    res.status(200).json({ results });
  } catch (error) {
    console.error('Fetch results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
