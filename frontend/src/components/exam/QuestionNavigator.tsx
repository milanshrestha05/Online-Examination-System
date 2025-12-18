import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: Set<number>;
  onNavigate: (index: number) => void;
}

export const QuestionNavigator = ({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onNavigate,
}: QuestionNavigatorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">Questions</span>
        <span className="text-muted-foreground">
          {answeredQuestions.size}/{totalQuestions} answered
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isAnswered = answeredQuestions.has(i);
          const isCurrent = currentQuestion === i;

          return (
            <Button
              key={i}
              variant="outline"
              size="sm"
              onClick={() => onNavigate(i)}
              className={cn(
                'relative h-10 w-full font-mono text-sm transition-all',
                isCurrent && 'ring-2 ring-primary ring-offset-2',
                isAnswered && !isCurrent && 'bg-success/10 border-success/30 text-success'
              )}
            >
              {isAnswered && (
                <Check className="absolute top-0.5 right-0.5 h-3 w-3 text-success" />
              )}
              {i + 1}
            </Button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border-2 border-primary" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-success/20 border border-success/30" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-border" />
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};
