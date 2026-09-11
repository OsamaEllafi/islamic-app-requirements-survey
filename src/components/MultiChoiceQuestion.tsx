import type { Answer, Question } from '../types/survey';
import { OptionCard } from './OptionCard';
import { CheckIcon } from './Icons';

interface Props {
  question: Question;
  answer: Answer | undefined;
  onToggle: (optionId: string) => void;
  onCustomText: (text: string) => void;
  /** True while this question has just refused an extra selection. */
  pulsing: boolean;
}

export function MultiChoiceQuestion({ question, answer, onToggle, onCustomText, pulsing }: Props) {
  const options = question.options ?? [];
  const selected = Array.isArray(answer?.selected) ? answer.selected : [];
  const max = question.maxSelections;
  const atLimit = max !== undefined && selected.length >= max;
  const counterId = `${question.id}-counter`;
  const dense = options.length >= 7;

  return (
    <>
      {max !== undefined ? (
        <p
          className="selection-counter"
          id={counterId}
          data-full={atLimit}
          data-pulse={pulsing}
          role="status"
        >
          {atLimit ? (
            <>{`تم اختيار ${selected.length} من ${max} — ألغِ اختيارًا لإضافة غيره`}</>
          ) : (
            <>
              <CheckIcon size={12} />
              {`تم اختيار ${selected.length} من ${max}`}
            </>
          )}
        </p>
      ) : null}

      <div className="options" data-dense={dense}>
        {options.map((option) => {
          const isChecked = selected.includes(option.id);
          return (
            <OptionCard
              key={option.id}
              type="checkbox"
              name={question.id}
              value={option.id}
              label={option.label}
              checked={isChecked}
              onChange={() => onToggle(option.id)}
              softDisabled={atLimit}
              describedBy={max !== undefined ? counterId : undefined}
            >
              {option.allowsCustomText && isChecked ? (
                <div className="custom-field">
                  <label className="sr-only" htmlFor={`${question.id}-custom`}>
                    {`تفاصيل الإجابة "${option.label}" للسؤال ${question.number}`}
                  </label>
                  <input
                    id={`${question.id}-custom`}
                    className="text-field"
                    type="text"
                    autoComplete="off"
                    placeholder="اكتب إجابتك هنا…"
                    value={answer?.text ?? ''}
                    onChange={(event) => onCustomText(event.target.value)}
                  />
                </div>
              ) : null}
            </OptionCard>
          );
        })}
      </div>
    </>
  );
}
