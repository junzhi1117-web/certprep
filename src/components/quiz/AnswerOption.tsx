import { useState } from 'react';
import type { AnswerState } from '../../hooks/useQuizSession';

interface AnswerOptionProps {
  letter: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  questionState: AnswerState;
  onSelect: () => void;
}

export function AnswerOption({ letter, text, isSelected, isCorrect, questionState, onSelect }: AnswerOptionProps) {
  const [tapped, setTapped] = useState(false);
  const answered = questionState !== 'unanswered';

  let bgColor = 'var(--color-card)';
  let borderColor = 'var(--color-border)';
  let textColor = 'var(--color-dark)';
  let letterBg = '#F2F2F7';
  let letterColor = 'var(--color-dark)';
  let icon = '';

  if (answered && isSelected && questionState === 'correct') {
    bgColor = '#E8F9ED';
    borderColor = 'var(--color-success)';
    letterBg = 'var(--color-success)';
    letterColor = 'white';
    icon = ' ✓';
  } else if (answered && isSelected && questionState === 'wrong') {
    bgColor = '#FEE8E7';
    borderColor = 'var(--color-danger)';
    letterBg = 'var(--color-danger)';
    letterColor = 'white';
    icon = ' ✗';
  } else if (answered && isCorrect) {
    bgColor = '#E8F9ED';
    borderColor = 'var(--color-success)';
    letterBg = 'var(--color-success)';
    letterColor = 'white';
    icon = ' ✓';
  } else if (answered) {
    textColor = 'var(--color-secondary)';
  }

  const handleClick = () => {
    if (answered) return;
    setTapped(true);
    setTimeout(() => setTapped(false), 150);
    onSelect();
  };

  return (
    <button
      onClick={handleClick}
      disabled={answered}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${tapped ? 'haptic' : ''} ${!answered ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
      style={{ background: bgColor, borderColor, color: textColor }}
      aria-label={`Option ${letter}: ${text}`}
    >
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-200"
        style={{ background: letterBg, color: letterColor }}
      >
        {letter}{icon}
      </span>
      <span className="text-[15px] leading-snug flex-1">{text}</span>
    </button>
  );
}
