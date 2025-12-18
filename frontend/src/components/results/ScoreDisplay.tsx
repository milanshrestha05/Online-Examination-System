import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, Clock, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  totalPoints: number;
  percentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
}

export const ScoreDisplay = ({
  score,
  totalPoints,
  percentage,
  correctAnswers,
  totalQuestions,
  timeTaken,
}: ScoreDisplayProps) => {
  const isPassed = percentage >= 60;
  const wrongAnswers = totalQuestions - correctAnswers;

  return (
    <div className="space-y-8">
      {/* Main Score Circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex flex-col items-center"
      >
        <div
          className={cn(
            'relative flex h-48 w-48 items-center justify-center rounded-full',
            isPassed
              ? 'bg-success/10 ring-4 ring-success/30'
              : 'bg-destructive/10 ring-4 ring-destructive/30'
          )}
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span
                className={cn(
                  'text-6xl font-bold',
                  isPassed ? 'text-success' : 'text-destructive'
                )}
              >
                {percentage}%
              </span>
            </motion.div>
            <p className="text-sm text-muted-foreground mt-1">
              {score}/{totalPoints} points
            </p>
          </div>
          <Trophy
            className={cn(
              'absolute -top-4 h-10 w-10',
              isPassed ? 'text-success' : 'text-muted-foreground'
            )}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-center"
        >
          <h2
            className={cn(
              'text-2xl font-bold',
              isPassed ? 'text-success' : 'text-destructive'
            )}
          >
            {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {isPassed
              ? 'You have passed the exam successfully.'
              : 'You need 60% to pass. Try again!'}
          </p>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50">
          <Target className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-xs text-muted-foreground">Total Points</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50">
          <CheckCircle className="h-6 w-6 text-success" />
          <span className="text-2xl font-bold">{correctAnswers}</span>
          <span className="text-xs text-muted-foreground">Correct</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50">
          <XCircle className="h-6 w-6 text-destructive" />
          <span className="text-2xl font-bold">{wrongAnswers}</span>
          <span className="text-xs text-muted-foreground">Wrong</span>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border/50">
          <Clock className="h-6 w-6 text-muted-foreground" />
          <span className="text-2xl font-bold">{timeTaken}</span>
          <span className="text-xs text-muted-foreground">Minutes</span>
        </div>
      </motion.div>
    </div>
  );
};
