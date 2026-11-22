import React from 'react';
import { Wind, Fan, Activity } from 'lucide-react';
import MetricCard from './MetricCard';
import SensorChart from './SensorChart';
import TimeRangeSelector from './TimeRangeSelector';

export default function CirculationTab({
  latest,
  history,
  timeRange,
  onSelectTimeRange,
  onDownload,
  roomName,
}) {
  const isFanOn = latest?.relay_state === 'ON';
  const windSpeed = latest?.wind_speed ?? null;
  const fanRpm = latest?.fan_rpm ?? null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] flex items-center gap-2">
            <Wind className="h-5 w-5 text-cyan-600" />
            <span>Sirkulasi Udara dan Aktuator Kipas {roomName}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring kecepatan angin dan otomasi kipas pembuangan udara (*exhaust system*).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
          <Activity className="h-4 w-4 text-cyan-600" />
          <span className="text-slate-700 font-medium">Instrumen: Anemometer & Relay Module</span>
        </div>
      </div>

      {/* Fan Status Hero Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className={`p-4 rounded-2xl border transition-all ${
              isFanOn
                ? 'bg-cyan-50 border-cyan-300 text-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <Fan className={`h-12 w-12 ${isFanOn ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status Aktuator Relay</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isFanOn
                    ? 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isFanOn ? 'AKTIF (RUNNING)' : 'STANDBY (OFF)'}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#0f2942] mt-1">
              {isFanOn ? `Kipas ${roomName} Menyala` : `Kipas ${roomName} Mati`}
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
              {isFanOn
                ? 'Kipas sedang berputar untuk membuang udara kotor dan menarik sirkulasi udara segar ke ruangan.'
                : 'Kualitas udara dinilai baik. Kipas berada pada mode hemat daya otomatis.'}
            </p>
          </div>
        </div>

        {/* Speed Stats */}
        <div className="flex items-center gap-4 text-center">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 shadow-2xs">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Kecepatan Putaran</div>
            <div className="text-2xl font-extrabold text-[#0f2942] font-mono mt-0.5">
              {fanRpm !== null ? `${fanRpm}` : '--'} <span className="text-xs font-normal text-slate-500">RPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Kecepatan Aliran Udara"
          value={windSpeed}
          unit="m/s"
          icon={Wind}
          status={windSpeed > 0.5 ? 'Baik' : 'Sedang'}
          subtitle="Sensor Anemometer"
        />

        <MetricCard
          title="Waktu Aktif Sistem (Uptime)"
          value={latest?.uptime ? `${Math.floor(latest.uptime / 60)} m` : '--'}
          unit="operasi"
          icon={Activity}
          status="Baik"
          subtitle="Mikrokontroler Aktif"
        />
      </div>

      {/* Time Range Filter Bar with Room Download */}
      <TimeRangeSelector
        timeRange={timeRange}
        onSelectTimeRange={onSelectTimeRange}
        onDownload={onDownload}
        roomName={roomName}
      />

      {/* Wind Speed Chart */}
      <SensorChart
        title={`Grafik Trend Kecepatan Aliran Angin (m/s) (${roomName})`}
        data={history}
        dataKey="wind_speed"
        label="Kecepatan Angin"
        color="#0284c7"
        unit="m/s"
        timeRange={timeRange}
      />
    </div>
  );
}
