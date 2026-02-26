import { ScoreCircle } from '../components/ui/ScoreCircle';
import { Card } from '../components/ui/Card';

interface QuizResultProps {
  results: {
    correct: number;
    wrong: number;
    skipped: number;
    total: number;
    timeSpent: number;
    scorePercent: number;
    wrongQuestions?: number[];
  };
  topicTitle: string;
  onRetake: () => void;
  onBack: () => void;
  onReview?: () => void;
}

export function QuizResult({ results, topicTitle, onRetake, onBack, onReview }: QuizResultProps) {
  const { correct, wrong, skipped, total, timeSpent, scorePercent } = results;

  const badge = scorePercent >= 90
    ? { emoji: '🏆', label: 'Excellent!', color: 'var(--color-success)' }
    : scorePercent >= 75
    ? { emoji: '⭐', label: 'Good Job!', color: 'var(--color-primary)' }
    : { emoji: '📖', label: 'Keep Studying', color: 'var(--color-warning)' };

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="min-h-dvh flex flex-col items-center px-4 py-8 pb-24 max-w-lg mx-auto w-full">
      {/* Score */}
      <div className="mt-4 mb-2">
        <ScoreCircle score={scorePercent} size={180} />
      </div>

      <div className="text-center mb-6">
        <span className="text-4xl">{badge.emoji}</span>
        <h2 className="text-xl font-bold m-0 mt-2" style={{ color: badge.color }}>
          {badge.label}
        </h2>
        <p className="text-sm m-0 mt-1" style={{ color: 'var(--color-secondary)' }}>
          {topicTitle}
        </p>
      </div>

      {/* Breakdown */}
      <Card className="w-full mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold m-0" style={{ color: 'var(--color-success)' }}>{correct}</p>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold m-0" style={{ color: 'var(--color-danger)' }}>{wrong}</p>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Wrong</p>
          </div>
          <div>
            <p className="text-2xl font-bold m-0" style={{ color: 'var(--color-secondary)' }}>{skipped}</p>
            <p className="text-xs m-0 mt-0.5" style={{ color: 'var(--color-secondary)' }}>Skipped</p>
          </div>
        </div>
      </Card>

      {/* Time */}
      <Card className="w-full mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>Time Spent</span>
          <span className="text-sm font-semibold">{minutes}m {seconds}s</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm" style={{ color: 'var(--color-secondary)' }}>Questions</span>
          <span className="text-sm font-semibold">{correct + wrong} / {total} answered</span>
        </div>
      </Card>

      {/* Tips */}
      {scorePercent < 90 && (
        <Card className="w-full mb-6" style={{ background: 'var(--color-primary-light)' }}>
          <h3 className="text-sm font-semibold m-0 mb-1" style={{ color: 'var(--color-primary)' }}>
            Study Tips
          </h3>
          <p className="text-[13px] m-0 leading-relaxed" style={{ color: 'var(--color-primary)' }}>
            {scorePercent < 50
              ? 'Focus on understanding the core concepts first. Review the explanations for each wrong answer carefully.'
              : scorePercent < 75
              ? 'You\'re making good progress! Review the questions you got wrong and pay attention to the exam tips.'
              : 'Almost there! Fine-tune your knowledge on the tricky edge cases. Pay attention to specific numbers and time ranges.'}
          </p>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full">
        <button className="btn-primary" onClick={onRetake}>
          Retake Quiz
        </button>
        {onReview && wrong > 0 && (
          <button
            className="btn-secondary"
            style={{
              background: '#FFF3E0',
              color: '#E67E00',
              borderColor: '#E67E00',
            }}
            onClick={onReview}
          >
            🔁 Review Wrong Answers ({wrong})
          </button>
        )}
        <button className="btn-secondary" onClick={onBack}>
          Back to Topics
        </button>
      </div>
    </div>
  );
}
