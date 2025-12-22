// types/exam.ts

/* ---------------- Question ---------------- */
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

/* ---------------- Full Exam ---------------- */
export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalPoints: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdAt: string;
  isActive: boolean;
}

/* ---------------- Exam List Item (Summary for User) ---------------- */
export interface ExamListItem {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  totalPoints: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  questions?: Question[];
}

/* ---------------- Exam Result ---------------- */
export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  completedAt: string;
  answers: Record<string, number>;
}

/* ---------------- User ---------------- */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
}
