import { useState, useCallback, useRef, useEffect } from 'react';
import type { Question } from '../data/types';

export type AnswerState = 'unanswered' | 'correct' | 'wrong';

interface QuestionState {
  selected: string | null;
  state: AnswerState;
}

export interface QuizSession {
  questions: Question[];
  currentIndex: number;
  questionStates: QuestionState[];
  isFinished: boolean;
  startTime: number;
  showExplanation: boolean;
}

interface SavedSession {
  questionIds: number[];
  currentIndex: number;
  questionStates: { selected: string | null; state: 'unanswered' | 'correct' | 'wrong' }[];
  elapsedSeconds: number;
  savedAt: string;
}

function sessionKey(topicId: string) {
  return `certprep-session-${topicId}`;
}

export function hasSavedSession(topicId: string): boolean {
  try {
    const raw = localStorage.getItem(sessionKey(topicId));
    return raw !== null;
  } catch {
    return false;
  }
}

export function getSavedSessionInfo(topicId: string): { currentIndex: number; total: number } | null {
  try {
    const raw = localStorage.getItem(sessionKey(topicId));
    if (!raw) return null;
    const saved: SavedSession = JSON.parse(raw);
    return { currentIndex: saved.currentIndex, total: saved.questionIds.length };
  } catch {
    return null;
  }
}

export function clearSavedSession(topicId: string) {
  localStorage.removeItem(sessionKey(topicId));
}

function loadSavedSession(topicId: string): SavedSession | null {
  try {
    const raw = localStorage.getItem(sessionKey(topicId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSessionToStorage(topicId: string, session: QuizSession, elapsedSeconds: number) {
  const data: SavedSession = {
    questionIds: session.questions.map(q => q.id),
    currentIndex: session.currentIndex,
    questionStates: session.questionStates,
    elapsedSeconds,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(sessionKey(topicId), JSON.stringify(data));
}

export function useQuizSession(
  allQuestions: Question[],
  count: number,
  shuffle: boolean,
  topicId: string,
  shouldRestore: boolean = true,
) {
  const startTimeRef = useRef(Date.now());
  const restoredElapsedRef = useRef(0);

  const [session, setSession] = useState<QuizSession>(() => {
    // Try to restore saved session
    if (shouldRestore) {
      const saved = loadSavedSession(topicId);
      if (saved) {
        const questionMap = new Map(allQuestions.map(q => [q.id, q]));
        const restoredQuestions = saved.questionIds
          .map(id => questionMap.get(id))
          .filter((q): q is Question => q !== undefined);

        if (restoredQuestions.length === saved.questionIds.length) {
          restoredElapsedRef.current = saved.elapsedSeconds;
          return {
            questions: restoredQuestions,
            currentIndex: saved.currentIndex,
            questionStates: saved.questionStates,
            isFinished: false,
            startTime: Date.now(),
            showExplanation: false,
          };
        }
        // Mismatch — clear stale session and start fresh
        clearSavedSession(topicId);
      }
    }

    let questions = [...allQuestions];
    if (shuffle) {
      questions = questions.sort(() => Math.random() - 0.5);
    }
    questions = questions.slice(0, count);

    return {
      questions,
      currentIndex: 0,
      questionStates: questions.map(() => ({ selected: null, state: 'unanswered' as const })),
      isFinished: false,
      startTime: Date.now(),
      showExplanation: false,
    };
  });

  // Save session to localStorage on state changes
  useEffect(() => {
    if (session.isFinished) return;
    const elapsed = restoredElapsedRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000);
    saveSessionToStorage(topicId, session, elapsed);
  }, [session, topicId]);

  const selectAnswer = useCallback((answer: string) => {
    setSession(prev => {
      if (prev.questionStates[prev.currentIndex].state !== 'unanswered') return prev;

      const question = prev.questions[prev.currentIndex];
      const isCorrect = answer === question.correct;
      const newStates = [...prev.questionStates];
      newStates[prev.currentIndex] = {
        selected: answer,
        state: isCorrect ? 'correct' : 'wrong',
      };

      return { ...prev, questionStates: newStates, showExplanation: true };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setSession(prev => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.questions.length - 1)),
      showExplanation: prev.questionStates[index]?.state !== 'unanswered',
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setSession(prev => {
      const next = prev.currentIndex + 1;
      if (next >= prev.questions.length) return prev;
      return {
        ...prev,
        currentIndex: next,
        showExplanation: prev.questionStates[next].state !== 'unanswered',
      };
    });
  }, []);

  const prevQuestion = useCallback(() => {
    setSession(prev => {
      const next = prev.currentIndex - 1;
      if (next < 0) return prev;
      return {
        ...prev,
        currentIndex: next,
        showExplanation: prev.questionStates[next].state !== 'unanswered',
      };
    });
  }, []);

  const dismissExplanation = useCallback(() => {
    setSession(prev => ({ ...prev, showExplanation: false }));
  }, []);

  const finishQuiz = useCallback(() => {
    setSession(prev => ({ ...prev, isFinished: true }));
  }, []);

  const getResults = useCallback(() => {
    const correct = session.questionStates.filter(s => s.state === 'correct').length;
    const wrong = session.questionStates.filter(s => s.state === 'wrong').length;
    const skipped = session.questionStates.filter(s => s.state === 'unanswered').length;
    const total = session.questions.length;
    const timeSpent = restoredElapsedRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000);
    const wrongQuestions = session.questions
      .filter((_, i) => session.questionStates[i].state === 'wrong')
      .map(q => q.id);

    return { correct, wrong, skipped, total, timeSpent, wrongQuestions, scorePercent: Math.round((correct / total) * 100) };
  }, [session.questionStates, session.questions]);

  const getElapsedSeconds = useCallback(() => {
    return restoredElapsedRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  return {
    session,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    dismissExplanation,
    finishQuiz,
    getResults,
    getElapsedSeconds,
  };
}
