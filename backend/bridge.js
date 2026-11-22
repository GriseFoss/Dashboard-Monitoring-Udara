const express  = require('express');
const mqtt     = require('mqtt');
const Database = require('better-sqlite3');
const path     = require('path');

// ---------- Database ----------
const dbPath = path.join(__dirname, 'air_data.db');
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL,
    humidity REAL,
    wind_speed REAL,
    co2 INTEGER,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Migrasi: tambahkan kolom baru jika tabel lama sudah ada
const newColumns = {
  tvoc: 'INTEGER',
  fan_rpm: 'REAL',
  relay_state: 'TEXT',
  air_quality: 'TEXT',
  temp_status: 'TEXT',
  hum_status: 'TEXT',
  co2_status: 'TEXT',
  uptime: 'INTEGER',
  room: "TEXT DEFAULT 'h5'",
};

const existing = db.prepare('PRAGMA table_info(readings)').all().map(c => c.name);
for (const [name, type] of Object.entries(newColumns)) {
  if (!existing.includes(name)) {
    db.prepare(`ALTER TABLE readings ADD COLUMN ${name} ${type}`).run();
  }
}

// Pastikan data lama memiliki nilai room default 'h5'
db.prepare("UPDATE readings SET room = 'h5' WHERE room IS NULL OR room = ''").run();

const insert = db.prepare(`
  INSERT INTO readings
    (temperature, humidity, wind_speed, co2, tvoc, fan_rpm, relay_state,
     air_quality, temp_status, hum_status, co2_status, uptime, room)
  VALUES
    (@temperature, @humidity, @wind_speed, @co2, @tvoc, @fan_rpm, @relay_state,
     @air_quality, @temp_status, @hum_status, @co2_status, @uptime, @room)
`);

// ---------- MQTT Configuration (Public Broker EMQX) ----------
const MQTT_URL   = process.env.MQTT_URL || 'mqtt://broker.emqx.io';
const MQTT_TOPIC = process.env.MQTT_TOPIC || 'monitoring_udara_ta/data';

console.log(`Menghubungkan ke MQTT Broker: ${MQTT_URL}`);
console.log(`Topik MQTT: ${MQTT_TOPIC}`);

const client = mqtt.connect(MQTT_URL, {
  reconnectPeriod: 3000,
  connectTimeout: 10000,
});

