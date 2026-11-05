import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, Info, ArrowUpRight, FileImage, RefreshCw } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useAppContext } from '@/store/AppContext';
import { ProgressBar, DevNotice } from '@/components/ui/Primitives';
import { formatFileSize, cn } from '@/lib/utils';

/* â”€â”€ Drop Zone â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function DropZone({
  onFile,
  isDragging,
  setIsDragging,
}: {
  onFile: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFile(file);
    },
    [onFile, setIsDragging],
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
      tabIndex={0}
      role="button"
      aria-label="Upload zone â€” click or drag and drop an image file"
      style={{
        border: `1.5px dashed ${isDragging ? '#F04A2D' : '#D5D2CC'}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        padding: '4rem 2rem',
        cursor: 'pointer',
        background: isDragging ? '#FEF0ED' : '#F1F0EC',
        transition: 'all 200ms ease',
        userSelect: 'none',
        minHeight: '20rem',
      }}
      className={cn(!isDragging && 'hover:border-[#151515] hover:bg-[#E6E4DF]')}
    >
      {/* Upload icon */}
      <motion.div
        animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 56,
          height: 56,
          border: `1.5px solid ${isDragging ? '#F04A2D' : '#D5D2CC'}`,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDragging ? '#F04A2D' : '#AAAAAA',
          transition: 'all 200ms ease',
        }}
      >
        <Upload size={22} strokeWidth={1.5} />
      </motion.div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: isDragging ? '#F04A2D' : '#151515',
            marginBottom: '0.375rem',
          }}
        >
          {isDragging ? 'DROP TO UPLOAD' : 'DROP IMAGE HERE'}
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#777' }}>
          or{' '}
          <span style={{ color: '#F04A2D', fontWeight: 600, textDecoration: 'underline' }}>
            browse file
          </span>
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '0.8125rem',
            color: '#686868',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.8,
          }}
        >
          Accepted: JPG / JPEG / PNG / WEBP
          <br />
          Max size: 20 MB per file
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ''; }}
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  );
}

