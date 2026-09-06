import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-rule-strong)] bg-[var(--color-paper-subtle)] text-[var(--color-ink-secondary)] py-12 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[var(--color-rule)]">
        
        <div>
          <h3 className="font-serif-headline text-[1.2rem] font-bold text-[var(--color-ink)] mb-2">
            UGATUZI TERMINAL
          </h3>
          <p className="text-[12px] text-[var(--color-ink-secondary)] leading-relaxed">
            Independent Kenyan news publication covering devolution, public finance, county governance, and accountability across Kenya's 47 counties.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] mb-3">
            Our Sources
          </h4>
          <ul className="text-[12px] space-y-1.5 font-mono">
            <li>• Central Bank of Kenya (CBK)</li>
            <li>• Kenya National Bureau of Statistics (KNBS)</li>
            <li>• National Treasury & Planning</li>
            <li>• Parliament of Kenya (Hansard Records)</li>
            <li>• Public Procurement Regulatory Authority</li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] mb-3">
            Public Navigation
          </h4>
          <ul className="text-[12px] space-y-2 font-medium">
            <li><Link href="/" className="hover:text-[var(--color-ink)]">Front Page</Link></li>
            <li><Link href="/counties" className="hover:text-[var(--color-ink)]">47 Counties</Link></li>
            <li><Link href="/databank" className="hover:text-[var(--color-ink)]">Data & Statistics</Link></li>
            <li><Link href="/search" className="hover:text-[var(--color-ink)]">Search</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[var(--color-ink-tertiary)]">
        <span>© {new Date().getFullYear()} Ugatuzi Terminal. All primary document claims cross-verified.</span>
        <span className="font-mono mt-2 sm:mt-0">Ugatuzi — Kenya Devolution News</span>
      </div>
    </footer>
  );
}
