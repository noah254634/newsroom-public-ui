"use client";

import React from 'react';
import { TrendingUp, ShieldCheck, Cpu } from 'lucide-react';

export default function TickerBar() {
  const tickerItems = [
    { label: "CBK CBR Benchmark Rate", val: "12.75%", change: "Stable" },
    { label: "KES/USD Exchange Rate", val: "129.45", change: "-0.12%" },
    { label: "Debt Service Ratio", val: "64.2%", change: "Treasury Target 58%" },
    { label: "KNBS Inflation Target", val: "4.3%", change: "Within Band" },
    { label: "County Allocation FY 25/26", val: "KES 400.1B", change: "+4.5%" }
  ];

  return (
    <div className="bg-[var(--color-paper-subtle)] border-b border-[var(--color-rule)] py-1.5 px-6 text-[11px] overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-6 whitespace-nowrap max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[var(--color-crimson)]">
          <TrendingUp size={12} />
          <span>Ugatuzi Terminal:</span>
        </div>
        {tickerItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[var(--color-ink-secondary)]">
            <span className="font-semibold text-[var(--color-ink)]">{item.label}:</span>
            <span className="font-mono font-bold text-[var(--color-ink)]">{item.val}</span>
            <span className="text-[10px] text-[var(--color-ink-tertiary)]">({item.change})</span>
            {idx < tickerItems.length - 1 && <span className="text-[var(--color-rule-strong)]">|</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
