import type { Answers, Question } from '../types/survey';
import { isAnswered, isQuestionVisible } from './validation';

export type AnswerState = 'answered' | 'empty' | 'notApplicable';

export interface AnswerDisplay {
  state: AnswerState;
  /** Selected option labels, with any "أخرى" text folded in. */
  items: string[];
  /** Free text for text questions. */
  text?: string;
  /** Why the question does not apply, when state is `notApplicable`. */
  note?: string;
}

/** Shared read model for the review page — the export has its own renderer. */
export function getAnswerDisplay(question: Question, answers: Answers): AnswerDisplay {
  if (!isQuestionVisible(question, answers)) {
    return {
      state: 'notApplicable',
      items: [],
      note: question.conditionalVisibility?.hiddenNote
        ? `لا ينطبق — ${question.conditionalVisibility.hiddenNote}`
        : 'لا ينطبق على هذا المشروع.',
    };
  }

  const answer = answers[question.id];
  if (!isAnswered(question, answer)) return { state: 'empty', items: [] };

  if (question.type === 'shortText' || question.type === 'longText') {
    return { state: 'answered', items: [], text: (answer?.text ?? '').trim() };
  }

  const selectedIds = Array.isArray(answer?.selected)
    ? answer.selected
    : answer?.selected
      ? [answer.selected]
      : [];

  const items = selectedIds.map((id) => {
    const option = question.options?.find((o) => o.id === id);
    if (!option) return id;
    if (option.allowsCustomText) {
      const custom = (answer?.text ?? '').trim();
      return custom ? `${option.label}: ${custom}` : `${option.label}: (لم يتم تحديدها)`;
    }
    return option.label;
  });

  return { state: 'answered', items };
}
