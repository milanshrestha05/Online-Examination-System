import { Router, Request, Response } from 'express';
import Exam from '../models/exam';
import Result from '../models/result';
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

/* =========================
   Hardcoded Stats & Testimonials
========================= */
const stats = [
  { value: 10000, label: 'Active Students', suffix: '+' },
  { value: 500, label: 'Exams Created', suffix: '+' },
  { value: 98, label: 'Success Rate', suffix: '%' },
  { value: 24, label: 'Availability', suffix: '/7' },
];

const testimonials = [
  {
    name: 'Aarav Patel',
    role: 'Computer Science Student',
    quote: 'ExamPro completely changed how I prepare for exams. The instant feedback is a game changer.',
  },
  {
    name: 'Sarah Johnson',
    role: 'University Lecturer',
    quote: 'Creating and managing exams is incredibly smooth. My students love the experience.',
  },
  {
    name: 'Mohammed Ali',
    role: 'Engineering Student',
    quote: 'The analytics helped me identify weak areas and improve quickly.',
  },
];

/* =========================
   Public Endpoints
========================= */

/* Stats */
router.get('/stats', (_req: Request, res: Response) => {
  res.status(200).json(stats);
});

/* Testimonials */
router.get('/testimonials', (_req: Request, res: Response) => {
  res.status(200).json(testimonials);
});

/* =========================
   Protected Endpoints
========================= */

/* Get all exams */
router.get('/exams', verifyToken, async (_req: Request, res: Response) => {
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
