const express  = require('express');
const mqtt     = require('mqtt');
const Database = require('better-sqlite3');

// ---------- Database ----------
const db = new Database('air_data.db');

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
};
const existing = db.prepare('PRAGMA table_info(readings)').all().map(c => c.name);
for (const [name, type] of Object.entries(newColumns)) {
  if (!existing.includes(name)) {
    db.prepare(`ALTER TABLE readings ADD COLUMN ${name} ${type}`).run();
  }
}

const insert = db.prepare(`
  INSERT INTO readings
    (temperature, humidity, wind_speed, co2, tvoc, fan_rpm, relay_state,
     air_quality, temp_status, hum_status, co2_status, uptime)
  VALUES
    (@temperature, @humidity, @wind_speed, @co2, @tvoc, @fan_rpm, @relay_state,
     @air_quality, @temp_status, @hum_status, @co2_status, @uptime)
`);

// ---------- MQTT ----------
const MQTT_URL   = 'mqtt://localhost'; // ganti ke IP broker jika bridge beda mesin
const MQTT_TOPIC = 'home/weather';

const client = mqtt.connect(MQTT_URL);

client.on('connect', () => {
  console.log('MQTT connected');
  client.subscribe(MQTT_TOPIC);
});

client.on('message', (_, payload) => {
  try {
    // Arduino mengirim "nan" (bukan JSON valid) jika DHT22 gagal baca -> ubah ke null
    const raw = payload.toString().replace(/:\s*-?nan/gi, ':null');
    const d = JSON.parse(raw);
    const detail = d.air_quality_detail || {};

    insert.run({
      temperature: d.temperature ?? null,
      humidity:    d.humidity ?? null,
      wind_speed:  d.wind_speed ?? null,
      co2:         d.co2 ?? null,
      tvoc:        d.tvoc ?? null,
      fan_rpm:     d.fan_rpm ?? null,
      relay_state: d.relay_state ?? null,
      air_quality: d.air_quality ?? null,
      temp_status: detail.temperature ?? null,
      hum_status:  detail.humidity ?? null,
      co2_status:  detail.co2 ?? null,
      uptime:      d.uptime ?? null,
    });
  } catch (e) {
    console.error('Parse/insert error:', e.message);
  }
});

// ---------- REST API ----------
const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/readings', (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM readings ORDER BY id DESC LIMIT 40'
  ).all();
  res.json(rows.reverse());
});

app.get('/latest', (req, res) => {
  const row = db.prepare(
    'SELECT * FROM readings ORDER BY id DESC LIMIT 1'
  ).get();
  res.json(row || {});
});

app.listen(3000, () => console.log('API on :3000'));