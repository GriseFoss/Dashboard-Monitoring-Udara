import React, { useState } from 'react';
import { Thermometer, Droplets, Wind, ShieldCheck } from 'lucide-react';
import MetricCard from './MetricCard';
import SensorChart from './SensorChart';
import TimeRangeSelector from './TimeRangeSelector';

export default function OverviewTab({
  latest,
  history,
  timeRange,
  onSelectTimeRange,
  onDownload,
  roomName,
}) {
  const [selectedChartKey, setSelectedChartKey] = useState('temperature');

  const chartConfigs = {
    temperature: { title: 'Tren Suhu (°C)', key: 'temperature', label: 'Suhu', color: '#ea580c', unit: '°C' },
    humidity: { title: 'Tren Kelembapan (%)', key: 'humidity', label: 'Kelembapan', color: '#7c3aed', unit: '%' },
    wind_speed: { title: 'Tren Kecepatan Angin (m/s)', key: 'wind_speed', label: 'Kecepatan', color: '#0284c7', unit: 'm/s' },
    co2: { title: 'Tren Kadar CO2 (ppm)', key: 'co2', label: 'CO2', color: '#16a34a', unit: 'ppm' },
  };

  const currentChart = chartConfigs[selectedChartKey];

  return (
    <div className="space-y-6">
      {/* Air Quality Summary Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-xs">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">
              Status Kualitas Udara {roomName}
            </div>
            <div className="text-2xl font-extrabold text-[#0f2942] flex items-center gap-2 mt-0.5">
              <span>{latest?.air_quality || 'Menunggu Data...'}</span>
              {latest?.relay_state === 'ON' && (
                <span className="text-xs bg-cyan-50 text-cyan-700 border border-cyan-200 px-2.5 py-0.5 rounded-full font-semibold">
                  Kipas Aktif
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600">
            <span>Kipas (Relay): </span>
            <span className={`font-bold ${latest?.relay_state === 'ON' ? 'text-cyan-700' : 'text-slate-800'}`}>
              {latest?.relay_state || '--'}
            </span>
          </div>
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600">
            <span>Putaran Kipas: </span>
            <span className="font-bold text-[#0f2942] font-mono">{latest?.fan_rpm != null ? `${latest.fan_rpm} RPM` : '--'}</span>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid (3 Aspek Pengukuran: Suhu, Kelembapan, Sirkulasi Angin) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Suhu Ruangan"
          value={latest?.temperature}
          unit="°C"
          icon={Thermometer}
          status={latest?.temp_status || (latest?.temperature ? (latest.temperature < 30 ? 'Baik' : 'Sedang') : 'Normal')}
          subtitle="Batas aman: < 30°C"
        />

        <MetricCard
          title="Kelembapan"
          value={latest?.humidity}
          unit="%"
          icon={Droplets}
          status={latest?.hum_status || (latest?.humidity ? (latest.humidity < 70 ? 'Baik' : 'Sedang') : 'Normal')}
          subtitle="Ideal: 45 - 65%"
        />

        <MetricCard
          title="Kadar CO2"
          value={latest?.co2}
          unit="ppm"
          icon={Droplets}
          status={latest?.co2_status || (latest?.co2 ? (latest.co2 <= 1000 ? 'Baik' : 'Sedang') : 'Normal')}
          subtitle="Ideal: <= 1000 ppm"
        />

        <MetricCard
          title="Kecepatan Sirkulasi"
          value={latest?.wind_speed}
          unit="m/s"
          icon={Wind}
          status={latest?.wind_speed > 0.5 ? 'Baik' : 'Sedang'}
          subtitle="Sensor Anemometer"
        />
      </div>

      {/* Time Range Filter Bar with Room Download */}
      <TimeRangeSelector
        timeRange={timeRange}
        onSelectTimeRange={onSelectTimeRange}
        onDownload={onDownload}
        roomName={roomName}
      />

      {/* Interactive Chart Section */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-bold text-[#0f2942]">
            Grafik Trend Riwayat Telemetri ({timeRange === '3d' ? '3 Hari Terakhir' : timeRange === '7d' ? '7 Hari Terakhir' : '1 Bulan Terakhir'})
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 p-1 rounded-xl">
            {Object.entries(chartConfigs).map(([k, cfg]) => (
              <button
                key={k}
                onClick={() => setSelectedChartKey(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedChartKey === k
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        <SensorChart
          title={`${currentChart.title} (${roomName})`}
          data={history}
          dataKey={currentChart.key}
          label={currentChart.label}
          color={currentChart.color}
          unit={currentChart.unit}
          timeRange={timeRange}
        />
      </div>
    </div>
  );
}
