import { useEffect, useRef } from 'react';
import { CheckIcon, DownloadIcon, FileIcon, PreviousIcon } from './Icons';

interface Props {
  filename: string;
  answeredQuestions: number;
  totalQuestions: number;
  onDownloadAgain: () => void;
  onBackToSurvey: () => void;
}

export function SuccessPage({
  filename,
  answeredQuestions,
  totalQuestions,
  onDownloadAgain,
  onBackToSurvey,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="success" role="status">
      <div className="success-mark" aria-hidden="true">
        <CheckIcon size={28} />
      </div>

      <h2 className="success-title" ref={headingRef} tabIndex={-1}>
        تم إكمال الاستبيان بنجاح
      </h2>

      <p className="success-text">
        {`تم إنشاء ملف الإجابات وتحميله على جهازك (${answeredQuestions} من ${totalQuestions} سؤالًا مجابًا). يمكنك إرسال هذا الملف إلى فريق التطوير لبناء نطاق المشروع ووثيقة المتطلبات.`}
      </p>

      <p className="success-file">
        <FileIcon />
        {filename}
      </p>

      <div className="success-actions">
        <button type="button" className="btn btn-primary" onClick={onDownloadAgain}>
          <DownloadIcon />
          تحميل الملف مرة أخرى
        </button>
        <button type="button" className="btn btn-secondary" onClick={onBackToSurvey}>
          <PreviousIcon />
          العودة إلى الاستبيان
        </button>
      </div>

      <p className="question-hint" style={{ marginTop: '1.5rem' }}>
        إجاباتك ما زالت محفوظة على هذا الجهاز، ويمكنك تعديلها وإعادة تحميل الملف في أي وقت.
      </p>
    </div>
  );
}
