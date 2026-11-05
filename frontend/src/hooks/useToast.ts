import { useState, useCallback, useId } from 'react';
import type { Toast, ToastVariant } from '@/types';

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const baseId = useId();
  let counter = 0;

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'info',
      duration = 4000,
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
      duration?: number;
    }) => {
      const id = `${baseId}-${Date.now()}-${counter++}`;
      const newToast: Toast = { id, title, description, variant, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    [baseId],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, toast, dismiss };
}

