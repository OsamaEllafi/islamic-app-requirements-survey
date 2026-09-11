/**
 * Inline icon set. Kept local so the app ships without an icon dependency and
 * every glyph inherits `currentColor` and the surrounding font size.
 */

interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

export const CheckIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} strokeWidth={3} className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const DotIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />
  </svg>
);

/** Points toward the reading direction's "back" — in RTL that is to the right. */
export const PreviousIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const NextIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ClockIcon = ({ size = 15, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ShieldIcon = ({ size = 15, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3l7 3v6c0 4.2-2.9 7.8-7 9-4.1-1.2-7-4.8-7-9V6z" />
  </svg>
);

export const AlertIcon = ({ size = 15, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

export const InfoIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);

export const TrashIcon = ({ size = 20, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </svg>
);

export const CloseIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const DownloadIcon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
  </svg>
);

export const FileIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </svg>
);

export const EditIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20h4l10-10-4-4L4 16z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

export const StarIcon = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path
      d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 8.7l5.4-.8z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

/** Eight-point star — the app's quiet Islamic geometric motif. */
export const GeometricMark = ({ size = 14, className }: IconProps) => (
  <svg {...base(size)} strokeWidth={1.6} className={className}>
    <path d="M12 2.5 21.5 12 12 21.5 2.5 12z" />
    <path d="M5.4 5.4h13.2v13.2H5.4z" />
  </svg>
);

export const ListIcon = ({ size = 16, className }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" />
  </svg>
);
