import React from 'react';
import {
  Cloud,
  ChevronRight,
  Droplets,
  Wind,
  Shield,
  Check,
} from 'lucide-react';
import { getStatusTheme } from '../../../theme/designSystem';

export default function AirQualityOverviewSection({ latest, onOpenDashboard }) {
  const currentStatus = latest?.air_quality || (latest?.id ? 'Baik' : 'Memuat');
  const pollutants = [
    {
      label: 'Suhu Udara (DHT22)',
      desc: 'Termal ruangan aktual',
      value: latest?.temperature != null ? `${Number(latest.temperature).toFixed(1)} °C` : '--',
      status: currentStatus,
    },
    {
      label: 'Kelembapan Relatif (RH)',
      desc: 'Kandungan uap air aktual',
      value: latest?.humidity != null ? `${Number(latest.humidity).toFixed(1)} %` : '--',
      status: currentStatus,
    },
    {
      label: 'Kecepatan Sirkulasi Angin',
      desc: 'Aliran sirkulasi anemometer aktual',
      value: latest?.wind_speed != null ? `${Number(latest.wind_speed).toFixed(1)} m/s` : '--',
      status: currentStatus,
    },
  ];

  return (
    <section id="tips" className="py-12 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Parameter Sensor List (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-[#0f2942]">Detail Parameter Kualitas Udara</h3>
                </div>
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  <span>Buka Dashboard</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              {/* Green status notification banner */}
              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 mb-4 flex items-start gap-3">
                <div className="rounded-full bg-emerald-500 p-1 text-white flex-shrink-0 mt-0.5">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <div className="text-xs text-emerald-800 leading-relaxed font-medium">
                  Kualitas udara ruangan saat ini dalam kondisi <strong>{currentStatus}</strong>. Sirkulasi udara berada dalam batas nyaman dan aman.
                </div>
              </div>

              {/* Pollutants list */}
              <div className="divide-y divide-slate-100 text-xs">
                {pollutants.map((item, idx) => {
                  const st = getStatusTheme(item.status);
                  return (
                    <div key={idx} className="py-3 flex items-center justify-between hover:bg-slate-50/70 px-2 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${st.dot}`} />
                        <div>
                          <div className="font-semibold text-slate-800">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <span className="font-mono font-bold text-slate-800">{item.value}</span>
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${st.badge}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Right Column: Tips Udara Sehat & Tren (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tips Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#0f2942]">Tips Kesehatan Udara</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="rounded-full bg-emerald-100 p-2 text-emerald-600 flex-shrink-0">
                    <Wind className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Sirkulasi Kipas Otomatis</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Pastikan kipas ekstraksi aktif saat sirkulasi udara ruangan rendah agar udara tetap segar dan mengalir lancar.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="rounded-full bg-cyan-100 p-2 text-cyan-600 flex-shrink-0">
                    <Droplets className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Jaga Hidrasi Tubuh</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Konsumsi air yang cukup membantu menjaga kelembapan membran mukosa saluran pernapasan.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="rounded-full bg-blue-100 p-2 text-blue-600 flex-shrink-0">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Pengaturan Suhu Nyaman</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Jaga suhu ruangan di rentang 24°C - 27°C untuk produktivitas dan kenyamanan maksimal.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
