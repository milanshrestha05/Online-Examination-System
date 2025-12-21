import mongoose, { Schema, Document, Types } from "mongoose";

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  points?: number;
}

export interface IExam extends Document {
  title: string;
  description: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalPoints: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema<Question> = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 },
});

const ExamSchema: Schema<IExam> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true, default: 30 },
    totalQuestions: { type: Number, required: true, default: 0 },
    totalPoints: { type: Number, required: true, default: 100 },
    category: { type: String, required: true, default: "General" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    questions: { type: [QuestionSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IExam>("Exam", ExamSchema);
