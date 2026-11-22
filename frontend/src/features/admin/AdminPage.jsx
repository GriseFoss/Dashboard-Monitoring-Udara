import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  Check,
  AlertCircle,
  Database,
  Search,
  X,
  Thermometer,
  Droplets,
  Wind,
  Fan,
  DoorOpen,
} from 'lucide-react';
import { fetchReadings, createReading, updateReading, deleteReading } from '../../services/api';
import { ROOMS } from '../dashboard/roomsConfig';

export default function AdminPage() {
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [formData, setFormData] = useState({
    id: null,
    room: 'lab_td',
    temperature: 26.5,
    humidity: 58.0,
    co2: 400,
    wind_speed: 1.2,
    fan_rpm: 850,
    relay_state: 'ON',
    air_quality: 'Baik',
  });
  const [saving, setSaving] = useState(false);

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchReadings({
        room: selectedRoom === 'all' ? '' : selectedRoom,
        limit: 100,
      });
      setReadings(Array.isArray(data) ? [...data].reverse() : []);
    } catch (err) {
      showToast('error', `Gagal memuat data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedRoom]);

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleOpenCreate = () => {
    setFormData({
      id: null,
      room: selectedRoom !== 'all' ? selectedRoom : 'lab_td',
      temperature: 26.5,
      humidity: 58.0,
      co2: 400,
      wind_speed: 1.2,
      fan_rpm: 850,
      relay_state: 'ON',
      air_quality: 'Baik',
    });
    setModalMode('create');
  };

  const handleOpenEdit = (item) => {
    setFormData({
      id: item.id,
      room: item.room || 'lab_td',
      temperature: item.temperature ?? 26.5,
      humidity: item.humidity ?? 58.0,
      co2: item.co2 ?? 400,
      wind_speed: item.wind_speed ?? 1.2,
      fan_rpm: item.fan_rpm ?? 0,
      relay_state: item.relay_state || 'OFF',
      air_quality: item.air_quality || 'Baik',
    });
    setModalMode('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modalMode === 'create') {
        const res = await createReading(formData);
        showToast('success', res.message || 'Data baru berhasil dibuat!');
      } else if (modalMode === 'edit') {
        const res = await updateReading(formData.id, formData);
        showToast('success', res.message || 'Data berhasil diperbarui!');
      }
      setModalMode(null);
      await loadData();
    } catch (err) {
      showToast('error', `Operasi gagal: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin ingin menghapus data rekaman sensor ID #${id}?`)) {
      return;
    }
    try {
      const res = await deleteReading(id);
      showToast('success', res.message || `Data #${id} berhasil dihapus`);
      setReadings((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      showToast('error', `Gagal menghapus: ${err.message}`);
    }
  };

  const filteredReadings = readings.filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      String(row.id).includes(term) ||
      String(row.room).toLowerCase().includes(term) ||
      String(row.temperature).includes(term) ||
      String(row.humidity).includes(term) ||
      String(row.co2).includes(term) ||
      String(row.wind_speed).includes(term) ||
      String(row.relay_state).toLowerCase().includes(term) ||
      String(row.air_quality).toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-20">
      {/* Toast Notification */}
      {message && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 font-mono">
                  Area Khusus Administrator
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0f2942] tracking-tight flex items-center gap-2.5">
                <Shield className="h-7 w-7 text-rose-600" />
                <span>Panel Manajemen Data Udara</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Kelola rekaman telemetri database SQLite secara langsung. Anda dapat membuat data baru, memperbarui nilai sensor, atau menghapus entri anomali.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Segarkan</span>
              </button>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Tambah Data Manual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Controls Bar: Room Filter & Search */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Room Pill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <DoorOpen className="h-3.5 w-3.5" />
              <span>Ruangan:</span>
            </span>
            <button
              onClick={() => setSelectedRoom('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoom === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Ruangan
            </button>
            {ROOMS.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoom(r.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRoom === r.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari ID, suhu, relay, ruangan..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Table of Readings */}
        <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-600" />
              <span className="font-bold text-[#0f2942]">Daftar Rekaman Database SQLite</span>
            </div>
            <div className="text-slate-500">
              Total Ditampilkan: <strong className="text-slate-800">{filteredReadings.length}</strong> baris data
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Ruangan</th>
                  <th className="py-3 px-4">Waktu Rekam</th>
                  <th className="py-3 px-4">Suhu (°C)</th>
                  <th className="py-3 px-4">Kelembapan (%)</th>
                  <th className="py-3 px-4">CO2 (ppm)</th>
                  <th className="py-3 px-4">Angin (m/s)</th>
                  <th className="py-3 px-4">Relay Kipas</th>
                  <th className="py-3 px-4">Kualitas</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto text-emerald-600 mb-2" />
                      <span>Sedang memuat data dari database...</span>
                    </td>
                  </tr>
                ) : filteredReadings.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-slate-400">
                      Tidak ada rekaman data yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredReadings.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 font-semibold">#{row.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800 font-mono uppercase">
                        {row.room || 'h5'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {row.recorded_at || '--'}
                      </td>
                      <td className="py-3 px-4 font-bold text-orange-700 font-mono">
                        {row.temperature != null ? `${row.temperature}°C` : '--'}
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-700 font-mono">
                        {row.humidity != null ? `${row.humidity}%` : '--'}
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-700 font-mono">
                        {row.co2 != null ? `${row.co2} ppm` : '--'}
                      </td>
                      <td className="py-3 px-4 font-bold text-cyan-700 font-mono">
                        {row.wind_speed != null ? `${row.wind_speed} m/s` : '--'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.relay_state === 'ON'
                              ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {row.relay_state || 'OFF'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            row.air_quality === 'Baik'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : row.air_quality === 'Sedang'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {row.air_quality || 'Baik'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Create / Edit Data */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  {modalMode === 'create' ? <Plus className="h-5 w-5" /> : <Edit2 className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#0f2942]">
                    {modalMode === 'create' ? 'Tambah Rekaman Sensor Baru' : `Edit Rekaman ID #${formData.id}`}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {modalMode === 'create'
                      ? 'Input data telemetri manual ke dalam database SQLite'
                      : 'Perbarui nilai parameter sensor untuk entri ini'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Ruangan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ruangan Target</label>
                <select
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 bg-white text-slate-800 font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  {ROOMS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid Sensor Aspek: Suhu, Lembap, CO2, Angin */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <Thermometer className="h-3.5 w-3.5 text-orange-600" />
                    <span>Suhu (°C)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 font-mono text-slate-800 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <Droplets className="h-3.5 w-3.5 text-purple-600" />
                    <span>Kelembapan (%)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.humidity}
                    onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 font-mono text-slate-800 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>CO₂ (ppm)</span>
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={formData.co2}
                    onChange={(e) => setFormData({ ...formData, co2: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 font-mono text-slate-800 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <Wind className="h-3.5 w-3.5 text-cyan-600" />
                    <span>Angin (m/s)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.wind_speed}
                    onChange={(e) => setFormData({ ...formData, wind_speed: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 font-mono text-slate-800 font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid Aktuator Kipas: Relay & Fan RPM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <Fan className="h-3.5 w-3.5 text-cyan-600" />
                    <span>Status Relay</span>
                  </label>
                  <select
                    value={formData.relay_state}
                    onChange={(e) => setFormData({ ...formData, relay_state: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 bg-white font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ON">ON (Aktif)</option>
                    <option value="OFF">OFF (Standby)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Putaran Kipas (RPM)</label>
                  <input
                    type="number"
                    value={formData.fan_rpm}
                    onChange={(e) => setFormData({ ...formData, fan_rpm: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 font-mono text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kualitas Udara</label>
                  <select
                    value={formData.air_quality}
                    onChange={(e) => setFormData({ ...formData, air_quality: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-2 bg-white font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Buruk">Buruk</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : modalMode === 'create' ? 'Tambah Data' : 'Perbarui Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
