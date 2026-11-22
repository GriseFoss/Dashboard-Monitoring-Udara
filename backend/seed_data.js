const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'air_data.db');
const db = new Database(dbPath);

console.log('Memeriksa data dan melakukan seeding riwayat 30 hari untuk setiap ruangan...');

// Ensure room column exists
const existing = db.prepare('PRAGMA table_info(readings)').all().map(c => c.name);
if (!existing.includes('room')) {
  db.prepare("ALTER TABLE readings ADD COLUMN room TEXT DEFAULT 'h5'").run();
}
db.prepare("UPDATE readings SET room = 'h5' WHERE room IS NULL OR room = ''").run();

// Migrasi nama ruangan lama ke ruangan baru jika ada
db.prepare("UPDATE readings SET room = 'lab_td' WHERE room = 'h17'").run();
db.prepare("UPDATE readings SET room = 'lab_kom' WHERE room = 'h18'").run();

const insert = db.prepare(`
  INSERT INTO readings
    (temperature, humidity, wind_speed, co2, tvoc, fan_rpm, relay_state,
     air_quality, temp_status, hum_status, co2_status, uptime, room, recorded_at)
  VALUES
    (@temperature, @humidity, @wind_speed, @co2, @tvoc, @fan_rpm, @relay_state,
     @air_quality, @temp_status, @hum_status, @co2_status, @uptime, @room, @recorded_at)
`);

const roomsConfig = [
  { id: 'lab_td', baseTemp: 25.1, baseHum: 53.0, baseCo2: 430, baseTvoc: 10, baseWind: 0.8 },
  { id: 'lab_kom', baseTemp: 24.0, baseHum: 51.0, baseCo2: 610, baseTvoc: 22, baseWind: 1.6 },
  { id: 'h5', baseTemp: 26.5, baseHum: 56.0, baseCo2: 480, baseTvoc: 14, baseWind: 1.2 },
  { id: 'seminar', baseTemp: 23.2, baseHum: 64.0, baseCo2: 760, baseTvoc: 38, baseWind: 2.1 },
];

// Check existing counts per room in the last 30 days
const checkCount = db.prepare(`
  SELECT room, count(*) as c FROM readings 
  WHERE recorded_at >= datetime('now', '-30 days')
  GROUP BY room
`).all();

console.log('Record 30 hari terakhir saat ini:', checkCount);

// Generate records every 4 hours for the last 30 days (180 points per room)
const now = new Date();
const insertMany = db.transaction(() => {
  for (const rc of roomsConfig) {
    const roomCount = checkCount.find(r => r.room === rc.id)?.c || 0;
    if (roomCount >= 30) {
      console.log(`Ruangan ${rc.id} sudah memiliki ${roomCount} data. Melewati seeding.`);
      continue;
    }

    console.log(`Menyimpan riwayat 30 hari untuk ${rc.id}...`);

    for (let hoursAgo = 30 * 24; hoursAgo >= 0; hoursAgo -= 4) {
      const recordDate = new Date(now.getTime() - hoursAgo * 3600 * 1000);
      const isoString = recordDate.toISOString().replace('T', ' ').slice(0, 19);

      // Add daylight cycle (warmer during midday, cooler at night)
      const hour = recordDate.getUTCHours();
      const dayFactor = Math.sin(((hour - 4) / 24) * Math.PI * 2);

      const t = +(rc.baseTemp + dayFactor * 1.5 + (Math.random() * 0.8 - 0.4)).toFixed(1);
      const h = +(rc.baseHum - dayFactor * 3.0 + (Math.random() * 2 - 1)).toFixed(1);
      const w = +(rc.baseWind + (Math.random() * 0.4 - 0.2)).toFixed(1);
      const c = Math.round(rc.baseCo2 + dayFactor * 50 + (Math.random() * 30 - 15));
      const tvoc = Math.round(rc.baseTvoc + (Math.random() * 4 - 2));

      const isFanOn = c > 700;
      const rpm = isFanOn ? (c > 750 ? 1600 : 1200) : 0;
      const relay = isFanOn ? 'ON' : 'OFF';

      const aq = c < 600 ? 'Baik' : c < 800 ? 'Sedang' : 'Buruk';
      const temp_st = t < 30 ? 'Baik' : 'Sedang';
      const hum_st = h < 70 ? 'Baik' : 'Sedang';
      const co2_st = c < 700 ? 'Baik' : c < 800 ? 'Sedang' : 'Buruk';

      insert.run({
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
        uptime: Math.floor(recordDate.getTime() / 1000),
        room: rc.id,
        recorded_at: isoString,
      });
    }
  }
});

insertMany();

console.log('Seeding selesai!');
const total = db.prepare('SELECT room, count(*) as count FROM readings GROUP BY room').all();
console.log('Total data per ruangan di database SQLite:', total);
