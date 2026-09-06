"use client";

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ArticleCard from '../../components/ArticleCard';
import { fetchArticles } from '../../lib/api';
import { MapPin, Filter, TrendingDown, AlertCircle, BarChart2, ChevronDown } from 'lucide-react';

// ── Full 47-county fiscal data (CRA FY 25/26 equitable share + COB Q3 estimates) ──
const COUNTY_DATA = {
  'Mombasa':        { region: 'Coast',          share: 8.8,  osr: 2.9, absorption: 68, pending: 5.2,  focus: 'Port Infrastructure, Tourism, Health' },
  'Kwale':          { region: 'Coast',          share: 7.4,  osr: 0.4, absorption: 61, pending: 3.1,  focus: 'Agriculture, Blue Economy, Roads' },
  'Kilifi':         { region: 'Coast',          share: 9.4,  osr: 0.7, absorption: 61, pending: 4.8,  focus: 'Tourism, Agriculture, Health' },
  'Tana River':     { region: 'Coast',          share: 5.8,  osr: 0.2, absorption: 55, pending: 2.0,  focus: 'Irrigation, Livestock, Roads' },
  'Lamu':           { region: 'Coast',          share: 4.2,  osr: 0.3, absorption: 58, pending: 1.4,  focus: 'LAPSSET Corridor, Fisheries, Tourism' },
  'Taita Taveta':   { region: 'Coast',          share: 5.9,  osr: 0.5, absorption: 63, pending: 2.2,  focus: 'Mining, Agriculture, SGR Corridor' },
  'Garissa':        { region: 'North Eastern',  share: 7.2,  osr: 0.3, absorption: 54, pending: 3.5,  focus: 'Livestock, Water, Humanitarian' },
  'Wajir':          { region: 'North Eastern',  share: 7.8,  osr: 0.2, absorption: 50, pending: 3.8,  focus: 'Pastoralism, Drought Response, Water' },
  'Mandera':        { region: 'North Eastern',  share: 9.1,  osr: 0.2, absorption: 48, pending: 4.2,  focus: 'Pastoralism, Cross-Border Trade, Health' },
  'Marsabit':       { region: 'Rift Valley',    share: 5.7,  osr: 0.2, absorption: 56, pending: 2.3,  focus: 'Renewable Energy, Livestock, LAPSSET' },
  'Isiolo':         { region: 'Eastern',        share: 4.4,  osr: 0.3, absorption: 59, pending: 1.6,  focus: 'LAPSSET, Conservation, Livestock' },
  'Meru':           { region: 'Eastern',        share: 9.0,  osr: 1.1, absorption: 67, pending: 4.1,  focus: 'Agriculture (Miraa), Health, Roads' },
  'Tharaka-Nithi':  { region: 'Eastern',        share: 5.3,  osr: 0.4, absorption: 62, pending: 2.0,  focus: 'Agriculture, Water Harvesting, Roads' },
  'Embu':           { region: 'Eastern',        share: 6.4,  osr: 0.7, absorption: 64, pending: 2.8,  focus: 'Agriculture, Manufacturing, Health' },
  'Kitui':          { region: 'Eastern',        share: 9.2,  osr: 0.6, absorption: 60, pending: 4.0,  focus: 'Coal/Mining, Agriculture, Roads' },
  'Machakos':       { region: 'Eastern',        share: 8.1,  osr: 1.3, absorption: 69, pending: 3.6,  focus: 'Manufacturing, Horticulture, Urban Dev' },
  'Makueni':        { region: 'Eastern',        share: 7.6,  osr: 0.7, absorption: 65, pending: 3.2,  focus: 'Agriculture, County Processing, Roads' },
  'Nyandarua':      { region: 'Central',        share: 6.3,  osr: 0.8, absorption: 66, pending: 2.6,  focus: 'Dairy, Horticulture, Water' },
  'Nyeri':          { region: 'Central',        share: 6.8,  osr: 1.0, absorption: 70, pending: 2.9,  focus: 'Agri-processing, Health, Water' },
  'Kirinyaga':      { region: 'Central',        share: 5.9,  osr: 0.8, absorption: 68, pending: 2.4,  focus: 'Rice, Horticulture, Manufacturing' },
  "Murang'a":       { region: 'Central',        share: 7.9,  osr: 1.1, absorption: 67, pending: 3.3,  focus: 'Tea, Horticulture, Water Projects' },
  'Kiambu':         { region: 'Central',        share: 11.4, osr: 3.1, absorption: 72, pending: 6.8,  focus: 'Manufacturing, Real Estate, Services' },
  'Turkana':        { region: 'Rift Valley',    share: 10.8, osr: 0.3, absorption: 52, pending: 5.5,  focus: 'Oil/Energy, Fisheries, LAPSSET' },
  'West Pokot':     { region: 'Rift Valley',    share: 6.8,  osr: 0.2, absorption: 55, pending: 2.5,  focus: 'Livestock, Mining, Roads' },
  'Samburu':        { region: 'Rift Valley',    share: 4.6,  osr: 0.2, absorption: 57, pending: 1.8,  focus: 'Tourism, Livestock, Conservation' },
  'Trans Nzoia':    { region: 'Rift Valley',    share: 7.9,  osr: 0.7, absorption: 64, pending: 3.5,  focus: 'Maize, Food Security, Roads' },
  'Uasin Gishu':    { region: 'Rift Valley',    share: 7.9,  osr: 1.8, absorption: 69, pending: 3.8,  focus: 'Agri-processing, Manufacturing, SGR' },
  'Elgeyo-Marakwet':{ region: 'Rift Valley',    share: 5.7,  osr: 0.3, absorption: 60, pending: 2.1,  focus: 'Hydropower, Agriculture, Roads' },
  'Nandi':          { region: 'Rift Valley',    share: 7.1,  osr: 0.6, absorption: 63, pending: 3.0,  focus: 'Tea, Horticulture, Livestock' },
  'Baringo':        { region: 'Rift Valley',    share: 6.9,  osr: 0.4, absorption: 61, pending: 2.8,  focus: 'Livestock, Oil, Tourism' },
  'Laikipia':       { region: 'Rift Valley',    share: 5.9,  osr: 0.5, absorption: 63, pending: 2.4,  focus: 'Tourism, Livestock, Conservation' },
  'Nakuru':         { region: 'Rift Valley',    share: 9.2,  osr: 1.8, absorption: 69, pending: 4.4,  focus: 'Floriculture, Tourism, Manufacturing' },
  'Narok':          { region: 'Rift Valley',    share: 7.8,  osr: 0.9, absorption: 64, pending: 3.4,  focus: 'Tourism (Maasai Mara), Agriculture' },
  'Kajiado':        { region: 'Rift Valley',    share: 7.5,  osr: 0.8, absorption: 65, pending: 3.1,  focus: 'Real Estate, Livestock, SGR' },
  'Kericho':        { region: 'Rift Valley',    share: 7.0,  osr: 0.9, absorption: 68, pending: 2.9,  focus: 'Tea, Agri-processing, Manufacturing' },
  'Bomet':          { region: 'Rift Valley',    share: 7.1,  osr: 0.5, absorption: 63, pending: 2.8,  focus: 'Tea, Agriculture, Health' },
  'Kakamega':       { region: 'Western',        share: 11.2, osr: 0.9, absorption: 65, pending: 5.9,  focus: 'Sugar, Health, Roads' },
  'Vihiga':         { region: 'Western',        share: 6.0,  osr: 0.4, absorption: 62, pending: 2.3,  focus: 'Agriculture, Small Business, Roads' },
  'Bungoma':        { region: 'Western',        share: 9.0,  osr: 0.6, absorption: 63, pending: 4.1,  focus: 'Sugar, Horticulture, Roads' },
  'Busia':          { region: 'Western',        share: 7.2,  osr: 0.5, absorption: 60, pending: 3.2,  focus: 'Cross-Border Trade, Agriculture' },
  'Siaya':          { region: 'Nyanza',         share: 7.5,  osr: 0.6, absorption: 65, pending: 3.0,  focus: 'Fisheries, Agriculture, Health' },
  'Kisumu':         { region: 'Nyanza',         share: 8.4,  osr: 1.2, absorption: 74, pending: 3.8,  focus: 'Lake Economy, Health, Manufacturing' },
  'Homa Bay':       { region: 'Nyanza',         share: 8.3,  osr: 0.5, absorption: 63, pending: 3.6,  focus: 'Fisheries, Agriculture, Health' },
  'Migori':         { region: 'Nyanza',         share: 8.1,  osr: 0.5, absorption: 61, pending: 3.4,  focus: 'Gold Mining, Agriculture, Border Trade' },
  'Kisii':          { region: 'Nyanza',         share: 9.5,  osr: 0.8, absorption: 66, pending: 4.2,  focus: 'Agriculture, Health, Small Business' },
  'Nyamira':        { region: 'Nyanza',         share: 6.7,  osr: 0.4, absorption: 62, pending: 2.5,  focus: 'Tea, Agriculture, Health' },
  'Nairobi':        { region: 'Nairobi',        share: 19.7, osr: 8.5, absorption: 71, pending: 22.4, focus: 'Urban Infrastructure, Transport, Health' },
};

