import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMaxW = { sm: '24rem', md: '32rem', lg: '44rem', xl: '56rem' };

export function Modal({ open, onClose, title, description, children, size = 'md', className }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(21,21,21,0.5)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: sizeMaxW[size],
              background: '#F1F0EC',
              border: '1px solid #D5D2CC',
              borderRadius: 2,
              padding: '1.75rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            className={className}
          >
            {(title || description) && (
              <div style={{ marginBottom: '1.25rem' }}>
                {title && (
                  <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#151515' }}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p style={{ fontSize: '0.875rem', color: '#777', marginTop: '0.375rem', lineHeight: 1.6 }}>
                    {description}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.25rem',
                color: '#686868',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              className="hover:text-[#151515] transition-colors"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'danger',
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="sm">
      <div className="flex gap-3 justify-end mt-5">
        <button onClick={onClose} className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
          {cancelLabel}
        </button>
        <button
          onClick={() => { onConfirm(); onClose(); }}
          className={variant === 'danger' ? 'btn-accent' : 'btn-primary'}
          style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', background: variant === 'danger' ? '#CC2222' : undefined, borderColor: variant === 'danger' ? '#CC2222' : undefined }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
