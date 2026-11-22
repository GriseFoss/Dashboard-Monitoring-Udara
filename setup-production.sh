#!/usr/bin/env bash
# ==============================================================================
# Setup & Deploy Otomatis Production dengan SSL (HTTPS) untuk Dashboard Monitoring Udara
# Kompatibel dengan Ubuntu / Debian (VPS Kosongan - Akses via Public IP)
# ==============================================================================

set -e

echo "🚀 [1/7] Memperbarui sistem dan menginstal paket dasar..."
sudo apt-get update -y
sudo apt-get install -y curl git build-essential python3 make g++ ufw nginx openssl

echo "📦 [2/7] Memeriksa & Menginstal Node.js (v22 LTS)..."
if ! command -v node &> /dev/null; then
  echo "Mengunduh Node.js dari NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js sudah terinstal: $(node -v)"
fi

echo "📦 [3/7] Menginstal PM2 (Process Manager)..."
if ! command -v pm2 &> /dev/null; then
  sudo npm install -g pm2
fi

REPO_DIR=$(pwd)
PUBLIC_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo "🔒 [4/7] Membuat Sertifikat SSL untuk IP Publik ($PUBLIC_IP)..."
sudo mkdir -p /etc/ssl/private /etc/ssl/certs

# Generate Self-Signed Certificate valid selama 365 hari
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/nginx-selfsigned.key \
  -out /etc/ssl/certs/nginx-selfsigned.crt \
  -subj "/C=ID/ST=Indonesia/L=Jakarta/O=Archtera/OU=AirSafeArea/CN=$PUBLIC_IP"

echo "⚙️ [5/7] Mengonfigurasi Backend Node.js..."
cd "$REPO_DIR/backend"
npm install
node seed_data.js

# Jalankan Backend dengan PM2
pm2 delete air-backend 2>/dev/null || true
pm2 start bridge.js --name "air-backend"
pm2 save

# Setup PM2 startup agar otomatis menyala saat VPS reboot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $HOME 2>/dev/null || true

echo "🎨 [6/7] Mengonfigurasi & Melakukan Build Frontend React..."
cd "$REPO_DIR/frontend"
npm install
npm run build

echo "🌐 [7/7] Mengonfigurasi Nginx Web Server dengan SSL (HTTPS)..."
NGINX_CONF="/etc/nginx/sites-available/air-dashboard"

sudo tee "$NGINX_CONF" > /dev/null <<EOF
# Redirect HTTP (Port 80) ke HTTPS (Port 443)
server {
    listen 80;
    server_name _;
    return 301 https://\$host\$request_uri;
}

# HTTPS Server (Port 443)
server {
    listen 443 ssl http2;
    server_name _;

    # Konfigurasi Sertifikat SSL
    ssl_certificate /etc/ssl/certs/nginx-selfsigned.crt;
    ssl_certificate_key /etc/ssl/private/nginx-selfsigned.key;

    # Pengaturan Keamanan SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Frontend React Static Files
    root $REPO_DIR/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Reverse Proxy ke Backend Express via SSL
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_cache_bypass \$http_upgrade;
    }

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Aktifkan konfigurasi Nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/air-dashboard
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Buka Port Firewall jika UFW aktif
if sudo ufw status | grep -q "Status: active"; then
  echo "Membuka port firewall UFW (80, 443, 22)..."
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 22/tcp
fi

echo ""
echo "=========================================================================="
echo "🎉 DEPLOY PRODUCTION DENGAN SSL (HTTPS) BERHASIL SELESAI!"
echo "=========================================================================="
echo "🌐 Halaman Depan Web (HTTPS)    : https://$PUBLIC_IP/"
echo "📊 Dashboard Telemetri (HTTPS)   : https://$PUBLIC_IP/dashboard"
echo "📖 Dokumentasi Backend (HTTPS)   : https://$PUBLIC_IP/docs-backend"
echo "🔌 Dokumentasi IoT (HTTPS)       : https://$PUBLIC_IP/docs-iot"
echo "🖥️ Dokumentasi VPS (HTTPS)       : https://$PUBLIC_IP/docs-vps"
echo "📡 Akses Backend API (HTTPS)     : https://$PUBLIC_IP/api/status"
echo "⚙️ Monitoring PM2                : pm2 status"
echo "📜 Log Backend                  : pm2 logs air-backend"
echo "=========================================================================="
echo "💡 Catatan Akses Pertama Kali di Browser:"
echo "Karena menggunakan SSL Self-Signed (IP tanpa domain), klik tombol 'Lanjutan' / 'Advanced'"
echo "lalu pilih 'Lanjutkan ke $PUBLIC_IP (tidak aman)' pada peramban Anda."
echo "Seluruh koneksi data frontend & backend akan terenkripsi secara aman via SSL."
echo "=========================================================================="
