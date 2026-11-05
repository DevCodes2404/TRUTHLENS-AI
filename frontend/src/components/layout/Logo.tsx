import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  dark?: boolean;
}

export function Logo({ className, dark = false }: LogoProps) {
  const fg = dark ? '#F1F0EC' : '#151515';
  const accent = '#F04A2D';

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Icon Mark */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Outer square frame */}
        <rect x="1" y="1" width="26" height="26" stroke={fg} strokeWidth="1.5" />
        {/* Inner lens circle */}
        <circle cx="14" cy="14" r="7" stroke={fg} strokeWidth="1.5" />
        {/* Center dot accent */}
        <circle cx="14" cy="14" r="2.5" fill={accent} />
        {/* Corner tick marks */}
        <line x1="1" y1="7" x2="5" y2="7" stroke={accent} strokeWidth="1.5" />
        <line x1="7" y1="1" x2="7" y2="5" stroke={accent} strokeWidth="1.5" />
        <line x1="21" y1="1" x2="21" y2="5" stroke={accent} strokeWidth="1.5" />
        <line x1="23" y1="7" x2="27" y2="7" stroke={accent} strokeWidth="1.5" />
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: fg,
          }}
        >
          TRUTHLENS
          <span style={{ color: accent }}>AI</span>
        </span>
      </div>
    </div>
  );
}
