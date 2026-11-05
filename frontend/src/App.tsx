import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from '@/store/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import OverviewPage from '@/pages/Overview';
import ScannerPage from '@/pages/Scanner';
import ResultsPage from '@/pages/Results';
import HistoryPage from '@/pages/History';
import IntelligencePage from '@/pages/Intelligence';
import LabPage from '@/pages/Lab';
import ReportsPage from '@/pages/Reports';
import SettingsPage from '@/pages/Settings';
import { getHealthCheck } from '@/api/client';

function HealthCheck() {
  const { setApiOnline } = useAppContext();

  useEffect(() => {
    getHealthCheck().then((res) => {
      setApiOnline(res.success && res.data?.status === 'healthy');
    });
  }, [setApiOnline]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <HealthCheck />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="scanner" element={<ScannerPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="intelligence" element={<IntelligencePage />} />
          <Route path="lab" element={<LabPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
