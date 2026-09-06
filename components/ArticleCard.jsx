"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { resolveImageUrl } from '../lib/imageUtils';

export default function ArticleCard({ article }) {
  const artId = article.id;
  const headline = article.headline || article.title;
  const subheadline = article.subheadline || '';
  const county = article.county || 'National';
  const category = article.category || 'FINANCE';
  const readTime = article.read_time_minutes || 3;
  const publishedAt = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  // Resolve documentary thumbnail image with category fallback
  const getFallbackImage = () => {
    const titleLower = (headline || '').toLowerCase();
    const catLower = (category || '').toLowerCase();
    if (titleLower.includes('nairobi') || county.toLowerCase().includes('nairobi')) {
      return '/nairobi_skyline.png';
    }
    if (titleLower.includes('central bank') || titleLower.includes('monetary') || catLower === 'finance') {
      return '/central_bank.png';
    }
    return '/devolution.png';
  };

  const coverImg = resolveImageUrl(article.cover_image_url) || getFallbackImage();
  const shortBullets = Array.isArray(article.short_version) ? article.short_version.slice(0, 2) : [];

  return (
    <article className="group flex flex-col justify-between border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 rounded-xs hover:border-[var(--color-rule-strong)] transition-all">
      
      <div className="space-y-3">
        
        {/* Split Top Header: Category/Meta on Left, Docked High-Density Wire Image Thumbnail on Right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Category & Meta Header */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-[var(--color-ink-tertiary)] uppercase tracking-wider font-mono">
              <span className="px-2 py-0.5 rounded-xs bg-[var(--color-paper-subtle)] border border-[var(--color-rule)] text-[var(--color-navy)] font-bold">
                {category}
              </span>
              <span className="text-[var(--color-rule-strong)]">•</span>
              <span className="flex items-center gap-1 font-semibold text-[var(--color-ink-secondary)]">
                <MapPin size={10} />
                {county}
              </span>
              {publishedAt && (
                <>
                  <span className="text-[var(--color-rule-strong)]">•</span>
                  <span>{publishedAt}</span>
                </>
              )}
              <span className="text-[var(--color-rule-strong)]">•</span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {readTime} min
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-serif-headline text-[1.18rem] sm:text-[1.3rem] font-bold leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-crimson)] transition-colors">
              <Link href={`/article/${artId}`}>
                {headline}
              </Link>
            </h3>
          </div>

          {/* Right-Docked High-Density Wire Thumbnail */}
          <Link
            href={`/article/${artId}`}
            className="flex-shrink-0 w-[110px] sm:w-[130px] aspect-[16/10] overflow-hidden rounded-xs border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] relative"
          >
            <img
              src={coverImg}
              alt={headline}
              onError={(e) => { e.target.src = '/central_bank.png'; }}
              className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
            />
            <div className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono text-white px-1 uppercase tracking-wider font-bold">
              PHOTO
            </div>
          </Link>
        </div>

        {/* Subheadline / Excerpt */}
        {subheadline && (
          <p className="text-[0.88rem] text-[var(--color-ink-secondary)] leading-relaxed line-clamp-2">
            {subheadline}
          </p>
        )}

        {/* Key Highlights */}
        {shortBullets.length > 0 && (
          <div className="p-3 rounded-xs bg-[var(--color-paper-subtle)] border-l-2 border-[var(--color-navy)] space-y-1 text-[11px]">
            {shortBullets.map((b, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="font-bold text-[var(--color-navy)]">•</span>
                <span className="text-[var(--color-ink)] font-medium leading-snug line-clamp-1">
                  {b.point || b.statement}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clean Editorial Link */}
      <div className="pt-4 mt-3 border-t border-[var(--color-rule)] flex items-center justify-between">
        <Link
          href={`/article/${artId}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)] group-hover:text-[var(--color-crimson)] transition-colors font-mono"
        >
          <span>Read Story</span>
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
