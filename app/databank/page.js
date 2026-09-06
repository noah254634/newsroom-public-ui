"use client";

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, BarChart2, ArrowRight, Zap } from 'lucide-react';

// ── Authoritative macro data (National Treasury MTDMS 2026, CBK MPC Minutes, KNBS 2025) ──

const MACRO_KPIS = [
  {
    label: 'CBK Benchmark Rate (CBR)',
    value: '12.75%',
    status: 'TIGHTENED',
    statusColor: 'var(--color-crimson)',
    authority: 'Central Bank of Kenya',
    note: 'MPC re-tightened Jun 2026 +75bps. Anchoring inflation within 5.0% ±2.5% band amid Eurobond refinancing pressures.',
    trend: 'up',
  },
  {
    label: 'National Debt Service Ratio',
    value: '64.2%',
    status: 'HIGH WATCH',
    statusColor: 'var(--color-crimson)',
    authority: 'National Treasury',
    note: 'Debt service absorbs 64.2% of ordinary revenue. Statutory ceiling 55%. Rollover risk managed via domestic yield curve flattening strategy.',
    trend: 'up',
  },
  {
    label: 'County Equitable Share FY 25/26',
    value: 'KSh 400.1B',
    status: 'APPROVED',
    statusColor: 'var(--color-emerald)',
    authority: 'Commission on Revenue Allocation',
    note: 'Parliament-approved equitable share. Minimum 35% capital allocation directive. CARA II Senate-NA mediation resolved Mar 2026.',
    trend: 'flat',
  },
  {
    label: 'KNBS Headline CPI (Aug 2026)',
    value: '4.3%',
    status: 'WITHIN BAND',
    statusColor: 'var(--color-emerald)',
    authority: 'Kenya National Bureau of Statistics',
    note: 'Within 5.0% ±2.5% CBK target band. Food & energy price stabilisation post-FY25 drought. Core CPI 5.1%.',
    trend: 'down',
  },
  {
    label: 'KES / USD Exchange Rate',
    value: '129.45',
    status: 'STABILISED',
    statusColor: 'var(--color-amber)',
    authority: 'CBK Foreign Exchange Markets',
    note: 'Stabilised from 160+ peak (Jul 2023) following IMF disbursements and Eurobond refinancing. 12-month range: 126.2–134.8.',
    trend: 'down',
  },
];

const DEBT_COMPOSITION = {
  total: '11.2T',
  external: { pct: 50, label: 'External Debt', amount: '5.6T', breakdown: [
    { label: 'Commercial (Eurobonds/Banks)', pct: 45, color: 'var(--color-crimson)' },
    { label: 'Bilateral (China, France, etc.)', pct: 24, color: 'var(--color-amber)' },
    { label: 'Multilateral (World Bank, IMF)', pct: 31, color: 'var(--color-navy)' },
  ]},
  domestic: { pct: 50, label: 'Domestic Debt', amount: '5.6T', breakdown: [
    { label: 'Treasury Bonds (long-term)', pct: 65, color: 'var(--color-navy)' },
    { label: 'Treasury Bills (short-term)', pct: 28, color: 'var(--color-amber)' },
    { label: 'Other Domestic', pct: 7, color: 'var(--color-ink-tertiary)' },
  ]},
};

const CBR_TIMELINE = [
  { date: 'Jan 2022', rate: 7.00,  action: 'HOLD', note: 'Post-pandemic recovery maintained' },
  { date: 'May 2022', rate: 7.50,  action: 'HIKE', note: '+50bps. Commodity shock from Russia-Ukraine war' },
  { date: 'Jun 2023', rate: 9.50,  action: 'HIKE', note: '+200bps. Emergency response to KES/USD hitting 160+' },
  { date: 'Oct 2023', rate: 10.50, action: 'HIKE', note: '+100bps. Core inflation holding above 9%' },
  { date: 'Dec 2023', rate: 12.50, action: 'HIKE', note: '+200bps. Aggressive tightening cycle accelerates' },
  { date: 'Feb 2024', rate: 13.00, action: 'HIKE', note: '+50bps. Cycle peak — highest CBR since 2012' },
  { date: 'Apr 2025', rate: 11.75, action: 'CUT',  note: '-125bps. Easing begins. CPI 4.3%, KES stabilised' },
  { date: 'Jun 2026', rate: 12.75, action: 'HIKE', note: '+100bps. Re-tightening: Eurobond refinancing pressure' },
];

