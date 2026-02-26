import { useState, useCallback, useRef } from 'react';
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

export function useQuizSession(allQuestions: Question[], count: number, shuffle: boolean) {
  const startTimeRef = useRef(Date.now());

  const [session, setSession] = useState<QuizSession>(() => {
    let questions = [...allQuestions];
    if (shuffle) {
      questions = questions.sort(() => Math.random() - 0.5);
    }
    questions = questions.slice(0, count);

    return {
      questions,
      currentIndex: 0,
      questionStates: questions.map(() => ({ selected: null, state: 'unanswered' })),
      isFinished: false,
      startTime: Date.now(),
      showExplanation: false,
    };
  });

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
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const wrongQuestions = session.questions
      .filter((_, i) => session.questionStates[i].state === 'wrong')
      .map(q => q.id);

    return { correct, wrong, skipped, total, timeSpent, wrongQuestions, scorePercent: Math.round((correct / total) * 100) };
  }, [session.questionStates, session.questions]);

  return {
    session,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    dismissExplanation,
    finishQuiz,
    getResults,
  };
}
