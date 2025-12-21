import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ExamCard } from '@/components/exam/ExamCard';
import { ResultCard } from '@/components/results/ResultCard';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Exam, ExamResult } from '@/types/exam';

const Dashboard = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [examsRes, resultsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/exams`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/api/results`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!examsRes.ok) throw new Error('Failed to fetch exams');
        if (!resultsRes.ok) throw new Error('Failed to fetch results');

        const examsData = await examsRes.json();
        const resultsData = await resultsRes.json();

        // Transform exams data safely
        setExams(
          (examsData.exams || []).map((e: unknown) => {
            const exam = e as Partial<Exam>;
            return {
              id: exam.id || '',
              title: exam.title || 'Untitled Exam',
              description: exam.description || '',
              duration: exam.duration || 30,
              totalQuestions: exam.totalQuestions || (exam.questions?.length ?? 0),
              totalPoints: exam.totalPoints || 100,
              category: exam.category || 'General',
              difficulty: (exam.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
              questions: exam.questions || [],
              createdAt: exam.createdAt || new Date().toISOString(),
              isActive: exam.isActive ?? true,
            } as Exam;
          })
        );

        // Transform results data safely
        setResults(
          (resultsData.results || []).map((r: unknown) => {
            const result = r as Partial<ExamResult>;
            return {
              id: result.id || '',
              examId: result.examId || result.id || '',
              examTitle: result.examTitle || 'Unknown Exam',
              score: result.score || Math.round(result.percentage || 0),
              totalPoints: result.totalPoints || 100,
              percentage: result.percentage || 0,
              correctAnswers: result.correctAnswers || 0,
              totalQuestions: result.totalQuestions || 0,
              timeTaken: result.timeTaken || 0,
              completedAt: result.completedAt || new Date().toISOString(),
              answers: result.answers || {},
            } as ExamResult;
          })
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Failed to load dashboard');
        }
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BACKEND_URL, token]);

  const availableExams = exams.filter((e) => e.isActive).slice(0, 3);
  const recentResults = results.slice(0, 2);

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
      value: `${Math.round(results.reduce((acc, r) => acc + r.score, 0) / (results.length || 1))}%`,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: `${results.reduce((acc, r) => acc + r.timeTaken, 0)} min`,
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
      <Header isLoggedIn onLogout={() => localStorage.removeItem('token')} />

      <main className="container py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Student!</h1>
          <p className="text-muted-foreground">Track your progress and continue your learning journey.</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((stat, i) => (
            <div key={i} className="p-5 rounded-xl bg-card border border-border/50 hover:shadow-md transition-shadow">
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
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
              <p className="text-sm text-muted-foreground">Start a new exam to test your knowledge</p>
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
              <p className="text-muted-foreground">No active exams available.</p>
            ) : (
              availableExams.map((exam, i) => <ExamCard key={exam.id} exam={exam} index={i} />)
            )}
          </div>
        </section>

        {/* Recent Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Recent Results</h2>
              <p className="text-sm text-muted-foreground">Your latest exam performances</p>
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
              recentResults.map((result, i) => <ResultCard key={result.id} result={result} index={i} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
