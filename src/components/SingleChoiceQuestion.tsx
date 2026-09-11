import type { Answer, Question } from '../types/survey';
import { OptionCard } from './OptionCard';

interface Props {
  question: Question;
  answer: Answer | undefined;
  onSelect: (optionId: string) => void;
  onCustomText: (text: string) => void;
}

export function SingleChoiceQuestion({ question, answer, onSelect, onCustomText }: Props) {
  const options = question.options ?? [];
  const selected = typeof answer?.selected === 'string' ? answer.selected : undefined;
  const dense = options.length >= 7;

  return (
    <div className="options" data-dense={dense}>
      {options.map((option) => {
        const isChecked = selected === option.id;
        return (
          <OptionCard
            key={option.id}
            type="radio"
            name={question.id}
            value={option.id}
            label={option.label}
            checked={isChecked}
            onChange={() => onSelect(option.id)}
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
  );
}
