import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Download, ArrowRight, FilePlus } from 'lucide-react';
import { DEMO_REPORTS } from '@/data/demoData';
import { DevNotice } from '@/components/ui/Primitives';

import type { Report } from '@/types';

const FORMAT_LABELS: Record<string, { label: string; color: string }> = {
  pdf:  { label: 'PDF',  color: '#151515' },
  json: { label: 'JSON', color: '#151515' },
  csv:  { label: 'CSV',  color: '#151515' },
};

const EXPORT_FORMATS = [
  {
    num: '01',
    format: 'PDF Report',
    desc: 'Structured forensic report with annotated analysis, confidence visualization, and metadata summary. Suitable for professional use and archiving.',
    availability: 'On completion of scan',
  },
  {
    num: '02',
    format: 'JSON Export',
    desc: 'Machine-readable export of raw analysis data including per-model scores, metadata fields, and processing log. For programmatic use and integration.',
    availability: 'On completion of scan',
  },
  {
    num: '03',
    format: 'CSV Summary',
    desc: 'Tabular summary of batch scan results. Suitable for importing into spreadsheet tools, data pipelines, and audit workflows.',
    availability: 'Batch scans only',
  },
];

export default function ReportsPage() {
  const hasReports = DEMO_REPORTS.length > 0;

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
              06
            </span>
            <span className="font-mono tracking-widest uppercase" style={{ fontSize: '0.8125rem', color: '#888888' }}>
              Reports
            </span>
          </div>

          <h1
            className="font-black uppercase leading-none mb-3"
            style={{ fontSize: 'clamp(2.5rem,5vw,3.75rem)', letterSpacing: '-0.03em', color: '#F1F0EC' }}
          >
            ANALYSIS
            <br />
            REPORTS
          </h1>

          <p className="max-w-xl" style={{ fontSize: "1.0625rem", color: "#888888", lineHeight: 1.7 }}>
            Forensic analysis reports are generated automatically when a scan is completed.
            Reports are available in PDF, JSON, and CSV formats for professional and programmatic use.
          </p>
        </motion.div>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Content Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="px-8 py-8 max-w-6xl space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <DevNotice message="Reports are generated from completed scan results. No reports are available until the detection engine is integrated and scans are completed. Download actions will only activate when real report files exist." />
        </motion.div>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Report List Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[13px] uppercase tracking-widest" style={{ color: '#555555' }}>
              Generated Reports
            </p>
            {hasReports && (
              <span className="font-mono text-[13px]" style={{ color: '#555555' }}>
                {DEMO_REPORTS.length} record{DEMO_REPORTS.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="border" style={{ borderColor: '#D5D2CC' }}>
            {hasReports ? (
              <>
                {/* Table Header */}
                <div
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b font-mono text-[13px] uppercase tracking-widest"
                  style={{ background: '#E6E4DF', borderColor: '#D5D2CC', color: '#555555' }}
                >
                  <span>Report</span>
                  <span>Format</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Action</span>
                </div>

                {DEMO_REPORTS.map((report: Report, i) => {
                  const fmtInfo = FORMAT_LABELS[report.format] ?? { label: report.format.toUpperCase(), color: '#151515' };
                  const isReady = report.status === 'ready';
                  return (
                    <div
                      key={report.id}
                      className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b last:border-0 items-center hover:bg-[#E6E4DF]/40 transition-colors"
                      style={{ borderColor: '#D5D2CC' }}
                    >
                      <div>
                        <p className="font-mono text-sm" style={{ color: '#151515' }}>
                          {report.title}
                        </p>
                        <p className="font-mono text-[13px] mt-0.5" style={{ color: '#555555' }}>
                          Scan #{report.scanId ?? 'Ã¢â‚¬â€'}
                        </p>
                      </div>

                      <span
                        className="font-mono text-[13px] px-2 py-0.5 border inline-block w-fit"
                        style={{ borderColor: '#D5D2CC', color: '#151515' }}
                      >
                        {fmtInfo.label}
                      </span>

                      <p className="font-mono text-[13px]" style={{ color: '#555555' }}>
                        {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Ã¢â‚¬â€'}
                      </p>

                      <span
                        className="font-mono text-[13px] uppercase tracking-widest px-2 py-0.5 border inline-block w-fit"
                        style={{
                          color: isReady ? '#166534' : '#777777',
                          borderColor: isReady ? '#86efac' : '#D5D2CC',
                          background: isReady ? '#f0fdf4' : 'transparent',
                        }}
                      >
                        {report.status}
                      </span>

                      <button
                        disabled={!isReady}
                        className="flex items-center gap-1.5 font-mono text-[13px] uppercase tracking-widest px-3 py-1.5 border transition-all"
                        style={{
                          borderColor: isReady ? '#151515' : '#D5D2CC',
                          color: isReady ? '#151515' : '#D5D2CC',
                          cursor: isReady ? 'pointer' : 'not-allowed',
                        }}
                      >
                        <Download size={11} />
                        Download
                      </button>
                    </div>
                  );
                })}
              </>
            ) : (
              /* Empty State */
              <div className="py-20 flex flex-col items-center text-center px-8">
                <div
                  className="w-14 h-14 border flex items-center justify-center mb-6"
                  style={{ borderColor: '#D5D2CC' }}
                >
                  <FilePlus size={22} style={{ color: '#555555' }} />
                </div>
                <h3
                  className="text-lg font-black uppercase tracking-tight mb-2"
                  style={{ color: '#151515', letterSpacing: '-0.02em' }}
                >
                  NO REPORTS YET
                </h3>
                <p className="text-sm max-w-sm mb-6" style={{ color: '#555555', lineHeight: 1.6 }}>
                  Reports are created automatically after a scan is completed. Begin by submitting
                  media for analysis in the Scanner.
                </p>
                <Link
                  to="/scanner"
                  className="flex items-center gap-2 font-mono text-[13px] uppercase tracking-widest px-4 py-2 border transition-all hover:bg-[#151515] hover:text-white"
                  style={{ borderColor: '#151515', color: '#151515' }}
                >
                  Open Scanner
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Divider Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div className="border-t" style={{ borderColor: '#D5D2CC' }} />

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Export Format Info Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="font-mono text-[13px] uppercase tracking-widest mb-4" style={{ color: '#555555' }}>
            Available Export Formats
          </p>

          <div className="border" style={{ borderColor: '#D5D2CC' }}>
            {EXPORT_FORMATS.map((ef, i) => (
              <div
                key={ef.num}
                className="flex gap-6 items-start px-6 py-5 border-b last:border-0 hover:bg-[#E6E4DF]/40 transition-colors"
                style={{ borderColor: '#D5D2CC' }}
              >
                <span
                  className="font-mono text-[13px] shrink-0 mt-0.5"
                  style={{ color: '#F04A2D', minWidth: '1.75rem' }}
                >
                  {ef.num}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-1">
                    <h3 className="text-sm font-bold uppercase tracking-tight" style={{ color: '#151515' }}>
                      {ef.format}
                    </h3>
                    <span
                      className="font-mono text-[13px] uppercase tracking-widest px-1.5 py-0.5 border"
                      style={{ color: '#555555', borderColor: '#D5D2CC' }}
                    >
                      {ef.availability}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#555555' }}>
                    {ef.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}





