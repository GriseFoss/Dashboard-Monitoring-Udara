import React from 'react';
import { Layers, Server, Database, Globe } from 'lucide-react';

export default function AboutSection() {
  const steps = [
    {
      icon: <Layers className="h-5 w-5 text-emerald-600" />,
      title: '1. Akuisisi Data Sensor',
      desc: 'Mikrokontroler membaca suhu, kelembaban udara (DHT22), serta kecepatan sirkulasi angin (Anemometer).'
    },
    {
      icon: <Globe className="h-5 w-5 text-cyan-600" />,
      title: '2. Transmisi via MQTT',
      desc: 'Data dipublikasikan secara instan ke server publik EMQX (broker.emqx.io) pada topik khusus tanpa jeda.'
    },
    {
      icon: <Server className="h-5 w-5 text-blue-600" />,
      title: '3. Backend API & SQLite',
      desc: 'Server Node.js Express berlangganan data, melakukan sanitasi data, dan menyimpannya ke database lokal SQLite.'
    },
    {
      icon: <Database className="h-5 w-5 text-amber-600" />,
      title: '4. Visualisasi & Alerting',
      desc: 'Dashboard web React menampilkan metrik secara real-time, grafik tren riwayat, dan sistem otomasi kipas.'
    }
  ];

  return (
    <section id="tentang" className="py-16 bg-white border-t border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Tentang Sistem</span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight">
            Menghadirkan Ruang Sehat Melalui Otomasi Udara
          </h2>
          <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
            Sistem pemantauan ini dikembangkan untuk memecahkan permasalahan udara pengap, ketidakseimbangan suhu, dan kelembaban di ruang tertutup melalui pemantauan cerdas dan aktuasi sirkulasi otomatis.
          </p>
        </div>

        {/* 4 Step Workflow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 transition-all hover:bg-white hover:shadow-md hover:border-emerald-200"
            >
              <div className="mb-3.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200/80 shadow-xs">
                {s.icon}
              </div>
              <h3 className="text-sm font-bold text-[#0f2942] mb-1.5">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Standards comparison table */}
        <div className="mt-10 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
          <h3 className="text-sm font-bold text-[#0f2942] mb-3">Ambang Batas & Rekomendasi Baku Mutu Kenyamanan Udara:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="font-bold text-orange-700 block mb-1">Suhu Udara (DHT22)</span>
              <p className="text-slate-600">• Nyaman: 22°C - 27°C</p>
              <p className="text-amber-600">• Cukup Hangat: 28°C - 30°C</p>
              <p className="text-rose-600">• Panas: &gt; 30°C</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="font-bold text-blue-700 block mb-1">Kelembaban Relatif (RH)</span>
              <p className="text-slate-600">• Ideal: 45% - 65% RH</p>
              <p className="text-amber-600">• Cukup Lembap: 66% - 75% RH</p>
              <p className="text-rose-600">• Sangat Lembap: &gt; 75% RH</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="font-bold text-cyan-700 block mb-1">Kecepatan Angin (Sirkulasi)</span>
              <p className="text-amber-600">• Sirkulasi Rendah: &lt; 0.3 m/s</p>
              <p className="text-slate-600">• Sirkulasi Optimal: 0.3 - 1.5 m/s</p>
              <p className="text-emerald-700">• Sirkulasi Aktif: &gt; 1.5 m/s</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
