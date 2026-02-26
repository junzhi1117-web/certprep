import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { QuizCard } from '../components/quiz/QuizCard';
import { ExplanationSheet } from '../components/quiz/ExplanationSheet';
import { useQuizSession } from '../hooks/useQuizSession';
import { loadSettings } from '../hooks/useQuizProgress';
import type { Question } from '../data/types';

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
}

export function Quiz({ questions: allQuestions, onFinish, onBack }: QuizProps) {
  const settings = loadSettings();
  const {
    session,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    dismissExplanation,
    finishQuiz,
    getResults,
  } = useQuizSession(allQuestions, settings.questionsPerSession, settings.shuffleQuestions);

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (settings.showTimer) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [settings.showTimer]);

  useEffect(() => {
    if (session.isFinished) {
      clearInterval(timerRef.current);
      onFinish(getResults());
    }
  }, [session.isFinished, getResults, onFinish]);

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
        leftAction={{ label: '← Back', onClick: onBack }}
        rightAction={{ label: 'End', onClick: finishQuiz }}
      />

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
