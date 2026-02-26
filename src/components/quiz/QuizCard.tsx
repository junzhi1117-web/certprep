import type { Question } from '../../data/types';
import type { AnswerState } from '../../hooks/useQuizSession';
import { AnswerOption } from './AnswerOption';

interface QuizCardProps {
  question: Question;
  selectedAnswer: string | null;
  answerState: AnswerState;
  onSelectAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

const letters = ['A', 'B', 'C', 'D'] as const;

export function QuizCard({ question, selectedAnswer, answerState, onSelectAnswer, questionNumber, totalQuestions }: QuizCardProps) {
  return (
    <div className="flex flex-col gap-4 animate-[fadeIn_0.25s_ease]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#F2F2F7', color: 'var(--color-secondary)' }}>
          {question.part}
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>
          {questionNumber} / {totalQuestions}
        </span>
      </div>

      <h2 className="text-[17px] font-semibold leading-relaxed m-0">
        {question.question}
      </h2>

      <div className="flex flex-col gap-2.5 mt-1">
        {letters.map(letter => (
          <AnswerOption
            key={letter}
            letter={letter}
            text={question.options[letter]}
            isSelected={selectedAnswer === letter}
            isCorrect={question.correct === letter}
            questionState={answerState}
            onSelect={() => onSelectAnswer(letter)}
          />
        ))}
      </div>
    </div>
  );
}
