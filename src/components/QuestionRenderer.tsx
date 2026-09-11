import type { Answer, Question } from '../types/survey';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { MultiChoiceQuestion } from './MultiChoiceQuestion';
import { TextQuestion } from './TextQuestion';
import { AlertIcon, StarIcon } from './Icons';

interface Props {
  question: Question;
  /** Position within the section — drives the entrance stagger only. */
  index: number;
  answer: Answer | undefined;
  showError: boolean;
  pulsing: boolean;
  onSelectSingle: (optionId: string) => void;
  onToggleMulti: (optionId: string) => void;
  onText: (text: string) => void;
}

const typeHint: Partial<Record<Question['type'], string>> = {
  multi: 'يمكن اختيار أكثر من إجابة',
  single: 'اختر إجابة واحدة',
};

/**
 * Renders any question from its configuration. There is deliberately no
 * per-question special casing here — new question types are added by extending
 * the switch, not by branching in the section view.
 */
export function QuestionRenderer({
  question,
  index,
  answer,
  showError,
  pulsing,
  onSelectSingle,
  onToggleMulti,
  onText,
}: Props) {
  const labelId = `${question.id}-label`;
  const errorId = `${question.id}-error`;
  const isChoice = question.type === 'single' || question.type === 'multi';
  const hasError = showError && question.required;

  const head = (
    <div className="question-head">
      <div className="question-meta">
        <span className="question-number">{`السؤال ${question.number}`}</span>
        {question.emphasis ? (
          <span className="tag" data-variant="accent">
            <StarIcon size={10} /> أولويات النسخة الأولى
          </span>
        ) : null}
        {!question.required ? <span className="tag">اختياري</span> : null}
        {typeHint[question.type] ? <span className="tag">{typeHint[question.type]}</span> : null}
      </div>

      <p className="question-text" id={labelId}>
        {question.text}
      </p>

      {question.hint ? <p className="question-hint">{question.hint}</p> : null}

      {hasError ? (
        <p className="question-error" id={errorId} role="alert">
          <AlertIcon size={14} />
          هذا السؤال مطلوب للمتابعة.
        </p>
      ) : null}
    </div>
  );

  const body = () => {
    switch (question.type) {
      case 'single':
        return (
          <SingleChoiceQuestion
            question={question}
            answer={answer}
            onSelect={onSelectSingle}
            onCustomText={onText}
          />
        );
      case 'multi':
        return (
          <MultiChoiceQuestion
            question={question}
            answer={answer}
            onToggle={onToggleMulti}
            onCustomText={onText}
            pulsing={pulsing}
          />
        );
      default:
        return (
          <TextQuestion
            question={question}
            answer={answer}
            onChange={onText}
            labelledBy={labelId}
          />
        );
    }
  };

  return (
    <section
      className="question question-stagger"
      id={question.id}
      data-emphasis={question.emphasis ? 'true' : undefined}
      style={{ '--i': index } as React.CSSProperties}
      aria-labelledby={labelId}
      tabIndex={-1}
    >
      {head}
      {isChoice ? (
        <div
          role={question.type === 'single' ? 'radiogroup' : 'group'}
          aria-labelledby={labelId}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
        >
          {body()}
        </div>
      ) : (
        body()
      )}
    </section>
  );
}
