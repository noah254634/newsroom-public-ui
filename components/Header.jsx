"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Search, BookOpen, ShieldCheck } from 'lucide-react';
import TickerBar from './TickerBar';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setDateStr(now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  return (
    <header className="border-b border-[var(--color-rule-strong)]">
      <TickerBar />
      
      {/* Utility Bar */}
      <div className="flex items-center justify-between px-6 py-2 text-[11px] text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)]">
        <span className="uppercase tracking-widest">{dateStr || 'Nairobi, Kenya'}</span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono">Nairobi, Kenya</span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] min-w-[44px] rounded-xs border border-[var(--color-rule)] text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] active:scale-95 transition-all cursor-pointer touch-manipulation"
          >
            {darkMode ? <Sun size={13} /> : <Moon size={13} />}
            <span className="text-[10px] font-bold uppercase tracking-wider">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* Classic Publication Masthead */}
      <div className="py-8 text-center px-4 bg-[var(--color-paper)] border-b border-[var(--color-rule)]">
        <Link href="/">
          <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[var(--color-crimson)] block mb-1">
            Ugatuzi — Kenya Devolution Intelligence
          </span>
          <h1 className="font-serif-headline text-[2.2rem] sm:text-[3.2rem] font-bold tracking-tight text-[var(--color-ink)] leading-none hover:opacity-90 transition-opacity">
            UGATUZI TERMINAL
          </h1>
          <p className="mt-2 text-[12px] text-[var(--color-ink-secondary)] font-serif italic max-w-xl mx-auto">
            Audited Devolution Intelligence • Sovereign Debt & County Fiscal Analytics • Primary Source Authority
          </p>
        </Link>
      </div>

      {/* Public Navigation */}
      <nav className="flex items-center justify-between px-6 border-b border-[var(--color-rule)] bg-[var(--color-paper-subtle)] overflow-x-auto">
        <div className="flex gap-0 -mb-px overflow-x-auto">
          {[
            { label: 'Front Page', href: '/' },
            { label: '47 Counties', href: '/counties' },
            { label: 'Data & Statistics', href: '/databank' },
            { label: 'Search', href: '/search' },
          ].map((tab, i) => (
            <Link
              key={i}
              href={tab.href}
              className="px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] hover:border-b-2 hover:border-[var(--color-ink)] transition-colors whitespace-nowrap"
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <Link
          href="/search"
          className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy)] hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          <Search size={13} />
          Search
        </Link>
      </nav>
    </header>
  );
}
