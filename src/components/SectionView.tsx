import { useEffect, useRef } from 'react';
import type { Answers, Question, Section } from '../types/survey';
import { QuestionRenderer } from './QuestionRenderer';
import { NextIcon, PreviousIcon } from './Icons';
import { getVisibleQuestions } from '../utils/validation';

interface Props {
  section: Section;
  sectionIndex: number;
  totalSections: number;
  answers: Answers;
  showErrors: boolean;
  limitPulse: string | null;
  onSelectSingle: (questionId: string, optionId: string) => void;
  onToggleMulti: (question: Question, optionId: string) => void;
  onText: (questionId: string, text: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  /** Question id to scroll to and focus, when arriving from the review page. */
  focusQuestionId: string | null;
}

export function SectionView({
  section,
  sectionIndex,
  totalSections,
  answers,
  showErrors,
  limitPulse,
  onSelectSingle,
  onToggleMulti,
  onText,
  onPrevious,
  onNext,
  focusQuestionId,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const visibleQuestions = getVisibleQuestions(section, answers);

  // Arriving at a new section: return to the top and move focus to the heading
  // so keyboard and screen-reader users start where sighted users do.
  useEffect(() => {
    if (focusQuestionId) {
      const target = document.getElementById(focusQuestionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.focus({ preventScroll: true });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    headingRef.current?.focus({ preventScroll: true });
  }, [section.id, focusQuestionId]);

  const isLast = sectionIndex === totalSections - 1;

  return (
    <div className="section-animate">
      <header className="section-header">
        <p className="section-counter">{`القسم ${sectionIndex + 1} من ${totalSections}`}</p>
        <h2 className="section-title" ref={headingRef} tabIndex={-1}>
          {section.title}
        </h2>
        <p className="section-description">{section.description}</p>
      </header>

      <div className="section-body">
        {visibleQuestions.map((question, index) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            index={index}
            answer={answers[question.id]}
            showError={showErrors && !!question.required}
            pulsing={limitPulse === question.id}
            onSelectSingle={(optionId) => onSelectSingle(question.id, optionId)}
            onToggleMulti={(optionId) => onToggleMulti(question, optionId)}
            onText={(text) => onText(question.id, text)}
          />
        ))}
      </div>

      <nav className="nav-footer" aria-label="التنقل بين الأقسام">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onPrevious}
          disabled={sectionIndex === 0}
        >
          <PreviousIcon />
          السابق
        </button>
        <span className="nav-spacer" />
        <button type="button" className="btn btn-primary" onClick={onNext}>
          {isLast ? (
            <>
              {/* The full label wraps to two lines in a split mobile footer */}
              <span className="label-wide">مراجعة الإجابات</span>
              <span className="label-narrow">المراجعة</span>
            </>
          ) : (
            'التالي'
          )}
          <NextIcon />
        </button>
      </nav>
    </div>
  );
}
