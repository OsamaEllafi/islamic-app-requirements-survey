import { useEffect, useState } from 'react';
import { useSurvey } from './hooks/useSurvey';
import { SurveyLayout } from './components/SurveyLayout';
import { MobileStepNav, SectionNavigation } from './components/SectionNavigation';
import { SectionView } from './components/SectionView';
import { ReviewPage } from './components/ReviewPage';
import { SuccessPage } from './components/SuccessPage';
import { ConfirmationModal } from './components/ConfirmationModal';
import { downloadMarkdown, generateMarkdown } from './utils/markdownExport';
import type { ExportResult } from './utils/markdownExport';

export default function App() {
  const s = useSurvey();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);

  // The restore notice is informational — it retires on its own instead of
  // waiting for a dismissal the respondent has no reason to bother with.
  useEffect(() => {
    if (!s.restored) return;
    const timer = window.setTimeout(() => setNoticeDismissed(true), 8000);
    return () => window.clearTimeout(timer);
  }, [s.restored]);

  const handleSubmit = () => {
    const result = generateMarkdown(s.survey, s.answers);
    setLastExport(result);
    downloadMarkdown(result);
    s.complete();
  };

  const handleClearConfirmed = () => {
    setConfirmClearOpen(false);
    setLastExport(null);
    setNoticeDismissed(true);
    s.clearAll();
  };

  const navCurrent = s.step === 'done' ? 'review' : s.step;

  return (
    <>
      <SurveyLayout
        title={s.survey.title}
        description={s.survey.description}
        estimatedTime={s.survey.estimatedTime}
        saveStatus={s.saveStatus}
        showRestoreNotice={s.restored && !noticeDismissed}
        onDismissRestoreNotice={() => setNoticeDismissed(true)}
        onClearRequest={() => setConfirmClearOpen(true)}
        navigation={
          <SectionNavigation
            sections={s.survey.sections}
            answers={s.answers}
            current={navCurrent}
            onSelect={(index) => s.goToSection(index)}
            onReview={s.goToReview}
            completionPercent={s.stats.completionPercent}
            onClearRequest={() => setConfirmClearOpen(true)}
          />
        }
        mobileNavigation={
          <MobileStepNav
            sections={s.survey.sections}
            answers={s.answers}
            current={navCurrent}
            onSelect={(index) => s.goToSection(index)}
            onReview={s.goToReview}
            completionPercent={s.stats.completionPercent}
          />
        }
      >
        {s.step === 'done' && lastExport ? (
          <SuccessPage
            filename={lastExport.filename}
            answeredQuestions={s.stats.answeredQuestions}
            totalQuestions={s.stats.totalQuestions}
            onDownloadAgain={() => downloadMarkdown(lastExport)}
            onBackToSurvey={() => s.goToSection(0)}
          />
        ) : s.step === 'review' ? (
          <ReviewPage
            survey={s.survey}
            answers={s.answers}
            onEdit={(sectionIndex, questionId) => s.goToSection(sectionIndex, questionId)}
            onBack={s.goPrevious}
            onSubmit={handleSubmit}
          />
        ) : (
          <SectionView
            // Remounting per section replays the entrance animation and resets
            // scroll/focus without any imperative bookkeeping.
            key={s.currentSection.id}
            section={s.currentSection}
            sectionIndex={s.sectionIndex}
            totalSections={s.survey.sections.length}
            answers={s.answers}
            showErrors={s.showErrors}
            limitPulse={s.limitPulse}
            focusQuestionId={s.focusQuestionId}
            onSelectSingle={s.setSingle}
            onToggleMulti={s.toggleMulti}
            onText={s.setText}
            onPrevious={s.goPrevious}
            onNext={s.goNext}
          />
        )}
      </SurveyLayout>

      <ConfirmationModal
        open={confirmClearOpen}
        title="مسح جميع الإجابات؟"
        description="سيتم حذف كل ما أدخلته في هذا الاستبيان من هذا الجهاز نهائيًا، ولا يمكن التراجع عن هذا الإجراء."
        confirmLabel="نعم، امسح الكل"
        cancelLabel="إلغاء"
        onConfirm={handleClearConfirmed}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </>
  );
}
