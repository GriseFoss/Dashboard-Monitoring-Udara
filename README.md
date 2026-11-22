# Archtera — Air Safe Area (Dashboard Monitoring Kualitas Udara & Sirkulasi)

Sistem pemantauan kualitas udara dan sirkulasi ruangan berbasis **IoT (Internet of Things)** dan **Web Modern**, menggunakan **React.js** (Feature-based & Component-based Architecture) di sisi frontend dan **Node.js Express + MQTT** di sisi backend.

---

## 🏗️ Struktur Arsitektur Proyek

```
Dashboard-Monitoring-Udara/
├── backend/                         # Backend Server & API Bridge
│   ├── bridge.js                    # MQTT Subscriber (EMQX) & Express REST API
│   ├── air_data.db                  # Database lokal SQLite untuk riwayat sensor
│   └── package.json                 # Dependensi backend (express, mqtt, better-sqlite3)
│
├── frontend/                        # Aplikasi Frontend Modern (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/              # Shared / Reusable UI Components
│   │   │   ├── Navbar.jsx           # Header Navigasi Minimalis
│   │   │   ├── Footer.jsx           # Footer Proyek
│   │   │   └── StatusBadge.jsx      # Indikator Status Koneksi (LIVE / OFFLINE)
│   │   │
│   │   ├── features/                # Feature-Based Modules
│   │   │   ├── landing/             # 1. Feature: Landing Page
│   │   │   │   ├── components/
│   │   │   │   │   ├── HeroSection.jsx               # Hero & Tombol Buka Dashboard
│   │   │   │   │   ├── AirQualityOverviewSection.jsx # Detail Parameter & Tips Udara
│   │   │   │   │   ├── SensorsSection.jsx            # Spesifikasi Sensor & Aktuator
│   │   │   │   │   └── AboutSection.jsx              # Penjelasan Sistem & Baku Mutu
│   │   │   │   └── LandingPage.jsx                   # Kontainer Halaman Depan
│   │   │   │
│   │   │   └── dashboard/           # 2. Feature: Dashboard Telemetri
│   │   │       ├── roomsConfig.js   # Konfigurasi Ruangan (Lab TD, Lab Kom, H5, Seminar)
│   │   │       ├── components/
│   │   │       │   ├── Sidebar.jsx         # Sidebar Navigasi Sticky & Dropdown Ruangan
│   │   │       │   ├── MetricCard.jsx      # Kartu Parameter Sensor Interaktif
│   │   │       │   ├── SensorChart.jsx     # Grafik Chart.js Riwayat Telemetri
│   │   │       │   ├── TimeRangeSelector.jsx # Filter Waktu (3 Hari, 7 Hari, 1 Bulan) & Unduh
│   │   │       │   ├── OverviewTab.jsx     # Tab 1: Ringkasan Sistem (Suhu, Lembap, Sirkulasi)
│   │   │       │   ├── TempHumidTab.jsx    # Tab 2: Suhu & Kelembaban Udara (DHT22)
│   │   │       │   ├── CirculationTab.jsx  # Tab 3: Sirkulasi Udara & Kipas (Anemometer & Relay)
│   │   │       │   └── HistoryLogsTab.jsx  # Tab 4: Log Riwayat Data & Unduh CSV
│   │   │       ├── hooks/
│   │   │       │   └── useSensorData.js    # Hook Koneksi Backend API & SQLite
│   │   │       └── DashboardPage.jsx       # Kontainer Dashboard Telemetri
│   │   │
│   │   │   ├── admin/               # 3. Feature: Panel Khusus Administrator (Direct URL Only)
│   │   │   │   └── AdminPage.jsx        # Rute /admin: Create, Edit, & Delete Data SQLite
│   │   │   │
│   │   │   └── docs/                # 4. Feature: Dokumentasi Interaktif
│   │   │       ├── components/
│   │   │       │   └── CodeBlock.jsx       # Komponen Monospace Code Block + Tombol Salin
│   │   │       ├── DocsAllHubPage.jsx      # Rute /docs-all: Hub Pengantar Utama Seluruh Dokumentasi
│   │   │       ├── DocsBackendPage.jsx     # Rute /docs-backend: Dokumentasi API & Backend
│   │   │       ├── DocsIotPage.jsx         # Rute /docs-iot: Panduan & Firmware IoT (ESP32)
│   │   │       └── DocsVpsPage.jsx         # Rute /docs-vps: Akses Server & Kredensial VPS
│   │   │
│   │   ├── services/
│   │   │   └── api.js               # Service REST API Backend (Support SSL & Proxy)
│   │   ├── theme/
│   │   │   └── designSystem.js      # Design System Light Mode
│   │   ├── App.jsx                  # Root App & Routing Path
│   │   ├── main.jsx                 # Entrypoint React
│   │   └── index.css                # Styling Tailwind CSS Light Mode
│   └── package.json
│
├── setup-production.sh              # Script otomatisasi deploy VPS kosongan + SSL
├── PRODUCTION_GUIDE.md              # Dokumentasi & prompt deploy AI Agent VPS
└── README.md
```

---

## 🌐 Rute URL Aplikasi (Base IP: 202.155.17.57)

| Rute URL | Tipe Halaman | Deskripsi |
| :--- | :--- | :--- |
| `https://202.155.17.57/` | Landing Page | Halaman depan, overview metrik, dan tips kesehatan udara |
| `https://202.155.17.57/dashboard` | Dashboard | Pemantauan live telemetri 4 ruangan, grafik tren 3d/7d/30d, unduh CSV |
| `https://202.155.17.57/docs-all` | Hub Dokumentasi | **Pengantar pertama pengembang & titik kumpul seluruh dokumen** |
| `https://202.155.17.57/docs-backend` | Dokumentasi API | Spesifikasi REST API, schema SQLite, dan contoh kode cURL, JS, Python |
| `https://202.155.17.57/docs-iot` | Dokumentasi IoT | Skema wiring pinout ESP32, broker MQTT, dan full source code firmware C++ |
| `https://202.155.17.57/docs-vps` | Dokumentasi VPS | Kredensial login SSH, panduan remote terminal, dan pemeliharaan service |
| `https://202.155.17.57/admin` | Panel Admin | **Area khusus manajemen data telemetri (Create, Edit, Delete)** |

---

## 🎯 Aspek Pengukuran Sensor
Sistem berfokus pada 3 aspek pengukuran lingkungan dalam ruangan:
1. **Kelembaban Udara (%)** — diukur dengan sensor digital presisi **DHT22**.
2. **Suhu Udara (°C)** — diukur dengan sensor digital **DHT22**.
3. **Kecepatan Angin / Sirkulasi Udara (m/s)** — diukur dengan sensor **Anemometer** dan diotomasi oleh aktuator **Relay / Exhaust Fan**.

---

## 🏢 Dropdown Ruangan pada Dashboard
Tersedia pemilih ruangan pada sidebar:
1. **Ruang Lab TD**
2. **Ruang Lab Kom**
3. **Ruang H5** (Terhubung langsung ke telemetri live hardware IoT)
4. **Ruang Seminar**

---

## 🚀 Cara Menjalankan

### 1. Menjalankan Backend API
```bash
cd backend
npm start
```

### 2. Menjalankan Frontend React
```bash
cd frontend
npm run dev
```
Buka browser di `http://localhost:5173`.
