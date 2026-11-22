import React, { useState } from 'react';
import { Leaf, ArrowLeft, Menu, X, BookOpen, Server, Cpu, Terminal, LayoutDashboard, Shield } from 'lucide-react';

export default function Navbar({ currentView, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Beranda');

  const navLinks = [
    { label: 'Beranda', href: '#beranda' },
    { label: 'Data & Sensor', href: '#sensor' },
    { label: 'Tips Udara', href: '#tips' },
    { label: 'Tentang', href: '#tentang' },
  ];

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setActiveTab(link.label);
    const el = document.querySelector(link.href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // If on Admin Panel: Minimal header with Admin Badge
  if (currentView === 'admin') {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div 
            onClick={() => onNavigate('landing')}
            className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
              <Shield className="h-5 w-5 fill-white stroke-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#0f2942]">Archtera</span>
              <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200/70">
                Admin Data Panel
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </header>
    );
  }

  // If on Docs views: docs-all, docs-backend, docs-iot, or docs-vps
  const isDocsView = ['docs-all', 'docs-backend', 'docs-iot', 'docs-vps'].includes(currentView);
  if (isDocsView) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
              <Leaf className="h-5 w-5 fill-white stroke-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#0f2942]">Archtera</span>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                Dokumentasi
              </span>
            </div>
          </div>

          {/* Docs Sub-navigation Tabs (Hanya muncul saat rute docs sedang dibuka) */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => onNavigate('docs-all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'docs-all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Hub Pengantar</span>
            </button>

            <button
              onClick={() => onNavigate('docs-iot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'docs-iot'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-600" />
              <span>Docs IoT</span>
            </button>

            <button
              onClick={() => onNavigate('docs-backend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'docs-backend'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Server className="h-3.5 w-3.5 text-emerald-600" />
              <span>Docs Backend</span>
            </button>

            <button
              onClick={() => onNavigate('docs-vps')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'docs-vps'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-amber-600" />
              <span>Docs VPS</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Beranda</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  // If on Dashboard: Minimal navbar (Logo + Kembali ke Beranda saja, TANPA tombol docs)
  if (currentView === 'dashboard') {
    return (
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
              <Leaf className="h-5 w-5 fill-white stroke-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-[#0f2942]">Archtera</span>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                Air Safe Area
              </span>
            </div>
          </div>

          {/* Kembali ke Beranda button */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </header>
    );
  }

  // On Landing Page: Clean navbar standar (Hanya link section, TANPA tombol docs)
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/80 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div 
          onClick={() => {
            onNavigate('landing');
            setActiveTab('Beranda');
          }}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
            <Leaf className="h-5 w-5 fill-white stroke-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-[#0f2942]">Archtera</span>
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
              Air Safe Area
            </span>
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = activeTab === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`relative py-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-600 font-semibold after:absolute after:bottom-[-13px] after:left-0 after:right-0 after:h-[2.5px] after:rounded-full after:bg-emerald-500'
                    : 'text-slate-600 hover:text-emerald-600'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
