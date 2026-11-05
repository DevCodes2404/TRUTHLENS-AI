import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MODEL_VERSIONS, DATASETS } from '@/data/demoData';
import { DevNotice } from '@/components/ui/Primitives';
import { cn } from '@/lib/utils';

type Tab = 'architecture' | 'datasets' | 'metrics' | 'notes';

const TABS: { id: Tab; label: string; num: string }[] = [
  { id: 'architecture', label: 'ARCHITECTURE', num: '01' },
  { id: 'datasets',     label: 'DATASETS',     num: '02' },
  { id: 'metrics',      label: 'METRICS',      num: '03' },
  { id: 'notes',        label: 'NOTES',        num: '04' },
];

const STATUS_STYLES: Record<string, string> = {
  planned:     'border-[#D5D2CC] text-[#777777]',
  in_training: 'border-[#151515]/30 text-[#151515] bg-[#E6E4DF]',
  evaluation:  'border-amber-400/60 text-amber-700',
  released:    'border-green-500/40 text-green-700',
  collecting:  'border-[#151515]/30 text-[#151515] bg-[#E6E4DF]',
  ready:       'border-green-500/40 text-green-700',
};

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'font-mono text-[13px] uppercase tracking-widest px-2 py-0.5 border inline-block',
        STATUS_STYLES[status] ?? 'border-[#D5D2CC] text-[#777777]',
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

const METRICS = [
  { name: 'Binary Cross-Entropy Loss', target: '< 0.25',  desc: 'Primary training objective for authenticity classification' },
  { name: 'AUC-ROC',                   target: 'Ã¢â€°Â¥ 0.92',  desc: 'Area under the receiver operating characteristic curve' },
  { name: 'F1 Score (Macro)',           target: 'Ã¢â€°Â¥ 0.88',  desc: 'Harmonic mean of precision and recall across classes' },
  { name: 'Equal Error Rate',           target: '< 8%',   desc: 'Point where false acceptance equals false rejection rate' },
  { name: 'Inference Latency (CPU)',    target: '< 2.5s',  desc: 'Per-image analysis time on standard CPU hardware' },
  { name: 'Inference Latency (GPU)',    target: '< 400ms', desc: 'Per-image analysis time with GPU acceleration' },
  { name: 'Generalisation Gap',         target: '< 5%',   desc: 'Accuracy delta between seen and unseen manipulation techniques' },
];

const NOTES_CONTENT = [
  {
    heading: 'Research Objective',
    body: `TRUTHLENS AI aims to build a multi-modal forensic detection system capable of identifying AI-generated and manipulated media at scale. The core challenge is generalisation Ã¢â‚¬â€ a model trained on GAN outputs must also perform reliably against diffusion-generated content, face-swap artefacts, and novel manipulation pipelines it has never seen during training.`,
  },
  {
    heading: 'Detection Strategy',
    body: `The planned detection pipeline operates in two stages. A lightweight classifier performs rapid triage on the full image, flagging suspicious candidates. A deeper analysis module then examines identified regions at multiple frequency scales, combining spatial-domain artefact detection with DCT-domain and Fourier spectral analysis.`,
  },
  {
    heading: 'Dataset Considerations',
    body: `Generalisability requires diverse, balanced training data across GAN families, diffusion architectures, and acquisition conditions. We are collecting authentic images from professional photography repositories, AI-generated images from open-source generation pipelines, and manipulated images using common face-swap toolkits. All data is subject to ethical review and licensing verification.`,
  },
  {
    heading: 'Known Challenges',
    body: `Social media platform compression (JPEG re-encoding, resolution downsampling) degrades the high-frequency artefacts most diagnostic for detection. The model must be trained on compressed variants, not raw outputs. Additionally, adversarial attacks on detectors are an active research area Ã¢â‚¬â€ robustness to such attacks is a secondary research goal.`,
  },
  {
    heading: 'Phase 1 Status',
    body: `This research lab interface represents the scaffolding for future model management. No detection model is currently deployed. All model versions listed in the Architecture tab reflect planned engineering work. This interface will be populated with real training metrics and checkpoint management once the first model reaches evaluation phase.`,
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'Triage Classifier',
    desc: 'Lightweight MobileNet-based binary classifier. Fast first-pass on full image to flag candidates.',
  },
  {
    step: '02',
    title: 'Frequency Analyser',
    desc: 'DCT + Fourier spectral analysis to detect unnatural frequency distributions from GAN training.',
  },
  {
    step: '03',
    title: 'Semantic Verifier',
    desc: 'Vision transformer examining semantic consistency Ã¢â‚¬â€ lighting, geometry, and physics coherence.',
  },
];

