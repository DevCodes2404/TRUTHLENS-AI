import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sun, Moon, Monitor, HardDrive } from 'lucide-react';
import { useAppContext } from '@/store/AppContext';
import type { Theme } from '@/types';
import { cn } from '@/lib/utils';
import { DevNotice } from '@/components/ui/Primitives';

type SettingsTab = 'account' | 'appearance' | 'notifications' | 'privacy' | 'storage' | 'about';

const TABS: { id: SettingsTab; num: string; label: string }[] = [
  { id: 'account',       num: '01', label: 'Account' },
  { id: 'appearance',    num: '02', label: 'Appearance' },
  { id: 'notifications', num: '03', label: 'Notifications' },
  { id: 'privacy',       num: '04', label: 'Privacy' },
  { id: 'storage',       num: '05', label: 'Storage' },
  { id: 'about',         num: '06', label: 'About' },
];

const ABOUT_ROWS = [
  { label: 'Application',      value: 'TRUTHLENS AI' },
  { label: 'Version',          value: '0.1.0-phase1' },
  { label: 'Build Phase',      value: 'Phase 1 Ã¢â‚¬â€ UI & Architecture' },
  { label: 'Frontend Stack',   value: 'React 19, TypeScript, Vite, Tailwind CSS v4' },
  { label: 'Backend Stack',    value: 'Python 3.14, FastAPI (scaffolded)' },
  { label: 'Detection Engine', value: 'Pending Ã¢â‚¬â€ Not Connected' },
  { label: 'Tagline',          value: 'See Beyond the Surface.' },
];