const ALL_COUNTIES = Object.keys(COUNTY_DATA).sort();

const ABSORPTION_COLOR = (pct) => {
  if (pct >= 70) return 'var(--color-emerald)';
  if (pct >= 60) return 'var(--color-amber)';
  return 'var(--color-crimson)';
};

function KpiChip({ label, value, sub, highlight }) {
  return (
    <div className="flex-1 min-w-[140px] p-4 border border-[var(--color-rule)] bg-[var(--color-paper)] space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] block">{label}</span>
      <span className={`font-mono text-[1.5rem] font-bold block ${highlight ? 'text-[var(--color-crimson)]' : 'text-[var(--color-ink)]'}`}>{value}</span>
      {sub && <span className="text-[10px] text-[var(--color-ink-tertiary)] font-mono">{sub}</span>}
    </div>
  );
}

function AbsorptionBar({ pct, animated }) {
  return (
    <div className="data-bar-track w-full">
      <div
        className="data-bar-fill"
        style={{
          width: animated ? `${pct}%` : '0%',
          backgroundColor: ABSORPTION_COLOR(pct),
          transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </div>
  );
}

function CountyProfile({ county, data }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [county]);

  return (
    <div ref={ref} className="border border-[var(--color-rule-strong)] bg-[var(--color-paper-subtle)] p-6 rounded-xs animate-fade-up">
      <div className="flex items-start justify-between mb-5 pb-4 border-b border-[var(--color-rule)]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-crimson)]">{data.region} Region</span>
          <h2 className="font-serif-headline text-[1.8rem] font-bold text-[var(--color-ink)] mt-0.5">{county} County</h2>
          <p className="text-[12px] text-[var(--color-ink-secondary)] mt-1 font-mono">{data.focus}</p>
        </div>
        <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] border border-[var(--color-rule)] px-2 py-1 rounded-xs hidden sm:block">
          Budget Year 2025/26
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] block">Government Funding</span>
          <span className="font-mono text-[1.4rem] font-bold text-[var(--color-ink)]">KSh {data.share}B</span>
          <span className="text-[10px] text-[var(--color-ink-tertiary)] font-mono">National Allocation</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] block">Locally Raised Revenue</span>
          <span className="font-mono text-[1.4rem] font-bold text-[var(--color-ink)]">KSh {data.osr}B</span>
          <span className="text-[10px] text-[var(--color-ink-tertiary)] font-mono">Local Collection</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] block">Budget Spent</span>
          <span className="font-mono text-[1.4rem] font-bold" style={{ color: ABSORPTION_COLOR(data.absorption) }}>{data.absorption}%</span>
          <AbsorptionBar pct={data.absorption} animated={animated} />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] block">Pending Bills</span>
          <span className="font-mono text-[1.4rem] font-bold text-[var(--color-crimson)]">KSh {data.pending}B</span>
          <span className="text-[10px] text-[var(--color-ink-tertiary)] font-mono">Estimated outstanding</span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-[var(--color-ink-tertiary)] pt-3 border-t border-[var(--color-rule)] flex flex-wrap gap-x-6 gap-y-1">
        <span>Source: Commission on Revenue Allocation (CRA) Circular 2025</span>
        <span>Controller of Budget FY 24/25 Q3 Implementation Report</span>
        <span>KNBS Economic Survey 2025</span>
      </div>
    </div>
  );
}

