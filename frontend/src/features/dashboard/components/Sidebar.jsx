import React from 'react';
import {
  LayoutDashboard,
  Thermometer,
  Wind,
  Database,
  ArrowLeft,
  Sparkles,
  Radio,
  DoorOpen,
} from 'lucide-react';
import { ROOMS } from '../roomsConfig';

export default function Sidebar({
  activeTab,
  onSelectTab,
  onBackToHome,
  status,
  statusText,
  onSimulate,
  isSimulating,
  selectedRoomId,
  onSelectRoom,
}) {
  const menuItems = [
    {
      id: 'overview',
      label: 'Ringkasan Sistem',
      icon: LayoutDashboard,
      desc: 'Ikhtisar suhu, kelembaban, sirkulasi',
    },
    {
      id: 'temp-humid',
      label: 'Suhu dan Kelembapan',
      icon: Thermometer,
      desc: 'Sensor DHT22 dan kenyamanan',
      badge: 'DHT22',
    },
    {
      id: 'circulation',
      label: 'Kecepatan Angin dan Kipas',
      icon: Wind,
      desc: 'Anemometer dan relay kipas',
      badge: 'Anemometer',
    },
    {
      id: 'history',
      label: 'Log Riwayat Data',
      icon: Database,
      desc: 'Rekaman tabel dan unduh CSV',
    },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 border-r border-slate-200/80 bg-white flex flex-col justify-between p-4 h-full overflow-y-auto">
      <div>
        {/* Room Dropdown in Sidebar */}
        <div className="mb-4 pb-4 border-b border-slate-100">
          <label className="flex items-center gap-1.5 px-1 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <DoorOpen className="h-3.5 w-3.5 text-emerald-600" />
            <span>Pilih Ruangan</span>
          </label>
          <div className="relative">
            <select
              value={selectedRoomId}
              onChange={(e) => onSelectRoom(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-[#0f2942] focus:border-emerald-500 focus:bg-white focus:outline-none transition-all cursor-pointer shadow-2xs pr-8"
            >
              {ROOMS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Navigation title */}
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Topik Monitoring
        </div>

        {/* Menu items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <div className="text-xs sm:text-sm">{item.label}</div>
                    <div className="text-[10px] text-slate-400 hidden sm:block font-normal">
                      {item.desc}
                    </div>
                  </div>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      isActive
                        ? 'border-emerald-300 bg-emerald-100/60 text-emerald-800'
                        : 'border-slate-200 bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: MQTT info & Actions */}
      <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
        {/* MQTT Broker Status Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <Radio className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
              <span>MQTT Broker</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
              EMQX Public
            </span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            Topik: <span className="text-slate-700 font-medium">monitoring_udara_ta/data</span>
          </div>
        </div>

        {/* Simulation Button */}
        <button
          onClick={onSimulate}
          disabled={isSimulating}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-emerald-400 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`h-3.5 w-3.5 text-amber-500 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Mengirim Data...' : 'Kirim Simulasi Data'}</span>
        </button>

        {/* Back to Home */}
        <button
          onClick={onBackToHome}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>
    </aside>
  );
}
