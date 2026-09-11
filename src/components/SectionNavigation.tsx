import { useEffect, useRef } from 'react';
import type { Answers, Section } from '../types/survey';
import { getSectionStatus, sectionStatusLabel } from '../utils/validation';
import { CheckIcon, ListIcon } from './Icons';
import { ProgressBar } from './ProgressBar';

interface NavProps {
  sections: Section[];
  answers: Answers;
  /** Section index, or 'review' when the review page is open. */
  current: number | 'review';
  onSelect: (index: number) => void;
  onReview: () => void;
  completionPercent: number;
  onClearRequest: () => void;
}

const REVIEW_LABEL = 'المراجعة والإرسال';

export function SectionNavigation({
  sections,
  answers,
  current,
  onSelect,
  onReview,
  completionPercent,
  onClearRequest,
}: NavProps) {
  return (
    <nav className="sidebar" aria-label="أقسام الاستبيان">
      <div className="sidebar-card">
        <p className="sidebar-heading">أقسام الاستبيان</p>

        <ol className="step-list">
          {sections.map((section, index) => {
            const status = getSectionStatus(section, answers);
            const isCurrent = current === index;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  className="step-button"
                  aria-current={isCurrent ? 'step' : undefined}
                  onClick={() => onSelect(index)}
                >
                  <span className="step-index" data-status={status} aria-hidden="true">
                    {status === 'complete' ? <CheckIcon size={12} /> : index + 1}
                  </span>
                  <span className="step-text">
                    <span className="step-title">{section.title}</span>
                    <span className="step-status">{sectionStatusLabel[status]}</span>
                  </span>
                </button>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              className="step-button"
              aria-current={current === 'review' ? 'step' : undefined}
              onClick={onReview}
            >
              <span className="step-index" aria-hidden="true">
                <ListIcon size={12} />
              </span>
              <span className="step-text">
                <span className="step-title">{REVIEW_LABEL}</span>
                <span className="step-status">مراجعة كل الإجابات</span>
              </span>
            </button>
          </li>
        </ol>

        <div className="sidebar-footer">
          <ProgressBar
            value={completionPercent}
            label="نسبة الاكتمال"
            detail={`${completionPercent}%`}
          />
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: '0.75rem' }}
            onClick={onClearRequest}
          >
            مسح جميع الإجابات
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * Compact step strip for small screens. The active pill is scrolled into view
 * on change so the respondent never loses their place in the row.
 */
export function MobileStepNav({
  sections,
  answers,
  current,
  onSelect,
  onReview,
  completionPercent,
}: Omit<NavProps, 'onClearRequest'>) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const active = row.querySelector<HTMLElement>('[aria-current="step"]');
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [current]);

  // The section number lives in the card header, so the strip only names the
  // section — repeating "القسم ٣ من ٧" twice on one screen is noise.
  const label = current === 'review' ? REVIEW_LABEL : sections[current].title;

  return (
    <div className="mobile-steps">
      <div className="shell mobile-steps-inner">
        <div className="pill-row" ref={rowRef} role="tablist" aria-label="أقسام الاستبيان">
          {sections.map((section, index) => {
            const status = getSectionStatus(section, answers);
            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                className="pill"
                data-status={status}
                aria-current={current === index ? 'step' : undefined}
                aria-selected={current === index}
                aria-label={`${section.title} — ${sectionStatusLabel[status]}`}
                onClick={() => onSelect(index)}
              >
                {status === 'complete' ? <CheckIcon size={12} className="pill-check" /> : null}
                {index + 1}
              </button>
            );
          })}
          <button
            type="button"
            role="tab"
            className="pill"
            aria-current={current === 'review' ? 'step' : undefined}
            aria-selected={current === 'review'}
            onClick={onReview}
          >
            {REVIEW_LABEL}
          </button>
        </div>

        <ProgressBar value={completionPercent} label={label} detail={`${completionPercent}%`} />
      </div>
    </div>
  );
}