export default function CountiesHub() {
  const [articles, setArticles] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles('PUBLISHED')
      .then(data => {
        // Deduplicate by headline
        const seen = new Set();
        const deduped = (data || []).filter(art => {
          const key = (art.headline || art.title || '').toLowerCase().trim();
          if (!key || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setArticles(deduped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = articles.filter(art => {
    if (selectedCounty === 'All') return true;
    return (art.county || 'National').toLowerCase() === selectedCounty.toLowerCase();
  });

  const countyData = selectedCounty !== 'All' ? COUNTY_DATA[selectedCounty] : null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">

        {/* ── Page Header ── */}
        <div className="border-b border-[var(--color-rule-strong)] pb-5">
          <span className="section-overline">All 47 County Governments · Kenya</span>
          <h1 className="font-serif-headline text-[2rem] font-bold text-[var(--color-ink)] mt-1">
            Kenya Counties Hub
          </h1>
          <p className="text-[0.95rem] text-[var(--color-ink-secondary)] max-w-2xl font-serif mt-1">
            Government funding allocations, locally raised revenue, budget spending rates, and outstanding bills across all 47 counties.
          </p>
        </div>

        {/* ── Devolution KPI Strip ── */}
        <div className="flex flex-wrap gap-px border border-[var(--color-rule)] bg-[var(--color-rule)] rounded-xs overflow-hidden">
          <KpiChip label="Total County Government Funding" value="KSh 400.1B" sub="CRA Approved Budget 2025/26" />
          <KpiChip label="Unpaid Government Bills" value="KSh 180B+" sub="Across all counties" highlight />
          <KpiChip label="Average Budget Spent" value="63.4%" sub="As of Q3 2024/25" />
          <KpiChip label="Counties Spending Under 60%" value="11 / 47" sub="Behind on delivery" highlight />
        </div>

        {/* ── County Selector ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] flex items-center gap-1.5 font-mono">
              <Filter size={11} />
              Select a county
            </span>
            {selectedCounty !== 'All' && (
              <button
                onClick={() => setSelectedCounty('All')}
                className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] transition-colors font-mono"
              >
                ← Clear Filter
              </button>
            )}
          </div>

          {/* All-counties button */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCounty('All')}
              className={`county-pill ${selectedCounty === 'All' ? 'active' : ''}`}
            >
              All 47 Counties
            </button>
            {ALL_COUNTIES.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCounty(c)}
                className={`county-pill ${selectedCounty === c ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── County Profile Card ── */}
        {countyData && (
          <CountyProfile county={selectedCounty} data={countyData} />
        )}

        {/* ── Dispatches Grid ── */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[var(--color-rule)] mb-6">
            <span className="text-[11px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
              {filtered.length} article{filtered.length !== 1 ? 's' : ''} · {selectedCounty === 'All' ? 'All Counties' : `${selectedCounty} County`}
            </span>
            {loading && (
              <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] animate-pulse">Loading…</span>
            )}
          </div>

          {loading ? (
            <div className="py-20 text-center text-[var(--color-ink-tertiary)] font-mono text-[12px]">
              Loading county dispatches…
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((art, idx) => (
                <ArticleCard key={art.id || idx} article={art} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-[var(--color-rule)] rounded-xs p-8 space-y-3">
              <MapPin size={24} className="mx-auto text-[var(--color-ink-tertiary)]" />
              <p className="text-[var(--color-ink-tertiary)] text-[0.9rem]">
                No published dispatches tagged for <strong>{selectedCounty}</strong> yet.
              </p>
              <p className="text-[11px] text-[var(--color-ink-tertiary)]">
                No articles have been published for {selectedCounty} yet.
              </p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
