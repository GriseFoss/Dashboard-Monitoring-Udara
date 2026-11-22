# Panduan Deploy Production VPS dengan SSL (HTTPS) — Dashboard Monitoring Udara

Dokumentasi ini dibuat khusus agar **AI Agent** atau developer dapat mengonfigurasi dan menjalankan proyek ini secara otomatis dari kondisi VPS yang masih kosong (*fresh install* Ubuntu/Debian), lengkap dengan **enkripsi SSL (HTTPS)** meskipun **belum memiliki domain** (menggunakan Public IP).

---

## 🔒 Arsitektur SSL Tanpa Domain

Karena VPS belum memiliki domain, sistem menggunakan **Self-Signed SSL Certificate** (atau Dynamic DNS sslip.io):
1. **Frontend & Backend satu pintu di Port 443 (HTTPS)**:
   * Frontend: Diakses melalui `https://<IP_VPS>/`
   * Backend API: Diakses secara aman melalui reverse proxy `https://<IP_VPS>/api/`
2. **Bebas Masalah *Mixed-Content***:
   * Karena frontend dan backend sama-sama berada di protokol `https://`, browser tidak akan memblokir request API atau unduhan data CSV.
3. **Redirect Otomatis**:
   * Akses biasa `http://<IP_VPS>` otomatis dialihkan (*301 Redirect*) ke `https://<IP_VPS>`.

---

## ⚡ Cara Cepat Sekali Klik (Automated Script)

Cukup clone repository lalu jalankan script:

```bash
git clone <URL_REPOSITORY_ANDA>
cd Dashboard-Monitoring-Udara
chmod +x setup-production.sh
./setup-production.sh
```

---

## 🤖 Prompt untuk AI Agent di Production VPS

Salin dan berikan prompt di bawah ini kepada AI Agent yang berjalan di VPS Anda:

```markdown
Tolong konfigurasikan dan deploy proyek Dashboard-Monitoring-Udara ini ke mode production di VPS saya lengkap dengan SSL (HTTPS). VPS ini masih kosongan (fresh install Ubuntu/Debian) dan saya belum memiliki nama domain (menggunakan Public IP).

Lakukan langkah-langkah berikut secara berurutan dan mandiri:
1. Perbarui sistem dan instal paket dasar yang dibutuhkan:
   sudo apt-get update -y
   sudo apt-get install -y curl git build-essential python3 make g++ nginx openssl ufw

2. Periksa versi Node.js. Jika belum ada atau di bawah v20, instal Node.js v22 LTS dari NodeSource:
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs

3. Instal PM2 untuk process manager:
   sudo npm install -g pm2

4. Dapatkan IP publik VPS dan buat Self-Signed SSL Certificate:
   PUBLIC_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
   sudo mkdir -p /etc/ssl/private /etc/ssl/certs
   sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout /etc/ssl/private/nginx-selfsigned.key \
     -out /etc/ssl/certs/nginx-selfsigned.crt \
     -subj "/C=ID/ST=Indonesia/L=Jakarta/O=Archtera/OU=AirSafeArea/CN=$PUBLIC_IP"

5. Konfigurasi Backend:
   - Masuk ke folder 'backend': cd backend
   - Jalankan 'npm install'
   - Jalankan 'node seed_data.js' untuk menginisialisasi database SQLite dan data riwayat
   - Daftarkan dan jalankan backend dengan PM2: pm2 start bridge.js --name "air-backend"
   - Simpan status PM2 dan aktifkan startup otomatis saat VPS reboot:
     pm2 save && sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $HOME

6. Konfigurasi Frontend:
   - Masuk ke folder 'frontend': cd ../frontend
   - Jalankan 'npm install'
   - Jalankan 'npm run build' untuk menghasilkan file produksi di folder 'dist'

7. Konfigurasi Nginx dengan SSL (Port 80 -> 443 Redirect & Reverse Proxy /api/):
   - Buat file konfigurasi /etc/nginx/sites-available/air-dashboard
   - Blok 1: listen 80; return 301 https://$host$request_uri;
   - Blok 2: listen 443 ssl http2;
     - Gunakan ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt; dan key /etc/ssl/private/nginx-selfsigned.key;
     - Root diarahkan ke path 'frontend/dist' proyek ini dengan 'try_files $uri $uri/ /index.html;'
     - Reverse proxy 'location /api/' diarahkan ke 'http://127.0.0.1:3000/' lengkap dengan proxy header Host, X-Real-IP, X-Forwarded-Proto https.
   - Hapus /etc/nginx/sites-enabled/default jika ada, lalu tautkan /etc/nginx/sites-available/air-dashboard ke /etc/nginx/sites-enabled/
   - Uji dengan 'sudo nginx -t' dan restart Nginx: 'sudo systemctl restart nginx'

8. Buka port firewall 80, 443, dan 22 jika UFW aktif.

9. Berikan saya ringkasan alamat HTTPS dan rute aplikasi yang berjalan:
   - Web Landing Page: https://202.155.17.57/
   - Dashboard Telemetri: https://202.155.17.57/dashboard
   - Hub Dokumentasi Utama: https://202.155.17.57/docs-all
   - Dokumentasi Backend: https://202.155.17.57/docs-backend
   - Dokumentasi IoT: https://202.155.17.57/docs-iot
   - Dokumentasi Server VPS: https://202.155.17.57/docs-vps
   - Panel Admin (CRUD Data): https://202.155.17.57/admin
   - Backend API Status: https://202.155.17.57/api/status
```

