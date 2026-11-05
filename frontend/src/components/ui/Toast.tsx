import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useAppContext } from '@/store/AppContext';
import type { Toast, ToastVariant } from '@/types';
import { cn } from '@/lib/utils';

const variantConfig: Record<ToastVariant, {
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  borderColor: string;
  bg: string;
  textColor: string;
}> = {
  success: { Icon: CheckCircle2, borderColor: '#2D7D46', bg: '#E8F5EC', textColor: '#1A5230' },
  error:   { Icon: AlertCircle,  borderColor: '#CC2222', bg: '#FDEEED', textColor: '#7A1515' },
  warning: { Icon: AlertTriangle,borderColor: '#B07A00', bg: '#FFF8E6', textColor: '#7A5700' },
  info:    { Icon: Info,         borderColor: '#151515', bg: '#F1F0EC', textColor: '#151515' },
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useAppContext();
  const { Icon, borderColor, bg, textColor } = variantConfig[toast.variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        width: '19rem',
        maxWidth: '100%',
        padding: '0.875rem 1rem',
        background: bg,
        borderRadius: 2,
        borderLeft: `3px solid ${borderColor}`,
        border: `1px solid ${borderColor}30`,
        borderLeftWidth: 3,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}
      role="alert"
    >
      <Icon size={16} style={{ color: borderColor, marginTop: 1, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.8125rem', fontWeight: 600, color: textColor, lineHeight: 1.3 }}>
          {toast.title}
        </p>
        {toast.description && (
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.75rem', color: textColor, opacity: 0.8, marginTop: '0.2rem', lineHeight: 1.5 }}>
            {toast.description}
          </p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        style={{ color: textColor, opacity: 0.5, flexShrink: 0, padding: 2, cursor: 'pointer', background: 'none', border: 'none' }}
        className="hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const { toasts } = useAppContext();

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
