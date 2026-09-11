import { useCallback, useMemo, useState } from 'react';
import type { Answers, Question } from '../types/survey';
import { survey } from '../data/survey';
import { clearPersistedState, loadPersistedState, useAutosave } from './useAutosave';
import { getMissingRequired, getSurveyStats } from '../utils/validation';

/** `number` = section index. */
export type Step = number | 'review' | 'done';

const initial = loadPersistedState();

export function useSurvey() {
  const [answers, setAnswers] = useState<Answers>(() => initial?.answers ?? {});
  const [step, setStep] = useState<Step>(() =>
    Math.min(initial?.sectionIndex ?? 0, survey.sections.length - 1),
  );
  /** Section indices whose validation errors are currently revealed. */
  const [validatedSections, setValidatedSections] = useState<number[]>([]);
  /** Question id that just refused an extra selection — drives the limit pulse. */
  const [limitPulse, setLimitPulse] = useState<string | null>(null);
  const [restored] = useState(() => initial !== null);
  /** Question to focus after jumping back from the review page. */
  const [focusQuestionId, setFocusQuestionId] = useState<string | null>(null);

  const saveStatus = useAutosave(answers, typeof step === 'number' ? step : 0);

  const sectionIndex = typeof step === 'number' ? step : survey.sections.length - 1;
  const currentSection = survey.sections[sectionIndex];

  const stats = useMemo(() => getSurveyStats(survey.sections, answers), [answers]);

  const setSingle = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], selected: optionId },
    }));
  }, []);

  const toggleMulti = useCallback((question: Question, optionId: string) => {
    setAnswers((prev) => {
      const current = prev[question.id]?.selected;
      const list = Array.isArray(current) ? current : [];
      const isSelected = list.includes(optionId);

      if (!isSelected && question.maxSelections && list.length >= question.maxSelections) {
        setLimitPulse(question.id);
        window.setTimeout(() => setLimitPulse((id) => (id === question.id ? null : id)), 600);
        return prev;
      }

      const next = isSelected ? list.filter((id) => id !== optionId) : [...list, optionId];
      return { ...prev, [question.id]: { ...prev[question.id], selected: next } };
    });
  }, []);

  /** Used both for text questions and for the "أخرى" free-text field. */
  const setText = useCallback((questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], text } }));
  }, []);

  const missingRequired = useMemo(
    () => (currentSection ? getMissingRequired(currentSection, answers) : []),
    [currentSection, answers],
  );

  const showErrors = validatedSections.includes(sectionIndex);

  const revealErrors = useCallback((index: number) => {
    setValidatedSections((prev) => (prev.includes(index) ? prev : [...prev, index]));
  }, []);

  const goToSection = useCallback((index: number, questionId?: string) => {
    setFocusQuestionId(questionId ?? null);
    setStep(index);
  }, []);

  const goNext = useCallback(() => {
    if (typeof step !== 'number') return false;
    if (getMissingRequired(survey.sections[step], answers).length > 0) {
      revealErrors(step);
      return false;
    }
    setFocusQuestionId(null);
    setStep(step + 1 >= survey.sections.length ? 'review' : step + 1);
    return true;
  }, [step, answers, revealErrors]);

  const goPrevious = useCallback(() => {
    setFocusQuestionId(null);
    setStep((prev) => {
      if (prev === 'review') return survey.sections.length - 1;
      if (typeof prev === 'number' && prev > 0) return prev - 1;
      return prev;
    });
  }, []);

  const goToReview = useCallback(() => setStep('review'), []);
  const complete = useCallback(() => setStep('done'), []);

  const clearAll = useCallback(() => {
    clearPersistedState();
    setAnswers({});
    setValidatedSections([]);
    setStep(0);
  }, []);

  return {
    survey,
    answers,
    step,
    sectionIndex,
    currentSection,
    stats,
    saveStatus,
    restored,
    missingRequired,
    showErrors,
    limitPulse,
    focusQuestionId,
    setSingle,
    toggleMulti,
    setText,
    goToSection,
    goNext,
    goPrevious,
    goToReview,
    complete,
    clearAll,
  };
}

export type SurveyController = ReturnType<typeof useSurvey>;
