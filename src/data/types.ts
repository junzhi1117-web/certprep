export interface Question {
  id: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  examTip: string;
  topic: string;
  part: string;
}

export type ExamType = 'acsm' | 'cscs';
export type TopicStatus = 'available' | 'coming-soon';

export interface TopicMeta {
  id: string;
  exam: ExamType;
  day?: number;
  title: string;
  subtitle: string;
  questionCount: number;
  status: TopicStatus;
  icon: string;
}

export interface QuizAttempt {
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

export interface AppSettings {
  showTimer: boolean;
  showExplanationImmediately: boolean;
  questionsPerSession: 10 | 25 | 50 | 100;
  shuffleQuestions: boolean;
}

export type AnswerState = 'idle' | 'correct' | 'wrong';

export type Page = 'home' | 'study' | 'quiz' | 'quiz-result' | 'progress' | 'settings';
