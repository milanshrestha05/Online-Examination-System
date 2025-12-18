import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ScoreDisplay } from '@/components/results/ScoreDisplay';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Home, RotateCcw, BookOpen } from 'lucide-react';
import { ExamResult as ExamResultType, Exam } from '@/types/exam';
import { useState } from 'react';

const ExamResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, exam } = (location.state as { result: ExamResultType; exam: Exam }) || {};
  const [showReview, setShowReview] = useState(false);

  if (!result || !exam) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn onLogout={() => {}} />

      <main className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {!showReview ? (
            <Card className="border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Exam Complete!</CardTitle>
                <p className="text-muted-foreground">{exam.title}</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <ScoreDisplay
                  score={result.score}
                  totalPoints={result.totalPoints}
                  percentage={result.percentage}
                  correctAnswers={result.correctAnswers}
                  totalQuestions={result.totalQuestions}
                  timeTaken={result.timeTaken}
                />

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => setShowReview(true)}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Review Answers
                  </Button>
                  <Button variant="hero" onClick={() => navigate(`/exam/${exam.id}`)}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Review Answers</h1>
                  <p className="text-muted-foreground">{exam.title}</p>
                </div>
                <Button variant="outline" onClick={() => setShowReview(false)}>
                  Back to Results
                </Button>
              </div>

              <div className="space-y-6">
                {exam.questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                    totalQuestions={exam.totalQuestions}
                    selectedAnswer={result.answers[question.id] ?? null}
                    onSelectAnswer={() => {}}
                    showResult
                  />
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="hero" onClick={() => navigate(`/exam/${exam.id}`)}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry Exam
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ExamResult;
