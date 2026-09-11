/**
 * Survey data model.
 *
 * Everything the UI renders is derived from this structure — there is no
 * per-question bespoke rendering. Adding a question means adding an object.
 */

export type QuestionType = 'single' | 'multi' | 'shortText' | 'longText';

export interface Option {
  /** Stable id used as the storage key. Never change it for an existing option. */
  id: string;
  /** Arabic label exactly as written in the source questionnaire. */
  label: string;
  /** When true, selecting this option reveals a free-text field ("أخرى: ______"). */
  allowsCustomText?: boolean;
}

/**
 * A visibility rule. The question is shown when the referenced question's answer
 * satisfies the rule. Rules are declarative so conditional logic stays in one
 * readable place instead of being scattered through components.
 */
export interface ConditionalVisibility {
  /** Question whose answer decides the visibility. */
  questionId: string;
  /**
   * `notOneOf` — visible unless the single-choice answer is one of these option ids.
   * `oneOf`    — visible only when the single-choice answer is one of these option ids.
   */
  rule: 'notOneOf' | 'oneOf';
  optionIds: string[];
  /** Shown on the review page to explain why a question was skipped. */
  hiddenNote?: string;
}

export interface Question {
  id: string;
  /** 1-based number preserved from the source questionnaire. */
  number: number;
  type: QuestionType;
  text: string;
  /** Short assistive line under the question, when the source implies one. */
  hint?: string;
  required?: boolean;
  options?: Option[];
  /** Hard cap for `multi` questions. Enforced in the UI. */
  maxSelections?: number;
  /** Renders the question with extra visual weight (V1 priorities). */
  emphasis?: boolean;
  conditionalVisibility?: ConditionalVisibility;
  placeholder?: string;
}

export interface Section {
  id: string;
  /** "القسم الأول" — preserved from the source, used in the exported Markdown. */
  ordinalLabel: string;
  title: string;
  /** One-line explanation shown at the top of the section. */
  description: string;
  questions: Question[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  sections: Section[];
}

/** A single question's answer. `custom` holds the "أخرى" free text. */
export interface Answer {
  /** Option id for `single`, list of option ids for `multi`. */
  selected?: string | string[];
  /** Free text for text questions, or the "أخرى" text for choice questions. */
  text?: string;
}

export type Answers = Record<string, Answer>;

export type SectionStatus = 'untouched' | 'inProgress' | 'complete';
