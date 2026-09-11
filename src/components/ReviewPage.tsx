import { useEffect, useRef } from 'react';
import type { Answers, Survey } from '../types/survey';
import { getAnswerDisplay } from '../utils/answerDisplay';
import { getSurveyStats } from '../utils/validation';
import { AlertIcon, DownloadIcon, EditIcon, PreviousIcon } from './Icons';

interface Props {
  survey: Survey;
  answers: Answers;
  /** Jump back to a section, optionally focusing one question. */
  onEdit: (sectionIndex: number, questionId?: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function ReviewPage({ survey, answers, onEdit, onBack, onSubmit }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stats = getSurveyStats(survey.sections, answers);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="section-animate">
      <header className="section-header">
        <p className="section-counter">الخطوة الأخيرة</p>
        <h2 className="section-title" ref={headingRef} tabIndex={-1}>
          مراجعة الإجابات
        </h2>
        <p className="section-description">
          راجع إجاباتك قبل الإرسال. يمكنك تعديل أي قسم، وإرسال الاستبيان حتى لو بقيت أسئلة اختيارية
          دون إجابة.
        </p>
      </header>

      <div className="review-summary">
        <div className="stat">
          <div className="stat-value">{stats.totalQuestions}</div>
          <div className="stat-label">عدد الأسئلة</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.answeredQuestions}</div>
          <div className="stat-label">الأسئلة المجابة</div>
        </div>
        <div className="stat" data-variant={stats.unansweredQuestions > 0 ? 'warn' : undefined}>
          <div className="stat-value">{stats.unansweredQuestions}</div>
          <div className="stat-label">الأسئلة غير المجابة</div>
        </div>
        <div className="stat">
          <div className="stat-value">{stats.completionPercent}%</div>
          <div className="stat-label">نسبة الاكتمال</div>
        </div>
      </div>

      {survey.sections.map((section, sectionIndex) => (
        <section className="review-section" key={section.id} aria-label={section.title}>
          <header className="review-section-head">
            <h3 className="review-section-title">
              <span className="review-section-ordinal">{section.ordinalLabel}</span>
              {section.title}
            </h3>
            <button
              type="button"
              className="btn btn-secondary review-edit"
              style={{ minHeight: '36px', padding: '0.3rem 0.75rem', fontSize: '0.8125rem' }}
              onClick={() => onEdit(sectionIndex)}
            >
              <EditIcon />
              تعديل
            </button>
          </header>

          <ul className="review-list">
            {section.questions.map((question) => {
              const display = getAnswerDisplay(question, answers);
              return (
                <li className="review-item" key={question.id} data-state={display.state}>
                  <p className="review-question">
                    <span className="review-question-number">{question.number}.</span>
                    {question.text}
                  </p>

                  {display.state === 'answered' ? (
                    <div className="review-answer">
                      {display.text ? (
                        <span style={{ whiteSpace: 'pre-wrap' }}>{display.text}</span>
                      ) : (
                        <ul>
                          {display.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : display.state === 'notApplicable' ? (
                    <p className="review-answer" data-state="na">
                      {display.note}
                    </p>
                  ) : (
                    <p className="review-answer" data-state="empty">
                      <AlertIcon size={14} />
                      لم تتم الإجابة
                      <span className="review-divider" aria-hidden="true">
                        ·
                      </span>
                      <button
                        type="button"
                        className="review-jump"
                        onClick={() => onEdit(sectionIndex, question.id)}
                      >
                        {`الانتقال إلى السؤال ${question.number}`}
                      </button>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p
        className="question-hint"
        style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
      >
        <AlertIcon size={14} />
        {`الأسئلة غير المجابة: ${stats.unansweredQuestions}`}
      </p>

      <nav className="nav-footer" data-layout="review" aria-label="التنقل">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          <PreviousIcon />
          العودة للتعديل
        </button>
        <span className="nav-spacer" />
        <button type="button" className="btn btn-primary" onClick={onSubmit}>
          <DownloadIcon />
          إنهاء الاستبيان وتحميل الملف
        </button>
      </nav>
    </div>
  );
}
