import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserSettings, Toast, ToastVariant } from '@/types';
import { generateId } from '@/lib/utils';

interface AppContextValue {
  settings: UserSettings;
  updateSettings: (patch: Partial<UserSettings>) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (val: boolean) => void;
  toasts: Toast[];
  addToast: (params: {
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }) => void;
  removeToast: (id: string) => void;
  apiOnline: boolean;
  setApiOnline: (val: boolean) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  notifications: {
    scanComplete: true,
    weeklyDigest: false,
    systemAlerts: true,
  },
  privacy: {
    retainFiles: true,
    retentionDays: 30,
    anonymousMode: false,
  },
  appearance: {
    compactMode: false,
    sidebarCollapsed: false,
  },
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [apiOnline, setApiOnline] = useState(false);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const addToast = useCallback(
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
      const id = generateId();
      setToasts((prev) => [...prev, { id, title, description, variant, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        sidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        toasts,
        addToast,
        removeToast,
        apiOnline,
        setApiOnline,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

