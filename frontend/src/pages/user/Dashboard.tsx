import { Header } from '@/components/layout/Header';
import { ExamCard } from '@/components/exam/ExamCard';
import { ResultCard } from '@/components/results/ResultCard';
import { mockExams, mockResults } from '@/data/mockExams';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const availableExams = mockExams.filter((e) => e.isActive).slice(0, 3);
  const recentResults = mockResults.slice(0, 2);

  const stats = [
    {
      icon: BookOpen,
      label: 'Available Exams',
      value: mockExams.filter((e) => e.isActive).length,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Trophy,
      label: 'Exams Completed',
      value: mockResults.length,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      label: 'Average Score',
      value: `${Math.round(mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length || 0)}%`,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Clock,
      label: 'Total Time',
      value: `${mockResults.reduce((acc, r) => acc + r.timeTaken, 0)} min`,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn onLogout={() => {}} />

      <main className="container py-8">
        {/* Welcome Section */}
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

        {/* Stats Grid */}
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
            {availableExams.map((exam, i) => (
              <ExamCard key={exam.id} exam={exam} index={i} />
            ))}
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
            {recentResults.map((result, i) => (
              <ResultCard key={result.id} result={result} index={i} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