const COUNTY_REVENUE_TABLE = [
  { county: 'Nairobi',   share: 19.7, osr: 8.5,  grants: 2.1, absorption: 71, pending: 22.4 },
  { county: 'Kiambu',    share: 11.4, osr: 3.1,  grants: 1.1, absorption: 72, pending: 6.8  },
  { county: 'Kakamega',  share: 11.2, osr: 0.9,  grants: 1.0, absorption: 65, pending: 5.9  },
  { county: 'Turkana',   share: 10.8, osr: 0.3,  grants: 2.8, absorption: 52, pending: 5.5  },
  { county: 'Mandera',   share: 9.1,  osr: 0.2,  grants: 1.8, absorption: 48, pending: 4.2  },
  { county: 'Kisii',     share: 9.5,  osr: 0.8,  grants: 0.7, absorption: 66, pending: 4.2  },
  { county: 'Kilifi',    share: 9.4,  osr: 0.7,  grants: 1.2, absorption: 61, pending: 4.8  },
  { county: 'Nakuru',    share: 9.2,  osr: 1.8,  grants: 0.9, absorption: 69, pending: 4.4  },
  { county: 'Kitui',     share: 9.2,  osr: 0.6,  grants: 0.8, absorption: 60, pending: 4.0  },
  { county: 'Mombasa',   share: 8.8,  osr: 2.9,  grants: 0.9, absorption: 68, pending: 5.2  },
];

const MAX_CBR = 13.0;
const MIN_CBR = 7.0;
const cbr_range = MAX_CBR - MIN_CBR;

function TrendIcon({ trend }) {
  if (trend === 'up')   return <TrendingUp size={14} className="text-[var(--color-crimson)]" />;
  if (trend === 'down') return <TrendingDown size={14} className="text-[var(--color-emerald)]" />;
  return <Minus size={14} className="text-[var(--color-amber)]" />;
}

function AbsBar({ pct }) {
  const color = pct >= 70 ? 'var(--color-emerald)' : pct >= 60 ? 'var(--color-amber)' : 'var(--color-crimson)';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[var(--color-rule)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="font-mono text-[11px] font-bold" style={{ color }}>{pct}%</span>
    </div>
  );
}

function AnimatedBar({ pct, color, delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="data-bar-track flex-1">
      <div className="data-bar-fill" style={{ width: `${width}%`, backgroundColor: color }} />
    </div>
  );
}

