import mongoose, { Schema, Document, Types } from "mongoose";

/* ---------------- Exam Answer Interface ---------------- */
export interface ExamAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

/* ---------------- Result Interface ---------------- */
export interface IResult extends Document {
  userId: Types.ObjectId;
  examId: Types.ObjectId;
  examTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number; // in minutes
  completedAt: Date;
  answers: ExamAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

/* ---------------- Exam Answer Schema ---------------- */
const ExamAnswerSchema: Schema<ExamAnswer> = new Schema({
  questionId: { type: String, required: true },
  selectedAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  pointsEarned: { type: Number, required: true, default: 0 },
});

/* ---------------- Result Schema ---------------- */
const ResultSchema: Schema<IResult> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    examTitle: { type: String, required: true },
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 100 },
    percentage: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    completedAt: { type: Date, default: Date.now },
    answers: { type: [ExamAnswerSchema], default: [] },
  },
  { timestamps: true }
);

/* ---------------- Export Model ---------------- */
export default mongoose.model<IResult>("Result", ResultSchema);
