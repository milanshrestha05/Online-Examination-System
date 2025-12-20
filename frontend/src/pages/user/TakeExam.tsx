import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { mockExams } from '@/data/mockExams';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, AlertTriangle } from 'lucide-react';
import { ExamResult } from '@/types/exam';

const TakeExam = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const exam = mockExams.find((e) => e.id === id);

  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime] = useState(Date.now());

  const answeredQuestions = useMemo(
    () => new Set(Object.keys(answers).map((k) => exam?.questions.findIndex((q) => q.id === k) ?? -1)),
    [answers, exam]
  );

  const handleSelectAnswer = useCallback(
    (answer: number) => {
      if (!exam) return;
      const questionId = exam.questions[currentQuestion].id;
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    },
    [currentQuestion, exam]
  );

  const handleSubmit = useCallback(() => {
    if (!exam) return;

    const timeTaken = Math.round((Date.now() - startTime) / 60000);
    let score = 0;
    let correctAnswers = 0;

    exam.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score += q.points;
        correctAnswers++;
      }
    });

    const result: ExamResult = {
      id: crypto.randomUUID(),
      examId: exam.id,
      examTitle: exam.title,
      score,
      totalPoints: exam.totalPoints,
      percentage: Math.round((score / exam.totalPoints) * 100),
      correctAnswers,
      totalQuestions: exam.totalQuestions,
      timeTaken: Math.max(1, timeTaken),
      completedAt: new Date().toISOString(),
      answers,
    };

    // In a real app, save to database
    navigate('/exam-result', { state: { result, exam } });
  }, [exam, answers, startTime, navigate]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (!exam) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Exam not found</h1>
          <Button onClick={() => navigate('/exams')}>Back to Exams</Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-border/50">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                  <Flag className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{exam.title}</CardTitle>
                <p className="text-muted-foreground mt-2">{exam.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{exam.duration}</div>
                    <div className="text-sm text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center border-x border-border">
                    <div className="text-2xl font-bold">{exam.totalQuestions}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{exam.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Points</div>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-2 text-warning font-medium">
                    <AlertTriangle className="h-5 w-5" />
                    Important Instructions
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Once started, the timer cannot be paused</li>
                    <li>• You can navigate between questions freely</li>
                    <li>• Make sure to review all answers before submitting</li>
                    <li>• The exam will auto-submit when time runs out</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => navigate('/exams')} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="hero" onClick={() => setStarted(true)} className="flex-1">
                    Start Exam
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestion];
  const progress = (answeredQuestions.size / exam.totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Exam Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold truncate">{exam.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <ExamTimer duration={exam.duration} onTimeUp={handleTimeUp} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Submit Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have answered {answeredQuestions.size} out of {exam.totalQuestions} questions.
                    {answeredQuestions.size < exam.totalQuestions && (
                      <span className="block mt-2 text-warning">
                        Warning: You have {exam.totalQuestions - answeredQuestions.size} unanswered
                        questions.
                      </span>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>Submit Now</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="h-1">
          <Progress value={progress} className="h-full rounded-none" />
        </div>
      </header>

      <main className="container py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Question Area */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <QuestionCard
                key={currentQ.id}
                question={currentQ}
                questionNumber={currentQuestion + 1}
                totalQuestions={exam.totalQuestions}
                selectedAnswer={answers[currentQ.id] ?? null}
                onSelectAnswer={handleSelectAnswer}
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {exam.totalQuestions}
              </span>
              <Button
                onClick={() =>
                  setCurrentQuestion((prev) => Math.min(exam.totalQuestions - 1, prev + 1))
                }
                disabled={currentQuestion === exam.totalQuestions - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-24 border-border/50">
              <CardContent className="pt-6">
                <QuestionNavigator
                  totalQuestions={exam.totalQuestions}
                  currentQuestion={currentQuestion}
                  answeredQuestions={answeredQuestions}
                  onNavigate={setCurrentQuestion}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TakeExam;
