import React from 'react';
import { getStatusTheme } from '../../../theme/designSystem';

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  status = 'Baik',
  subtitle,
}) {
  const st = getStatusTheme(status);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f2942] font-mono">
          {value !== null && value !== undefined ? value : '--'}
        </span>
        {unit && <span className="text-xs text-slate-400 font-semibold">{unit}</span>}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${st.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
          <span>{status || 'Baik'}</span>
        </span>
        {subtitle && <span className="text-[11px] text-slate-400">{subtitle}</span>}
      </div>

      {/* Ambient bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
        <div
          className="h-full transition-all duration-500"
          style={{ backgroundColor: st.color, width: '100%' }}
        />
      </div>
    </div>
  );
}
