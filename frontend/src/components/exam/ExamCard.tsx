import { Exam } from '@/types/exam';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, FileQuestion, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ExamCardProps {
  exam: Exam;
  index?: number;
}

const difficultyColors = {
  easy: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  hard: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const ExamCard = ({ exam, index = 0 }: ExamCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-[0.02] transition-opacity" />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                {exam.title}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {exam.category}
              </Badge>
            </div>
            <Badge
              variant="outline"
              className={`capitalize shrink-0 ${difficultyColors[exam.difficulty]}`}
            >
              {exam.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-sm line-clamp-2">
            {exam.description}
          </CardDescription>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{exam.duration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileQuestion className="h-4 w-4" />
              <span>{exam.totalQuestions} questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4" />
              <span>{exam.totalPoints} pts</span>
            </div>
          </div>

          <Link to={`/exam/${exam.id}`}>
            <Button className="w-full group/btn" variant="default">
              Start Exam
              <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
};
