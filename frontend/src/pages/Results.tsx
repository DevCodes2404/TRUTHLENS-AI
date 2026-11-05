import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ScanLine, FileSearch, Cpu, FileImage, Clock } from 'lucide-react';
import { EmptyState, DevNotice } from '@/components/ui/Primitives';

function LayoutRow({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '1.25rem 1.5rem', borderBottom: '1px solid #D5D2CC' }}>
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', minWidth: 20, marginTop: 2 }}>
        {number}
      </span>
      <div>
        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#151515', marginBottom: '0.2rem' }}>{title}</p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', letterSpacing: '0.04em' }}>{desc}</p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div style={{ minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#F1F0EC', borderBottom: '1px solid #D5D2CC' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #D5D2CC' }}>
            <span className="num-badge">02</span>
            <div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#686868', marginBottom: '0.25rem' }}>
                FORENSIC ANALYSIS OUTPUT
              </p>
              <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1 }}>
                ANALYSIS RESULTS
              </h1>
            </div>
          </div>
          <div style={{ paddingTop: '1rem', paddingBottom: '1.25rem' }}>
            <DevNotice message="No scan has been completed. Results will appear here once the detection engine is integrated and a scan is submitted." />
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
        <EmptyState
          icon={<FileSearch size={40} strokeWidth={1} />}
          title="No Analysis Results"
          description="Complete a scan from the Media Scanner to view a full forensic authenticity report here."
          action={
            <Link to="/scanner" className="btn-accent" style={{ fontSize: '0.75rem', padding: '0.625rem 1.25rem' }}>
              Go to Media Scanner <ArrowUpRight size={13} />
            </Link>
          }
        />

        {/* Layout preview */}
        <div style={{ marginTop: '2rem', border: '1px solid #D5D2CC', borderRadius: 2, overflow: 'hidden', opacity: 0.6 }}>
          <div style={{ padding: '1rem 1.5rem', background: '#E6E4DF', borderBottom: '1px solid #D5D2CC' }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#686868' }}>
              PLANNED RESULT LAYOUT (Architecture Preview)
            </p>
          </div>
          <LayoutRow number="A" title="Media Preview" desc="Original file display with forensic overlay" />
          <LayoutRow number="B" title="Authenticity Assessment" desc="Verdict + confidence visualization" />
          <LayoutRow number="C" title="Evidence Summary" desc="Key signals used in determination" />
          <LayoutRow number="D" title="Metadata Observations" desc="EXIF, compression, provenance" />
          <LayoutRow number="E" title="Model Explanation" desc="Grad-CAM attention maps â€” planned" />
          <LayoutRow number="F" title="Report Export" desc="PDF / JSON / CSV export" />
        </div>
      </div>
    </div>
  );
}

