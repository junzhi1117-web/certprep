import type { TopicMeta } from './types';

export const acsmTopics: TopicMeta[] = [
  { id: 'acsm-day01', exam: 'acsm', day: 1, title: 'Energy Systems', subtitle: 'ATP-PC, Glycolytic, Oxidative', questionCount: 100, status: 'available', icon: '⚡' },
  { id: 'acsm-day02', exam: 'acsm', day: 2, title: 'Biomechanics', subtitle: 'Levers, Forces, Movement', questionCount: 0, status: 'coming-soon', icon: '🦴' },
  { id: 'acsm-day03', exam: 'acsm', day: 3, title: 'Exercise Physiology', subtitle: 'Cardiovascular & Respiratory', questionCount: 0, status: 'coming-soon', icon: '❤️' },
  { id: 'acsm-day04', exam: 'acsm', day: 4, title: 'Anatomy & Kinesiology', subtitle: 'Muscles, Joints, Actions', questionCount: 0, status: 'coming-soon', icon: '🏋️' },
  { id: 'acsm-day05', exam: 'acsm', day: 5, title: 'Nutrition Basics', subtitle: 'Macros, Micros, Hydration', questionCount: 0, status: 'coming-soon', icon: '🥗' },
  { id: 'acsm-day06', exam: 'acsm', day: 6, title: 'Weight Management', subtitle: 'Energy Balance, Body Comp', questionCount: 0, status: 'coming-soon', icon: '⚖️' },
  { id: 'acsm-day07', exam: 'acsm', day: 7, title: 'Health Screening', subtitle: 'PAR-Q, Risk Stratification', questionCount: 0, status: 'coming-soon', icon: '📋' },
  { id: 'acsm-day08', exam: 'acsm', day: 8, title: 'Fitness Assessment', subtitle: 'VO2max, Body Comp, Flexibility', questionCount: 0, status: 'coming-soon', icon: '📏' },
  { id: 'acsm-day09', exam: 'acsm', day: 9, title: 'Cardiorespiratory Training', subtitle: 'FITT-VP, HR Zones', questionCount: 0, status: 'coming-soon', icon: '🫀' },
  { id: 'acsm-day10', exam: 'acsm', day: 10, title: 'Resistance Training', subtitle: 'Principles, Program Design', questionCount: 0, status: 'coming-soon', icon: '💪' },
  { id: 'acsm-day11', exam: 'acsm', day: 11, title: 'Flexibility Training', subtitle: 'Static, Dynamic, PNF', questionCount: 0, status: 'coming-soon', icon: '🧘' },
  { id: 'acsm-day12', exam: 'acsm', day: 12, title: 'Special Populations I', subtitle: 'Older Adults, Youth', questionCount: 0, status: 'coming-soon', icon: '👶' },
  { id: 'acsm-day13', exam: 'acsm', day: 13, title: 'Special Populations II', subtitle: 'Pregnancy, Disabilities', questionCount: 0, status: 'coming-soon', icon: '🤰' },
  { id: 'acsm-day14', exam: 'acsm', day: 14, title: 'Cardiovascular Disease', subtitle: 'Risk Factors, Pathophysiology', questionCount: 0, status: 'coming-soon', icon: '🩺' },
  { id: 'acsm-day15', exam: 'acsm', day: 15, title: 'Metabolic Conditions', subtitle: 'Diabetes, Metabolic Syndrome', questionCount: 0, status: 'coming-soon', icon: '🔬' },
  { id: 'acsm-day16', exam: 'acsm', day: 16, title: 'Pulmonary Conditions', subtitle: 'Asthma, COPD', questionCount: 0, status: 'coming-soon', icon: '🫁' },
  { id: 'acsm-day17', exam: 'acsm', day: 17, title: 'Behavioral Strategies', subtitle: 'Motivation, Adherence', questionCount: 0, status: 'coming-soon', icon: '🧠' },
  { id: 'acsm-day18', exam: 'acsm', day: 18, title: 'Communication & Coaching', subtitle: 'Client Interaction', questionCount: 0, status: 'coming-soon', icon: '🗣️' },
  { id: 'acsm-day19', exam: 'acsm', day: 19, title: 'Legal & Professional', subtitle: 'Scope of Practice, Liability', questionCount: 0, status: 'coming-soon', icon: '⚖️' },
  { id: 'acsm-day20', exam: 'acsm', day: 20, title: 'Emergency Procedures', subtitle: 'CPR, AED, First Aid', questionCount: 0, status: 'coming-soon', icon: '🚑' },
  { id: 'acsm-day21', exam: 'acsm', day: 21, title: 'Program Design', subtitle: 'Periodization, Progression', questionCount: 0, status: 'coming-soon', icon: '📐' },
  { id: 'acsm-day22', exam: 'acsm', day: 22, title: 'Comprehensive Review', subtitle: 'Full Exam Simulation', questionCount: 0, status: 'coming-soon', icon: '🎯' },
];

export const cscsTopics: TopicMeta[] = [
  { id: 'cscs-program-design', exam: 'cscs', title: 'Program Design', subtitle: 'Periodization, Volume, Variables', questionCount: 50, status: 'available', icon: '📐' },
  { id: 'cscs-implementation', exam: 'cscs', title: 'Program Implementation', subtitle: 'Technique, Spotting, Monitoring', questionCount: 50, status: 'available', icon: '🏗️' },
  { id: 'cscs-scientific', exam: 'cscs', title: 'Scientific Foundations', subtitle: 'Anatomy, Physiology, Biomechanics', questionCount: 0, status: 'coming-soon', icon: '🔬' },
  { id: 'cscs-practical', exam: 'cscs', title: 'Practical / Applied', subtitle: 'Testing, Evaluation, Nutrition', questionCount: 0, status: 'coming-soon', icon: '📊' },
];

export const allTopics = [...acsmTopics, ...cscsTopics];

export function getTopicById(id: string) {
  return allTopics.find(t => t.id === id);
}
