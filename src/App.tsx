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
  const { saveAttempt } = useQuizProgress();

  const handleNavigate = useCallback((target: string, topicId?: string) => {
    if (topicId) {
      setActiveTopicId(topicId);
      setPage('quiz');
    } else {
      setPage(target as Page);
    }
  }, []);

  const handleStartQuiz = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    setPage('quiz');
  }, []);

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
    setPage('quiz');
  }, []);

  const handleBackToStudy = useCallback(() => {
    setPage('study');
  }, []);

  const showNav = page !== 'quiz' && page !== 'result';
  const topic = activeTopicId ? getTopicById(activeTopicId) : undefined;

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        {page === 'home' && <Home onNavigate={handleNavigate} />}
        {page === 'study' && <Study onStartQuiz={handleStartQuiz} />}
        {page === 'progress' && <Progress />}
        {page === 'settings' && <Settings />}
        {page === 'quiz' && activeTopicId && (
          <Quiz
            topicId={activeTopicId}
            questions={getQuestionsForTopic(activeTopicId)}
            onFinish={handleFinishQuiz}
            onBack={handleBackToStudy}
          />
        )}
        {page === 'result' && quizResults && (
          <QuizResult
            results={quizResults}
            topicTitle={topic?.title ?? 'Quiz'}
            onRetake={handleRetake}
            onBack={handleBackToStudy}
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
