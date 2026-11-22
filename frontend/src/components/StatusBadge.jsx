import React from 'react';
import { getStatusTheme } from '../theme/designSystem';

export default function StatusBadge({ status, text, size = 'md' }) {
  const theme = getStatusTheme(status);
  const displayText = text || theme.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-sans font-semibold tracking-tight transition-all ${
        size === 'sm' ? 'text-[11px]' : 'text-xs'
      } ${theme.badge}`}
    >
      <span className={`h-2 w-2 rounded-full ${theme.dot} ${status === 'ok' || status === 'LIVE' ? 'animate-pulse' : ''}`} />
      <span>{displayText}</span>
    </span>
  );
}
