import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ code, language = 'bash', title }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0d1520] overflow-hidden my-3 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#131d2b] border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          {title && <span className="ml-2 font-mono text-slate-300 font-semibold">{title}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-[11px] font-medium cursor-pointer"
            title="Salin kode"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed selection:bg-emerald-800 selection:text-white">
        <code>{code}</code>
      </pre>
    </div>
  );
}
