import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Wifi,
  Wind,
  Thermometer,
  Droplets,
  Fan,
  ArrowLeft,
  ArrowRight,
  Layers,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Server,
  Zap,
  Terminal,
  BookOpen,
  Workflow,
} from 'lucide-react';
import CodeBlock from './components/CodeBlock';

export default function DocsIotPage({ onNavigate }) {
  const [selectedRoom, setSelectedRoom] = useState('h5');
  const baseIp = '202.155.17.57';

  const arduinoCode = `/*
 * ==================================================================================
 * FIRMWARE IOT MONITORING KUALITAS UDARA & SIRKULASI
 * Mengukur: Suhu (°C), Kelembaban (%), Kecepatan Angin (m/s), & Kontrol Relay Kipas
 * Mikrokontroler: ESP32 DevKit V1
 * Protokol: MQTT ke Broker EMQX (broker.emqx.io) -> Terhubung ke Web Dashboard
 * ==================================================================================
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ---------- 1. KONFIGURASI WIFI & MQTT ----------
const char* WIFI_SSID     = "NAMA_WIFI_ANDA";
const char* WIFI_PASSWORD = "PASSWORD_WIFI_ANDA";

const char* MQTT_SERVER   = "broker.emqx.io";
const int   MQTT_PORT     = 1883;
const char* MQTT_TOPIC    = "monitoring_udara_ta/data";

// Pengenal Ruangan: 'lab_td', 'lab_kom', 'h5', atau 'seminar'
const char* ROOM_ID       = "${selectedRoom}";

// ---------- 2. DEFINISI PIN PERANGKAT KERAS ----------
#define DHTPIN          4      // Pin Data DHT22 (GPIO 4)
#define DHTTYPE         DHT22  // Tipe Sensor DHT22 (AM2302)
#define ANEMOMETER_PIN  34     // Pin Analog Output Anemometer (ADC1 GPIO 34)
#define RELAY_PIN       5      // Pin Kontrol Modul Relay Kipas (GPIO 5)

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastPublishTime = 0;
const unsigned long PUBLISH_INTERVAL = 5000; // Kirim data setiap 5 detik

// ---------- 3. FUNGSI HITUNG KECEPATAN ANGIN ----------
float readWindSpeed() {
  // ESP32 ADC: 12-bit (0 - 4095), rentang tegangan 0 - 3.3V
  int rawADC = analogRead(ANEMOMETER_PIN);
  float voltage = (rawADC / 4095.0) * 3.3;

  // Kalibrasi Anemometer (Tegangan 0.4V - 2.0V mengukur 0 - 30 m/s)
  float windSpeed = 0.0;
  if (voltage > 0.4) {
    windSpeed = ((voltage - 0.4) / 1.6) * 30.0;
  }
  if (windSpeed < 0) windSpeed = 0.0;
  return windSpeed;
}

// ---------- 4. KONEKSI KE WIFI ----------
void setupWiFi() {
  delay(10);
  Serial.println();
  Serial.print("[WiFi] Menghubungkan ke ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("[WiFi] Berhasil Terhubung!");
  Serial.print("[WiFi] IP Address: ");
  Serial.println(WiFi.localIP());
}

// ---------- 5. KONEKSI KE BROKER MQTT ----------
void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("[MQTT] Menghubungkan ke broker EMQX...");
    
    // Generate Client ID acak unik
    String clientId = "ESP32_Archtera_" + String(ROOM_ID) + "_" + String(random(0xffff), HEX);

    if (mqttClient.connect(clientId.c_str())) {
      Serial.println(" Terhubung!");
    } else {
      Serial.print(" Gagal, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Coba lagi dalam 4 detik...");
      delay(4000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\\n=== ESP32 MONITORING KUALITAS UDARA TELEMETRI ===");

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Relay Standby (OFF)

  dht.begin();
  setupWiFi();

  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setBufferSize(512);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    setupWiFi();
  }

  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - lastPublishTime >= PUBLISH_INTERVAL) {
    lastPublishTime = currentMillis;

    // 1. Baca Sensor Suhu & Kelembaban (DHT22)
    float temperature = dht.readTemperature();
    float humidity    = dht.readHumidity();

    // 2. Baca Sensor Kecepatan Sirkulasi Angin (Anemometer)
    float windSpeed   = readWindSpeed();

    // Cek error pembacaan sensor
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("[Sensor Error] Gagal membaca data dari DHT22!");
      return;
    }

    // 3. Otomasi Kontrol Relay Kipas Sirkulasi
    // Kipas AKTIF jika suhu > 29.5°C ATAU kelembaban > 70% ATAU sirkulasi angin < 0.3 m/s
    String relayState = "OFF";
    int fanRpm = 0;
    String airQuality = "Baik";

    if (temperature > 29.5 || humidity > 70.0 || windSpeed < 0.3) {
      digitalWrite(RELAY_PIN, HIGH); // Nyalakan Relay (Kipas On)
      relayState = "ON";
      fanRpm = 950;
      airQuality = (temperature > 32.0 || humidity > 75.0) ? "Buruk" : "Sedang";
    } else {
      digitalWrite(RELAY_PIN, LOW);  // Matikan Relay (Kipas Off)
      relayState = "OFF";
      fanRpm = 0;
      airQuality = "Baik";
    }

    // 4. Susun Payload JSON sesuai schema Web Backend
    StaticJsonDocument<300> doc;
    doc["room"]        = ROOM_ID;
    doc["temperature"] = round(temperature * 10.0) / 10.0;
    doc["humidity"]    = round(humidity * 10.0) / 10.0;
    doc["wind_speed"]  = round(windSpeed * 10.0) / 10.0;
    doc["fan_rpm"]     = fanRpm;
    doc["relay_state"] = relayState;
    doc["air_quality"] = airQuality;
    doc["uptime"]      = millis() / 1000;

    char jsonBuffer[300];
    serializeJson(doc, jsonBuffer);

    // 5. Publish Payload ke MQTT Broker
    bool published = mqttClient.publish(MQTT_TOPIC, jsonBuffer);
    if (published) {
      Serial.print("[MQTT Publish Success]: ");
      Serial.println(jsonBuffer);
    } else {
      Serial.println("[MQTT Error] Gagal mempublikasikan payload!");
    }
  }
}`;

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
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                  Panduan Perangkat Keras
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight flex items-center gap-3">
                <Cpu className="h-7 w-7 text-cyan-600" />
                <span>Dokumentasi Koneksi Perangkat IoT ke Dashboard</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Panduan komprehensif mengintegrasikan mikrokontroler (ESP32/Arduino) dengan sensor DHT22, Anemometer, dan Relay Kipas agar data langsung masuk ke website secara real-time.
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
                <span>Buka Dokumen Backend</span>
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
                <span>Lihat Live Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1: Alur Kerja & Arsitektur Komunikasi */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Radio className="h-5 w-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">1. Alur Transmisi Data IoT ke Web Dashboard</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-6">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Komunikasi antara sensor fisik di lapangan dan web dashboard di server <strong>{baseIp}</strong> berlangsung cepat dan tanpa jeda menggunakan protokol <strong>MQTT (Message Queuing Telemetry Transport)</strong>:
            </p>

            {/* Step-by-Step Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 relative">
                <span className="text-[10px] font-bold text-cyan-600 uppercase font-mono">Tahap 1</span>
                <div className="font-bold text-sm text-[#0f2942] mt-1">Pembacaan Sensor Fisik</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  ESP32 membaca suhu & kelembaban dari <strong>DHT22</strong> serta kecepatan angin dari <strong>Anemometer</strong>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 relative">
                <span className="text-[10px] font-bold text-cyan-600 uppercase font-mono">Tahap 2</span>
                <div className="font-bold text-sm text-[#0f2942] mt-1">Publish MQTT JSON</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Payload JSON dikirim melalui WiFi ke broker publik <code>broker.emqx.io:1883</code> pada topik <code>monitoring_udara_ta/data</code>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 relative">
                <span className="text-[10px] font-bold text-cyan-600 uppercase font-mono">Tahap 3</span>
                <div className="font-bold text-sm text-[#0f2942] mt-1">Backend Bridge VPS</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Server Express di VPS (<code>{baseIp}</code>) menerima pesan, memvalidasi format, lalu menyimpannya ke <code>air_data.db</code>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 relative">
                <span className="text-[10px] font-bold text-cyan-600 uppercase font-mono">Tahap 4</span>
                <div className="font-bold text-sm text-[#0f2942] mt-1">Tampilan Dashboard Live</div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Web React melakukan polling ke <code>/api/latest</code> & <code>/api/readings</code>, grafik dan kartu metrik terupdate otomatis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: MQTT Broker Parameters & JSON Schema */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Wifi className="h-5 w-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">2. Parameter Koneksi MQTT & Schema JSON</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Broker Specs Table */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#0f2942]">Konfigurasi Broker EMQX</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-600">MQTT Broker Host</td>
                      <td className="py-2.5 font-mono text-cyan-700 font-bold">broker.emqx.io</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-600">Port TCP Standar</td>
                      <td className="py-2.5 font-mono text-slate-800 font-bold">1883 (Unencrypted)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-600">Topik Telemetri</td>
                      <td className="py-2.5 font-mono text-emerald-700 font-bold">monitoring_udara_ta/data</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-600">QoS Level</td>
                      <td className="py-2.5 font-mono text-slate-800">QoS 0 atau 1</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-slate-600">Interval Publish</td>
                      <td className="py-2.5 text-slate-600">Disarankan 3 - 5 detik</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* JSON Schema */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#0f2942]">Format JSON Payload Wajib</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Backend mem-parsing data dari JSON string berikut:
              </p>
              <CodeBlock
                language="json"
                title="Payload MQTT JSON"
                code={`{
  "room": "${selectedRoom}",
  "temperature": 27.5,
  "humidity": 60.2,
  "wind_speed": 1.2,
  "fan_rpm": 850,
  "relay_state": "ON",
  "air_quality": "Baik",
  "uptime": 3600
}`}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Hardware Pinout & Wiring Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Zap className="h-5 w-5 text-cyan-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">3. Skema Pengkabelan (Wiring) Pinout ESP32</h2>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                  <tr>
                    <th className="py-3 px-4">Nama Modul Sensor</th>
                    <th className="py-3 px-4">Pin Modul</th>
                    <th className="py-3 px-4">Pin ESP32</th>
                    <th className="py-3 px-4">Fungsi & Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* DHT22 */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-orange-700" rowSpan="3">
                      Sensor DHT22 (Suhu & Lembab)
                    </td>
                    <td className="py-1.5 px-4 font-mono">VCC (+)</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">Pin 3.3V / 5V</td>
                    <td className="py-1.5 px-4 text-slate-600">Daya sensor (3.3V aman untuk GPIO ESP32)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-4 font-mono">DATA / OUT</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">GPIO 4</td>
                    <td className="py-1.5 px-4 text-slate-600">Sinyal digital komunikasi 1-Wire</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-4 font-mono">GND (-)</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">GND</td>
                    <td className="py-1.5 px-4 text-slate-600">Ground bersama</td>
                  </tr>

                  {/* Anemometer */}
                  <tr className="bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-cyan-700" rowSpan="3">
                      Sensor Anemometer (Kecepatan Angin)
                    </td>
                    <td className="py-1.5 px-4 font-mono">VCC (+)</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">12V / 5V DC</td>
                    <td className="py-1.5 px-4 text-slate-600">Tegangan kerja sesuai spesifikasi anemometer</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-1.5 px-4 font-mono">SIGNAL (Out)</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">GPIO 34 (ADC1)</td>
                    <td className="py-1.5 px-4 text-slate-600">
                      Input Analog 0-3.3V (Gunakan voltage divider jika output sensor 5V)
                    </td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-1.5 px-4 font-mono">GND (-)</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">GND (Common)</td>
                    <td className="py-1.5 px-4 text-slate-600">Wajib sambungkan GND anemometer dengan GND ESP32</td>
                  </tr>

                  {/* Relay Modul */}
                  <tr>
                    <td className="py-3 px-4 font-bold text-purple-700" rowSpan="3">
                      Modul Relay Kipas (Exhaust Fan)
                    </td>
                    <td className="py-1.5 px-4 font-mono">VCC</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">Pin 5V (VIN)</td>
                    <td className="py-1.5 px-4 text-slate-600">Daya koil relay</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-4 font-mono">IN / Signal</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">GPIO 5</td>
                    <td className="py-1.5 px-4 text-slate-600">Sinyal digital kontrol relay (HIGH = ON, LOW = OFF)</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-4 font-mono">GND</td>
                    <td className="py-1.5 px-4 font-mono font-bold text-emerald-700">GND</td>
                    <td className="py-1.5 px-4 text-slate-600">Ground bersama</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: Complete Firmware Source Code (Arduino IDE) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5">
              <FileCode className="h-5 w-5 text-cyan-600" />
              <h2 className="text-lg font-bold text-[#0f2942]">4. Source Code Firmware ESP32 (Arduino C++)</h2>
            </div>

            {/* Room Selector for Code Generation */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Pilih Kode Ruangan:</span>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs cursor-pointer focus:outline-none focus:border-cyan-500"
              >
                <option value="h5">Ruang H5 (Live)</option>
                <option value="lab_td">Ruang Lab TD</option>
                <option value="lab_kom">Ruang Lab Kom</option>
                <option value="seminar">Ruang Seminar</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Kode berikut sudah siap pakai. Salin dan buka di <strong>Arduino IDE</strong>, masukkan nama & password WiFi Anda, lalu lakukan upload ke board ESP32:
          </p>

          <CodeBlock
            language="cpp"
            title={`Firmware_ESP32_${selectedRoom.toUpperCase()}.ino`}
            code={arduinoCode}
          />
        </section>

        {/* Section 5: Step-by-Step Tutorial & Troubleshooting */}
        <section className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#0f2942]">5. Langkah-Langkah Pemasangan & Pengujian</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Step by step */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#0f2942]">Persiapan di Arduino IDE</h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
                <li>
                  Buka <strong>Tools &gt; Manage Libraries</strong> di Arduino IDE.
                </li>
                <li>
                  Instal library <strong>PubSubClient</strong> oleh <em>Nick O'Leary</em>.
                </li>
                <li>
                  Instal library <strong>DHT sensor library</strong> oleh <em>Adafruit</em>.
                </li>
                <li>
                  Instal library <strong>ArduinoJson</strong> oleh <em>Benoit Blanchon</em> (versi 6.x atau 7.x).
                </li>
                <li>
                  Pilih board <strong>ESP32 Dev Module</strong> pada menu <em>Tools &gt; Board</em>.
                </li>
                <li>
                  Colokkan kabel Micro-USB/Type-C ke ESP32, pilih COM Port yang sesuai, lalu klik <strong>Upload</strong>.
                </li>
              </ol>
            </div>

            {/* Troubleshooting */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#0f2942] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Troubleshooting Masalah Umum</span>
              </h3>
              <div className="space-y-2.5 text-slate-600 leading-relaxed">
                <div>
                  <strong className="text-slate-800 block">Sensor DHT22 membaca "nan":</strong>
                  Pastikan kabel DATA terpasang kokoh di GPIO 4 dan memiliki resistor pull-up 10kΩ ke 3.3V jika menggunakan sensor tanpa board pcb.
                </div>
                <div>
                  <strong className="text-slate-800 block">Status MQTT rc=-2 di Serial Monitor:</strong>
                  Menandakan koneksi internet WiFi terputus atau firewall jaringan memblokir port 1883. Coba sambungkan ke tethering HP untuk pengujian.
                </div>
                <div>
                  <strong className="text-slate-800 block">Data tidak muncul di Web Dashboard:</strong>
                  Pastikan nilai <code>ROOM_ID</code> pada Arduino IDE cocok dengan ruangan yang sedang Anda pilih pada sidebar dashboard web.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
