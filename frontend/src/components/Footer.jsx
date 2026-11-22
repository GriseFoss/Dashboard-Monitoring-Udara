import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs">
            <Leaf className="h-3.5 w-3.5 fill-white stroke-white" />
          </div>
          <span className="font-bold text-[#0f2942]">Archtera</span>
          <span className="text-emerald-700 font-semibold">• Air Safe Area</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="text-slate-400 text-xs">
          Archtera — Air Safe Area | Sistem Monitoring Mutu Udara & Sirkulasi Otomatis IoT
        </div>
      </div>
    </footer>
  );
}
