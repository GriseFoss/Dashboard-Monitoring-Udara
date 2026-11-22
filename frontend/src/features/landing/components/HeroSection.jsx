import React from 'react';
import {
  Leaf,
  ShieldCheck,
  MapPin,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
} from 'lucide-react';

export default function HeroSection({ onOpenDashboard, latest }) {
  const hasData = Boolean(latest && latest.id);
  const temp = hasData && latest.temperature != null ? Number(latest.temperature).toFixed(1) : null;
  const humid = hasData && latest.humidity != null ? Number(latest.humidity).toFixed(1) : null;
  const wind = hasData && latest.wind_speed != null ? Number(latest.wind_speed).toFixed(1) : null;

  // Skor Kenyamanan Ruangan berdasarkan suhu & kelembapan ideal langsung dari database
  const comfortScore = (temp !== null && humid !== null)
    ? Math.max(30, Math.min(98, Math.round(100 - Math.abs(Number(temp) - 24) * 4 - Math.abs(Number(humid) - 55) * 0.4)))
    : '--';

  const roomLabel = latest?.room ? `Ruang ${latest.room.toUpperCase()}` : 'Stasiun Telemetri Ruangan';
  const airQuality = latest?.air_quality || (hasData ? 'Kondisi Baik' : 'Memuat data...');

  return (
    <section id="beranda" className="relative overflow-hidden bg-gradient-to-b from-[#e3f2fd]/70 via-[#f0f9ff]/50 to-[#f8fafc] pt-10 pb-16 border-b border-slate-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headlines & Call To Action */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Archtera
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Air Safe Area
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-[#0f2942] tracking-tight leading-tight">
              Pantau Kualitas Udara <br className="hidden sm:inline" />
              di Sekitarmu
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              Dapatkan informasi suhu, kelembaban udara, dan kelancaran sirkulasi angin secara real-time untuk menjaga kenyamanan dan kesehatan lingkungan ruangan.
            </p>

            {/* Prominent Call to Action Button */}
            <div className="pt-2">
              <button
                onClick={onOpenDashboard}
                className="inline-flex items-center gap-3 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/25 hover:bg-emerald-700 hover:scale-[1.02] transition-all cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Buka Dashboard Telemetri</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Badges Row */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-emerald-600" />
                <span>Data Real-Time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Akurat & Terpercaya</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>Sensor DHT22 & Anemometer</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Floating Widget */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-[0_4px_20px_rgba(15,41,66,0.06)]">
              
              {/* Card Location Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0f2942]">{roomLabel}</h3>
                    <p className="text-[11px] text-slate-400">Node IoT Pemantauan Aktif</p>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div className="font-semibold text-slate-700">Real-Time Live</div>
                  <div>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              {/* AQI Score & Status Circle */}
              <div className="py-5 flex items-center gap-6">
                {/* Circular Gauge */}
                <div className="relative flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center rounded-full border-4 border-emerald-500 bg-emerald-50/40">
                  <span className="text-3xl font-extrabold text-[#0f2942] leading-none">{comfortScore}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">Skor Indeks</span>
                </div>

                {/* Status text */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-100" />
                    <span className="text-lg font-bold text-emerald-700">
                      {airQuality}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sirkulasi dan kenyamanan udara ruangan terjaga dengan stabil.
                  </p>
                </div>
              </div>

              {/* 3 Aspek Pengukuran: Suhu, Kelembaban, Sirkulasi Angin */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="rounded-xl bg-orange-50/50 border border-orange-100 p-2.5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Suhu Udara</div>
                  <div className="text-sm font-bold text-orange-700 mt-0.5">
                    {temp !== null ? `${temp}°C` : '--'}
                  </div>
                </div>
                <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-2.5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Kelembaban</div>
                  <div className="text-sm font-bold text-purple-700 mt-0.5">
                    {humid !== null ? `${humid}%` : '--'}
                  </div>
                </div>
                <div className="rounded-xl bg-cyan-50/50 border border-cyan-100 p-2.5">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Sirkulasi Angin</div>
                  <div className="text-sm font-bold text-cyan-700 mt-0.5">
                    {wind !== null ? `${wind} m/s` : '--'}
                  </div>
                </div>
              </div>

              {/* Quick Link to Dashboard */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Buka visualisasi mendalam</span>
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span>Lihat Detail Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
