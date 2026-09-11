import type { ReactNode } from 'react';
import type { SaveStatus } from '../hooks/useAutosave';
import { ClockIcon, CloseIcon, GeometricMark, InfoIcon, ShieldIcon } from './Icons';

interface Props {
  title: string;
  description: string;
  estimatedTime: string;
  saveStatus: SaveStatus;
  showRestoreNotice: boolean;
  onDismissRestoreNotice: () => void;
  navigation: ReactNode;
  mobileNavigation: ReactNode;
  /** The sidebar carries this action on desktop; the footer covers small screens. */
  onClearRequest: () => void;
  children: ReactNode;
}

const saveLabel: Record<SaveStatus, string> = {
  idle: 'لم يتم إجراء أي تعديل بعد',
  saving: 'جارٍ الحفظ…',
  saved: 'تم حفظ التقدم تلقائيًا',
};

const PRIVACY_NOTE = 'يتم حفظ إجاباتك محليًا على هذا الجهاز ولا يتم إرسالها إلى أي خادم.';

export function SurveyLayout({
  title,
  description,
  estimatedTime,
  saveStatus,
  showRestoreNotice,
  onDismissRestoreNotice,
  navigation,
  mobileNavigation,
  onClearRequest,
  children,
}: Props) {
  return (
    <div className="app">
      <a className="skip-link" href="#survey-content">
        تخطَّ إلى محتوى الاستبيان
      </a>

      <header className="site-header">
        <div className="shell">
          <p className="header-eyebrow">
            <GeometricMark size={13} />
            استبيان متطلبات
          </p>

          <h1 className="site-title">{title}</h1>
          <p className="site-subtitle">{description}</p>

          <div className="header-meta">
            <span className="meta-item">
              <ClockIcon />
              {estimatedTime}
            </span>
            <span className="save-indicator" data-status={saveStatus} role="status">
              <span className="save-dot" aria-hidden="true" />
              {saveLabel[saveStatus]}
            </span>
          </div>

          {showRestoreNotice ? (
            <div className="restore-notice" role="status">
              <InfoIcon size={16} />
              تم استعادة إجاباتك السابقة.
              <button type="button" onClick={onDismissRestoreNotice} aria-label="إخفاء الإشعار">
                <CloseIcon size={14} />
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {mobileNavigation}

      <div className="shell layout">
        {navigation}
        <main id="survey-content" className="survey-card" tabIndex={-1}>
          {children}
        </main>
      </div>

      <footer className="site-footer">
        <div className="shell">
          <span className="privacy-note">
            <ShieldIcon />
            {PRIVACY_NOTE}
          </span>
          <span className="footer-note">لا يتم استخدام أي أدوات تتبع أو تحليلات في هذا النموذج.</span>
          <button type="button" className="btn btn-ghost footer-clear" onClick={onClearRequest}>
            مسح جميع الإجابات
          </button>
        </div>
      </footer>
    </div>
  );
}