/* â”€â”€ File Preview Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function FilePreviewCard({
  uploadedFile,
  uploadState,
  uploadProgress,
  onRemove,
  onSimulate,
}: {
  uploadedFile: NonNullable<ReturnType<typeof useFileUpload>['uploadedFile']>;
  uploadState: string;
  uploadProgress: number;
  onRemove: () => void;
  onSimulate: () => void;
}) {
  return (
    <div
      style={{
        border: '1px solid #D5D2CC',
        borderRadius: 2,
        overflow: 'hidden',
        background: '#FFFFFF',
      }}
    >
      {/* Image preview */}
      <div
        style={{
          position: 'relative',
          height: '14rem',
          background: '#E6E4DF',
          overflow: 'hidden',
        }}
      >
        <img
          src={uploadedFile.previewUrl}
          alt="File preview"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {/* Remove button */}
        <button
          onClick={onRemove}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: 28,
            height: 28,
            border: '1px solid #D5D2CC',
            borderRadius: 2,
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#777',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          className="hover:border-[#CC2222] hover:text-[#CC2222]"
          aria-label="Remove file"
        >
          <X size={13} />
        </button>
      </div>

      {/* File info */}
      <div style={{ padding: '1rem 1.25rem' }}>
        <p
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#151515',
            letterSpacing: '-0.01em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            marginBottom: '0.375rem',
          }}
        >
          {uploadedFile.file.name}
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.8125rem',
              color: '#686868',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {formatFileSize(uploadedFile.file.size)}
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.8125rem',
              color: '#686868',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {uploadedFile.file.type.split('/')[1]?.toUpperCase()}
          </span>
        </div>

        {/* Progress */}
        {uploadState === 'uploading' && (
          <div style={{ marginTop: '0.875rem' }}>
            <ProgressBar value={uploadProgress} variant="accent" size="sm" showLabel label="UPLOADING (UI DEMO)" />
          </div>
        )}

        {uploadState === 'ready' && (
          <div style={{ marginTop: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.8125rem',
                color: '#2D7D46',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              âœ“ FILE VALIDATED
            </span>
            <button
              onClick={onSimulate}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#686868', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              className="hover:text-[#151515] transition-colors"
            >
              <RefreshCw size={11} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Retry Upload
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* â”€â”€ Scanner Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function ScannerPage() {
  const { addToast } = useAppContext();
  const {
    uploadedFile,
    uploadState,
    validationError,
    uploadProgress,
    processFile,
    removeFile,
    simulateProgress,
  } = useFileUpload();

  const [isDragging, setIsDragging] = useState(false);
  const [showEngineModal, setShowEngineModal] = useState(false);
  const [config, setConfig] = useState({
    pixelAnalysis: true,
    metadataCheck: true,
    noiseAnalysis: false,
  });

  const handleAnalyze = () => {
    if (!uploadedFile) {
      addToast({ title: 'No file selected', variant: 'warning', description: 'Please upload an image file first.' });
      return;
    }
    setShowEngineModal(true);
  };

  return (
    <>
      <div
        style={{
          borderBottom: '1px solid #D5D2CC',
          background: '#F1F0EC',
        }}
      >
        {/* â”€â”€ Page Header â”€â”€ */}
        <div
          className="max-w-screen-2xl mx-auto"
          style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '2.5rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #D5D2CC',
            }}
          >
            <span className="num-badge">02</span>
            <div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#686868', marginBottom: '0.25rem' }}>
                FORENSIC ANALYSIS WORKSPACE
              </p>
              <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1 }}>
                MEDIA SCANNER
              </h1>
            </div>
          </div>

          {/* Dev notice */}
          <div style={{ paddingTop: '1rem', paddingBottom: '1.25rem' }}>
            <DevNotice message="Phase 1 â€” Upload UI and file validation are operational. AI detection engine is pending integration. Clicking Analyze Media will show system status, not real predictions." />
          </div>
        </div>

        {/* â”€â”€ Asymmetric Layout: Left + Right â”€â”€ */}
        <div
          className="max-w-screen-2xl mx-auto"
          style={{ padding: '0 clamp(1.25rem,4vw,3rem)', paddingBottom: '3rem' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '2.5rem',
            }}
            className="max-lg:grid-cols-1"
          >
            {/* LEFT: Upload */}
            <div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#686868', marginBottom: '1rem' }}>
                â€” UPLOAD TARGET FILE
              </p>

              {!uploadedFile ? (
                <DropZone
                  onFile={processFile}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <FilePreviewCard
                    uploadedFile={uploadedFile}
                    uploadState={uploadState}
                    uploadProgress={uploadProgress}
                    onRemove={removeFile}
                    onSimulate={simulateProgress}
                  />
                </motion.div>
              )}

              {/* Validation error */}
              <AnimatePresence>
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.625rem',
                      padding: '0.625rem 0.875rem',
                      background: '#FDEEED',
                      border: '1px solid #CC2222',
                      borderRadius: 2,
                    }}
                  >
                    <AlertCircle size={14} style={{ color: '#CC2222', flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#7A1515', letterSpacing: '0.02em', lineHeight: 1.5 }}>
                      {validationError}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Analyze button */}
              <div style={{ marginTop: '1.5rem' }}>
                <button
                  onClick={handleAnalyze}
                  disabled={!uploadedFile || uploadState === 'uploading'}
                  style={{
                    width: '100%',
                    padding: '1rem 1.75rem',
                    background: uploadedFile ? '#151515' : '#E6E4DF',
                    color: uploadedFile ? '#F1F0EC' : '#686868',
                    border: `1.5px solid ${uploadedFile ? '#151515' : '#D5D2CC'}`,
                    borderRadius: 2,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: uploadedFile ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 200ms ease',
                  }}
                  className={uploadedFile ? 'hover:bg-[#F04A2D] hover:border-[#F04A2D]' : ''}
                >
                  ANALYZE MEDIA
                  <ArrowUpRight size={15} />
                </button>
              </div>

              {/* Scan configuration */}
              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #D5D2CC',
                }}
              >
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#686868', marginBottom: '1rem' }}>
                  ANALYSIS CONFIGURATION
                </p>
                <div className="space-y-2.5">
                  {[
                    { key: 'pixelAnalysis', label: 'Pixel-Level Analysis', desc: 'GAN artifacts and compression anomalies' },
                    { key: 'metadataCheck', label: 'Metadata Forensics', desc: 'EXIF data inspection' },
                    { key: 'noiseAnalysis', label: 'Noise Pattern Analysis', desc: 'AI generation signature detection' },
                  ].map(({ key, label, desc }) => (
                    <label
                      key={key}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}
                    >
                      <div style={{ position: 'relative', marginTop: 2 }}>
                        <input
                          type="checkbox"
                          checked={config[key as keyof typeof config]}
                          onChange={(e) => setConfig((p) => ({ ...p, [key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div
                          style={{
                            width: 15,
                            height: 15,
                            border: `1.5px solid ${config[key as keyof typeof config] ? '#151515' : '#D5D2CC'}`,
                            borderRadius: 1,
                            background: config[key as keyof typeof config] ? '#151515' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 150ms ease',
                          }}
                        >
                          {config[key as keyof typeof config] && (
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                              <path d="M1 3L3 5L7 1" stroke="#F1F0EC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#151515' }}>{label}</p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', letterSpacing: '0.04em', marginTop: '0.1rem' }}>
                          {desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Information panel */}
            <div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#686868', marginBottom: '1rem' }}>
                â€” ANALYSIS INFORMATION
              </p>

              {/* Analysis workflow */}
              <div
                style={{
                  border: '1px solid #D5D2CC',
                  borderRadius: 2,
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ padding: '1rem 1.25rem', background: '#E6E4DF', borderBottom: '1px solid #D5D2CC' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                    Analysis Workflow
                  </p>
                </div>
                <div>
                  {[
                    { step: '01', label: 'Upload & Validate', status: uploadedFile ? 'complete' : 'pending', desc: 'File format and size verification' },
                    { step: '02', label: 'Pixel Analysis', status: 'pending', desc: 'Low-level artifact detection' },
                    { step: '03', label: 'Metadata Inspection', status: 'pending', desc: 'EXIF and provenance analysis' },
                    { step: '04', label: 'Model Inference', status: 'pending', desc: 'AI detection engine â€” pending' },
                    { step: '05', label: 'Report Generation', status: 'pending', desc: 'Structured result compilation' },
                  ].map(({ step, label, status, desc }, i) => (
                    <div
                      key={step}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.875rem',
                        padding: '0.875rem 1.25rem',
                        borderBottom: i < 4 ? '1px solid #D5D2CC' : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '0.8125rem',
                          color: status === 'complete' ? '#F04A2D' : '#AAAAAA',
                          letterSpacing: '0.08em',
                          marginTop: 2,
                          minWidth: 20,
                        }}
                      >
                        {status === 'complete' ? 'âœ“' : step}
                      </span>
                      <div>
                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: status === 'complete' ? '#151515' : '#777', marginBottom: '0.1rem' }}>
                          {label}
                        </p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', letterSpacing: '0.04em' }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported formats */}
              <div
                style={{
                  border: '1px solid #D5D2CC',
                  borderRadius: 2,
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ padding: '1rem 1.25rem', background: '#E6E4DF', borderBottom: '1px solid #D5D2CC' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase' }}>Supported Formats</p>
                </div>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { fmt: 'JPG/JPEG', ok: true },
                    { fmt: 'PNG', ok: true },
                    { fmt: 'WEBP', ok: true },
                    { fmt: 'MP4 Video', ok: false },
                    { fmt: 'MOV Video', ok: false },
                  ].map(({ fmt, ok }) => (
                    <span
                      key={fmt}
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.8125rem',
                        padding: '0.25rem 0.5rem',
                        border: `1px solid ${ok ? '#D5D2CC' : '#E6E4DF'}`,
                        borderRadius: 1,
                        color: ok ? '#151515' : '#AAAAAA',
                        background: ok ? '#FFFFFF' : '#E6E4DF',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {fmt} {!ok && '(planned)'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Privacy note */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  background: '#E6E4DF',
                  border: '1px solid #D5D2CC',
                  borderRadius: 2,
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'flex-start',
                }}
              >
                <Info size={14} style={{ color: '#686868', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#777', letterSpacing: '0.03em', lineHeight: 1.6 }}>
                  Uploaded files are processed locally and not stored permanently by default. Configure retention in Settings &gt; Privacy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Engine Unavailable Modal â”€â”€ */}
      <AnimatePresence>
        {showEngineModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(21,21,21,0.5)' }}
              onClick={() => setShowEngineModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '28rem',
                background: '#171717',
                border: '1px solid #2A2A2A',
                borderRadius: 2,
                padding: '2rem',
              }}
            >
              <button
                onClick={() => setShowEngineModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}
                className="hover:text-white transition-colors"
              >
                <X size={15} />
              </button>

              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F04A2D', marginBottom: '1rem' }}>
                SYSTEM STATUS
              </p>
              <h3 style={{ fontSize: '1.375rem', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#F1F0EC', marginBottom: '0.75rem' }}>
                Detection Engine Unavailable
              </h3>
              <p style={{ fontSize: '1rem', color: '#555555', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                The AI analysis engine is not yet connected. Phase 1 establishes the UI, architecture, and backend scaffolding. No predictions will be generated.
              </p>

              {/* Status rows */}
              <div style={{ borderTop: '1px solid #2A2A2A', paddingTop: '1rem' }}>
                {[
                  { label: 'File Upload', value: 'Operational', ok: true },
                  { label: 'File Validation', value: 'Operational', ok: true },
                  { label: 'AI Detection Engine', value: 'Pending Integration', ok: false },
                  { label: 'Result Generation', value: 'Awaiting Engine', ok: false },
                ].map(({ label, value, ok }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #2A2A2A' }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#777', letterSpacing: '0.04em' }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: ok ? '#2D7D46' : '#F04A2D', letterSpacing: '0.04em' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowEngineModal(false)}
                style={{ marginTop: '1.5rem', width: '100%' }}
                className="btn-outline"
                // override for dark panel
                data-dark="true"
              >
                <span style={{ color: '#F1F0EC', borderColor: '#2A2A2A' }}>Close</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}


