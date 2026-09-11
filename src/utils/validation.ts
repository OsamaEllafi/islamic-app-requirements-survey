import type { Answer, Answers, Question, Section, SectionStatus } from '../types/survey';
import { questionsById } from '../data/survey';

/** True when the respondent has actually provided something for this question. */
export function isAnswered(question: Question, answer: Answer | undefined): boolean {
  if (!answer) return false;
  switch (question.type) {
    case 'single':
      return typeof answer.selected === 'string' && answer.selected.length > 0;
    case 'multi':
      return Array.isArray(answer.selected) && answer.selected.length > 0;
    case 'shortText':
    case 'longText':
      return typeof answer.text === 'string' && answer.text.trim().length > 0;
  }
}

/**
 * Conditional visibility. Answers of hidden questions are never deleted — they
 * simply stop being rendered, and reappear intact if the condition flips back.
 */
export function isQuestionVisible(question: Question, answers: Answers): boolean {
  const rule = question.conditionalVisibility;
  if (!rule) return true;

  const controller = questionsById.get(rule.questionId);
  const controllingAnswer = answers[rule.questionId];
  if (!controller || !isAnswered(controller, controllingAnswer)) {
    // Undecided controller: keep the dependent question visible rather than
    // hiding something the respondent has not had a chance to decide about.
    return true;
  }

  const selected = controllingAnswer?.selected;
  const selectedIds = Array.isArray(selected) ? selected : selected ? [selected] : [];
  const matches = selectedIds.some((id) => rule.optionIds.includes(id));

  return rule.rule === 'oneOf' ? matches : !matches;
}

export function getVisibleQuestions(section: Section, answers: Answers): Question[] {
  return section.questions.filter((q) => isQuestionVisible(q, answers));
}

export function getSectionStatus(section: Section, answers: Answers): SectionStatus {
  const visible = getVisibleQuestions(section, answers);
  if (visible.length === 0) return 'complete';
  const answeredCount = visible.filter((q) => isAnswered(q, answers[q.id])).length;
  if (answeredCount === 0) return 'untouched';
  return answeredCount === visible.length ? 'complete' : 'inProgress';
}

export const sectionStatusLabel: Record<SectionStatus, string> = {
  untouched: 'لم يبدأ',
  inProgress: 'قيد الإجابة',
  complete: 'مكتمل',
};

/** Required questions in this section that are visible and still empty. */
export function getMissingRequired(section: Section, answers: Answers): Question[] {
  return getVisibleQuestions(section, answers).filter(
    (q) => q.required && !isAnswered(q, answers[q.id]),
  );
}

export interface SurveyStats {
  totalSections: number;
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  completionPercent: number;
}

/**
 * Progress is measured against *visible* questions only, so hiding an
 * inapplicable branch does not make the survey look permanently incomplete.
 */
export function getSurveyStats(sections: Section[], answers: Answers): SurveyStats {
  const visible = sections.flatMap((s) => getVisibleQuestions(s, answers));
  const answered = visible.filter((q) => isAnswered(q, answers[q.id])).length;
  return {
    totalSections: sections.length,
    totalQuestions: visible.length,
    answeredQuestions: answered,
    unansweredQuestions: visible.length - answered,
    completionPercent: visible.length === 0 ? 0 : Math.round((answered / visible.length) * 100),
  };
}
