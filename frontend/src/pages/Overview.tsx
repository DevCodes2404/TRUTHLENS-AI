import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ScanLine,
  ShieldCheck,
  Bot,
  Flag,
  Cpu,
  Image as ImageIcon,
  Video,
  FileSearch,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DEMO_STATS, ENGINE_STATUS } from '@/data/demoData';
import { EmptyState, DevNotice, StatusBadge } from '@/components/ui/Primitives';
import { useAppContext } from '@/store/AppContext';
import { cn } from '@/lib/utils';

/* ── Fade-up animation helper ───────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

/* ── Section ID label (mono uppercase) ─────── */
function SectionId({ num, label, right }: { num: string; label: string; right?: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        paddingTop: '1.75rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #D5D2CC',
      }}
    >
      <span className="num-badge">{num}</span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.8125rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#686868',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: '#D5D2CC' }} />
      {right}
    </div>
  );
}

/* ── Metric Block ────────────────────────────── */
function MetricBlock({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: number | string;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: '2rem 1.75rem',
        borderRight: '1px solid #D5D2CC',
        borderBottom: '1px solid #D5D2CC',
      }}
    >
      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '0.8125rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#686868',
          fontWeight: 500,
          marginBottom: '1rem',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 'clamp(2.75rem, 5vw, 3.5rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: accent ? '#F04A2D' : '#151515',
        }}
      >
        {value}
      </p>
      {note && (
        <p style={{ fontSize: '0.875rem', color: '#686868', marginTop: '0.5rem' }}>{note}</p>
      )}
    </div>
  );
}

