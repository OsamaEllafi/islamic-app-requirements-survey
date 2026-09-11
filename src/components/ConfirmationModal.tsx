import { useCallback, useEffect, useRef, useState } from 'react';
import { TrashIcon } from './Icons';

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const EXIT_MS = 150;

/**
 * Confirmation dialog for destructive actions. Enter is a settle; exit is
 * roughly a third of the duration — the user has already decided by then and
 * anything slower reads as lag.
 */
export function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      restoreFocusTo.current?.focus();
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, mounted]);

  // Move focus to the safe (cancel) action, never to the destructive one.
  useEffect(() => {
    if (mounted && !closing) cancelRef.current?.focus();
  }, [mounted, closing]);

  // Stop the page behind the dialog from scrolling on touch devices.
  useEffect(() => {
    if (!mounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mounted]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCancel();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onCancel],
  );

  if (!mounted) return null;

  return (
    <div
      className="modal-overlay"
      data-state={closing ? 'closing' : 'open'}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        className="modal"
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="modal-icon" aria-hidden="true">
          <TrashIcon size={20} />
        </div>
        <h2 className="modal-title" id="modal-title">
          {title}
        </h2>
        <p className="modal-text" id="modal-description">
          {description}
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" ref={cancelRef} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
