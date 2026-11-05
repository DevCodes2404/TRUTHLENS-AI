import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Circle } from 'lucide-react';
import { Logo } from './Logo';
import { useAppContext } from '@/store/AppContext';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { num: '01', label: 'Overview',      path: '/' },
  { num: '02', label: 'Media Scanner', path: '/scanner' },
  { num: '03', label: 'Scan History',  path: '/history' },
  { num: '04', label: 'Intelligence',  path: '/intelligence' },
  { num: '05', label: 'Research Lab',  path: '/lab' },
  { num: '06', label: 'Reports',       path: '/reports' },
  { num: '07', label: 'Settings',      path: '/settings' },
];

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { apiOnline } = useAppContext();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 w-80 flex flex-col"
            style={{ background: '#171717' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid #2A2A2A' }}
            >
              <Logo dark />
              <button
                onClick={onClose}
                className="p-1.5 text-[#999] hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 py-4 px-4 space-y-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map(({ num, label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-4 px-4 py-3.5 transition-colors',
                      isActive ? 'text-white bg-[#1f1f1f]' : 'text-[#888] hover:text-white',
                    )
                  }
                  end={path === '/'}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '0.75rem',
                          color: isActive ? '#F04A2D' : '#555',
                          letterSpacing: '0.08em',
                          minWidth: '1.5rem',
                        }}
                      >
                        {num}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.02em' }}>
                        {label}
                      </span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#F04A2D]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Footer status */}
            <div className="px-6 py-5" style={{ borderTop: '1px solid #2A2A2A' }}>
              <div className="flex items-center gap-2.5">
                <Circle
                  size={7}
                  className={cn('fill-current', apiOnline ? 'text-green-500' : 'text-[#555]')}
                />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.75rem', color: '#777', letterSpacing: '0.06em' }}>
                  API: {apiOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { apiOnline } = useAppContext();
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <>
      <header
        style={{
          background: '#F1F0EC',
          borderBottom: '1px solid #D5D2CC',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="flex items-center px-6 gap-8 max-w-screen-2xl mx-auto" style={{ height: '4rem' }}>
          {/* Logo */}
          <Link to="/" aria-label="Go to overview" className="shrink-0">
            <Logo />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-0.5 flex-1"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map(({ num, label, path }) => {
              const active = isActive(path);
              return (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={cn(
                    'relative flex items-center gap-2 px-3.5 py-2 font-medium transition-colors',
                    active
                      ? 'text-[#151515]'
                      : 'text-[#686868] hover:text-[#151515]',
                  )}
                  style={{ fontSize: '0.9375rem', letterSpacing: '0.01em' }}
                >
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.6875rem',
                      color: active ? '#F04A2D' : '#BBBBBB',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {num}
                  </span>
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3.5 right-3.5 h-px"
                      style={{ background: '#F04A2D' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right: status + mobile toggle */}
          <div className="ml-auto flex items-center gap-5 shrink-0">
            {/* API status */}
            <div className="hidden sm:flex items-center gap-2">
              <Circle
                size={6}
                className={cn('fill-current shrink-0', apiOnline ? 'text-green-500' : 'text-[#BBBBBB]')}
              />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '0.6875rem',
                  color: '#686868',
                  letterSpacing: '0.08em',
                }}
              >
                {apiOnline ? 'API ONLINE' : 'API OFFLINE'}
              </span>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-[#686868] hover:text-[#151515] transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
