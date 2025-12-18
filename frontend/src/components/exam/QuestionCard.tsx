import { Question } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (answer: number) => void;
  showResult?: boolean;
}

export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult = false,
}: QuestionCardProps) => {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-mono">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            <Badge variant="outline" className="font-medium">
              {question.points} pts
            </Badge>
          </div>
          <CardTitle className="text-xl font-medium leading-relaxed pt-4">
            {question.text}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => onSelectAnswer(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = showResult && index === question.correctAnswer;
              const isWrong = showResult && isSelected && index !== question.correctAnswer;

              return (
                <div
                  key={index}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg border p-4 transition-all cursor-pointer hover:bg-accent/50',
                    isSelected && !showResult && 'border-primary bg-primary/5',
                    isCorrect && 'border-success bg-success/10',
                    isWrong && 'border-destructive bg-destructive/10'
                  )}
                  onClick={() => !showResult && onSelectAnswer(index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    disabled={showResult}
                    className={cn(
                      isCorrect && 'border-success text-success',
                      isWrong && 'border-destructive text-destructive'
                    )}
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className={cn(
                      'flex-1 cursor-pointer text-base',
                      isCorrect && 'text-success font-medium',
                      isWrong && 'text-destructive'
                    )}
                  >
                    {option}
                  </Label>
                  {isCorrect && (
                    <Badge className="bg-success text-success-foreground">
                      Correct
                    </Badge>
                  )}
                  {isWrong && (
                    <Badge variant="destructive">
                      Wrong
                    </Badge>
                  )}
                </div>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>
    </motion.div>
  );
};
