import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { INTELLIGENCE_INSIGHTS } from '@/data/demoData';
import type { ThreatInsight } from '@/types';
import { cn } from '@/lib/utils';

const severityColor: Record<ThreatInsight['severity'], string> = {
  low:      '#777',
  medium:   '#B07A00',
  high:     '#CC2222',
  critical: '#F04A2D',
};

function InsightCard({ insight, index }: { insight: ThreatInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderBottom: '1px solid #D5D2CC', padding: '1.75rem 0' }}
    >
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Number */}
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#F04A2D', letterSpacing: '0.08em', minWidth: 24, marginTop: 3 }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        <div style={{ flex: 1 }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.625rem' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#686868' }}>
              {insight.category.toUpperCase().replace('-', ' ')}
            </span>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.8125rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: severityColor[insight.severity],
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: severityColor[insight.severity] }} />
              {insight.severity.toUpperCase()}
            </span>
          </div>

          <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#151515', marginBottom: '0.625rem', lineHeight: 1.2 }}>
            {insight.title}
          </h3>

          <p style={{ fontSize: '1rem', color: '#555555', lineHeight: 1.65, maxWidth: '56rem' }}
            className={cn(!expanded && 'line-clamp-3')}>
            {insight.summary}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {insight.summary.length > 200 && (
              <button
                onClick={() => setExpanded((p) => !p)}
                style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F04A2D', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                className="hover-underline"
              >
                {expanded ? 'SHOW LESS' : 'READ MORE'}
              </button>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {insight.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.875rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#686868', padding: '0.15rem 0.4rem', border: '1px solid #D5D2CC', borderRadius: 1 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <time style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', letterSpacing: '0.04em', flexShrink: 0 }}>
          {new Date(insight.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }).toUpperCase()}
        </time>
      </div>
    </motion.article>
  );
}

export default function IntelligencePage() {
  const [catFilter, setCatFilter] = useState<ThreatInsight['category'] | 'all'>('all');
  const [sevFilter, setSevFilter] = useState<ThreatInsight['severity'] | 'all'>('all');

  const filtered = INTELLIGENCE_INSIGHTS.filter((i) => {
    if (catFilter !== 'all' && i.category !== catFilter) return false;
    if (sevFilter !== 'all' && i.severity !== sevFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{ background: '#171717', borderBottom: '1px solid #2A2A2A' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <div style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <span className="num-badge">04</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555' }}>
                STATIC EDUCATIONAL CONTENT â€” NOT LIVE THREAT INTELLIGENCE
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem,5vw,4rem)', fontWeight: 700, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.95, color: '#F1F0EC' }}>
              INTELLIGENCE
              <br />
              <span style={{ color: '#F04A2D' }}>CENTER</span>
            </h1>
            <p style={{ fontSize: '1rem', color: '#555555', marginTop: '1.25rem', maxWidth: '36rem', lineHeight: 1.65 }}>
              Curated knowledge on AI media manipulation techniques, detection methodologies, and digital forensics concepts.
            </p>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid #2A2A2A' }} className="max-sm:grid-cols-1">
            {[
              { label: 'Topics Covered', value: INTELLIGENCE_INSIGHTS.length },
              { label: 'Threat Categories', value: 6 },
              { label: 'Industry Standards', value: 3 },
            ].map(({ label, value }, i) => (
              <div key={label} style={{ padding: '1.25rem 1.5rem', borderRight: '1px solid #2A2A2A' }} className="last:border-r-0">
                <p style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#F1F0EC' }}>{value}</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#F1F0EC', borderBottom: '1px solid #D5D2CC' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', paddingTop: '1rem', paddingBottom: '1rem' }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#686868' }}>Filter:</span>
            {['all', 'gan', 'diffusion', 'face-swap', 'deepfake', 'voice', 'general'].map((v) => (
              <button
                key={v}
                onClick={() => setCatFilter(v as ThreatInsight['category'] | 'all')}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.8125rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.3rem 0.7rem',
                  border: `1px solid ${catFilter === v ? '#151515' : '#D5D2CC'}`,
                  borderRadius: 1,
                  background: catFilter === v ? '#151515' : 'transparent',
                  color: catFilter === v ? '#F1F0EC' : '#777',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {v === 'all' ? 'ALL' : v.toUpperCase().replace('-', ' ')}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              {(['all', 'low', 'medium', 'high', 'critical'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setSevFilter(v as ThreatInsight['severity'] | 'all')}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '0.8125rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.6rem',
                    border: `1px solid ${sevFilter === v ? '#151515' : '#D5D2CC'}`,
                    borderRadius: 1,
                    background: sevFilter === v ? '#151515' : 'transparent',
                    color: sevFilter === v ? '#F1F0EC' : '#777',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights list */}
      <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
        {filtered.map((insight, i) => (
          <InsightCard key={insight.id} insight={insight} index={i} />
        ))}
        {filtered.length === 0 && (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', textAlign: 'center', padding: '4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            No insights match the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}


