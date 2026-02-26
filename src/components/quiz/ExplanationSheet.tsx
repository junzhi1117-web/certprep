interface ExplanationSheetProps {
  explanation: string;
  examTip: string;
  isCorrect: boolean;
  onDismiss: () => void;
  onNext: () => void;
  hasNext: boolean;
}

export function ExplanationSheet({ explanation, examTip, isCorrect, onDismiss, onNext, hasNext }: ExplanationSheetProps) {
  return (
    <>
      <div className="sheet-overlay" onClick={onDismiss} />
      <div className="sheet">
        <div className="sheet-handle" />

        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-lg font-bold"
            style={{ color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)' }}
          >
            {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--color-secondary)' }}>
            Explanation
          </h3>
          <p className="text-[15px] leading-relaxed m-0">{explanation}</p>
        </div>

        {examTip && (
          <div
            className="rounded-xl p-3 mb-4"
            style={{ background: 'var(--color-primary-light)' }}
          >
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>
              Exam Tip
            </h3>
            <p className="text-[14px] leading-relaxed m-0" style={{ color: 'var(--color-primary)' }}>
              {examTip}
            </p>
          </div>
        )}

        {hasNext && (
          <button className="btn-primary mt-2" onClick={onNext}>
            Next Question
          </button>
        )}
      </div>
    </>
  );
}
