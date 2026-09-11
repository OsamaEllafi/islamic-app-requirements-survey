import type { ReactNode } from 'react';

interface OptionCardProps {
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  /** Visually dimmed because a selection cap has been reached. */
  softDisabled?: boolean;
  describedBy?: string;
  children?: ReactNode;
}

/**
 * A selectable card built on a real input, so keyboard behaviour (arrow keys
 * within a radio group, space to toggle a checkbox) and screen-reader
 * semantics come from the platform rather than from ARIA patched on top.
 */
export function OptionCard({
  type,
  name,
  value,
  label,
  checked,
  onChange,
  softDisabled,
  describedBy,
  children,
}: OptionCardProps) {
  return (
    <div>
      <label
        className="option"
        data-selected={checked}
        data-disabled={softDisabled && !checked ? 'true' : undefined}
      >
        <input
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          aria-describedby={describedBy}
        />
        <span
          className="option-indicator"
          data-shape={type === 'radio' ? 'radio' : 'checkbox'}
          aria-hidden="true"
        >
          {type === 'radio' ? (
            <svg width="8" height="8" viewBox="0 0 8 8" focusable="false">
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
          ) : (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              focusable="false"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          )}
        </span>
        <span className="option-label">{label}</span>
      </label>
      {children}
    </div>
  );
}
