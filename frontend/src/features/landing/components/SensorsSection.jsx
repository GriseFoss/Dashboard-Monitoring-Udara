import React from 'react';
import { Thermometer, Wind, Fan } from 'lucide-react';

export default function SensorsSection() {
  const sensors = [
    {
      icon: <Thermometer className="h-6 w-6 text-orange-600" />,
      tag: 'Kondisi Termal & Kelembaban',
      title: 'Sensor DHT22',
      metrics: 'Suhu (°C) & Kelembaban (%)',
      desc: 'Sensor digital presisi dengan elemen kapasitif dan termistor NTC untuk mengukur suhu dan kelembaban udara ruangan secara berkala.',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      icon: <Wind className="h-6 w-6 text-cyan-600" />,
      tag: 'Sirkulasi Udara',
      title: 'Sensor Anemometer',
      metrics: 'Kecepatan Aliran (m/s)',
      desc: 'Mengukur kelancaran laju sirkulasi udara ruangan dan ventilasi untuk memastikan sirkulasi udara bersih senantiasa mengalir aktif.',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      icon: <Fan className="h-6 w-6 text-purple-600" />,
      tag: 'Aktuator Otomatis',
      title: 'Modul Relay & Kipas',
      metrics: 'Status Kipas & Fan RPM',
      desc: 'Aktuator otomatis yang mengontrol putaran kipas ekstraksi (*exhaust fan*) saat sirkulasi udara atau suhu membutuhkan sirkulasi tambahan.',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <section id="sensor" className="py-16 bg-[#f8fafc] border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Perangkat Keras IoT</span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight">
            Instrumen Sensor & Aktuator
          </h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Integrasi sensor pengukur suhu, kelembaban, dan sirkulasi udara yang terpasang pada mikrokontroler untuk memberikan data pemantauan lingkungan yang akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {sensors.map((s, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-emerald-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  {s.icon}
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${s.badgeColor}`}>
                  {s.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#0f2942]">{s.title}</h3>
              <div className="text-xs font-mono font-semibold text-emerald-700 mt-0.5 mb-2">{s.metrics}</div>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
