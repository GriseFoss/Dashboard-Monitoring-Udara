import React, { useState, useMemo } from 'react';
import { useSensorData } from './hooks/useSensorData';
import Sidebar from './components/Sidebar';
import OverviewTab from './components/OverviewTab';
import TempHumidTab from './components/TempHumidTab';
import CirculationTab from './components/CirculationTab';
import HistoryLogsTab from './components/HistoryLogsTab';
import StatusBadge from '../../components/StatusBadge';
import { Menu, X, Download } from 'lucide-react';
import { ROOMS } from './roomsConfig';

export default function DashboardPage({ onBackToHome }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRoomId, setSelectedRoomId] = useState('lab_td');
  const [timeRange, setTimeRange] = useState('7d'); // '3d' | '7d' | '30d'
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Directly connect to backend API for the selected room and time range
  const {
    latest,
    history,
    status,
    statusText,
    lastUpdated,
    triggerSimulation,
    isSimulating,
    downloadData,
  } = useSensorData(selectedRoomId, timeRange);

  const currentRoom = useMemo(
    () => ROOMS.find((r) => r.id === selectedRoomId) || ROOMS[0],
    [selectedRoomId]
  );

  const handleDownload = () => {
    downloadData(timeRange);
  };

  const renderActiveTab = () => {
    const tabProps = {
      latest,
      history,
      timeRange,
      onSelectTimeRange: setTimeRange,
      onDownload: handleDownload,
      roomName: currentRoom.name,
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewTab {...tabProps} />;
      case 'temp-humid':
        return <TempHumidTab {...tabProps} />;
      case 'circulation':
        return <CirculationTab {...tabProps} />;
      case 'history':
        return <HistoryLogsTab {...tabProps} />;
      default:
        return <OverviewTab {...tabProps} />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'overview':
        return `Ringkasan Telemetri ${currentRoom.name}`;
      case 'temp-humid':
        return `Suhu dan Kelembapan ${currentRoom.name}`;
      case 'circulation':
        return `Kecepatan Angin dan Sirkulasi ${currentRoom.name}`;
      case 'history':
        return `Log Riwayat Sensor ${currentRoom.name}`;
      default:
        return `Dashboard Telemetri ${currentRoom.name}`;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-65px)] bg-[#f8fafc]">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700"
        >
          {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>Menu dan Ruangan</span>
        </button>

        <StatusBadge status={status} text={statusText} size="sm" />
      </div>

      {/* Sidebar for Desktop (Fixed/Sticky) */}
      <div className="hidden md:block sticky top-[61px] h-[calc(100vh-61px)] flex-shrink-0 z-30">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onBackToHome={onBackToHome}
          status={status}
          statusText={statusText}
          onSimulate={triggerSimulation}
          isSimulating={isSimulating}
          selectedRoomId={selectedRoomId}
          onSelectRoom={setSelectedRoomId}
        />
      </div>

      {/* Sidebar Drawer for Mobile */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <div
            className="w-72 h-full bg-white border-r border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              onBackToHome={onBackToHome}
              status={status}
              statusText={statusText}
              onSimulate={triggerSimulation}
              isSimulating={isSimulating}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Top Header info bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Stasiun Pemantauan
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2942] tracking-tight">
              {getTabTitle()}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick CSV Download */}
            <button
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
              title={`Unduh data CSV ${currentRoom.name}`}
            >
              <Download className="h-3.5 w-3.5 text-emerald-700" />
              <span>Unduh CSV</span>
            </button>

            <div className="hidden sm:block text-right border-l border-slate-200 pl-3">
              <div className="text-[10px] text-slate-400 font-medium">Pembaruan Terakhir</div>
              <div className="font-mono text-xs font-bold text-slate-700">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
              </div>
            </div>

            <StatusBadge status={status} text={statusText} />
          </div>
        </div>

        {/* Dynamic Content by Active Topic */}
        {renderActiveTab()}
      </main>
    </div>
  );
}
