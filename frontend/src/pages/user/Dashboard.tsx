import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { Header } from '@/components/layout/Header';
import { ExamCard } from '@/components/exam/ExamCard';
import { ResultCard } from '@/components/results/ResultCard';
import { Button } from '@/components/ui/button';
import { Exam, ExamResult } from '@/types/exam';

const Dashboard = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const [examsRes, resultsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/exams`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/api/results`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!examsRes.ok) {
          const msg = await examsRes.text();
          throw new Error(msg || 'Failed to fetch exams');
        }

        if (!resultsRes.ok) {
          const msg = await resultsRes.text();
          throw new Error(msg || 'Failed to fetch results');
        }

        const examsData = await examsRes.json();
        const resultsData = await resultsRes.json();

        setExams(
          (examsData.exams || []).map((e: Partial<Exam>): Exam => ({
            id: e.id ?? '',
            title: e.title ?? 'Untitled Exam',
            description: e.description ?? '',
            duration: e.duration ?? 30,
            totalQuestions: e.totalQuestions ?? e.questions?.length ?? 0,
            totalPoints: e.totalPoints ?? 100,
            category: e.category ?? 'General',
            difficulty: e.difficulty ?? 'medium',
            questions: e.questions ?? [],
            createdAt: e.createdAt ?? new Date().toISOString(),
            isActive: e.isActive ?? true,
          }))
        );

        setResults(
          (resultsData.results || []).map((r: Partial<ExamResult>): ExamResult => ({
            id: r.id ?? '',
            examId: r.examId ?? '',
            examTitle: r.examTitle ?? 'Unknown Exam',
            score: r.score ?? 0,
            totalPoints: r.totalPoints ?? 100,
            percentage: r.percentage ?? 0,
            correctAnswers: r.correctAnswers ?? 0,
            totalQuestions: r.totalQuestions ?? 0,
            timeTaken: r.timeTaken ?? 0,
            completedAt: r.completedAt ?? new Date().toISOString(),
            answers: r.answers ?? {},
          }))
        );
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL, token, navigate]);

  /* -------------------- Derived Data -------------------- */

  const availableExams = useMemo(
    () => exams.filter((e) => e.isActive).slice(0, 3),
    [exams]
  );

  const recentResults = useMemo(
    () =>
      [...results]
        .sort(
          (a, b) =>
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
        )
        .slice(0, 2),
    [results]
  );

  const averageScore = useMemo(() => {
    if (results.length === 0) return '0%';
    const avg =
      results.reduce((acc, r) => acc + r.percentage, 0) / results.length;
    return `${Math.round(avg)}%`;
  }, [results]);

  const totalTimeMinutes = useMemo(() => {
    const totalSeconds = results.reduce((acc, r) => acc + r.timeTaken, 0);
    return Math.round(totalSeconds / 60);
  }, [results]);

  const stats = [
    {
      icon: BookOpen,
      label: 'Available Exams',
      value: exams.filter((e) => e.isActive).length,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Trophy,
      label: 'Exams Completed',
      value: results.length,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: averageScore,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: `${totalTimeMinutes} min`,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn
        onLogout={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}
      />

      <main className="container py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
          <p className="text-muted-foreground">
            Track your progress and continue your learning journey.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-card border border-border/50 hover:shadow-md transition-shadow"
            >
              <div
                className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Available Exams */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Available Exams</h2>
              <p className="text-sm text-muted-foreground">
                Start a new exam to test your knowledge
              </p>
            </div>
            <Link to="/exams">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExams.length === 0 ? (
              <p className="text-muted-foreground">
                No active exams available.
              </p>
            ) : (
              availableExams.map((exam, i) => (
                <ExamCard key={exam.id} exam={exam} index={i} />
              ))
            )}
          </div>
        </section>

        {/* Recent Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Recent Results</h2>
              <p className="text-sm text-muted-foreground">
                Your latest exam performances
              </p>
            </div>
            <Link to="/results">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recentResults.length === 0 ? (
              <p className="text-muted-foreground">No recent results.</p>
            ) : (
              recentResults.map((result, i) => (
                <ResultCard key={result.id} result={result} index={i} />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
