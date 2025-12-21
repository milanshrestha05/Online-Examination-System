import mongoose, { Schema, Document, Model } from "mongoose";

/* ---------------- Question Interface ---------------- */
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

/* ---------------- Exam Interface ---------------- */
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

/* ---------------- Question Schema ---------------- */
const QuestionSchema: Schema<Question> = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  points: { type: Number, required: true, default: 1 },
});

/* ---------------- Exam Schema ---------------- */
const ExamSchema: Schema<IExam> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true, default: 30 },
    totalQuestions: { type: Number, required: true, default: 0 },
    totalPoints: { type: Number, required: true, default: 0 },
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

/* ---------------- Pre-save Hook ---------------- */
// Automatically update totalQuestions and totalPoints based on questions
ExamSchema.pre("save", function (this: IExam) {
  this.totalQuestions = this.questions.length;
  this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 1), 0);
});

/* ---------------- Export Model ---------------- */
const Exam: Model<IExam> = mongoose.model<IExam>("Exam", ExamSchema);
export default Exam;