client.on('connect', () => {
  console.log(`[MQTT] Terhubung ke ${MQTT_URL}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error(`[MQTT] Gagal subscribe ke topik ${MQTT_TOPIC}:`, err.message);
    } else {
      console.log(`[MQTT] Berhasil subscribe ke topik: ${MQTT_TOPIC}`);
    }
  });
});

client.on('error', (err) => {
  console.error('[MQTT Error]:', err.message);
});

client.on('reconnect', () => {
  console.log('[MQTT] Mencoba menyambung kembali ke broker...');
});

client.on('message', (_, payload) => {
  try {
    // Sanitasi data jika Arduino/ESP mengirim "nan"
    const raw = payload.toString().replace(/:\s*-?nan/gi, ':null');
    const d = JSON.parse(raw);
    const detail = d.air_quality_detail || {};
    const room = (d.room || 'h5').toLowerCase();

    const info = insert.run({
      temperature: d.temperature ?? null,
      humidity:    d.humidity ?? null,
      co2:         d.co2 ?? null,
      wind_speed:  d.wind_speed ?? null,
      tvoc:        d.tvoc ?? null,
      fan_rpm:     d.fan_rpm ?? null,
      relay_state: d.relay_state ?? null,
      air_quality: d.air_quality ?? null,
      temp_status: detail.temperature ?? null,
      hum_status:  detail.humidity ?? null,
      co2_status:  detail.co2 ?? null,
      uptime:      d.uptime ?? null,
      room,
    });
    console.log(`[MQTT Data Diterima [${room}] ID ${info.lastInsertRowid}]: Temp: ${d.temperature}°C, Hum: ${d.humidity}%, CO2: ${d.co2}ppm`);
  } catch (e) {
    console.error('Parse/insert error:', e.message);
  }
});

// ---------- REST API ----------
const app = express();

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Status & Health Check
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    mqtt: {
      broker: MQTT_URL,
      topic: MQTT_TOPIC,
      connected: client.connected,
    },
    timestamp: new Date().toISOString()
  });
});

// Ambil riwayat pembacaan berdasarkan ruangan & rentang waktu (3d, 7d, 30d)
app.get('/readings', (req, res) => {
  const room = (req.query.room || 'h5').toLowerCase();
  const range = (req.query.range || '').toLowerCase();
  const limit = Math.min(parseInt(req.query.limit) || 1000, 2000);

  let query = 'SELECT * FROM readings WHERE 1=1';
  const params = [];

  if (room !== 'all') {
    query += ' AND room = ?';
    params.push(room);
  }

  if (range === '3d') {
    query += " AND recorded_at >= datetime('now', '-3 days')";
  } else if (range === '7d') {
    query += " AND recorded_at >= datetime('now', '-7 days')";
  } else if (range === '30d' || range === '1m' || range === '1month') {
    query += " AND recorded_at >= datetime('now', '-30 days')";
  }

  // Jika range waktu diminta, kembalikan urutan kronologis ASC untuk plotting chart
  if (range) {
    query += ' ORDER BY recorded_at ASC LIMIT ?';
    params.push(limit);
    const rows = db.prepare(query).all(...params);
    res.json(rows);
  } else {
    query += ' ORDER BY id DESC LIMIT ?';
    params.push(limit);
    const rows = db.prepare(query).all(...params);
    res.json(rows.reverse());
  }
});

// Ambil pembacaan paling akhir per ruangan
app.get('/latest', (req, res) => {
  const room = (req.query.room || 'h5').toLowerCase();
  let query = 'SELECT * FROM readings';
  const params = [];

  if (room !== 'all') {
    query += ' WHERE room = ?';
    params.push(room);
  }

  query += ' ORDER BY id DESC LIMIT 1';
  const row = db.prepare(query).get(...params);
  res.json(row || {});
});

// ---------- CRUD ENDPOINTS UNTUK HALAMAN /admin ----------

// 1. Tambah Data Baru (CREATE)
app.post('/readings', (req, res) => {
  try {
    const d = req.body || {};
    const room = (d.room || 'lab_td').toLowerCase();
    const temp = d.temperature != null ? parseFloat(d.temperature) : null;
    const hum = d.humidity != null ? parseFloat(d.humidity) : null;
    const co2 = d.co2 != null ? parseInt(d.co2) : null;
    const wind = d.wind_speed != null ? parseFloat(d.wind_speed) : null;
    const fan = d.fan_rpm != null ? parseInt(d.fan_rpm) : 0;
    const relay = d.relay_state ? String(d.relay_state).toUpperCase() : (temp > 29 ? 'ON' : 'OFF');
    const airQuality = d.air_quality || (temp && temp > 32 ? 'Buruk' : temp > 29 ? 'Sedang' : 'Baik');

    const stmt = db.prepare(`
      INSERT INTO readings (room, temperature, humidity, co2, wind_speed, fan_rpm, relay_state, air_quality, temp_status, hum_status, co2_status, uptime)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      room,
      temp,
      hum,
      co2,
      wind,
      fan,
      relay,
      airQuality,
      temp && temp > 30 ? 'Sedang' : 'Baik',
      hum && hum > 70 ? 'Sedang' : 'Baik',
      co2 && co2 > 700 ? 'Sedang' : 'Baik',
      d.uptime != null ? parseInt(d.uptime) : 3600
    );

    res.status(201).json({
      success: true,
      id: info.lastInsertRowid,
      message: 'Data sensor berhasil ditambahkan'
    });
  } catch (err) {
    console.error('Error POST /readings:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Edit Data Eksisting (UPDATE)
app.put('/readings/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID tidak valid' });

    const d = req.body || {};
    const room = (d.room || 'lab_td').toLowerCase();
    const temp = d.temperature != null ? parseFloat(d.temperature) : null;
    const hum = d.humidity != null ? parseFloat(d.humidity) : null;
    const co2 = d.co2 != null ? parseInt(d.co2) : null;
    const wind = d.wind_speed != null ? parseFloat(d.wind_speed) : null;
    const fan = d.fan_rpm != null ? parseInt(d.fan_rpm) : 0;
    const relay = d.relay_state ? String(d.relay_state).toUpperCase() : 'OFF';
    const airQuality = d.air_quality || (temp && temp > 32 ? 'Buruk' : temp > 29 ? 'Sedang' : 'Baik');

    const stmt = db.prepare(`
      UPDATE readings
      SET room = ?, temperature = ?, humidity = ?, wind_speed = ?, fan_rpm = ?, relay_state = ?, air_quality = ?
      WHERE id = ?
    `);

    const result = stmt.run(room, temp, hum, wind, fan, relay, airQuality, id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Data dengan ID tersebut tidak ditemukan' });
    }

    res.json({
      success: true,
      message: `Data ID #${id} berhasil diperbarui`
    });
  } catch (err) {
    console.error('Error PUT /readings/:id:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Hapus Data (DELETE)
app.delete('/readings/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ success: false, error: 'ID tidak valid' });

    const stmt = db.prepare('DELETE FROM readings WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Data tidak ditemukan' });
    }

    res.json({
      success: true,
      message: `Data ID #${id} berhasil dihapus`
    });
  } catch (err) {
    console.error('Error DELETE /readings/:id:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint unduh CSV langsung dari database SQLite per ruangan dan rentang waktu
app.get('/download', (req, res) => {
  const room = (req.query.room || 'lab_td').toLowerCase();
  const range = (req.query.range || 'all').toLowerCase();

  let query = 'SELECT * FROM readings WHERE 1=1';
  const params = [];

  if (room !== 'all') {
    query += ' AND room = ?';
    params.push(room);
  }

  if (range === '3d') {
    query += " AND recorded_at >= datetime('now', '-3 days')";
  } else if (range === '7d') {
    query += " AND recorded_at >= datetime('now', '-7 days')";
  } else if (range === '30d' || range === '1m') {
    query += " AND recorded_at >= datetime('now', '-30 days')";
  }

  query += ' ORDER BY recorded_at ASC';
  const rows = db.prepare(query).all(...params);

  const headers = ['ID', 'Ruangan', 'Waktu_Rekam', 'Suhu_C', 'Kelembapan_Persen', 'Angin_ms', 'Status_Kipas', 'Kualitas_Udara'];
  const csvLines = [headers.join(',')];

  for (const r of rows) {
    csvLines.push([
      r.id,
      r.room || 'lab_td',
      `"${r.recorded_at}"`,
      r.temperature ?? '',
      r.humidity ?? '',
      r.wind_speed ?? '',
      r.relay_state ?? '',
      `"${r.air_quality ?? ''}"`
    ].join(','));
  }

  const csvContent = csvLines.join('\r\n');
  const filename = `data_sensor_${room}_${range || 'semua'}_${new Date().toISOString().slice(0, 10)}.csv`;

  res.header('Content-Type', 'text/csv');
  res.header('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvContent);
});

// Endpoint untuk inject/simulasi data manual per ruangan
app.post('/simulate', (req, res) => {
  const d = req.body || {};
  const room = (d.room || 'h5').toLowerCase();

  let baseTemp = 26.5;
  let baseHum = 56.0;
  let baseCo2 = 480;
  let baseTvoc = 14;

  if (room === 'lab_kom') {
    baseTemp = 24.0; baseHum = 51.0; baseCo2 = 610; baseTvoc = 22;
  } else if (room === 'seminar') {
    baseTemp = 23.2; baseHum = 64.0; baseCo2 = 760; baseTvoc = 38;
  } else if (room === 'lab_td') {
    baseTemp = 25.1; baseHum = 53.0; baseCo2 = 430; baseTvoc = 10;
  }

  const t = d.temperature ?? +(baseTemp + (Math.random() * 2 - 1)).toFixed(1);
  const h = d.humidity ?? +(baseHum + (Math.random() * 4 - 2)).toFixed(1);
  const w = d.wind_speed ?? +(0.8 + Math.random() * 1.5).toFixed(1);
  const c = d.co2 ?? Math.floor(baseCo2 + (Math.random() * 50 - 25));
  const tvoc = d.tvoc ?? Math.floor(baseTvoc + (Math.random() * 6 - 3));
  const rpm = d.fan_rpm ?? (c > 700 ? 1600 : 0);
  const relay = d.relay_state ?? (c > 700 ? 'ON' : 'OFF');

  const aq = c < 600 ? 'Baik' : c < 800 ? 'Sedang' : 'Buruk';
  const temp_st = t < 30 ? 'Baik' : 'Sedang';
  const hum_st = h < 70 ? 'Baik' : 'Sedang';
  const co2_st = c < 700 ? 'Baik' : c < 800 ? 'Sedang' : 'Buruk';

  const info = insert.run({
    temperature: t,
    humidity: h,
    wind_speed: w,
    co2: c,
    tvoc,
    fan_rpm: rpm,
    relay_state: relay,
    air_quality: aq,
    temp_status: temp_st,
    hum_status: hum_st,
    co2_status: co2_st,
    uptime: Math.floor(Date.now() / 1000),
    room,
  });

  res.json({ success: true, insertedId: info.lastInsertRowid, room });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[API] Server berjalan pada http://localhost:${PORT}`);
});
