import React, { useState } from 'react';
import { Database, Download, Search } from 'lucide-react';
import TimeRangeSelector from './TimeRangeSelector';

export default function HistoryLogsTab({
  history,
  timeRange,
  onSelectTimeRange,
  onDownload,
  roomName,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const formatTimestamp = (ts) => {
    if (!ts) return '--';
    const date = new Date(String(ts).replace(' ', 'T') + 'Z');
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const filteredHistory = [...history].reverse().filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(row.id).includes(term) ||
      String(row.temperature).includes(term) ||
      String(row.humidity).includes(term) ||
      String(row.co2).includes(term) ||
      String(row.wind_speed).includes(term) ||
      String(row.relay_state).toLowerCase().includes(term) ||
      String(row.air_quality).toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-600" />
            <span>Log Riwayat Data Telemetri {roomName}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar rekaman pembacaan sensor langsung dari database lokal backend SQLite.
          </p>
        </div>

        <button
          onClick={onDownload}
          disabled={history.length === 0}
          className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all shadow-2xs disabled:opacity-40 cursor-pointer"
        >
          <Download className="h-4 w-4 text-emerald-700" />
          <span>Unduh CSV {roomName}</span>
        </button>
      </div>

      {/* Time Range Filter Bar with Room Download */}
      <TimeRangeSelector
        timeRange={timeRange}
        onSelectTimeRange={onSelectTimeRange}
        onDownload={onDownload}
        roomName={roomName}
      />

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID, nilai sensor, status..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none transition-all shadow-2xs"
          />
        </div>
        <div className="text-xs text-slate-500">
          Total Data Database: <strong className="text-slate-800">{filteredHistory.length}</strong> baris
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Ruangan</th>
                <th className="py-3 px-4">Waktu Rekam</th>
                <th className="py-3 px-4">Suhu (°C)</th>
                <th className="py-3 px-4">Kelembapan (%)</th>
                <th className="py-3 px-4">CO2 (ppm)</th>
                <th className="py-3 px-4">Angin (m/s)</th>
                <th className="py-3 px-4">Relay Kipas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-slate-400">
                    Tidak ada rekaman data pada rentang waktu ini.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row) => {
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 font-medium">#{row.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700 uppercase font-mono">{row.room || 'lab_td'}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{formatTimestamp(row.recorded_at)}</td>
                      
                      <td className="py-3 px-4 font-bold text-orange-700 font-mono">
                        {row.temperature != null ? `${row.temperature}°` : '--'}
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-700 font-mono">
                        {row.humidity != null ? `${row.humidity}%` : '--'}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-700 font-mono">
                        {row.co2 != null ? `${row.co2} ppm` : '--'}
                      </td>
                      <td className="py-3 px-4 font-bold text-cyan-700 font-mono">
                        {row.wind_speed != null ? `${row.wind_speed}` : '--'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.relay_state === 'ON'
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {row.relay_state || 'OFF'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
