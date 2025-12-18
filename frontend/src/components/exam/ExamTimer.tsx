import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamTimerProps {
  duration: number; // in minutes
  onTimeUp: () => void;
  isPaused?: boolean;
}

export const ExamTimer = ({ duration, onTimeUp, isPaused = false }: ExamTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (duration * 60)) * 100;

  const isLow = percentage < 20;
  const isWarning = percentage < 50 && percentage >= 20;

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold transition-colors',
        isLow && 'bg-destructive/10 text-destructive animate-pulse',
        isWarning && 'bg-warning/10 text-warning',
        !isLow && !isWarning && 'bg-secondary text-secondary-foreground'
      )}
    >
      <Clock className="h-5 w-5" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