---

## 🔑 Kredensial Server VPS

* **Host / Public IP**: `202.155.17.57`
* **SSH Username**: `root`
* **SSH Password**: `iot123bridge321`
* **Port**: `22`
* **Remote Command**: `ssh root@202.155.17.57`

---

## 📌 Daftar Rute Aplikasi (Base IP: 202.155.17.57)

| Rute URL | Protokol | Keterangan |
| :--- | :--- | :--- |
| `https://202.155.17.57/` | HTTPS (SSL) | Halaman Depan Archtera — Air Safe Area |
| `https://202.155.17.57/dashboard` | HTTPS (SSL) | Dashboard Monitoring Sensor & Grafik 4 Ruangan |
| `https://202.155.17.57/docs-all` | HTTPS (SSL) | **Hub Utama Pengantar & Ringkasan Seluruh Dokumentasi** |
| `https://202.155.17.57/docs-backend` | HTTPS (SSL) | **Dokumentasi Lengkap Backend & RESTful API** |
| `https://202.155.17.57/docs-iot` | HTTPS (SSL) | **Dokumentasi & Firmware IoT (ESP32/Arduino)** |
| `https://202.155.17.57/docs-vps` | HTTPS (SSL) | **Dokumentasi & Kredensial Akses Server VPS** |
| `https://202.155.17.57/admin` | HTTPS (SSL) | **Panel Admin CRUD Data Udara (Direct Route Only)** |
| `https://202.155.17.57/api/*` | HTTPS (SSL) | Reverse Proxy Nginx ke Express Server |

---

## 💡 Akses Pertama Kali di Browser
Saat pertama kali membuka `https://202.155.17.57/`, peramban (Chrome/Edge/Firefox) akan menampilkan pemberitahuan keamanan standar karena menggunakan sertifikat *Self-Signed* (tanpa domain). Cukup:
1. Klik tombol **"Lanjutan"** (*Advanced*).
2. Klik link **"Lanjutkan ke 202.155.17.57 (tidak aman)"**.
3. Website dan API akan langsung berjalan dengan enkripsi SSL HTTPS penuh.

---

## ☁️ Panduan Menghubungkan VPS ke Domain Custom via Cloudflare

Jika Anda telah memiliki nama domain kustom (contoh: `archtera.com`), ikuti langkah-langkah berikut untuk menghubungkannya ke VPS `202.155.17.57` menggunakan Cloudflare:

### 1. Ubah Nameserver Domain ke Cloudflare
1. Buka akun Cloudflare di [dash.cloudflare.com](https://dash.cloudflare.com) &gt; **Add a Site** &gt; Masukkan domain Anda (pilih Free Plan).
2. Ubah nameserver default di registrar domain Anda (Niagahoster, Domainesia, Namecheap, GoDaddy, dll.) ke 2 nameserver resmi dari Cloudflare (contoh: `dina.ns.cloudflare.com` & `noah.ns.cloudflare.com`).

### 2. Atur DNS Records Menuju IP VPS
Pada dashboard Cloudflare &gt; **DNS &gt; Records**, tambahkan dua record:
* **Record A (Root)**:
  * Type: `A`
  * Name: `@`
  * IPv4 address: `202.155.17.57`
  * Proxy status: **Proxied (🟠 Awan Orange)**
* **Record CNAME (WWW)**:
  * Type: `CNAME`
  * Name: `www`
  * Target: `@`
  * Proxy status: **Proxied (🟠 Awan Orange)**

### 3. Pengaturan SSL/TLS Cloudflare (PENTING)
1. Buka menu **SSL/TLS &gt; Overview** di Cloudflare:
   * **Wajib pilih mode: "Full"**.
   * *Perhatian*: Jangan pilih *Flexible*, karena akan menyebabkan loop pengalihan `ERR_TOO_MANY_REDIRECTS`. Mode *Full* bekerja sempurna dan aman dengan sertifikat SSL Self-Signed yang ada di VPS.
2. Buka tab **SSL/TLS &gt; Edge Certificates**:
   * Aktifkan **Always Use HTTPS** (`ON`).
   * Aktifkan **Automatic HTTPS Rewrites** (`ON`).

### 4. Sesuaikan Konfigurasi Nginx di VPS
Login ke VPS via SSH (`ssh root@202.155.17.57`), buka file konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/air-dashboard
```
Ubah `server_name _;` menjadi nama domain Anda:
```nginx
server {
    listen 80;
    server_name namadomain.com www.namadomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name namadomain.com www.namadomain.com;

    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;
    ...
}
```
Uji dan restart Nginx:
```bash
sudo nginx -t
sudo systemctl restart nginx
```
Domain Anda kini dapat diakses penuh melalui HTTPS publik tanpa peringatan sertifikat browser!
