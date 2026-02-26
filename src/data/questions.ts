import type { Question } from './types';
import { acsmDay01Questions } from './acsm-day01';
import { cscsProgramDesignQuestions } from './cscs-program-design';
import { cscsImplementationQuestions } from './cscs-program-implementation';

export function getQuestionsForTopic(topicId: string): Question[] {
  switch (topicId) {
    case 'acsm-day01':
      return acsmDay01Questions;
    case 'cscs-program-design':
      return cscsProgramDesignQuestions;
    case 'cscs-implementation':
      return cscsImplementationQuestions;
    default:
      return [];
  }
}
