"use client";

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProvenanceDrawer from '../../components/ProvenanceDrawer';
import { vectorSearch } from '../../lib/api';
import { Search, ArrowUpRight, ShieldCheck, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [activeProvenanceId, setActiveProvenanceId] = useState(null);

  const sampleQueries = [
    "Kenya Sovereign Debt Servicing & CBK CBR Policy 2026",
    "Kakamega County infrastructure budget allocation",
    "Public Procurement Regulatory Authority audits",
    "Nairobi freight customs collection and revenue targets"
  ];

  const handleSearch = async (customQuery) => {
    const q = customQuery !== undefined ? customQuery : query;
    if (!q || !q.trim()) return;
    if (customQuery !== undefined) setQuery(customQuery);
    
    setSearching(true);
    try {
      const data = await vectorSearch(q, 6);
      setResults(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Title */}
        <div className="border-b border-[var(--color-rule-strong)] pb-4">
          <span className="section-overline">Search the Knowledge Base</span>
          <h1 className="font-serif-headline text-[2rem] font-bold text-[var(--color-ink)] mt-1">
            Search Government Documents & Reports
          </h1>
          <p className="text-[0.95rem] text-[var(--color-ink-secondary)] font-serif">
            Search across thousands of audited government documents, parliamentary reports, and published articles by topic, keyword, or question.
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-tertiary)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask a question or enter keywords (e.g. CBK benchmark interest rate 2026)..."
              className="w-full pl-10 pr-4 py-3 text-[0.95rem] bg-[var(--color-paper-subtle)] border border-[var(--color-rule-strong)] rounded-xs text-[var(--color-ink)] placeholder:text-[var(--color-ink-tertiary)] outline-none focus:border-[var(--color-ink)] transition-colors"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={searching || !query.trim()}
            className="px-6 py-3 bg-[var(--color-ink)] text-[var(--color-paper)] font-mono text-[12px] font-bold uppercase tracking-wider rounded-xs hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 whitespace-nowrap"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Suggested Topics */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider block">Try searching for:</span>
          <div className="flex gap-2 flex-wrap">
            {sampleQueries.map((sq, i) => (
              <button
                key={i}
                onClick={() => handleSearch(sq)}
                className="px-3 py-1 text-[11px] text-[var(--color-ink-secondary)] bg-[var(--color-paper-subtle)] border border-[var(--color-rule)] rounded-xs hover:border-[var(--color-rule-strong)] hover:text-[var(--color-ink)] cursor-pointer transition-colors"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {searching ? (
          <div className="py-20 text-center text-[var(--color-ink-tertiary)] text-[12px] flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-[var(--color-navy)] border-t-transparent rounded-full animate-spin" />
            <span>Searching documents...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-[var(--color-rule)] pb-2 text-[11px] font-mono text-[var(--color-ink-tertiary)] uppercase">
              <span>{results.length} results found</span>
              <span>Most relevant first</span>
            </div>

            <div className="space-y-4">
              {results.map((res, i) => {
                const scorePercent = typeof res.similarity_score === 'number' 
                  ? Math.round(res.similarity_score * 100) 
                  : res.similarity_score;
                return (
                  <div key={res.id || i} className="p-5 rounded-xs border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-xs bg-[var(--color-paper)] border border-[var(--color-rule-strong)] font-bold text-[var(--color-navy)]">
                        {scorePercent}% match
                      </span>
                      <span className="text-[var(--color-ink-tertiary)]">{res.source_name || 'Government Document'}</span>
                    </div>

                    <h4 className="font-serif-headline text-[1.15rem] font-bold text-[var(--color-ink)]">
                      {res.title}
                    </h4>

                    <p className="text-[0.9rem] text-[var(--color-ink-secondary)] leading-relaxed line-clamp-4 font-serif">
                      {res.content}
                    </p>

                    {res.id && (
                      <div className="pt-2 flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider">
                        <Link href={`/article/${res.id}`} className="text-[var(--color-ink)] hover:text-[var(--color-crimson)] flex items-center gap-1">
                          Read Article <ArrowUpRight size={13} />
                        </Link>
                        <button
                          onClick={() => setActiveProvenanceId(res.id)}
                          className="text-[var(--color-navy)] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck size={13} />
                          Check Sources
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : query && !searching ? (
          <div className="py-16 text-center border border-dashed border-[var(--color-rule)] rounded-xs p-8 text-[var(--color-ink-tertiary)] text-[0.9rem]">
            No results found for "{query}".
          </div>
        ) : null}

      </main>

      <ProvenanceDrawer
        articleId={activeProvenanceId}
        onClose={() => setActiveProvenanceId(null)}
      />

      <Footer />
    </div>
  );
}
