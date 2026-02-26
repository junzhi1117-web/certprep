import { useState, useCallback } from 'react';

interface QuizAttempt {
  date: string;
  score: number;
  total: number;
  wrongQuestions: number[];
  timeSpent: number;
}

export interface QuizProgress {
  topicId: string;
  attempts: QuizAttempt[];
  lastAttempted: string;
  bestScore: number;
}

interface AppSettings {
  showTimer: boolean;
  showExplanationImmediately: boolean;
  questionsPerSession: number;
  shuffleQuestions: boolean;
}

const PROGRESS_KEY = 'certprep-progress';
const SETTINGS_KEY = 'certprep-settings';
const STREAK_KEY = 'certprep-streak';

const defaultSettings: AppSettings = {
  showTimer: false,
  showExplanationImmediately: true,
  questionsPerSession: 25,
  shuffleQuestions: true,
};

function loadProgress(): Record<string, QuizProgress> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: Record<string, QuizProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getStudyDates(): string[] {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addStudyDate(date: string) {
  const dates = getStudyDates();
  if (!dates.includes(date)) {
    dates.push(date);
    localStorage.setItem(STREAK_KEY, JSON.stringify(dates));
  }
}

export function getStreak(): number {
  const dates = getStudyDates().sort().reverse();
  if (dates.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  let checkDate = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export function getStudyHeatmap(): Record<string, number> {
  const progress = loadProgress();
  const heatmap: Record<string, number> = {};

  for (const p of Object.values(progress)) {
    for (const attempt of p.attempts) {
      const date = attempt.date.split('T')[0];
      heatmap[date] = (heatmap[date] || 0) + 1;
    }
  }
  return heatmap;
}

export function getTotalStats() {
  const progress = loadProgress();
  let totalAnswered = 0;
  let totalCorrect = 0;
  let totalTime = 0;

  for (const p of Object.values(progress)) {
    for (const attempt of p.attempts) {
      totalAnswered += attempt.total;
      totalCorrect += attempt.score;
      totalTime += attempt.timeSpent;
    }
  }

  return {
    totalAnswered,
    totalCorrect,
    accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
    totalTime,
    streak: getStreak(),
  };
}

export function useQuizProgress() {
  const [progressMap, setProgressMap] = useState(loadProgress);

  const getProgress = useCallback(
    (topicId: string): QuizProgress | undefined => progressMap[topicId],
    [progressMap]
  );

  const saveAttempt = useCallback(
    (topicId: string, attempt: QuizAttempt) => {
      setProgressMap(prev => {
        const existing = prev[topicId] || {
          topicId,
          attempts: [],
          lastAttempted: '',
          bestScore: 0,
        };

        const scorePercent = Math.round((attempt.score / attempt.total) * 100);
        const updated: QuizProgress = {
          ...existing,
          attempts: [...existing.attempts, attempt],
          lastAttempted: attempt.date,
          bestScore: Math.max(existing.bestScore, scorePercent),
        };

        const next = { ...prev, [topicId]: updated };
        saveProgress(next);
        addStudyDate(attempt.date.split('T')[0]);
        return next;
      });
    },
    []
  );

  const getAllProgress = useCallback(
    () => Object.values(progressMap),
    [progressMap]
  );

  return { getProgress, saveAttempt, getAllProgress, settings: loadSettings(), saveSettings };
}
