"use client";

import React, { useState } from 'react';
import ArticleCard from './ArticleCard';

export default function CategoryFeed({ secondaryArticles }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', label: 'All Stories' },
    { id: 'FINANCE', label: 'Finance & Economy' },
    { id: 'COUNTY METRICS', label: 'County News' },
    { id: 'GOVERNANCE', label: 'Governance & Policy' },
  ];

  const filteredSecondary = secondaryArticles.filter(art => {
    if (selectedCategory === 'ALL') return true;
    return (art.category || '').toUpperCase() === selectedCategory.toUpperCase();
  });

  return (
    <div className="space-y-8">
      {/* Section Header & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-rule-strong)] pb-4">
        <div>
          <span className="section-overline">Coverage</span>
          <h3 className="font-serif-headline text-[1.5rem] font-bold text-[var(--color-ink)]">
            Latest News & Analysis
          </h3>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer border whitespace-nowrap
                ${selectedCategory === cat.id
                  ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]'
                  : 'bg-transparent text-[var(--color-ink-secondary)] border-[var(--color-rule)] hover:border-[var(--color-rule-strong)]'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Articles Feed */}
      {filteredSecondary.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSecondary.map((art, idx) => (
            <ArticleCard key={art.id || idx} article={art} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-[var(--color-rule)] rounded-xs p-8 text-[var(--color-ink-tertiary)] text-[0.9rem]">
          No stories match category "{selectedCategory}".
        </div>
      )}
    </div>
  );
}
