interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label: string;
  detail?: string;
}

export function ProgressBar({ value, label, detail }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="progress">
      <div className="progress-meta">
        <span>{label}</span>
        {detail ? <span className="progress-value">{detail}</span> : null}
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="progress-fill" style={{ transform: `scaleX(${clamped / 100})` }} />
      </div>
    </div>
  );
}