export default function LabPage() {
  const [activeTab, setActiveTab] = useState<Tab>('architecture');

  return (
    <div className="min-h-screen" style={{ background: '#F1F0EC' }}>
      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Dark Header Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div style={{ background: '#171717' }} className="px-8 pt-10 pb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="font-mono text-[13px] tracking-widest uppercase px-2 py-0.5"
              style={{ color: '#F04A2D', border: '1px solid #F04A2D' }}
            >
              05
            </span>
            <span className="font-mono tracking-widest uppercase" style={{ fontSize: '0.8125rem', color: '#888888' }}>
              Research Lab
            </span>
          </div>
          <h1
            className="font-black uppercase leading-none mb-3"
            style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', letterSpacing: '-0.03em', color: '#F1F0EC' }}
          >
            RESEARCH
            <br />
            LABORATORY
          </h1>
          <p className="max-w-xl" style={{ fontSize: "1.0625rem", color: "#888888", lineHeight: 1.7 }}>
            Model architecture specifications, training dataset registry, evaluation targets,
            and research documentation for the TRUTHLENS detection pipeline.
          </p>
        </motion.div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Tab Bar Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div
        className="border-b flex gap-0 overflow-x-auto"
        style={{ background: '#171717', borderColor: '#2a2a2a' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative flex items-center gap-2.5 px-6 py-4 font-mono text-[13px] tracking-widest uppercase transition-colors shrink-0"
            style={{ color: activeTab === tab.id ? '#F1F0EC' : '#555', background: 'transparent' }}
          >
            <span style={{ color: activeTab === tab.id ? '#F04A2D' : '#444' }}>
              {tab.num}
            </span>
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="lab-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: '#F04A2D' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Content Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="px-8 py-8 max-w-6xl">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <DevNotice message="This research lab displays planned model architecture and dataset specifications. No model has been trained or evaluated. All entries reflect engineering design targets only." />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ ARCHITECTURE TAB Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {activeTab === 'architecture' && (
              <div className="space-y-6">

                {/* Model Registry */}
                <div>
                  <p className="font-mono text-[13px] uppercase tracking-widest mb-3" style={{ color: '#555555' }}>
                    Model Registry
                  </p>
                  <div className="border" style={{ borderColor: '#D5D2CC' }}>
                    <div
                      className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-4 px-5 py-3 border-b font-mono text-[13px] uppercase tracking-widest"
                      style={{ background: '#E6E4DF', borderColor: '#D5D2CC', color: '#555555' }}
                    >
                      <span>Architecture</span>
                      <span>Parameters</span>
                      <span>Status</span>
                      <span>Notes</span>
                    </div>

                    {MODEL_VERSIONS.length === 0 ? (
                      <div className="px-5 py-10 text-center">
                        <p className="font-mono text-[13px] uppercase tracking-widest" style={{ color: '#555555' }}>
                          No model versions registered
                        </p>
                        <p className="text-[13px] mt-1" style={{ color: '#555555' }}>
                          Model entries will appear here once training begins.
                        </p>
                      </div>
                    ) : (
                      MODEL_VERSIONS.map((model, i) => (
                        <div
                          key={`model-${i}`}
                          className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-4 px-5 py-4 border-b items-start last:border-0 hover:bg-[#E6E4DF]/40 transition-colors"
                          style={{ borderColor: '#D5D2CC' }}
                        >
                          <div>
                            <p className="font-mono text-sm font-semibold" style={{ color: '#151515' }}>
                              {model.architecture}
                            </p>
                            <p className="font-mono text-[13px] mt-0.5" style={{ color: '#555555' }}>
                              {model.version}
                            </p>
                          </div>
                          <p className="font-mono text-[13px]" style={{ color: '#555555' }}>
                            {model.parameters ?? 'Ã¢â‚¬â€'}
                          </p>
                          <StatusPill status={model.status} />
                          <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                            {model.notes}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Planned Pipeline */}
                <div>
                  <p className="font-mono text-[13px] uppercase tracking-widest mb-3" style={{ color: '#555555' }}>
                    Planned Detection Pipeline
                  </p>
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 border"
                    style={{ borderColor: '#D5D2CC' }}
                  >
                    {PIPELINE_STEPS.map(item => (
                      <div
                        key={item.step}
                        className="p-5 border-r last:border-r-0 border-b md:border-b-0"
                        style={{ borderColor: '#D5D2CC' }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-mono text-[13px]" style={{ color: '#F04A2D' }}>
                            {item.step}
                          </span>
                          <span
                            className="font-mono text-[13px] uppercase tracking-widest px-1.5 py-0.5 border"
                            style={{ color: '#555555', borderColor: '#D5D2CC' }}
                          >
                            PLANNED
                          </span>
                        </div>
                        <h3
                          className="text-sm font-bold mb-2 uppercase"
                          style={{ color: '#151515', letterSpacing: '-0.01em' }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ DATASETS TAB Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {activeTab === 'datasets' && (
              <div>
                <p className="font-mono text-[13px] uppercase tracking-widest mb-3" style={{ color: '#555555' }}>
                  Training Dataset Registry
                </p>
                <div className="border" style={{ borderColor: '#D5D2CC' }}>
                  <div
                    className="grid grid-cols-[2fr_1fr_3fr] gap-4 px-5 py-3 border-b font-mono text-[13px] uppercase tracking-widest"
                    style={{ background: '#E6E4DF', borderColor: '#D5D2CC', color: '#555555' }}
                  >
                    <span>Dataset</span>
                    <span>Status</span>
                    <span>Description</span>
                  </div>

                  {DATASETS.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <p className="font-mono text-[13px] uppercase tracking-widest" style={{ color: '#555555' }}>
                        No datasets registered
                      </p>
                      <p className="text-[13px] mt-1" style={{ color: '#555555' }}>
                        Dataset entries will appear here once data collection begins.
                      </p>
                    </div>
                  ) : (
                    DATASETS.map((ds, i) => (
                      <div
                        key={`ds-${i}`}
                        className="grid grid-cols-[2fr_1fr_3fr] gap-4 px-5 py-4 border-b items-start last:border-0 hover:bg-[#E6E4DF]/40 transition-colors"
                        style={{ borderColor: '#D5D2CC' }}
                      >
                        <div>
                          <p className="font-mono text-sm font-semibold" style={{ color: '#151515' }}>
                            {ds.name}
                          </p>
                          {ds.size && (
                            <p className="font-mono text-[13px] mt-0.5" style={{ color: '#555555' }}>
                              {ds.size}
                            </p>
                          )}
                        </div>
                        <StatusPill status={ds.status} />
                        <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                          {ds.description}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div
                  className="mt-4 p-4 border"
                  style={{ borderColor: '#D5D2CC', background: '#E6E4DF' }}
                >
                  <p className="font-mono text-[13px] uppercase tracking-widest" style={{ color: '#555555' }}>
                    Data Policy Note
                  </p>
                  <p className="text-[13px] mt-1 leading-relaxed" style={{ color: '#555555' }}>
                    All training datasets are subject to ethical review, licensing verification, and
                    consent requirements. No personal or identifiable data will be collected without
                    explicit authorisation. Synthetic datasets generated in-house are preferred where
                    real-world licensed data is unavailable.
                  </p>
                </div>
              </div>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ METRICS TAB Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {activeTab === 'metrics' && (
              <div>
                <p className="font-mono text-[13px] uppercase tracking-widest mb-3" style={{ color: '#555555' }}>
                  Evaluation Targets Ã¢â‚¬â€ Not Yet Measured
                </p>
                <div className="border" style={{ borderColor: '#D5D2CC' }}>
                  <div
                    className="grid grid-cols-[2fr_1fr_3fr] gap-4 px-5 py-3 border-b font-mono text-[13px] uppercase tracking-widest"
                    style={{ background: '#E6E4DF', borderColor: '#D5D2CC', color: '#555555' }}
                  >
                    <span>Metric</span>
                    <span>Target</span>
                    <span>Description</span>
                  </div>
                  {METRICS.map((m) => (
                    <div
                      key={m.name}
                      className="grid grid-cols-[2fr_1fr_3fr] gap-4 px-5 py-4 border-b last:border-0 items-start hover:bg-[#E6E4DF]/40 transition-colors"
                      style={{ borderColor: '#D5D2CC' }}
                    >
                      <p className="font-mono text-sm" style={{ color: '#151515' }}>
                        {m.name}
                      </p>
                      <p className="font-mono text-sm font-bold" style={{ color: '#F04A2D' }}>
                        {m.target}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                        {m.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-4 p-4 border"
                  style={{ borderColor: '#D5D2CC', background: '#E6E4DF' }}
                >
                  <p className="font-mono text-[13px] uppercase tracking-widest" style={{ color: '#555555' }}>
                    Important Ã¢â‚¬â€ Targets Only
                  </p>
                  <p className="text-[13px] mt-1 leading-relaxed" style={{ color: '#555555' }}>
                    The values above are design-time engineering targets, not measured results. No model
                    has been trained or evaluated. These targets will be updated with actual benchmark
                    results once the detection engine reaches evaluation phase.
                  </p>
                </div>
              </div>
            )}

            {/* Ã¢â€â‚¬Ã¢â€â‚¬ NOTES TAB Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ */}
            {activeTab === 'notes' && (
              <div className="max-w-2xl">
                {NOTES_CONTENT.map((note, i) => (
                  <div
                    key={note.heading}
                    className="border-b py-6 last:border-0"
                    style={{ borderColor: '#D5D2CC' }}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="font-mono text-[13px] mt-0.5 shrink-0"
                        style={{ color: '#F04A2D', minWidth: '1.5rem' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3
                          className="text-sm font-bold uppercase mb-2"
                          style={{ color: '#151515', letterSpacing: '-0.01em' }}
                        >
                          {note.heading}
                        </h3>
                        <p className="text-sm" style={{ color: '#555', lineHeight: 1.75 }}>
                          {note.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}





