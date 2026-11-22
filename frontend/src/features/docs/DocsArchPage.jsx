import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Server,
  Database,
  Globe,
  Radio,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  HardDrive,
  RefreshCw,
  Clock,
  Terminal,
  BookOpen,
  Share2,
  Workflow,
  Sparkles,
  GitBranch,
  ChevronRight,
  Check,
  Copy,
} from 'lucide-react';
import CodeBlock from './components/CodeBlock';

export default function DocsArchPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('pipeline');
  const baseIp = '202.155.17.57';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-800">
                <Workflow className="h-3.5 w-3.5 text-indigo-600" />
                <span>Dokumentasi Arsitektur Sistem & Alur Kerja Archtera</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight">
                Arsitektur & Spesifikasi Teknologi Sistem
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
                Panduan komprehensif rancang bangun sistem telemetri multi-ruangan Archtera: mulai dari lapisan akuisisi sensor fisik (IoT edge), protokol pesan MQTT, pemrosesan backend Node.js, database SQLite WAL, hingga visualisasi real-time.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('docs-all')}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Hub Dokumentasi (/docs-all)</span>
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-10">
        
        {/* SECTION 1: 5-LAYER ARCHITECTURE OVERVIEW */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f2942]">
                1. Topologi Arsitektur 5-Lapisan (End-to-End Hierarchy)
              </h2>
              <p className="text-xs text-slate-500">
                Pemisahan tanggung jawab sistem (Separation of Concerns) dari sensor fisik hingga antarmuka pengguna.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Layer 1 */}
            <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md inline-block">
                  Lapisan 1: Edge / Sensing
                </span>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="h-4 w-4 text-cyan-600" />
                  <span>Hardware & Akuisisi</span>
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  ESP32 Microcontroller membaca sensor suhu/kelembaban DHT22 (digital) dan Anemometer sirkulasi udara (analog ADC). Dilengkapi aktuasi relay otomatis exhaust fan.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-cyan-100 text-[10px] font-mono text-cyan-900 font-semibold">
                GPIO 4, 34, 5 • C++ Firmware
              </div>
            </div>

            {/* Layer 2 */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                  Lapisan 2: Transport
                </span>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Radio className="h-4 w-4 text-emerald-600" />
                  <span>MQTT Messaging Broker</span>
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Eclipse Mosquitto v2.0 pada VPS {baseIp}. Menerima publikasi JSON ringan dari node IoT via port 1883 (TCP) dan port 9001 (WebSocket) dengan latensi sub-detik.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-100 text-[10px] font-mono text-emerald-900 font-semibold">
                Port 1883 • QoS 0/1 • Keepalive 60s
              </div>
            </div>

            {/* Layer 3 */}
            <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded-md inline-block">
                  Lapisan 3: Ingestion
                </span>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Server className="h-4 w-4 text-purple-600" />
                  <span>Backend Node.js Core</span>
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Service Express.js bertindak sebagai MQTT Subscriber aktif. Melakukan validasi schema payload, penentuan label kualitas udara, dan penyediaan REST API.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-purple-100 text-[10px] font-mono text-purple-900 font-semibold">
                Express.js • Port 5000 • PM2 Cluster
              </div>
            </div>

            {/* Layer 4 */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md inline-block">
                  Lapisan 4: Storage
                </span>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-amber-600" />
                  <span>SQLite WAL Engine</span>
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Database file lokal berkecepatan tinggi dengan C++ binding (better-sqlite3) mode Write-Ahead Logging (WAL). Pembacaan paralel tanpa kunci (non-blocking reads).
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-amber-100 text-[10px] font-mono text-amber-900 font-semibold">
                air_data.db • WAL Mode • Indexed
              </div>
            </div>

            {/* Layer 5 */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md inline-block">
                  Lapisan 5: UI / Gateway
                </span>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>Nginx & React SPA</span>
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Nginx sebagai reverse proxy TLS/SSL & file server statis. Frontend React 19 + Tailwind menghadirkan dashboard analitik, kontrol admin, dan monitoring multi-ruang.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-100 text-[10px] font-mono text-blue-900 font-semibold">
                React 19 • Chart.js • Nginx 443
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE FLOWCHARTS (DIAGRAM ALIR) */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Workflow className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f2942]">
                  2. Diagram Alir Sistem (System Flowcharts)
                </h2>
                <p className="text-xs text-slate-500">
                  Visualisasi proses langkah demi langkah untuk setiap subsistem utama.
                </p>
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pipeline'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Alur Data Telemetri (End-to-End)
              </button>
              <button
                onClick={() => setActiveTab('actuation')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'actuation'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Logika Aktuator Kipas (Edge Logic)
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'network'
                    ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Routing Reverse Proxy (Nginx)
              </button>
            </div>
          </div>

          {/* TAB 1: DATA PIPELINE FLOWCHART */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-2">
                  Alur Pipeline Data: Dari Transduser Fisik hingga Visualisasi Dashboard
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Setiap interval sampling (default: 3000 ms), perangkat node IoT melakukan pembacaan, validasi, dan pengiriman payload ke server pusat tanpa hambatan proses.
                </p>

                {/* Flowchart Diagram Visualization */}
                <div className="mt-6 space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-white font-bold text-sm shadow-xs">
                      1
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                          Sensor Transduction (Edge)
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">GPIO 4 & GPIO 34</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0f2942] mt-1.5">Sampling Suhu, Kelembaban, & Kecepatan Angin</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Sensor DHT22 membaca temperatur (°C) dan kelembaban relatif (% RH). Anemometer membaca beda potensial analog (0.4V - 2.0V) lalu dikonversikan menjadi kecepatan angin linear (0 - 30 m/s).
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-2 text-slate-300">
                    <ArrowDown className="h-6 w-6 stroke-[2.5]" />
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-xs">
                      2
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          JSON Serialization & MQTT Publish
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">PubSubClient • Port 1883</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0f2942] mt-1.5">Enkapsulasi Payload & Transmisi ke Broker</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        ESP32 menyusun JSON berukuran ringkas (~120 bytes) berisi room ID, suhu, kelembaban, kecepatan angin, dan relay state, lalu mempublikasikannya ke topik <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded">air_monitoring/data</code>.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-2 text-slate-300">
                    <ArrowDown className="h-6 w-6 stroke-[2.5]" />
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-sm shadow-xs">
                      3
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                          Backend Ingestion & Evaluation
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">Node.js Express Subscriber</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0f2942] mt-1.5">Pemrosesan Server & Scoring Kualitas Udara</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Service Node.js menerima paket via socket MQTT lokal (<code className="bg-slate-100 px-1 py-0.5 rounded">mqtt://127.0.0.1:1883</code>). Backend mengevaluasi batas kelayakan udara (Baik, Sedang, Kurang) dan menyiapkan data terformat.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-2 text-slate-300">
                    <ArrowDown className="h-6 w-6 stroke-[2.5]" />
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white font-bold text-sm shadow-xs">
                      4
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          ACID Database Commit
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">better-sqlite3 • WAL Mode</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0f2942] mt-1.5">Penyimpanan Terindeks di SQLite (air_data.db)</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Data dicatat ke tabel <code className="bg-slate-100 px-1 py-0.5 rounded">readings</code> dengan timestamp ISO lokal. Mode WAL memastikan penulisan instan (sub-milidetik) tanpa memblokir pembacaan API yang terjadi bersamaan.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-2 text-slate-300">
                    <ArrowDown className="h-6 w-6 stroke-[2.5]" />
                  </div>

                  {/* Step 5 */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs">
                      5
                    </div>
                    <div className="flex-1 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                          Client Consumption & Telemetry
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">GET /api/latest • React Polling</span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0f2942] mt-1.5">Konsumsi REST API & Reaktif Render di Frontend</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Web Browser pengguna memanggil endpoint terenkripsi SSL HTTPS. Komponen Hero Section, Indikator Ruang, dan Grafik Tren Riwayat memperbarui visualisasinya secara halus tanpa re-load halaman.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTUATION LOGIC FLOWCHART */}
          {activeTab === 'actuation' && (
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-2">
                  Logika Otomasi Aktuator Kipas Sirkulasi (Edge Actuation & Hysteresis)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Untuk mencegah relay berosilasi (berkedip on/off terlalu cepat akibat fluktuasi bacaan sensor di batas ambang), sistem menggunakan algoritma <strong>Hysteresis Buffer</strong>:
                </p>

                {/* Decision Flowchart Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Kondisi 1: Trigger ON */}
                  <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                        Kondisi Trigger ON
                      </span>
                      <Zap className="h-4 w-4 text-rose-600" />
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      Suhu &gt; 29.5 °C <br />
                      <span className="text-rose-600">ATAU</span> <br />
                      Kecepatan Angin &lt; 0.3 m/s
                    </div>
                    <div className="pt-2 border-t border-rose-100 text-xs text-rose-700">
                      <strong>Aksi:</strong> Relay Aktif (GPIO 5 LOW). Exhaust Fan berputar penuh untuk mengevakuasi udara panas dan melancarkan sirkulasi ruangan.
                    </div>
                  </div>

                  {/* Kondisi 2: Hysteresis / Buffer */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Zona Aman (Hysteresis)
                      </span>
                      <Activity className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      Suhu: 27.1 °C s/d 29.5 °C <br />
                      <span className="text-amber-600">DAN</span> <br />
                      Angin: 0.3 s/d 0.5 m/s
                    </div>
                    <div className="pt-2 border-t border-amber-100 text-xs text-amber-800">
                      <strong>Aksi:</strong> Pertahankan state sebelumnya (No Change). Menjaga ketahanan mekanis motor kipas dari siklus switching frekuensi tinggi.
                    </div>
                  </div>

                  {/* Kondisi 3: Trigger OFF */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Kondisi Standby OFF
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      Suhu &le; 27.0 °C <br />
                      <span className="text-emerald-600">DAN</span> <br />
                      Kecepatan Angin &ge; 0.5 m/s
                    </div>
                    <div className="pt-2 border-t border-emerald-100 text-xs text-emerald-700">
                      <strong>Aksi:</strong> Relay Nonaktif (GPIO 5 HIGH). Kipas berhenti otomatis untuk efisiensi daya listrik karena ventilasi ruangan sudah ideal.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NETWORK & REVERSE PROXY FLOWCHART */}
          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-2">
                  Topologi Jaringan VPS, Nginx Ingress, & Port Mappings
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Semua akses publik masuk melalui gerbang Nginx Reverse Proxy pada port 80/443 dengan enkripsi SSL. Service internal terisolasi di localhost untuk keamanan maksimal.
                </p>

                {/* Routing Flow Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Protokol Masuk</th>
                        <th className="p-3">Path / Domain</th>
                        <th className="p-3">Tujuan Routing Internal</th>
                        <th className="p-3">Fungsi Utama</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="p-3 font-mono font-bold text-emerald-700">HTTPS (443)</td>
                        <td className="p-3 font-mono">/api/*</td>
                        <td className="p-3 font-mono text-purple-700">http://127.0.0.1:5000</td>
                        <td className="p-3 text-slate-600">Backend Express.js (REST API & Telemetri)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-emerald-700">HTTPS (443)</td>
                        <td className="p-3 font-mono">/* (SPA)</td>
                        <td className="p-3 font-mono text-blue-700">/var/www/air_monitoring/frontend/dist</td>
                        <td className="p-3 text-slate-600">Static Build React (HTML, CSS, JS Bundle)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-cyan-700">TCP (1883)</td>
                        <td className="p-3 font-mono">Direct IP:1883</td>
                        <td className="p-3 font-mono text-cyan-700">Mosquitto Service (Direct TCP)</td>
                        <td className="p-3 text-slate-600">Komunikasi MQTT Perangkat ESP32 Hardware</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-amber-700">WSS (443)</td>
                        <td className="p-3 font-mono">/mqtt</td>
                        <td className="p-3 font-mono text-amber-700">http://127.0.0.1:9001</td>
                        <td className="p-3 text-slate-600">Mosquitto WebSocket untuk Real-Time Browser Stream</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: COMPREHENSIVE TECH STACK SPECIFICATION */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f2942]">
                3. Rincian Komponen & Spesifikasi Teknologi
              </h2>
              <p className="text-xs text-slate-500">
                Daftar lengkap pustaka, hardware, driver, dan konfigurasi performa yang digunakan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tech Item: Hardware & Firmware */}
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f2942] flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-600" />
                  <span>Sistem Mikrokontroler & Transduser</span>
                </h3>
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">Hardware</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>ESP32 NodeMCU:</strong> Tensilica Xtensa Dual-Core 32-bit 240MHz, 520 KB SRAM, Built-in WiFi 802.11 b/g/n.</li>
                <li><strong>DHT22 (AM2302):</strong> Rentang suhu -40 s/d 80 °C (akurasi ±0.5 °C), kelembaban 0 s/d 100% RH (akurasi ±2%).</li>
                <li><strong>Anemometer Analog:</strong> 3-Cup Sensor, output tegangan 0.4V - 2.0V DC sebanding dengan 0 - 30 m/s kecepatan udara.</li>
                <li><strong>Relay Module:</strong> 5V 1-Channel dengan isolasi Optocoupler PC817 (Active-LOW) untuk kontrol kipas sirkulasi AC/DC.</li>
                <li><strong>Pustaka Firmware:</strong> Arduino Core ESP32, PubSubClient 2.8, DHT sensor library by Adafruit, ArduinoJson 6.x.</li>
              </ul>
            </div>

            {/* Tech Item: Ingestion & Server Broker */}
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f2942] flex items-center gap-2">
                  <Radio className="h-4 w-4 text-emerald-600" />
                  <span>MQTT Broker & Message Bus</span>
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Messaging</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>Eclipse Mosquitto:</strong> v2.0.11 berjalan sebagai systemd service pada VPS Linux Ubuntu 22.04 LTS.</li>
                <li><strong>Listener Dual-Mode:</strong> Port 1883 (Raw TCP Socket untuk IoT Node) dan Port 9001 (WebSockets listener).</li>
                <li><strong>Throughput:</strong> Mampu memproses ribuan pesan per detik dengan jejak memori kurang dari 15 MB RAM.</li>
                <li><strong>Topik Struktur Hierarkis:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded">air_monitoring/data</code> untuk telemetri dan <code className="bg-slate-200 px-1 py-0.5 rounded">air_monitoring/control/&#123;room&#125;</code> untuk downlink kontrol.</li>
              </ul>
            </div>

            {/* Tech Item: Backend Runtime & Database */}
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f2942] flex items-center gap-2">
                  <Database className="h-4 w-4 text-amber-600" />
                  <span>Backend Engine & Storage</span>
                </h3>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Database & API</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>Node.js v20 LTS:</strong> Non-blocking event-driven runtime dikelola oleh process manager PM2.</li>
                <li><strong>Express.js:</strong> Framework RESTful API yang melayani query analitik, download CSV, dan status diagnostik.</li>
                <li><strong>Better-SQLite3:</strong> Library driver SQLite sinkron tercepat di ekosistem Node.js dengan binding native C++.</li>
                <li><strong>WAL Mode (Write-Ahead Logging):</strong> Memungkinkan operasi tulis (INSERT) dan operasi baca (SELECT) berjalan paralel tanpa file lock.</li>
              </ul>
            </div>

            {/* Tech Item: Frontend Web App */}
            <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0f2942] flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>Frontend Client & Visualisasi</span>
                </h3>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Frontend</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li><strong>React 19 & Vite 8:</strong> Arsitektur Single Page Application (SPA) ultra-cepat dengan Hot Module Replacement (HMR).</li>
                <li><strong>Tailwind CSS:</strong> Utilitas styling responsif dengan palette warna sistematis ramah mata.</li>
                <li><strong>Chart.js & react-chartjs-2:</strong> Visualisasi grafik tren garis dinamis dengan interpolasi cubic smoothing.</li>
                <li><strong>Lucide React:</strong> Ikon vektor modern beresolusi tinggi yang konsisten di semua layar gawai.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* SECTION 4: DATA CONTRACT & SCHEMA DEFINITION */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600">
              <Share2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f2942]">
                4. Kontrak Data Telemetri & Skema Database
              </h2>
              <p className="text-xs text-slate-500">
                Standarisasi format payload antar perangkat keras, broker pesan, dan basis data.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Spesifikasi Format JSON MQTT (Transmisi Node IoT)
            </h3>
            <CodeBlock
              language="json"
              title="MQTT Ingestion Payload Contract"
              code={`{
  "room": "lab_td",          // Identifier stasiun: 'lab_td', 'lab_kom', 'h5', 'seminar'
  "temperature": 26.4,      // Derajat Celcius (DHT22 Float, 1 desimal)
  "humidity": 55.6,         // Persentase Kelembaban Relatif (DHT22 Float, 1 desimal)
  "wind_speed": 1.2,        // Kecepatan Sirkulasi Angin (m/s Float, Anemometer ADC)
  "relay_state": "OFF",     // Status Aktuator Kipas: 'ON' atau 'OFF'
  "air_quality": "Baik"     // Evaluasi Lokal: 'Baik', 'Sedang', atau 'Kurang'
}`}
            />

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-3">
              DDL Skema Tabel SQLite (air_data.db)
            </h3>
            <CodeBlock
              language="sql"
              title="Database Table Schema & Performance Indexes"
              code={`-- Tabel Utama Rekaman Telemetri Sensor
CREATE TABLE IF NOT EXISTS readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room TEXT NOT NULL,
  temperature REAL NOT NULL,
  humidity REAL NOT NULL,
  wind_speed REAL DEFAULT 0,
  relay_state TEXT DEFAULT 'OFF',
  air_quality TEXT DEFAULT 'Baik',
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indeks Kinerja untuk Kueri Grafis Cepat (Multi-Column Index)
CREATE INDEX IF NOT EXISTS idx_room_time ON readings(room, recorded_at);
CREATE INDEX IF NOT EXISTS idx_room_id ON readings(room, id DESC);

-- Pragmas Konfigurasi Kecepatan & Keamanan Transaksi
PRAGMA journal_mode = WAL;          -- Write-Ahead Logging untuk konkurensi tinggi
PRAGMA synchronous = NORMAL;        -- Mengurangi disk I/O bottleneck
PRAGMA cache_size = -64000;         -- 64MB In-Memory Cache`}
            />
          </div>
        </section>

        {/* SECTION 5: FAULT TOLERANCE, SECURITY & PERFORMANCE */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0f2942]">
                5. Keandalan Sistem, Toleransi Kesalahan, & Keamanan
              </h2>
              <p className="text-xs text-slate-500">
                Mekanisme pertahanan berlapis untuk menjamin sistem berjalan 24/7 tanpa henti (High Availability).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <RefreshCw className="h-4 w-4" />
                <span>Auto Reconnect Loop (Edge)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Firmware ESP32 mengimplementasikan algoritma non-blocking timer (<code className="bg-slate-200 px-1 py-0.5 rounded">millis()</code>). Jika koneksi WiFi atau MQTT terputus, mikrokontroler akan mencoba reconnect secara berkala tanpa membekukan logika sampling sensor maupun aktuasi kipas lokal.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <Zap className="h-4 w-4" />
                <span>Process Supervisor PM2</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Backend Node.js diawasi secara penuh oleh PM2. Jika terjadi uncaught exception atau lonjakan konsumsi memori, PM2 akan melakukan auto-restart instan dalam hitungan milidetik sehingga downtime sistem bernilai mendekati nol.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>Enkripsi TLS/SSL & Firewall</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Seluruh komunikasi klien web dilindungi sertifikat SSL TLS 1.3 melalui Nginx / Cloudflare Edge. Port server dilindungi oleh firewall Linux (UFW) hanya membuka akses untuk port publik yang diperlukan (22, 80, 443, 1883).
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-[#0f2942]">Langkah Selanjutnya untuk Pengembang</h4>
            <p className="text-xs text-slate-500">Kunjungi dokumentasi teknis mendalam sesuai dengan bidang tugas Anda:</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('docs-iot')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-800 hover:bg-cyan-100 transition-colors cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5 text-cyan-600" />
              <span>Dokumentasi IoT</span>
            </button>
            <button
              onClick={() => onNavigate('docs-backend')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Server className="h-3.5 w-3.5 text-emerald-600" />
              <span>Dokumentasi Backend</span>
            </button>
            <button
              onClick={() => onNavigate('docs-vps')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Terminal className="h-3.5 w-3.5 text-amber-600" />
              <span>Dokumentasi VPS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