/* ── Capability card ─────────────────────────── */
function CapabilityCard({
  number,
  title,
  description,
  available,
  link,
  delay = 0,
}: {
  number: string;
  title: string;
  description: string;
  available: boolean;
  link: string;
  delay?: number;
}) {
  return (
    <motion.div {...fadeUp(delay)} style={{ borderTop: '1px solid #D5D2CC' }}>
      <Link
        to={link}
        className="group block"
        style={{ padding: '2rem 0' }}
        aria-label={`Go to ${title}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  color: '#F04A2D',
                  fontWeight: 500,
                }}
              >
                {number}
              </span>
              {!available && (
                <span className="badge badge-muted" style={{ fontSize: '0.6875rem' }}>
                  COMING SOON
                </span>
              )}
            </div>
            <h3
              style={{
                fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#151515',
                marginBottom: '0.625rem',
              }}
            >
              {title}
            </h3>
            <p style={{ fontSize: '1rem', color: '#555555', lineHeight: 1.65, maxWidth: '36rem' }}>
              {description}
            </p>
          </div>
          <div
            className="shrink-0 mt-1"
            style={{
              width: 36,
              height: 36,
              border: '1px solid #D5D2CC',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#686868',
              transition: 'all 200ms ease',
            }}
          >
            <ArrowUpRight
              size={17}
              style={{ transition: 'transform 200ms ease' }}
              className="group-hover:text-[#F04A2D] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Custom tooltip for chart ────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#171717',
        border: '1px solid #2A2A2A',
        borderRadius: 2,
        padding: '0.75rem 1rem',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '0.8125rem',
      }}
    >
      <p style={{ color: '#AAAAAA', marginBottom: '0.375rem', letterSpacing: '0.06em' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color || '#F1F0EC' }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

/* ── Main Overview Page ──────────────────────── */
export default function OverviewPage() {
  const { addToast } = useAppContext();
  const stats = DEMO_STATS;

  return (
    <div>
      {/* ═══════════════════════════════════════════
          SECTION 01 — HERO
          ═══════════════════════════════════════════ */}
      <section
        style={{
          borderBottom: '1px solid #D5D2CC',
          background: '#F1F0EC',
        }}
      >
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '82vh' }}>
            {/* Left — text */}
            <div
              className="flex flex-col justify-center py-16 lg:py-24"
              style={{ borderRight: '1px solid #D5D2CC', paddingRight: '4rem' }}
            >
              {/* Section label */}
              <motion.div {...fadeUp(0)} className="flex items-center gap-3 mb-10">
                <span className="num-badge">01</span>
                <div style={{ flex: 1, height: 1, background: '#D5D2CC' }} />
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.8125rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#686868',
              transition: 'all 200ms ease',
                    fontWeight: 500,
                  }}
                >
                  OVERVIEW
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp(0.07)}
                style={{
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.92,
                  textTransform: 'uppercase',
                  color: '#151515',
                  marginBottom: '1.75rem',
                }}
              >
                SEE WHAT'S
                <br />
                <span style={{ color: '#F04A2D' }}>REAL.</span>
                <br />
                QUESTION
                <br />
                WHAT'S NOT.
              </motion.h1>

              <motion.p
                {...fadeUp(0.14)}
                style={{ fontSize: '1.125rem', color: '#555555', lineHeight: 1.7, maxWidth: '30rem', marginBottom: '2.5rem' }}
              >
                Advanced media authenticity intelligence for a world where seeing is no longer believing.
              </motion.p>

              <motion.div {...fadeUp(0.2)} className="flex flex-wrap gap-3">
                <Link to="/scanner" className="btn-accent" aria-label="Start media analysis">
                  Start Analysis
                  <ArrowUpRight size={16} />
                </Link>
                <Link to="/intelligence" className="btn-outline" aria-label="Explore intelligence center">
                  Explore Intelligence
                </Link>
              </motion.div>

              {/* Dev mode label */}
              <motion.div {...fadeUp(0.26)} style={{ marginTop: '2.5rem' }}>
                <DevNotice message="Phase 1 — UI Foundation. Detection engine pending integration." />
              </motion.div>
            </div>

            {/* Right — visual */}
            <motion.div
              {...fadeUp(0.1)}
              className="hidden lg:flex items-center justify-center relative"
              style={{ padding: '3rem', background: '#E6E4DF' }}
            >
              {/* Abstract forensics grid visual */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '28rem' }}>
                {/* Grid of pixel blocks */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: 3,
                    opacity: 0.85,
                  }}
                >
                  {Array.from({ length: 64 }).map((_, i) => {
                    const isAccent = [4, 11, 18, 23, 29, 36, 43, 52].includes(i);
                    const isDark = [0, 7, 14, 21, 28, 35, 42, 49, 56, 63].includes(i);
                    const isMid = [2, 5, 9, 13, 20, 27, 34, 41, 48, 55, 62].includes(i);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.01, duration: 0.3 }}
                        style={{
                          aspectRatio: '1',
                          background: isAccent
                            ? '#F04A2D'
                            : isDark
                            ? '#151515'
                            : isMid
                            ? '#AAAAAA'
                            : '#D5D2CC',
                          borderRadius: 1,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Scan line overlay */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #F04A2D, transparent)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Label */}
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #D5D2CC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.75rem',
                      color: '#686868',
              transition: 'all 200ms ease',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                    }}
                  >
                    FORENSIC PIXEL ANALYSIS — DEMO
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', color: '#F04A2D', fontWeight: 500 }}>
                    v0.1
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 02 — INTELLIGENCE SNAPSHOT
          ═══════════════════════════════════════════ */}
      <section style={{ borderBottom: '1px solid #D5D2CC' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <SectionId
            num="02"
            label="INTELLIGENCE SNAPSHOT"
            right={
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.75rem',
                  letterSpacing: '0.06em',
                  color: '#686868',
              transition: 'all 200ms ease',
                }}
              >
                DEMONSTRATION DATA — NOT LIVE RESULTS
              </span>
            }
          />

          {/* Metric grid */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}
            className="max-sm:grid-cols-2 sm:max-lg:grid-cols-2"
          >
            {[
              { label: 'Total Scans',    value: stats.totalScans,       note: 'All time' },
              { label: 'Authentic Media', value: stats.authenticCount,  note: 'Verified authentic', accent: false },
              { label: 'AI Generated',   value: stats.aiGeneratedCount, note: 'Synthetically generated', accent: true },
              { label: 'Flagged',        value: stats.flaggedCount,     note: 'Requires review', accent: false },
            ].map((m) => (
              <MetricBlock key={m.label} {...m} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 03 — SCAN ACTIVITY CHART
          ═══════════════════════════════════════════ */}
      <section style={{ borderBottom: '1px solid #D5D2CC' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <SectionId num="03" label="SCAN ACTIVITY — 7 DAY WINDOW" />

          <div style={{ padding: '2rem 0' }}>
            {stats.totalScans === 0 ? (
              <div
                style={{
                  height: '14rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #D5D2CC',
                  background: '#E6E4DF',
                  borderRadius: 2,
                }}
              >
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.8125rem',
                    color: '#686868',
              transition: 'all 200ms ease',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontWeight: 500,
                  }}
                >
                  No scan activity — chart will populate when scans are completed
                </p>
              </div>
            ) : (
              <div style={{ height: '14rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.weeklyActivity} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scansFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#151515" stopOpacity={0.1} />
                        <stop offset="100%" stopColor="#151515" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="flaggedFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F04A2D" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#F04A2D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E6E4DF" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fill: '#686868', letterSpacing: 1 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fill: '#686868' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="scans" name="Scans" stroke="#151515" strokeWidth={1.5} fill="url(#scansFill)" dot={false} />
                    <Area type="monotone" dataKey="flagged" name="Flagged" stroke="#F04A2D" strokeWidth={1.5} fill="url(#flaggedFill)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 04 — DETECTION CAPABILITIES
          ═══════════════════════════════════════════ */}
      <section style={{ borderBottom: '1px solid #D5D2CC' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <SectionId num="04" label="DETECTION CAPABILITIES" />
          <div style={{ paddingBottom: '2rem' }}>
            <CapabilityCard
              number="A"
              title="Image Authenticity Analysis"
              description="Inspect still images for GAN artifacts, diffusion model signatures, pixel-level compression anomalies, and metadata inconsistencies."
              available
              link="/scanner"
              delay={0.05}
            />
            <CapabilityCard
              number="B"
              title="Video Analysis"
              description="Frame-by-frame deepfake detection and temporal coherence analysis for video content. Full pipeline under development."
              available={false}
              link="/scanner"
              delay={0.1}
            />
            <CapabilityCard
              number="C"
              title="Metadata Investigation"
              description="EXIF forensics, digital provenance, timestamp analysis, and C2PA content authenticity verification."
              available
              link="/intelligence"
              delay={0.15}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTION 05 — RECENT INVESTIGATIONS
          ═══════════════════════════════════════════ */}
      <section style={{ background: '#E6E4DF' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <SectionId
            num="05"
            label="RECENT INVESTIGATIONS"
            right={
              <Link
                to="/history"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8125rem',
                  letterSpacing: '0.06em',
                  color: '#F04A2D',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: 500,
                }}
                className="hover-underline"
              >
                VIEW ALL <ArrowUpRight size={12} />
              </Link>
            }
          />

          <EmptyState
            title="No investigations yet"
            description="Upload an image in the Media Scanner to begin your first authenticity investigation."
            action={
              <Link to="/scanner" className="btn-accent">
                Start First Scan <ArrowUpRight size={15} />
              </Link>
            }
            icon={<ScanLine size={40} strokeWidth={1} />}
          />

          {/* System engine status */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              borderTop: '1px solid #D5D2CC',
            }}
            className="max-sm:grid-cols-1"
          >
            {[
              { label: 'Detection Engine', status: ENGINE_STATUS.imageDetection },
              { label: 'API Endpoint',     status: ENGINE_STATUS.apiEndpoint },
            ].map(({ label, status }) => (
              <div
                key={label}
                style={{ padding: '1.5rem 1.75rem', borderRight: '1px solid #D5D2CC' }}
                className="last:border-r-0"
              >
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.8125rem',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#686868',
              transition: 'all 200ms ease',
                    marginBottom: '0.625rem',
                    fontWeight: 500,
                  }}
                >
                  {label}
                </p>
                <StatusBadge label={(status as string) === 'coming_soon' ? 'pending' : status} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
