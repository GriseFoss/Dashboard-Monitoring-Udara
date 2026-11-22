import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './features/landing/LandingPage';
import DashboardPage from './features/dashboard/DashboardPage';
import DocsBackendPage from './features/docs/DocsBackendPage';
import DocsIotPage from './features/docs/DocsIotPage';
import DocsVpsPage from './features/docs/DocsVpsPage';
import DocsAllHubPage from './features/docs/DocsAllHubPage';
import DocsArchPage from './features/docs/DocsArchPage';
import AdminPage from './features/admin/AdminPage';
import { fetchLatest } from './services/api';

const pathToView = (pathname) => {
  const cleanPath = (pathname || '').toLowerCase().replace(/\/+$/, '');
  if (cleanPath === '/admin') return 'admin';
  if (cleanPath === '/docs-all') return 'docs-all';
  if (cleanPath === '/docs-arch') return 'docs-arch';
  if (cleanPath === '/docs-backend') return 'docs-backend';
  if (cleanPath === '/docs-iot') return 'docs-iot';
  if (cleanPath === '/docs-vps') return 'docs-vps';
  if (cleanPath === '/dashboard') return 'dashboard';
  return 'landing';
};

const viewToPath = (view) => {
  switch (view) {
    case 'admin':
      return '/admin';
    case 'docs-all':
      return '/docs-all';
    case 'docs-arch':
      return '/docs-arch';
    case 'docs-backend':
      return '/docs-backend';
    case 'docs-iot':
      return '/docs-iot';
    case 'docs-vps':
      return '/docs-vps';
    case 'dashboard':
      return '/dashboard';
    default:
      return '/';
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState(() => pathToView(window.location.pathname));
  const [initialData, setInitialData] = useState(null);

  const navigateTo = (view) => {
    setCurrentView(view);
    const newPath = viewToPath(view);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(pathToView(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    async function getLatest() {
      try {
        const d = await fetchLatest();
        if (d && d.id) setInitialData(d);
      } catch (err) {
        // Backend not online or initial load
      }
    }
    getLatest();
    const intervalId = setInterval(getLatest, 4000);
    return () => clearInterval(intervalId);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPage onNavigate={navigateTo} />;
      case 'docs-all':
        return <DocsAllHubPage onNavigate={navigateTo} />;
      case 'docs-arch':
        return <DocsArchPage onNavigate={navigateTo} />;
      case 'dashboard':
        return <DashboardPage onBackToHome={() => navigateTo('landing')} onNavigate={navigateTo} />;
      case 'docs-backend':
        return <DocsBackendPage onNavigate={navigateTo} />;
      case 'docs-iot':
        return <DocsIotPage onNavigate={navigateTo} />;
      case 'docs-vps':
        return <DocsVpsPage onNavigate={navigateTo} />;
      case 'landing':
      default:
        return (
          <LandingPage
            onOpenDashboard={() => navigateTo('dashboard')}
            onNavigate={navigateTo}
            latest={initialData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
      />

      <div className="flex-1">
        {renderCurrentView()}
      </div>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