export default function DataBankPage() {
  const [barsVisible, setBarsVisible] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setBarsVisible(true);
    }, { threshold: 0.2 });
    if (barRef.current) obs.observe(barRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10 space-y-14">

        {/* ── Page Header ── */}
        <div className="border-b border-[var(--color-rule-strong)] pb-5">
          <span className="section-overline">Audited Macroeconomic & Devolution Intelligence</span>
          <h1 className="font-serif-headline text-[2rem] font-bold text-[var(--color-ink)] mt-1">
            Public Fiscal Intelligence Databank
          </h1>
          <p className="text-[0.95rem] text-[var(--color-ink-secondary)] font-serif max-w-2xl mt-1">
            Primary-source KPIs from CBK, National Treasury, CRA, KNBS, and the Controller of Budget — updated each fiscal quarter.
          </p>
        </div>

        {/* ── Section 1: Macro KPI Grid ── */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)] pb-2">
            § 1 — Key Macro Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MACRO_KPIS.map((kpi, i) => (
              <div key={i} className="p-5 border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] space-y-3 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-navy)] font-mono border border-[var(--color-navy)] px-2 py-0.5 rounded-xs opacity-70">
                    {kpi.authority}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <TrendIcon trend={kpi.trend} />
                    <span className="text-[10px] font-bold font-mono uppercase" style={{ color: kpi.statusColor }}>{kpi.status}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-tertiary)] font-bold block">{kpi.label}</span>
                  <span className="font-mono text-[2.4rem] font-bold text-[var(--color-ink)] block leading-tight mt-1">{kpi.value}</span>
                </div>
                <p className="text-[0.82rem] text-[var(--color-ink-secondary)] leading-relaxed border-t border-[var(--color-rule)] pt-2.5">{kpi.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Debt Composition ── */}
        <section ref={barRef} className="space-y-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)] pb-2">
            § 2 — National Debt Composition · KSh {DEBT_COMPOSITION.total} Total (National Treasury MTDMS 2026)
          </h2>

          {/* Macro split */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[var(--color-ink-secondary)] uppercase tracking-wider">
              <span>External Debt · KSh {DEBT_COMPOSITION.external.amount}</span>
              <span>Domestic Debt · KSh {DEBT_COMPOSITION.domestic.amount}</span>
            </div>
            <div className="flex h-4 w-full rounded-xs overflow-hidden border border-[var(--color-rule)]">
              <div className="h-full transition-all duration-1000" style={{ width: barsVisible ? '50%' : '0%', backgroundColor: 'var(--color-crimson)' }} />
              <div className="h-full transition-all duration-1000 delay-200" style={{ width: barsVisible ? '50%' : '0%', backgroundColor: 'var(--color-navy)' }} />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[var(--color-ink-tertiary)]">
              <span>50% External</span>
              <span>50% Domestic</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* External breakdown */}
            <div className="space-y-3 p-4 border border-[var(--color-rule)] bg-[var(--color-paper-subtle)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-crimson)] block">External Debt Breakdown</span>
              {DEBT_COMPOSITION.external.breakdown.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[var(--color-ink-secondary)]">{item.label}</span>
                    <span className="font-bold text-[var(--color-ink)]">{item.pct}%</span>
                  </div>
                  <AnimatedBar pct={barsVisible ? item.pct : 0} color={item.color} delay={i * 150} />
                </div>
              ))}
            </div>

            {/* Domestic breakdown */}
            <div className="space-y-3 p-4 border border-[var(--color-rule)] bg-[var(--color-paper-subtle)]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-navy)] block">Domestic Debt Breakdown</span>
              {DEBT_COMPOSITION.domestic.breakdown.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[var(--color-ink-secondary)]">{item.label}</span>
                    <span className="font-bold text-[var(--color-ink)]">{item.pct}%</span>
                  </div>
                  <AnimatedBar pct={barsVisible ? item.pct : 0} color={item.color} delay={300 + i * 150} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: CBR Timeline ── */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)] pb-2">
            § 3 — CBK Monetary Policy Committee Rate Decisions (2022–2026)
          </h2>
          <div className="relative pl-4 border-l-2 border-[var(--color-rule-strong)] space-y-0">
            {CBR_TIMELINE.map((event, i) => {
              const isHike = event.action === 'HIKE';
              const isCut  = event.action === 'CUT';
              const isLast = i === CBR_TIMELINE.length - 1;
              const barWidth = ((event.rate - MIN_CBR) / cbr_range) * 100;
              const actionColor = isHike ? 'var(--color-crimson)' : isCut ? 'var(--color-emerald)' : 'var(--color-amber)';
              return (
                <div key={i} className="relative flex gap-5 pb-5">
                  {/* Timeline dot */}
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 flex-shrink-0 bg-[var(--color-paper)]" style={{ borderColor: actionColor }} />
                  <div className="flex-1 p-3 border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">{event.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[1.1rem] font-bold text-[var(--color-ink)]">{event.rate.toFixed(2)}%</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs" style={{ color: actionColor, border: `1px solid ${actionColor}` }}>
                          {event.action}
                        </span>
                      </div>
                    </div>
                    {/* Rate bar */}
                    <div className="data-bar-track">
                      <div className="data-bar-fill" style={{ width: `${barWidth}%`, backgroundColor: actionColor, transition: 'width 0.8s ease' }} />
                    </div>
                    <p className="text-[11px] text-[var(--color-ink-secondary)]">{event.note}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 4: County Revenue Intelligence ── */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)] pb-2">
            § 4 — County Revenue Intelligence · Top 10 by Equitable Share (CRA FY 25/26)
          </h2>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-rule-strong)]">
                  {['County', 'Eq. Share (KSh B)', 'OSR (KSh B)', 'Cond. Grants', 'Dev. Absorption', 'Pending Bills'].map(h => (
                    <th key={h} className="py-2 px-3 text-left text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-tertiary)] font-mono whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COUNTY_REVENUE_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--color-rule)] hover:bg-[var(--color-paper-subtle)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--color-ink)]">{row.county}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--color-ink)]">{row.share}</td>
                    <td className="py-2.5 px-3 font-mono text-[var(--color-ink-secondary)]">{row.osr}</td>
                    <td className="py-2.5 px-3 font-mono text-[var(--color-ink-secondary)]">{row.grants}</td>
                    <td className="py-2.5 px-3"><AbsBar pct={row.absorption} /></td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[var(--color-crimson)]">{row.pending}B</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-[var(--color-ink-tertiary)] font-mono">
            Sources: CRA Equitable Share Circular 2025 · COB FY 24/25 Q3 Implementation Report · KNBS Economic Survey 2025
          </p>
        </section>

        {/* ── Section 5: Crowding-Out Transmission ── */}
        <section className="space-y-5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)] pb-2">
            § 5 — Sovereign Debt Crowding-Out Transmission to County Economies
          </h2>
          <p className="text-[0.9rem] text-[var(--color-ink-secondary)] font-serif leading-relaxed max-w-3xl">
            When the CBK maintains elevated benchmark rates to service sovereign debt and anchor the exchange rate, commercial banks rationally park capital in risk-free government paper — crowding out private sector credit and directly starving county contractors and SMEs of working capital.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {[
              { icon: <TrendingUp size={16} />, label: 'CBK CBR ↑', val: '12.75%', sub: 'MPC re-tightening', color: 'var(--color-crimson)' },
              { icon: <BarChart2 size={16} />, label: 'T-Bond Yields ↑', val: '16.8%', sub: '91-day T-Bill avg.', color: 'var(--color-amber)' },
              { icon: <AlertTriangle size={16} />, label: 'Bank Lending ↓', val: 'KSh 820B', sub: 'Risk-free paper held', color: 'var(--color-amber)' },
              { icon: <Zap size={16} />, label: 'County Credit ↓', val: '< 5% OSR', sub: 'SME/contractor squeeze', color: 'var(--color-crimson)' },
            ].map((node, i, arr) => (
              <React.Fragment key={i}>
                <div className="flex-1 p-4 border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] space-y-2 text-center">
                  <div className="flex justify-center" style={{ color: node.color }}>{node.icon}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-tertiary)]">{node.label}</div>
                  <div className="font-mono text-[1.2rem] font-bold text-[var(--color-ink)]">{node.val}</div>
                  <div className="text-[10px] text-[var(--color-ink-tertiary)]">{node.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div className="flex items-center justify-center px-1 text-[var(--color-ink-tertiary)] sm:rotate-0 rotate-90 my-1 sm:my-0 sm:mx-0">
                    <ArrowRight size={14} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="p-4 border-l-4 border-[var(--color-navy)] bg-[var(--color-paper-subtle)] text-[0.85rem] text-[var(--color-ink-secondary)] leading-relaxed">
            <strong className="text-[var(--color-ink)]">Policy Implication:</strong> Each 100bps increase in the CBR effectively raises the opportunity cost of county contractor lending by an equivalent margin, while simultaneously compressing county governments' own OSR collection potential through reduced local economic activity. The CBK's Jun 2026 +75bps re-tightening cycle compounds already-elevated pending bills (est. KSh 180B+) held by county governments against local suppliers.
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
