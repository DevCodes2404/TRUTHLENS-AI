import React from 'react';
import { cn } from '@/lib/utils';
import type { AuthenticityLabel, ScanStatus } from '@/types';

/* ── Skeleton ──────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse', className)}
      style={{ background: '#E6E4DF', borderRadius: 2 }}
      aria-hidden="true"
    />
  );
}

/* ── Progress Bar ───────────────────────────── */
interface ProgressBarProps {
  value: number;
  label?: string;
  showLabel?: boolean;
  variant?: 'accent' | 'dark' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

const progressColors = {
  accent: '#F04A2D',
  dark:   '#151515',
  muted:  '#AAAAAA',
};

export function ProgressBar({
  value,
  label,
  showLabel,
  variant = 'dark',
  size = 'md',
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const height = size === 'sm' ? 2 : 3;

  return (
    <div className={cn('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.75rem',
                color: '#686868',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </span>
          )}
          {showLabel && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.75rem',
                color: '#151515',
                fontWeight: 500,
              }}
            >
              {clamped.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          background: '#E6E4DF',
          borderRadius: 1,
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            background: progressColors[variant],
            transition: 'width 300ms ease',
          }}
        />
      </div>
    </div>
  );
}

/* ── Status Badge ───────────────────────────── */
interface StatusBadgeProps {
  label: AuthenticityLabel | ScanStatus | string;
  className?: string;
}

const labelMap: Record<string, { text: string; variant: string }> = {
  authentic:    { text: 'Authentic',    variant: 'badge-success' },
  ai_generated: { text: 'AI Generated', variant: 'badge-danger' },
  manipulated:  { text: 'Manipulated',  variant: 'badge-warning' },
  inconclusive: { text: 'Inconclusive', variant: 'badge-muted' },
  unknown:      { text: 'Unknown',      variant: 'badge-muted' },
  pending:      { text: 'Pending',      variant: 'badge-muted' },
  processing:   { text: 'Processing',   variant: 'badge-dark' },
  complete:     { text: 'Complete',     variant: 'badge-success' },
  failed:       { text: 'Failed',       variant: 'badge-danger' },
  unavailable:  { text: 'Unavailable',  variant: 'badge-muted' },
  healthy:      { text: 'Healthy',      variant: 'badge-success' },
};

export function StatusBadge({ label, className }: StatusBadgeProps) {
  const config = labelMap[label] ?? { text: label, variant: 'badge-muted' };
  return <span className={cn('badge', config.variant, className)}>{config.text}</span>;
}

/* ── Empty State ────────────────────────────── */
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, className, icon }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-20 px-8',
        className,
      )}
    >
      {icon && (
        <div className="mb-6 text-[#686868]">{icon}</div>
      )}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#686868',
          marginBottom: '0.75rem',
        }}
      >
        Empty State
      </div>
      <p
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#151515',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
        }}
      >
        {title}
      </p>
      {description && (
        <p style={{ fontSize: '1rem', color: '#555', maxWidth: '28rem', lineHeight: 1.65 }}>
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ── Section Header ─────────────────────────── */
interface SectionHeaderProps {
  number: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ number, title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <span className="num-badge">{number}</span>
        <div className="flex-1" style={{ height: 1, background: '#D5D2CC' }} />
      </div>
      <h2
        style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          textTransform: 'uppercase',
          color: '#151515',
        }}
      >
        {title}
      </h2>
      {description && (
        <p style={{ fontSize: '1.0625rem', color: '#555555', maxWidth: '48rem', lineHeight: 1.65 }}>
          {description}
        </p>
      )}
    </div>
  );
}

/* ── Dev Notice Banner ──────────────────────── */
export function DevNotice({ message }: { message: string }) {
  return (
    <div
      style={{
        background: '#F9F4E8',
        border: '1px solid #E8D99A',
        borderLeft: '3px solid #B07A00',
        borderRadius: 2,
        padding: '0.75rem 1.125rem',
      }}
    >
      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.8125rem',
          color: '#7A5700',
          letterSpacing: '0.02em',
          lineHeight: 1.65,
        }}
      >
        <strong>DEV MODE:</strong> {message}
      </p>
    </div>
  );
}
