import React, { useState } from 'react';
import {
  Server,
  Terminal,
  Shield,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  HardDrive,
  Cpu,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Radio,
  FileCode,
  BookOpen,
  Cloud,
  Workflow,
} from 'lucide-react';
import CodeBlock from './components/CodeBlock';

export default function DocsVpsPage({ onNavigate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const vpsInfo = {
    ip: '202.155.17.57',
    username: 'root',
    password: 'iot123bridge321',
    port: '22',
    os: 'Ubuntu 22.04 / 24.04 LTS (atau Debian 12)',
    sshCommand: 'ssh root@202.155.17.57',
  };

  const handleCopy = (field, text) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Akses Server
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight flex items-center gap-3">
                <Server className="h-7 w-7 text-amber-600" />
                <span>Dokumentasi & Kredensial Server VPS</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Informasi login SSH, konfigurasi arsitektur produksi, otomatisasi deploy di VPS <strong>{vpsInfo.ip}</strong>, dan pemeliharaan service sistem.
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
                onClick={() => onNavigate('docs-backend')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-all cursor-pointer shadow-2xs"
              >
                <Server className="h-4 w-4 text-emerald-600" />
                <span>Docs API Backend</span>
              </button>

              <button
                onClick={() => onNavigate('docs-iot')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-cyan-700 transition-all cursor-pointer shadow-2xs"
              >
                <Cpu className="h-4 w-4 text-cyan-600" />
                <span>Docs IoT</span>
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
        {/* Section 1: Kredensial Akses SSH VPS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Key className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">1. Kredensial Otentikasi SSH VPS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* IP Address Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs relative">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Host / Public IP</span>
                <Globe className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-lg font-extrabold text-[#0f2942] font-mono mt-1">
                {vpsInfo.ip}
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Port: {vpsInfo.port} (SSH)</span>
                <button
                  onClick={() => handleCopy('ip', vpsInfo.ip)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {copiedField === 'ip' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedField === 'ip' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Username Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs relative">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Username SSH</span>
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-extrabold text-[#0f2942] font-mono mt-1">
                {vpsInfo.username}
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Superuser (Root)</span>
                <button
                  onClick={() => handleCopy('user', vpsInfo.username)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {copiedField === 'user' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedField === 'user' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Password Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs relative">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Password SSH</span>
                <Lock className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-lg font-extrabold text-[#0f2942] font-mono mt-1 flex items-center gap-2">
                <span>{showPassword ? vpsInfo.password : '••••••••••••••••'}</span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Password Otentikasi</span>
                <button
                  onClick={() => handleCopy('pass', vpsInfo.password)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {copiedField === 'pass' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedField === 'pass' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            {/* Quick Command Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs relative">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Perintah Remote</span>
                <Terminal className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-[#0f2942] font-mono mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 truncate">
                {vpsInfo.sshCommand}
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500">Terminal Shell</span>
                <button
                  onClick={() => handleCopy('ssh', vpsInfo.sshCommand)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  {copiedField === 'ssh' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedField === 'ssh' ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Panduan Login SSH di Berbagai Sistem Operasi */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Terminal className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">2. Cara Terhubung ke VPS via SSH</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* PowerShell / CMD Windows */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#0f2942] flex items-center gap-2">
                <span>Pengguna Windows (PowerShell / Windows Terminal / CMD)</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Buka <strong>PowerShell</strong> atau <strong>Command Prompt</strong>, lalu jalankan perintah:
              </p>
              <CodeBlock
                language="bash"
                title="Windows PowerShell"
                code={`ssh root@202.155.17.57`}
              />
              <p className="text-slate-500 text-[11px] leading-relaxed">
                1. Jika muncul <em>"Are you sure you want to continue connecting (yes/no/[fingerprint])?"</em>, ketik <strong>yes</strong> lalu tekan Enter.<br />
                2. Masukkan password: <strong>{vpsInfo.password}</strong> (huruf password tidak akan terlihat di layar saat diketik, ini adalah standar keamanan Linux).
              </p>
            </div>

            {/* Linux / macOS Terminal */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#0f2942] flex items-center gap-2">
                <span>Pengguna Linux / macOS Terminal</span>
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Buka aplikasi <strong>Terminal</strong> bawaan, lalu hubungkan secara langsung:
              </p>
              <CodeBlock
                language="bash"
                title="macOS / Linux Terminal"
                code={`ssh root@202.155.17.57`}
              />
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Alternatif menggunakan client GUI seperti <strong>PuTTY</strong>, <strong>Bitvise SSH</strong>, atau <strong>Termius</strong>:<br />
                • HostName: <code>{vpsInfo.ip}</code><br />
                • Port: <code>22</code><br />
                • User: <code>root</code> | Password: <code>{vpsInfo.password}</code>
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Cara Setup Otomatis di VPS Kosongan */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">3. Langkah Setup Otomatis di VPS Kosongan</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Setelah login via SSH ke VPS kosongan, Anda hanya perlu menjalankan 4 baris perintah berikut. Seluruh instalasi (Node.js v22, PM2, Backend Express, SQLite, build React, Sertifikat SSL, dan Nginx Reverse Proxy) akan diselesaikan otomatis:
            </p>

            <CodeBlock
              language="bash"
              title="Eksekusi di Terminal VPS (Root)"
              code={`# 1. Clone repository project
git clone https://github.com/ImamAriadi2022/Dashboard-Monitoring-Udara.git

# 2. Masuk ke direktori project
cd Dashboard-Monitoring-Udara

# 3. Beri izin eksekusi script deploy
chmod +x setup-production.sh

# 4. Jalankan deploy otomatis production
./setup-production.sh`}
            />

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-900 leading-relaxed">
              <strong>Hasil Akhir Otomatisasi:</strong>
              <ul className="list-disc list-inside mt-1.5 space-y-1 text-emerald-800">
                <li>Frontend React di-build ke folder <code>frontend/dist</code>.</li>
                <li>Backend Express aktif di background via PM2 dengan nama <code>air-backend</code>.</li>
                <li>Sertifikat Self-Signed SSL dibuat otomatis untuk IP <code>{vpsInfo.ip}</code>.</li>
                <li>Nginx aktif di port 443 (HTTPS) dengan reverse proxy <code>/api/</code> ke backend.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Prompt AI Agent untuk Production */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <FileCode className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">4. Prompt untuk AI Agent di Production VPS</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Jika VPS Anda memiliki AI Agent atau asisten CLI (seperti Antigravity, Claude Code, Aider, dll.), Anda cukup menyalin prompt di bawah ini:
            </p>

            <CodeBlock
              language="markdown"
              title="Prompt Siap Pakai untuk AI Agent VPS"
              code={`Tolong deploy dan konfigurasikan project Dashboard-Monitoring-Udara ini secara menyeluruh di VPS saya (IP: 202.155.17.57). VPS ini masih kosongan (fresh install Ubuntu) dan saya belum memiliki domain (akses via Public IP dengan SSL HTTPS).

Jalankan langkah-langkah berikut secara berurutan:
1. Update apt dan install paket dasar: curl, git, build-essential, nginx, openssl, ufw.
2. Install Node.js v22 LTS dari NodeSource dan install PM2 global (npm install -g pm2).
3. Buat Self-Signed SSL Certificate untuk IP 202.155.17.57 di /etc/ssl/certs/nginx-selfsigned.crt dan /etc/ssl/private/nginx-selfsigned.key.
4. Setup Backend: masuk ke folder 'backend', jalankan 'npm install', inisialisasi database dengan 'node seed_data.js', lalu jalankan service dengan 'pm2 start bridge.js --name "air-backend"' dan 'pm2 save'.
5. Setup Frontend: masuk ke folder 'frontend', jalankan 'npm install' dan 'npm run build'.
6. Konfigurasikan Nginx di /etc/nginx/sites-available/air-dashboard:
   - Port 80 redirect otomatis (301) ke HTTPS port 443.
   - Port 443 SSL menggunakan sertifikat yang dibuat.
   - Root direktori mengarah ke 'frontend/dist' dengan 'try_files $uri $uri/ /index.html;'.
   - Reverse proxy location '/api/' mengarah ke 'http://127.0.0.1:3000/'.
7. Aktifkan konfigurasi Nginx, reload web server, dan pastikan firewall membuka port 80, 443, dan 22.
8. Berikan ringkasan URL akses HTTPS dan status service PM2.`}
            />
          </div>
        </section>

        {/* Section 5: Perintah Pemeliharaan Harian */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <HardDrive className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">5. Perintah Pemeliharaan Rutin Server</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* PM2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
              <span className="font-bold text-[#0f2942] block">Manajemen Backend (PM2)</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Mengelola proses background Node.js Express.
              </p>
              <CodeBlock
                language="bash"
                title="Perintah PM2"
                code={`# Cek status service
pm2 status

# Cek log data masuk
pm2 logs air-backend

# Restart service
pm2 restart air-backend`}
              />
            </div>

            {/* Nginx */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
              <span className="font-bold text-[#0f2942] block">Manajemen Web Server (Nginx)</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Mengontrol web server frontend dan reverse proxy SSL.
              </p>
              <CodeBlock
                language="bash"
                title="Perintah Nginx"
                code={`# Tes sintaks konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Status Nginx
sudo systemctl status nginx`}
              />
            </div>

            {/* SQLite & Firewall */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-2.5">
              <span className="font-bold text-[#0f2942] block">Database SQLite & Firewall</span>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Pemeriksaan data sensor dan status port keamanan.
              </p>
              <CodeBlock
                language="bash"
                title="Pemeriksaan Data"
                code={`# Cek status firewall
sudo ufw status

# Cek jumlah data SQLite
cd backend
node -e "const db=require('better-sqlite3')('air_data.db'); console.log(db.prepare('SELECT count(*) FROM readings').get());"`}
              />
            </div>
          </div>
        </section>

        {/* Section 6: Rekomendasi Keamanan Server */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Shield className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">6. Rekomendasi Keamanan Produksi</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3 text-xs leading-relaxed text-slate-600">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block text-sm">Ganti Password Default Setelah Setup Awal:</strong>
                <p className="text-slate-500 mt-0.5">
                  Untuk keamanan jangka panjang, Anda disarankan mengganti password root dengan menjalankan perintah <code>passwd</code> pada terminal VPS.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block text-sm">Gunakan SSH Key Authentication:</strong>
                <p className="text-slate-500 mt-0.5">
                  Gunakan perintah <code>ssh-copy-id root@{vpsInfo.ip}</code> dari komputer lokal Anda untuk login instan tanpa perlu mengetikkan password berulang kali.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Panduan Menghubungkan VPS ke Domain Sendiri via Cloudflare */}
        <section className="space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Cloud className="h-5 w-5 text-orange-500" />
            <div>
              <h2 className="text-lg font-bold text-[#0f2942]">7. Panduan Menghubungkan VPS ke Domain via Cloudflare</h2>
              <p className="text-xs text-slate-500">
                Langkah-langkah menghubungkan nama domain kustom (misal: <code>namadomain.com</code>) ke IP VPS <strong>{vpsInfo.ip}</strong> menggunakan Cloudflare DNS & SSL.
              </p>
            </div>
          </div>

          {/* Overview Benefits Banner */}
          <div className="rounded-2xl border border-orange-200/80 bg-orange-50/50 p-5 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-orange-950 text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-orange-600" />
              <span>Mengapa Menggunakan Cloudflare untuk Domain Archtera?</span>
            </div>
            <p className="leading-relaxed text-slate-600">
              Dengan mengarahkan domain Anda melalui Cloudflare (Proxied), website Anda mendapatkan perlindungan dari serangan DDoS, caching global CDN super cepat, dan <strong>sertifikat SSL publik yang tepercaya secara otomatis</strong> tanpa perlu memperpanjang sertifikat secara manual setiap beberapa bulan.
            </p>
          </div>

          {/* Step by Step Cloudflare Integration */}
          <div className="space-y-6 text-xs">
            {/* Step 1: Nameserver */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold font-mono text-[11px]">
                  1
                </span>
                <h3 className="font-bold text-sm text-[#0f2942]">
                  Pindahkan Nameserver Domain ke Cloudflare
                </h3>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 leading-relaxed pl-1">
                <li>Buka akun Anda di <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-orange-600 font-semibold underline">dash.cloudflare.com</a> dan klik <strong>+ Add a Site</strong>.</li>
                <li>Ketik nama domain Anda (misal: <code>archtera.com</code>), lalu pilih paket <strong>Free Plan</strong>.</li>
                <li>Cloudflare akan memberikan 2 buah Nameserver resmi (contoh: <code>dina.ns.cloudflare.com</code> dan <code>noah.ns.cloudflare.com</code>).</li>
                <li>Buka panel registrar tempat Anda membeli domain (Niagahoster, Domainesia, Namecheap, GoDaddy, dll.), masuk ke menu <strong>Nameserver Management</strong>, lalu ubah nameserver default ke nameserver Cloudflare tersebut.</li>
                <li>Tunggu proses propagasi nameserver (umumnya 5 menit hingga 1 jam).</li>
              </ol>
            </div>

            {/* Step 2: DNS Records Table */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold font-mono text-[11px]">
                  2
                </span>
                <h3 className="font-bold text-sm text-[#0f2942]">
                  Tambahkan DNS Record ke IP VPS ({vpsInfo.ip})
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Di dashboard Cloudflare, buka menu <strong>DNS &gt; Records</strong>, lalu buat record berikut:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Name</th>
                      <th className="py-2.5 px-3">IPv4 Address / Content</th>
                      <th className="py-2.5 px-3">Proxy Status</th>
                      <th className="py-2.5 px-3">TTL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-orange-700">A</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">@ (root domain)</td>
                      <td className="py-2.5 px-3 text-emerald-700 font-bold">{vpsInfo.ip}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-sans font-bold text-[10px]">
                          🟠 Proxied (Aktif)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">Auto</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-blue-700">CNAME</td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">www</td>
                      <td className="py-2.5 px-3 text-slate-800 font-bold">@ (atau namadomain.com)</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 font-sans font-bold text-[10px]">
                          🟠 Proxied (Aktif)
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">Auto</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 3: SSL/TLS Mode Settings */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold font-mono text-[11px]">
                  3
                </span>
                <h3 className="font-bold text-sm text-[#0f2942]">
                  Pilih Mode Enkripsi SSL/TLS di Cloudflare (PENTING)
                </h3>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-1.5 text-amber-900">
                <strong className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>Wajib Pilih Mode "Full" (Bukan Flexible!)</span>
                </strong>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  Jangan memilih mode <em>Flexible</em>. Karena Nginx di VPS Anda secara otomatis mengalihkan port 80 ke port 443 (HTTPS), mode <em>Flexible</em> akan menyebabkan loop tanpa henti yang memicu error <strong>ERR_TOO_MANY_REDIRECTS</strong>.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed pl-1">
                <li>Buka menu <strong>SSL/TLS &gt; Overview</strong> di panel Cloudflare.</li>
                <li>
                  Pilih opsi <strong>Full</strong> (enkripsi ujung-ke-ujung antara pengunjung &rarr; Cloudflare &rarr; VPS Anda). Mode <strong>Full</strong> kompatibel penuh dengan sertifikat SSL Self-Signed yang sudah dibuat oleh script otomatis di VPS Anda.
                </li>
                <li>
                  Masuk ke tab <strong>SSL/TLS &gt; Edge Certificates</strong>:
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-500 text-[11px]">
                    <li>Aktifkan <strong>Always Use HTTPS</strong> (Status: ON).</li>
                    <li>Aktifkan <strong>Automatic HTTPS Rewrites</strong> (Status: ON).</li>
                    <li>Minimum TLS Version: Pilih <strong>TLS 1.2</strong> atau <strong>TLS 1.3</strong>.</li>
                  </ul>
                </li>
              </ol>
            </div>

            {/* Step 4: Update Nginx server_name */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold font-mono text-[11px]">
                  4
                </span>
                <h3 className="font-bold text-sm text-[#0f2942]">
                  Perbarui Konfigurasi Nginx di VPS untuk Nama Domain
                </h3>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Login via SSH ke VPS (<code>ssh root@{vpsInfo.ip}</code>), lalu buka file konfigurasi Nginx:
              </p>

              <CodeBlock
                language="bash"
                title="Buka File Konfigurasi Nginx di VPS"
                code={`sudo nano /etc/nginx/sites-available/air-dashboard`}
              />

              <p className="text-slate-600 leading-relaxed">
                Ubah baris <code>server_name _;</code> menjadi nama domain Anda (ganti <code>namadomain.com</code> dengan domain asli Anda):
              </p>

              <CodeBlock
                language="nginx"
                title="Sesuaikan server_name pada /etc/nginx/sites-available/air-dashboard"
                code={`# 1. Blok Redirect HTTP ke HTTPS
server {
    listen 80;
    server_name namadomain.com www.namadomain.com;
    return 301 https://$host$request_uri;
}

# 2. Blok HTTPS Utama (SSL)
server {
    listen 443 ssl http2;
    server_name namadomain.com www.namadomain.com;

    # Tetap gunakan sertifikat yang sudah dibuat di VPS
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # Lokasi build frontend React
    root /root/Dashboard-Monitoring-Udara/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy aman ke backend Express API
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass $http_upgrade;
    }
}`}
              />

              <p className="text-slate-600 leading-relaxed">
                Simpan file dengan menekan <code>Ctrl+O</code> &rarr; <code>Enter</code>, lalu keluar dengan <code>Ctrl+X</code>. Selanjutnya uji sintaks dan restart Nginx:
              </p>

              <CodeBlock
                language="bash"
                title="Restart Nginx"
                code={`# Uji kebenaran sintaks
sudo nginx -t

# Restart web server Nginx
sudo systemctl restart nginx`}
              />
            </div>

            {/* Step 5: Troubleshooting Cloudflare */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold font-mono text-[11px]">
                  5
                </span>
                <h3 className="font-bold text-sm text-[#0f2942]">
                  Troubleshooting Masalah Error Cloudflare Umum
                </h3>
              </div>

              <div className="space-y-3 text-slate-600 leading-relaxed">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block text-xs">Error 521 (Web Server is Down):</strong>
                  <span className="text-[11px] text-slate-500">
                    Artinya Cloudflare tidak bisa menghubungi port 80/443 di VPS Anda. Solusi: Pastikan Nginx sedang aktif (<code>sudo systemctl status nginx</code>) dan firewall UFW mengizinkan port 80 & 443 (<code>sudo ufw allow 80/tcp && sudo ufw allow 443/tcp</code>).
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block text-xs">Error 526 (Invalid SSL Certificate):</strong>
                  <span className="text-[11px] text-slate-500">
                    Terjadi jika Anda memilih mode SSL <em>Full (Strict)</em> di Cloudflare padahal VPS masih menggunakan sertifikat Self-Signed. Solusi: Ubah mode SSL di dashboard Cloudflare ke mode <strong>Full</strong>.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800 block text-xs">ERR_TOO_MANY_REDIRECTS:</strong>
                  <span className="text-[11px] text-slate-500">
                    Terjadi jika mode SSL di Cloudflare disetel ke <em>Flexible</em>. Cloudflare menghubungi VPS lewat port 80, sementara Nginx selalu mengalihkan port 80 ke 443. Solusi: Ubah mode SSL di dashboard Cloudflare ke <strong>Full</strong>.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
