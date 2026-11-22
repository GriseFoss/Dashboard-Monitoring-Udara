import React, { useState } from 'react';
import {
  Server,
  Database,
  Radio,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Download,
  BookOpen,
  Workflow,
} from 'lucide-react';
import CodeBlock from './components/CodeBlock';

export default function DocsBackendPage({ onNavigate }) {
  const [activeLang, setActiveLang] = useState('curl');
  const baseIp = '202.155.17.57';
  const baseUrl = `https://${baseIp}/api`;

  const codeExamples = {
    curl: `# 1. Periksa status server dan koneksi MQTT
curl -k -X GET "${baseUrl}/status"

# 2. Ambil data telemetri terakhir Ruang Lab TD
curl -k -X GET "${baseUrl}/latest?room=lab_td"

# 3. Ambil riwayat grafik 7 hari terakhir Ruang H5
curl -k -X GET "${baseUrl}/readings?room=h5&range=7d"

# 4. Unduh file CSV 30 hari Ruang Seminar
curl -k -o data_seminar.csv "${baseUrl}/download?room=seminar&range=30d"`,

    js: `// Menggunakan JavaScript Fetch API (ES6+)
const BASE_URL = '${baseUrl}';

// 1. Ambil data real-time sensor terbaru
async function getLatestData(room = 'lab_td') {
  try {
    const response = await fetch(\`\${BASE_URL}/latest?room=\${room}\`);
    if (!response.ok) throw new Error(\`HTTP error! status: \${response.status}\`);
    const data = await response.json();
    
    console.log('Suhu:', data.temperature, '°C');
    console.log('Kelembaban:', data.humidity, '%');
    console.log('Kecepatan Angin:', data.wind_speed, 'm/s');
    console.log('Status Kipas:', data.relay_state);
    return data;
  } catch (error) {
    console.error('Gagal mengambil data:', error);
  }
}

// 2. Ambil riwayat telemetri untuk grafik Chart.js
async function getHistoryTrend(room = 'h5', range = '7d') {
  const response = await fetch(\`\${BASE_URL}/readings?room=\${room}&range=\${range}\`);
  const history = await response.json();
  console.log(\`Diterima \${history.length} baris rekaman sensor\`);
  return history;
}

getLatestData('lab_td');`,

    python: `import requests
import json

BASE_URL = "${baseUrl}"

# Nonaktifkan warning jika sertifikat self-signed
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# 1. Cek status koneksi backend & broker MQTT
def check_status():
    res = requests.get(f"{BASE_URL}/status", verify=False)
    print("Status Server:", res.json())

# 2. Ambil pembacaan terbaru suatu ruangan
def get_latest(room="lab_td"):
    params = {"room": room}
    res = requests.get(f"{BASE_URL}/latest", params=params, verify=False)
    data = res.json()
    print(f"[{room.upper()}] Suhu: {data.get('temperature')}°C, Lembab: {data.get('humidity')}%, Angin: {data.get('wind_speed')} m/s")
    return data

# 3. Unduh dataset CSV langsung ke file lokal
def download_csv(room="lab_td", range_param="7d", filename="sensor_data.csv"):
    res = requests.get(f"{BASE_URL}/download", params={"room": room, "range": range_param}, verify=False)
    with open(filename, "wb") as f:
        f.write(res.content)
    print(f"Dataset berhasil disimpan ke {filename}")

if __name__ == "__main__":
    check_status()
    get_latest("lab_td")
    download_csv("lab_td", "7d")`,

    nodejs: `// Menggunakan Node.js bawaan (v18+)
const BASE_URL = '${baseUrl}';

async function fetchTelemetry() {
  const res = await fetch(\`\${BASE_URL}/latest?room=lab_td\`);
  const data = await res.json();
  console.log('Telemetry Response:', data);
}

fetchTelemetry();`
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      {/* Top Header Banner */}
      <div className="border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('landing')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Beranda</span>
                </button>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Dokumentasi Teknis
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight flex items-center gap-3">
                <Server className="h-7 w-7 text-emerald-600" />
                <span>Dokumentasi Backend & REST API</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Spesifikasi lengkap RESTful API, arsitektur Nginx reverse proxy SSL, database SQLite, dan contoh kode integrasi pada server <strong>{baseIp}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onNavigate('docs-all')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all cursor-pointer shadow-2xs"
              >
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <span>Hub Pengantar</span>
              </button>

              <button
                onClick={() => onNavigate('docs-arch')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-indigo-700 transition-all cursor-pointer shadow-2xs"
              >
                <Workflow className="h-4 w-4 text-indigo-600" />
                <span>Arsitektur & Alur</span>
              </button>

              <button
                onClick={() => onNavigate('docs-iot')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all cursor-pointer shadow-2xs"
              >
                <Cpu className="h-4 w-4 text-cyan-600" />
                <span>Buka Dokumen IoT</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onNavigate('docs-vps')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-amber-700 transition-all cursor-pointer shadow-2xs"
              >
                <Terminal className="h-4 w-4 text-amber-600" />
                <span>Akses VPS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1: Server Architecture & SSL */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">1. Arsitektur Server & Endpoint SSL</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Protokol & Host</span>
              <div className="text-sm font-bold text-[#0f2942] font-mono mt-1">HTTPS (Port 443)</div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Diakses melalui Public IP <code>{baseIp}</code> dengan sertifikat SSL Self-Signed.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Base Path API</span>
              <div className="text-sm font-bold text-emerald-700 font-mono mt-1">{baseUrl}</div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Nginx me-reverse proxy rute <code>/api/*</code> ke Node.js Express di <code>http://127.0.0.1:3000/*</code>.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Database & Broker</span>
              <div className="text-sm font-bold text-slate-800 font-mono mt-1">SQLite + EMQX MQTT</div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Penyimpanan lokal di <code>air_data.db</code> dan listener MQTT di broker <code>broker.emqx.io:1883</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: REST API Endpoints Specification */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Terminal className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">2. Spesifikasi Endpoint REST API</h2>
          </div>

          <div className="space-y-6">
            {/* Endpoint 1: GET /status */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold font-mono">
                    GET
                  </span>
                  <span className="text-base font-bold text-[#0f2942] font-mono">/api/status</span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                  Health Check & Status MQTT
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Mengembalikan status operasional server backend dan konfirmasi keterhubungan listener terhadap broker MQTT EMQX.
              </p>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Contoh Response (200 OK):</span>
                <CodeBlock
                  language="json"
                  title="Response GET /api/status"
                  code={`{
  "status": "online",
  "mqtt": {
    "broker": "mqtt://broker.emqx.io",
    "topic": "monitoring_udara_ta/data",
    "connected": true
  },
  "timestamp": "2026-10-25T13:20:00.000Z"
}`}
                />
              </div>
            </div>

            {/* Endpoint 2: GET /latest */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold font-mono">
                    GET
                  </span>
                  <span className="text-base font-bold text-[#0f2942] font-mono">/api/latest</span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                  Data Sensor Terakhir
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Mengambil rekaman telemetri sensor paling baru untuk ruangan yang ditentukan. Digunakan pada kartu metrik live dashboard.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Tipe</th>
                      <th className="py-2.5 px-3">Wajib</th>
                      <th className="py-2.5 px-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-mono text-emerald-700 font-bold">room</td>
                      <td className="py-2 px-3 font-mono text-slate-500">string</td>
                      <td className="py-2 px-3 text-slate-500">Opsional</td>
                      <td className="py-2 px-3 text-slate-600">
                        Kode ruangan: <code>lab_td</code> (default), <code>lab_kom</code>, <code>h5</code>, <code>seminar</code>, atau <code>all</code>.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Contoh Response (200 OK):</span>
                <CodeBlock
                  language="json"
                  title="Response GET /api/latest?room=lab_td"
                  code={`{
  "id": 181,
  "temperature": 26.8,
  "humidity": 58.4,
  "wind_speed": 1.25,
  "fan_rpm": 920,
  "relay_state": "ON",
  "air_quality": "Baik",
  "temp_status": "Baik",
  "hum_status": "Baik",
  "uptime": 4520,
  "room": "lab_td",
  "recorded_at": "2026-10-25 20:15:00"
}`}
                />
              </div>
            </div>

            {/* Endpoint 3: GET /readings */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold font-mono">
                    GET
                  </span>
                  <span className="text-base font-bold text-[#0f2942] font-mono">/api/readings</span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                  Riwayat Telemetri Sensor
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Mengembalikan daftar deret waktu pembacaan sensor dalam urutan kronologis (ASC) untuk visualisasi grafik Chart.js.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Parameter</th>
                      <th className="py-2.5 px-3">Tipe</th>
                      <th className="py-2.5 px-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-mono text-emerald-700 font-bold">room</td>
                      <td className="py-2 px-3 font-mono text-slate-500">string</td>
                      <td className="py-2 px-3 text-slate-600">
                        Kode ruangan (<code>lab_td</code>, <code>lab_kom</code>, <code>h5</code>, <code>seminar</code>). Default: <code>lab_td</code>.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-emerald-700 font-bold">range</td>
                      <td className="py-2 px-3 font-mono text-slate-500">string</td>
                      <td className="py-2 px-3 text-slate-600">
                        Filter waktu: <code>3d</code> (3 hari), <code>7d</code> (7 hari), <code>30d</code> (1 bulan).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-emerald-700 font-bold">limit</td>
                      <td className="py-2 px-3 font-mono text-slate-500">integer</td>
                      <td className="py-2 px-3 text-slate-600">Batas maksimal baris (default: 1000, max: 2000).</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Contoh Response Array:</span>
                <CodeBlock
                  language="json"
                  title="Response GET /api/readings?room=lab_td&range=3d&limit=2"
                  code={`[
  {
    "id": 180,
    "room": "lab_td",
    "temperature": 26.5,
    "humidity": 57.0,
    "wind_speed": 1.1,
    "fan_rpm": 0,
    "relay_state": "OFF",
    "air_quality": "Baik",
    "recorded_at": "2026-10-25 18:00:00"
  },
  {
    "id": 181,
    "room": "lab_td",
    "temperature": 26.8,
    "humidity": 58.4,
    "wind_speed": 1.25,
    "fan_rpm": 920,
    "relay_state": "ON",
    "air_quality": "Baik",
    "recorded_at": "2026-10-25 18:05:00"
  }
]`}
                />
              </div>
            </div>

            {/* Endpoint 4: GET /download */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-lg bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-bold font-mono">
                    GET
                  </span>
                  <span className="text-base font-bold text-[#0f2942] font-mono">/api/download</span>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                  Unduh Dataset CSV
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Menghasilkan dan mendownload file CSV langsung dari database SQLite secara dinamis sesuai ruangan dan rentang waktu yang dipilih.
              </p>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Struktur Header Kolom CSV:</span>
                <CodeBlock
                  language="csv"
                  title="Format Output CSV"
                  code={`ID,Ruangan,Waktu_Rekam,Suhu_C,Kelembapan_Persen,Angin_ms,Status_Kipas,Kualitas_Udara
1,lab_td,"2026-10-25 10:00:00",26.4,56.2,1.2,OFF,"Baik"
2,lab_td,"2026-10-25 10:05:00",27.1,59.0,1.5,ON,"Baik"`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Database SQLite Schema */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Database className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">3. Skema Database SQLite (air_data.db)</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-3 px-4">Nama Kolom</th>
                    <th className="py-3 px-4">Tipe Data</th>
                    <th className="py-3 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2.5 px-4 text-emerald-700 font-bold">id</td>
                    <td className="py-2.5 px-4 text-slate-500">INTEGER PK AUTO</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">ID unik rekaman data</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-emerald-700 font-bold">room</td>
                    <td className="py-2.5 px-4 text-slate-500">TEXT</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">
                      Pengenal ruangan: <code>lab_td</code>, <code>lab_kom</code>, <code>h5</code>, <code>seminar</code>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-orange-700 font-bold">temperature</td>
                    <td className="py-2.5 px-4 text-slate-500">REAL</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Suhu udara ruangan (°C) dari sensor DHT22</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-purple-700 font-bold">humidity</td>
                    <td className="py-2.5 px-4 text-slate-500">REAL</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Kelembaban relatif udara (%) dari sensor DHT22</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-cyan-700 font-bold">wind_speed</td>
                    <td className="py-2.5 px-4 text-slate-500">REAL</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Kecepatan aliran sirkulasi udara (m/s) dari Anemometer</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-800 font-bold">fan_rpm</td>
                    <td className="py-2.5 px-4 text-slate-500">INTEGER</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Kecepatan putaran kipas ekstraksi (RPM)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-800 font-bold">relay_state</td>
                    <td className="py-2.5 px-4 text-slate-500">TEXT</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Status kontak saklar aktuator: 'ON' atau 'OFF'</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-800 font-bold">air_quality</td>
                    <td className="py-2.5 px-4 text-slate-500">TEXT</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Status evaluasi kenyamanan ('Baik', 'Sedang', 'Buruk')</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-slate-800 font-bold">recorded_at</td>
                    <td className="py-2.5 px-4 text-slate-500">DATETIME</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600">Timestamp waktu rekam lokal otomatis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: Code Implementation Examples */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <FileCode className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-[#0f2942]">4. Contoh Implementasi Kode</h2>
            </div>

            {/* Language Selector Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {['curl', 'js', 'python', 'nodejs'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeLang === lang
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'js' ? 'JavaScript' : lang === 'python' ? 'Python' : lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <CodeBlock
            language={activeLang === 'js' ? 'javascript' : activeLang}
            title={`Contoh Penggunaan API (${activeLang.toUpperCase()})`}
            code={codeExamples[activeLang]}
          />
        </section>

        {/* Section 5: PM2 Process Management */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Terminal className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">5. Manajemen Service Backend di VPS (PM2)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-[#0f2942]">Perintah Monitoring Service</h3>
              <p className="text-slate-500 leading-relaxed">
                Backend dikelola oleh <code>pm2</code> dengan nama service <code>air-backend</code>.
              </p>
              <CodeBlock
                language="bash"
                title="Terminal SSH VPS"
                code={`# Melihat status service
pm2 status

# Melihat log streaming data MQTT masuk
pm2 logs air-backend --lines 50

# Restart backend jika ada perubahan
pm2 restart air-backend`}
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-[#0f2942]">Perintah Pengujian Nginx</h3>
              <p className="text-slate-500 leading-relaxed">
                Jika konfigurasi SSL atau reverse proxy diubah di <code>/etc/nginx/sites-available/air-dashboard</code>:
              </p>
              <CodeBlock
                language="bash"
                title="Terminal SSH VPS"
                code={`# Uji sintaks konfigurasi Nginx
sudo nginx -t

# Restart web server Nginx
sudo systemctl restart nginx

# Cek status web server
sudo systemctl status nginx`}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
