import type { Answers, Question, Survey } from '../types/survey';
import { isAnswered, isQuestionVisible } from './validation';

const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const pad = (n: number) => String(n).padStart(2, '0');

/** "11 سبتمبر 2026" — built manually so digits stay Latin and parseable. */
export function formatArabicDate(date: Date): string {
  return `${date.getDate()} ${ARABIC_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** "14:30" */
export function formatTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** islamic-app-requirements-2026-09-11.md */
export function buildFilename(date: Date): string {
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `islamic-app-requirements-${stamp}.md`;
}

const NOT_ANSWERED = 'لم تتم الإجابة.';

/** Renders one question's answer block, including "أخرى" free text. */
function renderAnswer(question: Question, answers: Answers): string[] {
  const answer = answers[question.id];

  if (!isAnswered(question, answer)) return [NOT_ANSWERED];

  if (question.type === 'shortText' || question.type === 'longText') {
    return (answer?.text ?? '').trim().split(/\r?\n/);
  }

  const selectedIds = Array.isArray(answer?.selected)
    ? answer.selected
    : answer?.selected
      ? [answer.selected]
      : [];

  return selectedIds.map((id) => {
    const option = question.options?.find((o) => o.id === id);
    if (!option) return `- ${id}`;
    if (option.allowsCustomText) {
      const custom = (answer?.text ?? '').trim();
      return custom ? `- ${option.label}: ${custom}` : `- ${option.label}: (لم يتم تحديدها)`;
    }
    return `- ${option.label}`;
  });
}

export interface ExportResult {
  filename: string;
  markdown: string;
}

/**
 * Builds the deliverable Markdown. The shape is intentionally regular —
 * one `##` per section, one `###` per numbered question, one `**الإجابة:**`
 * block each — so it can be fed straight to a developer or an AI to produce a
 * project scope, an SRS, and an MVP definition.
 */
export function generateMarkdown(survey: Survey, answers: Answers, date = new Date()): ExportResult {
  const lines: string[] = [];

  const allQuestions = survey.sections.flatMap((s) => s.questions);
  const applicable = allQuestions.filter((q) => isQuestionVisible(q, answers));
  const answeredCount = applicable.filter((q) => isAnswered(q, answers[q.id])).length;
  const unansweredCount = applicable.length - answeredCount;
  const notApplicableCount = allQuestions.length - applicable.length;
  const completion =
    applicable.length === 0 ? 0 : Math.round((answeredCount / applicable.length) * 100);

  lines.push(`# إجابات ${survey.title}`);
  lines.push('');
  lines.push(`**تاريخ الإرسال:** ${formatArabicDate(date)}  `);
  lines.push(`**وقت الإرسال:** ${formatTime(date)}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## ملخص الاستبيان');
  lines.push('');
  lines.push(`- عدد الأقسام: ${survey.sections.length}`);
  lines.push(`- عدد الأسئلة: ${allQuestions.length}`);
  lines.push(`- الأسئلة المجابة: ${answeredCount}`);
  lines.push(`- الأسئلة غير المجابة: ${unansweredCount}`);
  if (notApplicableCount > 0) {
    lines.push(`- الأسئلة غير المنطبقة: ${notApplicableCount}`);
  }
  lines.push(`- نسبة الاكتمال: ${completion}%`);
  lines.push('');

  for (const section of survey.sections) {
    lines.push('---');
    lines.push('');
    lines.push(`## ${section.ordinalLabel}: ${section.title}`);
    lines.push('');

    for (const question of section.questions) {
      lines.push(`### ${question.number}. ${question.text}`);
      lines.push('');
      lines.push('**الإجابة:**');
      lines.push('');

      if (!isQuestionVisible(question, answers)) {
        const note = question.conditionalVisibility?.hiddenNote;
        lines.push(note ? `لا ينطبق — ${note}` : 'لا ينطبق على هذا المشروع.');
      } else {
        lines.push(...renderAnswer(question, answers));
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('');
  lines.push(
    '> تم إنشاء هذا الملف تلقائيًا من نموذج الاستبيان. الإجابات محفوظة محليًا على جهاز العميل ولم تُرسل إلى أي خادم.',
  );
  lines.push('');

  return { filename: buildFilename(date), markdown: lines.join('\n') };
}

/** Triggers a browser download without any server round-trip. */
export function downloadMarkdown({ filename, markdown }: ExportResult): void {
  // No BOM: modern editors and Markdown parsers read UTF-8 directly, and a BOM
  // can surface as a stray character in tools that read the file naively.
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke on the next tick so Safari has time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
