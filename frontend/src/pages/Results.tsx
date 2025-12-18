import { Header } from '@/components/layout/Header';
import { ResultCard } from '@/components/results/ResultCard';
import { mockResults } from '@/data/mockExams';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award } from 'lucide-react';

const Results = () => {
  const averageScore = Math.round(
    mockResults.reduce((acc, r) => acc + r.percentage, 0) / mockResults.length || 0
  );
  const totalExams = mockResults.length;
  const passedExams = mockResults.filter((r) => r.percentage >= 60).length;

  const stats = [
    {
      icon: Trophy,
      label: 'Average Score',
      value: `${averageScore}%`,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: TrendingUp,
      label: 'Exams Taken',
      value: totalExams,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Award,
      label: 'Passed',
      value: `${passedExams}/${totalExams}`,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn onLogout={() => {}} />

      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Results</h1>
          <p className="text-muted-foreground">
            Track your exam history and performance over time
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-12"
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

        {/* Results Grid */}
        {mockResults.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {mockResults.map((result, i) => (
              <ResultCard key={result.id} result={result} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-muted-foreground">
              No exam results yet. Take an exam to see your results here.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;
