import React from 'react';
import { Thermometer, Droplets, Sun, Info } from 'lucide-react';
import MetricCard from './MetricCard';
import SensorChart from './SensorChart';
import TimeRangeSelector from './TimeRangeSelector';

export default function TempHumidTab({
  latest,
  history,
  timeRange,
  onSelectTimeRange,
  onDownload,
  roomName,
}) {
  const t = latest?.temperature ?? null;
  const h = latest?.humidity ?? null;

  const getComfortAssessment = () => {
    if (t === null || h === null) return 'Menunggu pembacaan sensor DHT22...';
    if (t <= 28 && h >= 45 && h <= 65) {
      return `Kondisi Termal Sangat Nyaman di ${roomName}. Suhu dan kelembapan berada pada rentang ideal kenyamanan ruang.`;
    }
    if (t > 30) {
      return `Suhu di ${roomName} Cukup Hangat. Disarankan mengaktifkan sirkulasi udara atau membuka ventilasi.`;
    }
    if (h > 70) {
      return `Kelembapan Tinggi (>70%) di ${roomName}. Berpotensi memicu pengap jika ventilasi udara ruangan tertutup.`;
    }
    return `Kondisi Termal di ${roomName} Cukup Baik.`;
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0f2942] flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-600" />
            <span>Pemantauan Suhu dan Kelembapan {roomName}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menganalisis kenyamanan termal dan tingkat kelembapan udara relatif di dalam ruangan.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
          <Info className="h-4 w-4 text-cyan-600" />
          <span className="text-slate-700 font-medium">Sensor: DHT22 Digital</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Suhu Udara"
          value={t}
          unit="°Celsius"
          icon={Thermometer}
          status={latest?.temp_status || (t ? (t < 30 ? 'Baik' : 'Sedang') : 'Normal')}
          subtitle="Standar SNI: 24°C - 27°C"
        />

        <MetricCard
          title="Kelembapan Relatif (RH)"
          value={h}
          unit="%"
          icon={Droplets}
          status={latest?.hum_status || (h ? (h < 70 ? 'Baik' : 'Sedang') : 'Normal')}
          subtitle="Ideal: 40% - 65% RH"
        />
      </div>

      {/* Assessment Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-start gap-4">
        <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-600">
          <Sun className="h-6 w-6" />
        </div>
        <div>
          <div className="text-sm font-bold text-[#0f2942]">Analisis Kondisi Termal</div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{getComfortAssessment()}</p>
        </div>
      </div>

      {/* Time Range Filter Bar with Room Download */}
      <TimeRangeSelector
        timeRange={timeRange}
        onSelectTimeRange={onSelectTimeRange}
        onDownload={onDownload}
        roomName={roomName}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorChart
          title={`Riwayat Suhu (°C) (${roomName})`}
          data={history}
          dataKey="temperature"
          label="Suhu"
          color="#ea580c"
          unit="°C"
          timeRange={timeRange}
        />

        <SensorChart
          title={`Riwayat Kelembapan (%) (${roomName})`}
          data={history}
          dataKey="humidity"
          label="Kelembapan"
          color="#7c3aed"
          unit="%"
          timeRange={timeRange}
        />
      </div>
    </div>
  );
}