// Ã¢â€â‚¬Ã¢â€â‚¬ Toggle Row Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div
      className="flex items-center justify-between py-4 border-b last:border-0"
      style={{ borderColor: '#D5D2CC' }}
    >
      <label htmlFor={id} className="cursor-pointer flex-1 mr-6">
        <p className="text-sm font-medium" style={{ color: '#151515' }}>
          {label}
        </p>
        {desc && (
          <p className="font-mono text-[13px] mt-0.5" style={{ color: '#555555' }}>
            {desc}
          </p>
        )}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 transition-colors duration-200"
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? '#151515' : '#D5D2CC',
        }}
      >
        <span
          className="absolute top-0.5 left-0.5 bg-white shadow transition-transform duration-200"
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            transform: checked ? 'translateX(16px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Field Row Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b py-4 last:border-0" style={{ borderColor: '#D5D2CC' }}>
      <p className="font-mono text-[13px] uppercase tracking-widest mb-2" style={{ color: '#555555' }}>
        {label}
      </p>
      {children}
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Main Page Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export default function SettingsPage() {
  const { settings, updateSettings, addToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  const handleSave = () => {
    addToast({ title: 'Settings saved', variant: 'success', duration: 2500 });
  };

  return (
    <div className="min-h-screen" style={{ background: '#F1F0EC' }}>
      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Dark Header Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div style={{ background: '#171717' }} className="px-8 pt-10 pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="font-mono text-[13px] tracking-widest uppercase px-2 py-0.5"
              style={{ color: '#F04A2D', border: '1px solid #F04A2D' }}
            >
              07
            </span>
            <span className="font-mono tracking-widest uppercase" style={{ fontSize: '0.8125rem', color: '#888888' }}>
              Settings
            </span>
          </div>

          <h1
            className="font-black uppercase leading-none mb-3"
            style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', letterSpacing: '-0.03em', color: '#F1F0EC' }}
          >
            PREFERENCES
            <br />
            &amp; CONFIGURATION
          </h1>

          <p className="max-w-xl" style={{ fontSize: "1.0625rem", color: "#888888", lineHeight: 1.7 }}>
            Manage your account preferences, appearance settings, privacy controls,
            and notification options.
          </p>
        </motion.div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Layout Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="px-8 py-8 max-w-6xl">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <DevNotice message="Settings state is stored in-memory for this phase. Changes are not persisted across page reloads." />
        </motion.div>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Ã¢â€â‚¬Ã¢â€â‚¬ Tab List (Left Column) Ã¢â€â‚¬Ã¢â€â‚¬ */}
          <nav className="lg:w-48 shrink-0" aria-label="Settings navigation">
            <div className="border" style={{ borderColor: '#D5D2CC' }}>
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-3 w-full px-4 py-3 font-mono text-[13px] uppercase tracking-widest transition-colors border-b last:border-0 text-left"
                  style={{
                    borderColor: '#D5D2CC',
                    color: activeTab === tab.id ? '#151515' : '#777777',
                    background: activeTab === tab.id ? '#E6E4DF' : 'transparent',
                  }}
                  aria-pressed={activeTab === tab.id}
                >
                  <span
                    style={{
                      color: activeTab === tab.id ? '#F04A2D' : '#D5D2CC',
                      minWidth: '1.5rem',
                      fontFamily: 'IBM Plex Mono, monospace',
                    }}
                  >
                    {tab.num}
                  </span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <span
                      className="absolute left-0 top-0 bottom-0 w-0.5"
                      style={{ background: '#F04A2D' }}
                    />
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Ã¢â€â‚¬Ã¢â€â‚¬ Tab Content (Right Column) Ã¢â€â‚¬Ã¢â€â‚¬ */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
              >
                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Account Ã¢â€â‚¬Ã¢â€â‚¬ */}
                {activeTab === 'account' && (
                  <div className="border" style={{ borderColor: '#D5D2CC', background: '#FFFFFF' }}>
                    <div
                      className="px-6 py-4 border-b font-mono text-[13px] uppercase tracking-widest"
                      style={{ borderColor: '#D5D2CC', color: '#555555', background: '#E6E4DF' }}
                    >
                      Account Preferences
                    </div>
                    <div className="px-6">
                      <FieldRow label="Display Name">
                        <input
                          type="text"
                          defaultValue="Analyst"
                          className="input-base"
                          aria-label="Display name"
                        />
                      </FieldRow>
                      <FieldRow label="Role">
                        <input
                          type="text"
                          defaultValue="Phase 1 Ã¢â‚¬â€ Development Mode"
                          className="input-base opacity-60"
                          disabled
                          aria-label="Role"
                        />
                        <p className="font-mono text-[13px] mt-1.5" style={{ color: '#555555' }}>
                          Authentication will be configurable in a future phase.
                        </p>
                      </FieldRow>
                    </div>
                  </div>
                )}

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Appearance Ã¢â€â‚¬Ã¢â€â‚¬ */}
                {activeTab === 'appearance' && (
                  <div className="border" style={{ borderColor: '#D5D2CC', background: '#FFFFFF' }}>
                    <div
                      className="px-6 py-4 border-b font-mono text-[13px] uppercase tracking-widest"
                      style={{ borderColor: '#D5D2CC', color: '#555555', background: '#E6E4DF' }}
                    >
                      Appearance
                    </div>
                    <div className="px-6">
                      <div className="border-b py-4" style={{ borderColor: '#D5D2CC' }}>
                        <p className="font-mono text-[13px] uppercase tracking-widest mb-3" style={{ color: '#555555' }}>
                          Theme
                        </p>
                        <div className="flex gap-0 border" style={{ borderColor: '#D5D2CC' }}>
                          {(
                            [
                              { value: 'light' as Theme, label: 'LIGHT', icon: Sun },
                              { value: 'dark' as Theme, label: 'DARK', icon: Moon },
                              { value: 'system' as Theme, label: 'SYSTEM', icon: Monitor },
                            ]
                          ).map(({ value, label, icon: Icon }) => (
                            <button
                              key={value}
                              onClick={() => updateSettings({ theme: value })}
                              className="flex-1 flex flex-col items-center gap-2 py-4 font-mono text-[13px] uppercase tracking-widest border-r last:border-r-0 transition-colors"
                              style={{
                                borderColor: '#D5D2CC',
                                color: settings.theme === value ? '#151515' : '#777777',
                                background: settings.theme === value ? '#E6E4DF' : 'transparent',
                              }}
                              aria-pressed={settings.theme === value}
                            >
                              <Icon size={16} />
                              {label}
                              {settings.theme === value && (
                                <Check size={10} style={{ color: '#F04A2D' }} />
                              )}
                            </button>
                          ))}
                        </div>
                        <p className="font-mono text-[13px] mt-2" style={{ color: '#555555' }}>
                          Theme persistence will be fully implemented in Phase 2.
                        </p>
                      </div>
                      <ToggleRow
                        label="Compact Mode"
                        desc="Reduce spacing for a denser layout."
                        checked={settings.appearance.compactMode}
                        onChange={(v) => updateSettings({ appearance: { ...settings.appearance, compactMode: v } })}
                      />
                    </div>
                  </div>
                )}

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Notifications Ã¢â€â‚¬Ã¢â€â‚¬ */}
                {activeTab === 'notifications' && (
                  <div className="border" style={{ borderColor: '#D5D2CC', background: '#FFFFFF' }}>
                    <div
                      className="px-6 py-4 border-b font-mono text-[13px] uppercase tracking-widest"
                      style={{ borderColor: '#D5D2CC', color: '#555555', background: '#E6E4DF' }}
                    >
                      Notification Preferences
                    </div>
                    <div className="px-6">
                      <ToggleRow
                        label="Scan Complete"
                        desc="Notify when a media scan finishes processing."
                        checked={settings.notifications.scanComplete}
                        onChange={(v) =>
                          updateSettings({ notifications: { ...settings.notifications, scanComplete: v } })
                        }
                      />
                      <ToggleRow
                        label="Weekly Digest"
                        desc="Receive a weekly summary of scan activity."
                        checked={settings.notifications.weeklyDigest}
                        onChange={(v) =>
                          updateSettings({ notifications: { ...settings.notifications, weeklyDigest: v } })
                        }
                      />
                      <ToggleRow
                        label="System Alerts"
                        desc="Important system status and engine updates."
                        checked={settings.notifications.systemAlerts}
                        onChange={(v) =>
                          updateSettings({ notifications: { ...settings.notifications, systemAlerts: v } })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Privacy Ã¢â€â‚¬Ã¢â€â‚¬ */}
                {activeTab === 'privacy' && (
                  <div className="border" style={{ borderColor: '#D5D2CC', background: '#FFFFFF' }}>
                    <div
                      className="px-6 py-4 border-b font-mono text-[13px] uppercase tracking-widest"
                      style={{ borderColor: '#D5D2CC', color: '#555555', background: '#E6E4DF' }}
                    >
                      Privacy Settings
                    </div>
                    <div className="px-6">
                      <ToggleRow
                        label="Retain Uploaded Files"
                        desc="Keep uploaded media files after scanning for re-analysis."
                        checked={settings.privacy.retainFiles}
                        onChange={(v) => updateSettings({ privacy: { ...settings.privacy, retainFiles: v } })}
                      />
                      <ToggleRow
                        label="Anonymous Mode"
                        desc="Process scans without associating them with your account."
                        checked={settings.privacy.anonymousMode}
                        onChange={(v) => updateSettings({ privacy: { ...settings.privacy, anonymousMode: v } })}
                      />
                      <div className="border-b py-4 last:border-0" style={{ borderColor: '#D5D2CC' }}>
                        <p className="font-mono text-[13px] uppercase tracking-widest mb-2" style={{ color: '#555555' }}>
                          File Retention Period
                        </p>
                        <select
                          value={settings.privacy.retentionDays}
                          onChange={(e) =>
                            updateSettings({
                              privacy: { ...settings.privacy, retentionDays: Number(e.target.value) },
                            })
                          }
                          className="input-base"
                          aria-label="File retention period"
                        >
                          {[7, 14, 30, 60, 90].map((d) => (
                            <option key={d} value={d}>
                              {d} days
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Storage Ã¢â€â‚¬Ã¢â€â‚¬ */}
                {activeTab === 'storage' && (
                  <div className="border" style={{ borderColor: '#D5D2CC', background: '#FFFFFF' }}>
                    <div
                      className="px-6 py-4 border-b font-mono text-[13px] uppercase tracking-widest"
                      style={{ borderColor: '#D5D2CC', color: '#555555', background: '#E6E4DF' }}
                    >
                      Storage & Data
                    </div>
                    <div className="px-6 py-16 flex flex-col items-center text-center">
                      <div
                        className="w-14 h-14 border flex items-center justify-center mb-4"
                        style={{ borderColor: '#D5D2CC' }}
                      >
                        <HardDrive size={22} style={{ color: '#D5D2CC' }} />
                      </div>
                      <h3
                        className="text-sm font-black uppercase tracking-tight mb-1"
                        style={{ color: '#151515', letterSpacing: '-0.01em' }}
                      >
                        STORAGE ANALYTICS UNAVAILABLE
                      </h3>
                      <p className="font-mono text-[13px]" style={{ color: '#555555' }}>
                        File storage and usage statistics will be available once the backend is integrated.
                      </p>
                    </div>
                  </div>
                )}

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ About Ã¢â€â‚¬Ã¢â€â‚¬ */}
                {activeTab === 'about' && (
                  <div className="border" style={{ borderColor: '#D5D2CC', background: '#FFFFFF' }}>
                    <div
                      className="px-6 py-4 border-b font-mono text-[13px] uppercase tracking-widest"
                      style={{ borderColor: '#D5D2CC', color: '#555555', background: '#E6E4DF' }}
                    >
                      About TRUTHLENS AI
                    </div>
                    <div className="px-6">
                      {ABOUT_ROWS.map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex items-baseline justify-between py-3 border-b last:border-0"
                          style={{ borderColor: '#D5D2CC' }}
                        >
                          <span
                            className="font-mono text-[13px] uppercase tracking-widest"
                            style={{ color: '#555555' }}
                          >
                            {label}
                          </span>
                          <span className="font-mono text-[13px] text-right" style={{ color: '#151515' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="px-6 py-4 border-t" style={{ borderColor: '#D5D2CC', background: '#E6E4DF' }}>
                      <p className="font-mono text-[13px]" style={{ color: '#555555' }}>
                        TRUTHLENS AI Ã¢â‚¬â€ Phase 1 Front-End Foundation. No detection model is active.
                        All analysis capabilities are pending backend integration.
                      </p>
                    </div>
                  </div>
                )}

                {/* Ã¢â€â‚¬Ã¢â€â‚¬ Save Button Ã¢â€â‚¬Ã¢â€â‚¬ */}
                {activeTab !== 'about' && activeTab !== 'storage' && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-widest px-5 py-2.5 transition-colors"
                      style={{
                        background: '#151515',
                        color: '#F1F0EC',
                        border: '1px solid #151515',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#F04A2D';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#F04A2D';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#151515';
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#151515';
                      }}
                    >
                      <Check size={12} />
                      Save Changes
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}





