import { ExamResult } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: ExamResult;
  index?: number;
}

export const ResultCard = ({ result, index = 0 }: ResultCardProps) => {
  const isPassed = result.percentage >= 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="border-border/50 bg-card hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold">
                {result.examTitle}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {new Date(result.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <Badge
              className={cn(
                'shrink-0',
                isPassed
                  ? 'bg-success/10 text-success border-success/20'
                  : 'bg-destructive/10 text-destructive border-destructive/20'
              )}
              variant="outline"
            >
              {isPassed ? 'Passed' : 'Failed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Score</span>
              <span className="font-semibold">{result.percentage}%</span>
            </div>
            <Progress
              value={result.percentage}
              className={cn(
                'h-2',
                isPassed ? '[&>div]:bg-success' : '[&>div]:bg-destructive'
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/50">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-lg font-bold">{result.score}</span>
              <span className="text-xs text-muted-foreground">Points</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/50">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-lg font-bold">{result.correctAnswers}</span>
              <span className="text-xs text-muted-foreground">Correct</span>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-secondary/50">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold">{result.timeTaken}</span>
              <span className="text-xs text-muted-foreground">Minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
