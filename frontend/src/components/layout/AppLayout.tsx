import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopNav } from './TopNav';
import { ToastContainer } from '../ui/Toast';

export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: '#F1F0EC', color: '#151515' }}
    >
      <TopNav />

      <main className="flex-1" id="main-content">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      <ToastContainer />
    </div>
  );
}
