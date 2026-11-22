// Design System Tokens and Utilities based on AirSafe light UI specification

export const theme = {
  colors: {
    bg: 'bg-[#f8fafc]',
    surface: 'bg-white',
    surfaceSubtle: 'bg-slate-50',
    border: 'border-slate-200/80',
    borderLight: 'border-slate-100',
    primary: 'emerald',
    primaryText: 'text-[#0f2942]',
    secondaryText: 'text-slate-500',
    mutedText: 'text-slate-400',
  },
  card: 'bg-white rounded-2xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
  badge: {
    baik: 'bg-emerald-50 text-emerald-700 border border-emerald-200/70',
    sedang: 'bg-amber-50 text-amber-700 border border-amber-200/70',
    buruk: 'bg-rose-50 text-rose-700 border border-rose-200/70',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  },
  dot: {
    baik: 'bg-emerald-500',
    sedang: 'bg-amber-500',
    buruk: 'bg-rose-500',
    neutral: 'bg-slate-400',
  }
};

export function getStatusTheme(status) {
  const s = String(status || '').toUpperCase();
  if (['AMAN', 'BAIK', 'SANGAT BAIK', 'ON', 'LIVE', 'OK'].includes(s)) {
    return {
      type: 'baik',
      label: 'Baik',
      badge: theme.badge.baik,
      dot: theme.dot.baik,
      color: '#10b981',
      bgLight: 'bg-emerald-50',
      text: 'text-emerald-700',
    };
  }
  if (['PERINGATAN', 'WASPADA', 'SEDANG', 'CUKUP'].includes(s)) {
    return {
      type: 'sedang',
      label: 'Sedang',
      badge: theme.badge.sedang,
      dot: theme.dot.sedang,
      color: '#f59e0b',
      bgLight: 'bg-amber-50',
      text: 'text-amber-700',
    };
  }
  if (['BAHAYA', 'BURUK', 'TIDAK SEHAT', 'SANGAT TIDAK SEHAT', 'OFFLINE', 'ERR'].includes(s)) {
    return {
      type: 'buruk',
      label: 'Buruk',
      badge: theme.badge.buruk,
      dot: theme.dot.buruk,
      color: '#ef4444',
      bgLight: 'bg-rose-50',
      text: 'text-rose-700',
    };
  }
  return {
    type: 'neutral',
    label: status || 'Normal',
    badge: theme.badge.neutral,
    dot: theme.dot.neutral,
    color: '#64748b',
    bgLight: 'bg-slate-100',
    text: 'text-slate-700',
  };
}
