import React from 'react';
import {
  BookOpen,
  Cpu,
  Server,
  Terminal,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Thermometer,
  Droplets,
  Wind,
  Fan,
  ExternalLink,
  Code2,
  Zap,
  Globe,
  Database,
  Workflow,
} from 'lucide-react';

export default function DocsAllHubPage({ onNavigate }) {
  const baseIp = '202.155.17.57';

  const docPillars = [
    {
      id: 'docs-arch',
      title: 'Dokumentasi Arsitektur Sistem & Alur Kerja',
      badge: 'System Architecture',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Workflow,
      iconColor: 'text-indigo-600',
      desc: 'Penjelasan komprehensif topologi 5-lapisan sistem telemetri Archtera, flowchart data end-to-end, logika hysteresis aktuator exhaust fan, kontrak skema SQLite WAL, dan reverse proxy Nginx.',
      highlights: [
        'Diagram Alir (Flowchart) lengkap: Sensor Transduction -> MQTT Broker -> Express Engine -> SQLite WAL -> Dashboard UI',
        'Algoritma Hysteresis Buffer otomasi kipas (Suhu > 29.5°C atau Angin < 0.3 m/s) tanpa osilasi relay',
        'Topologi Ingress Nginx port 80/443, Mosquitto port 1883/9001, dan Node.js internal port 5000',
        'Spesifikasi kontrak JSON payload MQTT & optimasi SQLite WAL mode PRAGMA synchronous NORMAL',
      ],
      linkText: 'Buka Dokumentasi Arsitektur (/docs-arch)',
    },
    {
      id: 'docs-iot',
      title: 'Dokumentasi Perangkat Keras IoT',
      badge: 'Hardware & Firmware',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Cpu,
      iconColor: 'text-cyan-600',
      desc: 'Panduan lengkap perakitan sirkuit ESP32, skema wiring pinout DHT22 & Anemometer, format string JSON MQTT, dan full source code firmware Arduino C++.',
      highlights: [
        'Pinout GPIO ESP32 (DHT22 di GPIO 4, Anemometer di GPIO 34, Relay di GPIO 5)',
        'Kalkulasi konversi ADC tegangan analog anemometer (0.4V - 2.0V)',
        'Otomasi lokal aktuator relay exhaust fan (suhu > 29.5°C atau sirkulasi < 0.3 m/s)',
        'Firmware Arduino C++ siap upload dengan auto-reconnect WiFi & MQTT',
      ],
      linkText: 'Buka Dokumentasi IoT (/docs-iot)',
    },
    {
      id: 'docs-backend',
      title: 'Dokumentasi Backend & RESTful API',
      badge: 'API & Database',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: Server,
      iconColor: 'text-emerald-600',
      desc: 'Spesifikasi endpoint REST API Express.js, reverse proxy SSL Nginx, skema tabel SQLite, serta contoh integrasi multi-bahasa pemrograman.',
      highlights: [
        'Endpoint GET /api/latest, /api/readings, /api/download, dan /api/status',
        'Struktur skema tabel SQLite (air_data.db) dengan query filter 3d/7d/30d',
        'Contoh kode pemanggilan API dengan cURL, Fetch JavaScript, dan Python',
        'Dukungan penuh CORS dan SSL HTTPS tanpa mixed-content',
      ],
      linkText: 'Buka Dokumentasi Backend (/docs-backend)',
    },
    {
      id: 'docs-vps',
      title: 'Dokumentasi Server VPS & Deploy',
      badge: 'DevOps & Server',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Terminal,
      iconColor: 'text-amber-600',
      desc: 'Informasi login SSH, kredensial otentikasi IP 202.155.17.57, otomatisasi deploy 1-klik di VPS kosongan, dan pemeliharaan service PM2 & Nginx.',
      highlights: [
        'Kredensial SSH: IP 202.155.17.57, User root, Password iot123bridge321',
        'Eksekusi otomatisasi deploy via script setup-production.sh',
        'Panduan menghubungkan domain custom via Cloudflare DNS & SSL Full',
        'Perintah monitoring berkala (pm2 status, pm2 logs, systemctl restart nginx)',
      ],
      linkText: 'Buka Dokumentasi VPS (/docs-vps)',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      {/* Top Hero Banner */}
      <div className="border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
              <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
              <span>Titik Kumpul Dokumentasi Pengembang Archtera — Air Safe Area</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0f2942] tracking-tight leading-tight">
              Panduan Arsitektur & Titik Awal Pengembang Archtera
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Halaman ini merupakan <strong>dokumen pengantar pertama</strong> yang dirancang khusus untuk memandu teknisi perangkat keras, pengembang IoT, dan pengembang perangkat lunak dalam memahami, merakit, dan menghubungkan seluruh instrumen sistem ke server produksi <strong>{baseIp}</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs transition-all cursor-pointer"
              >
                <span>Buka Dashboard Telemetri</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1: Overview Parameter & Ruangan */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Layers className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">1. Ruang Lingkup Pengukuran & Karakteristik Sistem</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 3 Measured Aspects */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#0f2942]">3 Aspek Pengukuran Utama</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sistem berfokus pada kesehatan termal dan kelancaran sirkulasi udara ruangan tertutup:
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/60 border border-orange-100">
                  <Thermometer className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Suhu Udara (°C):</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Diukur dengan sensor DHT22. Ambang batas nyaman ruangan: 22°C - 27°C.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                  <Droplets className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Kelembaban Relatif (%):</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Diukur dengan sensor DHT22. Kelembaban ideal manusia: 45% - 65% RH.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-50/60 border border-cyan-100">
                  <Wind className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">Kecepatan Sirkulasi Angin (m/s) & Relay:</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Diukur dengan Anemometer. Mengontrol modul relay kipas ekstraksi (*exhaust fan*) otomatis saat udara pengap (&lt; 0.3 m/s) atau suhu meningkat.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Rooms */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-[#0f2942]">4 Ruangan yang Dimonitoring</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Setiap node telemetri mengirimkan kode pengenal ruangan (<code>room</code>) yang tersimpan rapi di database:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono">Kode: lab_td</span>
                  <div className="font-bold text-[#0f2942] text-sm mt-0.5">Ruang Lab TD</div>
                  <p className="text-[11px] text-slate-500 mt-1">Laboratorium Teknik Daya</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono">Kode: lab_kom</span>
                  <div className="font-bold text-[#0f2942] text-sm mt-0.5">Ruang Lab Kom</div>
                  <p className="text-[11px] text-slate-500 mt-1">Laboratorium Komputer</p>
                </div>

                <div className="rounded-xl border border-emerald-300 bg-emerald-50/50 p-3.5">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase font-mono">Kode: h5 (Live)</span>
                  <div className="font-bold text-emerald-950 text-sm mt-0.5">Ruang H5</div>
                  <p className="text-[11px] text-emerald-700 mt-1">Node Hardware IoT Langsung</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase font-mono">Kode: seminar</span>
                  <div className="font-bold text-[#0f2942] text-sm mt-0.5">Ruang Seminar</div>
                  <p className="text-[11px] text-slate-500 mt-1">Ruang Seminar & Diskusi</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: End-to-End System Architecture */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-[#0f2942]">2. Peta Alur Komunikasi Sistem Menyeluruh</h2>
            </div>
            <button
              onClick={() => onNavigate('docs-arch')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <span>Lihat Diagram Alir & Spesifikasi Lengkap (/docs-arch)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cyan-600 uppercase font-mono">Lapisan 1</span>
                  <Cpu className="h-4 w-4 text-cyan-600" />
                </div>
                <div className="font-bold text-sm text-[#0f2942]">Perangkat IoT ESP32</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Membaca pin digital DHT22 & pin analog anemometer secara berkala setiap 5 detik.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">Lapisan 2</span>
                  <Radio className="h-4 w-4 text-blue-600" />
                </div>
                <div className="font-bold text-sm text-[#0f2942]">Broker MQTT (Mosquitto)</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  ESP32 mempublikasikan string JSON ke <code>{baseIp}:1883</code> topik <code>air_monitoring/data</code>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">Lapisan 3</span>
                  <Server className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="font-bold text-sm text-[#0f2942]">Backend VPS & SQLite</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Node.js Express di <code>{baseIp}</code> berlangganan topik, melakukan evaluasi, dan menyimpan ke <code>air_data.db</code>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-600 uppercase font-mono">Lapisan 4</span>
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <div className="font-bold text-sm text-[#0f2942]">Web React Dashboard</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  Frontend menyajikan kartu metrik live, tren grafik interaktif, dan kontrol administrasi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: 4 Documentation Pillars */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">3. Akses Panduan Detail Berdasarkan Topik</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {docPillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-emerald-300 transition-all hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Icon className={`h-6 w-6 ${p.iconColor}`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${p.badgeColor}`}>
                        {p.badge}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#0f2942]">{p.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Cakupan Bahasan:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {p.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(p.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 p-2.5 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  >
                    <span>{p.linkText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: 5-Step Quick Start Checklist */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Zap className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">4. Alur Cepat Memulai (Developer Quickstart)</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4 text-xs">
            <ol className="list-decimal list-inside space-y-3 text-slate-600 leading-relaxed">
              <li>
                <strong className="text-slate-800">Baca Skema Rangkaian di /docs-iot:</strong> Pastikan sensor DHT22 (GPIO 4), Anemometer (GPIO 34), dan Relay (GPIO 5) terhubung stabil pada mikrokontroler ESP32 Anda.
              </li>
              <li>
                <strong className="text-slate-800">Flash Firmware Arduino C++:</strong> Masukkan SSID dan password WiFi lokal Anda pada firmware yang disediakan di <code>/docs-iot</code>, lalu upload ke board ESP32.
              </li>
              <li>
                <strong className="text-slate-800">Periksa Serial Monitor:</strong> Pastikan muncul pesan <code>[WiFi] Berhasil Terhubung!</code> dan <code>[MQTT Publish Success]</code> setiap 5 detik.
              </li>
              <li>
                <strong className="text-slate-800">Periksa Status Server VPS di /docs-vps:</strong> Pastikan service <code>air-backend</code> berjalan di VPS (<code>pm2 status</code>).
              </li>
              <li>
                <strong className="text-slate-800">Buka Web Dashboard:</strong> Buka <code>https://{baseIp}/dashboard</code> — data suhu, kelembaban, dan sirkulasi angin ruangan Anda akan langsung tampil secara real-time!
              </li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
