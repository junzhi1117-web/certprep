import { useState, useCallback } from 'react';
import { BottomNav } from './components/layout/BottomNav';
import { Home } from './pages/Home';
import { Study } from './pages/Study';
import { Quiz } from './pages/Quiz';
import { QuizResult } from './pages/QuizResult';
import { Progress } from './pages/Progress';
import { Settings } from './pages/Settings';
import { useQuizProgress } from './hooks/useQuizProgress';
import { getTopicById } from './data/topics';
import { getQuestionsForTopic } from './data/questions';
import type { QuizMode } from './data/types';

type Page = 'home' | 'study' | 'progress' | 'settings' | 'quiz' | 'result';

interface QuizResultData {
  correct: number;
  wrong: number;
  skipped: number;
  total: number;
  timeSpent: number;
  wrongQuestions: number[];
  scorePercent: number;
}

function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeTopicId, setActiveTopicId] = useState<string>('');
  const [quizResults, setQuizResults] = useState<QuizResultData | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode>('normal');
  const [reviewQuestions, setReviewQuestions] = useState<number[] | null>(null);
  const { saveAttempt, getProgress } = useQuizProgress();

  const handleNavigate = useCallback((target: string, topicId?: string) => {
    if (topicId) {
      setActiveTopicId(topicId);
      setQuizMode('normal');
      setReviewQuestions(null);
      setPage('quiz');
    } else {
      setPage(target as Page);
    }
  }, []);

  const handleStartQuiz = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    setQuizMode('normal');
    setReviewQuestions(null);
    setPage('quiz');
  }, []);

  const handleStartReview = useCallback((topicId: string) => {
    const progress = getProgress(topicId);
    if (!progress || progress.attempts.length === 0) {
      alert('No previous attempts to review!');
      return;
    }
    const lastAttempt = progress.attempts[progress.attempts.length - 1];
    if (!lastAttempt.wrongQuestions || lastAttempt.wrongQuestions.length === 0) {
      alert('No wrong questions to review!');
      return;
    }
    setActiveTopicId(topicId);
    setQuizMode('review');
    setReviewQuestions(lastAttempt.wrongQuestions);
    setPage('quiz');
  }, [getProgress]);

  const handleFinishQuiz = useCallback((results: QuizResultData) => {
    saveAttempt(activeTopicId, {
      date: new Date().toISOString(),
      score: results.correct,
      total: results.total,
      wrongQuestions: results.wrongQuestions,
      timeSpent: results.timeSpent,
    });
    setQuizResults(results);
    setPage('result');
  }, [activeTopicId, saveAttempt]);

  const handleRetake = useCallback(() => {
    setQuizMode('normal');
    setReviewQuestions(null);
    setPage('quiz');
  }, []);

  const handleReviewFromResult = useCallback(() => {
    if (!quizResults || quizResults.wrongQuestions.length === 0) return;
    setQuizMode('review');
    setReviewQuestions(quizResults.wrongQuestions);
    setPage('quiz');
  }, [quizResults]);

  const handleBackToStudy = useCallback(() => {
    setQuizMode('normal');
    setReviewQuestions(null);
    setPage('study');
  }, []);

  const showNav = page !== 'quiz' && page !== 'result';
  const topic = activeTopicId ? getTopicById(activeTopicId) : undefined;

  // Get questions, filtering for review mode
  const getQuizQuestions = () => {
    const all = getQuestionsForTopic(activeTopicId);
    if (quizMode === 'review' && reviewQuestions) {
      const wrongSet = new Set(reviewQuestions);
      return all.filter(q => wrongSet.has(q.id));
    }
    return all;
  };

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        {page === 'home' && <Home onNavigate={handleNavigate} />}
        {page === 'study' && (
          <Study onStartQuiz={handleStartQuiz} onStartReview={handleStartReview} />
        )}
        {page === 'progress' && <Progress />}
        {page === 'settings' && <Settings />}
        {page === 'quiz' && activeTopicId && (
          <Quiz
            key={`${activeTopicId}-${quizMode}-${reviewQuestions?.length ?? 0}`}
            topicId={activeTopicId}
            questions={getQuizQuestions()}
            onFinish={handleFinishQuiz}
            onBack={handleBackToStudy}
            mode={quizMode}
          />
        )}
        {page === 'result' && quizResults && (
          <QuizResult
            results={quizResults}
            topicTitle={topic?.title ?? 'Quiz'}
            onRetake={handleRetake}
            onBack={handleBackToStudy}
            onReview={quizResults.wrongQuestions.length > 0 ? handleReviewFromResult : undefined}
          />
        )}
      </main>

      {showNav && (
        <BottomNav
          active={page}
          onNavigate={(id) => setPage(id as Page)}
        />
      )}
    </div>
  );
}

export default App;
