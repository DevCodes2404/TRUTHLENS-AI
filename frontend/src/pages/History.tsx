import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Search, ScanLine } from 'lucide-react';
import { DEMO_SCAN_HISTORY } from '@/data/demoData';
import { EmptyState, StatusBadge } from '@/components/ui/Primitives';
import type { ScanStatus, AuthenticityLabel } from '@/types';
import { cn } from '@/lib/utils';

type SortKey = 'createdAt' | 'filename' | 'status';
type SortDir = 'asc' | 'desc';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ScanStatus | 'all'>('all');
  const [labelFilter, setLabelFilter] = useState<AuthenticityLabel | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(k); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    return DEMO_SCAN_HISTORY
      .filter((s) => {
        if (search && !s.filename.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter !== 'all' && s.status !== statusFilter) return false;
        if (labelFilter !== 'all' && s.label !== labelFilter) return false;
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortKey === 'filename') cmp = a.filename.localeCompare(b.filename);
        if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
        return sortDir === 'asc' ? cmp : -cmp;
      });
  }, [search, statusFilter, labelFilter, sortKey, sortDir]);

  const thStyle: React.CSSProperties = {
    padding: '0.75rem 1.25rem',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: '0.8125rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#686868',
    textAlign: 'left',
    fontWeight: 500,
    cursor: 'pointer',
    userSelect: 'none',
    background: '#E6E4DF',
    borderBottom: '1px solid #D5D2CC',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ background: '#F1F0EC', borderBottom: '1px solid #D5D2CC' }}>
        <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #D5D2CC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="num-badge">03</span>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#686868', marginBottom: '0.25rem' }}>
                  INVESTIGATION ARCHIVE
                </p>
                <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase', lineHeight: 1 }}>
                  SCAN HISTORY
                </h1>
              </div>
            </div>
            <Link to="/scanner" className="btn-accent" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
              New Scan <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '1.25rem', paddingBottom: '1.25rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 16rem' }}>
              <Search size={13} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#686868' }} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by filenameâ€¦"
                className="input-base"
                style={{ paddingLeft: '2.25rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.875rem' }}
                aria-label="Search scan history"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ScanStatus | 'all')}
              className="input-base"
              style={{ width: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.04em' }}
              aria-label="Filter by status"
            >
              <option value="all">ALL STATUS</option>
              <option value="complete">COMPLETE</option>
              <option value="pending">PENDING</option>
              <option value="failed">FAILED</option>
            </select>
            <select
              value={labelFilter}
              onChange={(e) => setLabelFilter(e.target.value as AuthenticityLabel | 'all')}
              className="input-base"
              style={{ width: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', letterSpacing: '0.04em' }}
              aria-label="Filter by label"
            >
              <option value="all">ALL LABELS</option>
              <option value="authentic">AUTHENTIC</option>
              <option value="ai_generated">AI GENERATED</option>
              <option value="manipulated">MANIPULATED</option>
            </select>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', letterSpacing: '0.08em', marginLeft: 'auto' }}>
              {filtered.length} RECORD{filtered.length !== 1 ? 'S' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-screen-2xl mx-auto" style={{ padding: '0 clamp(1.25rem,4vw,3rem)', paddingTop: '2rem' }}>
        <div style={{ border: '1px solid #D5D2CC', borderRadius: 2, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <EmptyState
              icon={<ScanLine size={36} strokeWidth={1} />}
              title="No Scan History"
              description="Your completed investigations will appear here. Run your first scan to begin."
              action={
                <Link to="/scanner" className="btn-accent" style={{ fontSize: '0.875rem', padding: '0.625rem 1.25rem' }}>
                  Start First Scan <ArrowUpRight size={13} />
                </Link>
              }
            />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} aria-label="Scan history">
                <thead>
                  <tr>
                    {[
                      { label: 'File', key: 'filename' as SortKey },
                      { label: 'Status', key: 'status' as SortKey },
                      { label: 'Label', key: null },
                      { label: 'Date', key: 'createdAt' as SortKey },
                      { label: '', key: null },
                    ].map(({ label, key }) => (
                      <th key={label || 'action'} scope="col" style={thStyle} onClick={() => key && handleSort(key)}>
                        {label} {key && sortKey === key && (sortDir === 'asc' ? 'â†‘' : 'â†“')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((scan, i) => (
                    <tr
                      key={scan.id}
                      style={{
                        borderBottom: '1px solid #D5D2CC',
                        background: i % 2 === 0 ? '#FFFFFF' : '#F9F8F6',
                        transition: 'background 150ms ease',
                      }}
                      className="hover:bg-[#E6E4DF]"
                    >
                      <td style={{ padding: '0.875rem 1.25rem', fontSize: '1rem', fontWeight: 500, color: '#151515', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {scan.filename}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <StatusBadge label={scan.status} />
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <StatusBadge label={scan.label} />
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#686868', whiteSpace: 'nowrap' }}>
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                        <Link to={`/results?scanId=${scan.id}`} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.8125rem', color: '#F04A2D', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 4 }} className="hover-underline">
                          VIEW <ArrowUpRight size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


