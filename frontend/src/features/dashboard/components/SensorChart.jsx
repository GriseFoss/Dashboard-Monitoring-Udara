import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SensorChart({
  title,
  data = [],
  dataKey,
  label,
  color = '#059669',
  unit = '',
  timeRange = '7d',
}) {
  const labels = data.map((d) => {
    if (!d.recorded_at) return '';
    const date = new Date(String(d.recorded_at).replace(' ', 'T') + 'Z');
    if (timeRange === '3d') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + date.getDate() + '/' + (date.getMonth() + 1) + ')';
    }
    return date.toLocaleDateString([], { day: '2-digit', month: 'short' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const values = data.map((d) => d[dataKey] ?? null);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${label} (${unit})`,
        data: values,
        borderColor: color,
        backgroundColor: `${color}18`,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: data.length > 50 ? 0 : 2.5,
        pointHoverRadius: 5,
        pointBackgroundColor: color,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        displayColors: false,
        callbacks: {
          label: (context) => `${label}: ${context.parsed.y} ${unit}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(241, 245, 249, 1)',
        },
        ticks: {
          color: '#64748b',
          maxRotation: 0,
          font: { size: 10 },
          maxTicksLimit: timeRange === '30d' ? 8 : 6,
        },
      },
      y: {
        grid: {
          color: 'rgba(241, 245, 249, 1)',
        },
        ticks: {
          color: '#64748b',
          font: { size: 10 },
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#0f2942]">{title}</h3>
          <p className="text-[11px] text-slate-400">
            Total {data.length} data telemetri tercatat di database backend
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-xs font-mono font-bold" style={{ color }}>
            {values.length > 0 && values[values.length - 1] !== null ? `${values[values.length - 1]} ${unit}` : '--'}
          </span>
        </div>
      </div>
      <div className="h-60 sm:h-72 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            Tidak ada rekaman data pada rentang waktu ini.
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
