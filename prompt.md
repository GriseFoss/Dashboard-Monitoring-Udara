Tolong konfigurasikan dan deploy proyek Dashboard-Monitoring-Udara ini ke mode production di VPS saya lengkap dengan SSL (HTTPS). VPS ini masih kosongan (fresh install Ubuntu/Debian) dan saya belum memiliki nama domain (menggunakan Public IP).

Lakukan langkah-langkah berikut secara berurutan dan mandiri:
1. Perbarui sistem dan instal paket dasar yang dibutuhkan:
   sudo apt-get update -y
   sudo apt-get install -y curl git build-essential python3 make g++ nginx openssl ufw

2. Periksa versi Node.js. Jika belum ada atau di bawah v20, instal Node.js v22 LTS dari NodeSource:
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs

3. Instal PM2 secara global untuk process manager:
   sudo npm install -g pm2

4. Dapatkan IP publik VPS dan buat Self-Signed SSL Certificate:
   PUBLIC_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
   sudo mkdir -p /etc/ssl/private /etc/ssl/certs
   sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout /etc/ssl/private/nginx-selfsigned.key \
     -out /etc/ssl/certs/nginx-selfsigned.crt \
     -subj "/C=ID/ST=Indonesia/L=Jakarta/O=AirSafe/OU=IoT/CN=$PUBLIC_IP"

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
   - Blok HTTP (Port 80): listen 80; return 301 https://$host$request_uri;
   - Blok HTTPS (Port 443): listen 443 ssl http2;
     - Gunakan ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt; dan key /etc/ssl/private/nginx-selfsigned.key;
     - Root diarahkan ke path 'frontend/dist' proyek ini dengan 'try_files $uri $uri/ /index.html;'
     - Reverse proxy 'location /api/' diarahkan ke 'http://127.0.0.1:3000/' lengkap dengan proxy header Host, X-Real-IP, X-Forwarded-Proto https.
   - Hapus /etc/nginx/sites-enabled/default jika ada, lalu tautkan /etc/nginx/sites-available/air-dashboard ke /etc/nginx/sites-enabled/
   - Uji dengan 'sudo nginx -t' dan restart Nginx: 'sudo systemctl restart nginx'

8. Buka port firewall 80, 443, dan 22 jika UFW aktif.

9. Berikan saya ringkasan alamat HTTPS (https://<IP_PUBLIK>/) dan status service yang berjalan.