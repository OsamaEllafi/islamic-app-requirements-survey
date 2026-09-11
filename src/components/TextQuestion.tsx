import type { Answer, Question } from '../types/survey';

interface Props {
  question: Question;
  answer: Answer | undefined;
  onChange: (text: string) => void;
  /** Id of the visible question label, so the field is announced with it. */
  labelledBy: string;
}

export function TextQuestion({ question, answer, onChange, labelledBy }: Props) {
  const shared = {
    id: `${question.id}-field`,
    className: 'text-field',
    value: answer?.text ?? '',
    placeholder: question.placeholder,
    'aria-labelledby': labelledBy,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
  };

  return question.type === 'longText' ? (
    <textarea {...shared} rows={6} />
  ) : (
    <input {...shared} type="text" autoComplete="off" />
  );
}
