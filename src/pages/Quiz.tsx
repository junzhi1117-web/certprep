import { useEffect, useRef, useState, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { QuizCard } from '../components/quiz/QuizCard';
import { ExplanationSheet } from '../components/quiz/ExplanationSheet';
import { useQuizSession, clearSavedSession, getSavedSessionInfo } from '../hooks/useQuizSession';
import { loadSettings } from '../hooks/useQuizProgress';
import { Badge } from '../components/ui/Badge';
import type { Question } from '../data/types';
import type { QuizMode } from '../data/types';

interface QuizProps {
  topicId: string;
  questions: Question[];
  onFinish: (results: {
    correct: number;
    wrong: number;
    skipped: number;
    total: number;
    timeSpent: number;
    wrongQuestions: number[];
    scorePercent: number;
  }) => void;
  onBack: () => void;
  mode?: QuizMode;
}

export function Quiz({ topicId, questions: allQuestions, onFinish, onBack, mode = 'normal' }: QuizProps) {
  const settings = loadSettings();

  // Check for saved session before initializing
  const [resumeInfo] = useState(() => getSavedSessionInfo(topicId));
  const [sessionChoice, setSessionChoice] = useState<'pending' | 'resume' | 'fresh'>(
    () => (mode === 'review' || !resumeInfo) ? 'resume' : 'pending'
  );

  const shouldRestore = sessionChoice === 'resume' && mode !== 'review';

  const {
    session,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    dismissExplanation,
    finishQuiz,
    getResults,
    getElapsedSeconds,
  } = useQuizSession(
    allQuestions,
    settings.questionsPerSession,
    settings.shuffleQuestions,
    topicId,
    shouldRestore,
  );

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (settings.showTimer) {
      timerRef.current = setInterval(() => setElapsed(getElapsedSeconds()), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [settings.showTimer, getElapsedSeconds]);

  useEffect(() => {
    if (session.isFinished) {
      clearInterval(timerRef.current);
      clearSavedSession(topicId);
      onFinish(getResults());
    }
  }, [session.isFinished, getResults, onFinish, topicId]);

  const handleBack = useCallback(() => {
    clearSavedSession(topicId);
    onBack();
  }, [topicId, onBack]);

  const handleStartFresh = useCallback(() => {
    clearSavedSession(topicId);
    setSessionChoice('fresh');
    // Force re-mount by navigating away and back — simplest approach is to reload
    window.location.reload();
  }, [topicId]);

  // Show resume banner
  if (sessionChoice === 'pending') {
    return (
      <div className="flex flex-col min-h-dvh bg-white">
        <Header
          title="Resume Quiz?"
          leftAction={{ label: '← Back', onClick: onBack }}
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <div
            className="w-full max-w-sm rounded-2xl p-6 text-center"
            style={{ background: 'var(--color-primary-light)' }}
          >
            <p className="text-3xl m-0 mb-3">📝</p>
            <h2 className="text-lg font-bold m-0 mb-1">Session In Progress</h2>
            <p className="text-sm m-0 mb-5" style={{ color: 'var(--color-secondary)' }}>
              You left off at Q{(resumeInfo?.currentIndex ?? 0) + 1} of {resumeInfo?.total ?? '?'}.
              Continue where you stopped?
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="btn-primary"
                onClick={() => setSessionChoice('resume')}
              >
                Continue
              </button>
              <button
                className="btn-secondary"
                onClick={handleStartFresh}
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = session.questions[session.currentIndex];
  const currentState = session.questionStates[session.currentIndex];
  const answeredCount = session.questionStates.filter(s => s.state !== 'unanswered').length;
  const isLast = session.currentIndex === session.questions.length - 1;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Header
        title={settings.showTimer ? formatTime(elapsed) : `Question ${session.currentIndex + 1}`}
        leftAction={{ label: '← Back', onClick: handleBack }}
        rightAction={{ label: 'End', onClick: finishQuiz }}
      />

      {mode === 'review' && (
        <div className="flex justify-center py-1.5" style={{ background: '#FFF3E0' }}>
          <Badge label="🔁 Review Mode" variant="warning" />
        </div>
      )}

      <ProgressBar current={answeredCount} total={session.questions.length} />

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
        <QuizCard
          question={currentQ}
          selectedAnswer={currentState.selected}
          answerState={currentState.state}
          onSelectAnswer={selectAnswer}
          questionNumber={session.currentIndex + 1}
          totalQuestions={session.questions.length}
        />
      </div>

      {/* Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/60 px-4 py-3 flex items-center justify-between"
        style={{ paddingBottom: 'calc(12px + var(--safe-bottom))' }}
      >
        <button
          onClick={prevQuestion}
          disabled={session.currentIndex === 0}
          className="text-[15px] font-semibold border-none bg-transparent cursor-pointer disabled:opacity-30"
          style={{ color: 'var(--color-primary)' }}
        >
          ← Previous
        </button>

        <span className="text-xs font-medium" style={{ color: 'var(--color-secondary)' }}>
          {session.currentIndex + 1} / {session.questions.length}
        </span>

        {isLast && currentState.state !== 'unanswered' ? (
          <button
            onClick={finishQuiz}
            className="text-[15px] font-semibold border-none bg-transparent cursor-pointer"
            style={{ color: 'var(--color-success)' }}
          >
            Finish ✓
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            disabled={isLast}
            className="text-[15px] font-semibold border-none bg-transparent cursor-pointer disabled:opacity-30"
            style={{ color: 'var(--color-primary)' }}
          >
            Next →
          </button>
        )}
      </div>

      {/* Explanation Sheet */}
      {session.showExplanation && currentState.state !== 'unanswered' && (
        <ExplanationSheet
          explanation={currentQ.explanation}
          examTip={currentQ.examTip}
          isCorrect={currentState.state === 'correct'}
          onDismiss={dismissExplanation}
          onNext={() => {
            dismissExplanation();
            if (!isLast) nextQuestion();
          }}
          hasNext={!isLast}
        />
      )}
    </div>
  );
}
