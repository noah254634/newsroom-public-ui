"use client";

/**
 * FeaturedHero component.
 * Renders active featured stories in a rotating carousel or a single lead hero.
 * Periodically polls /api/featured for real-time editorial updates.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveImageUrl } from '../lib/imageUtils';

const ROTATION_MS = 7000;
const POLL_MS     = 30000;

function getImage(article) {
  return (
    resolveImageUrl(article?.cover_image_url) ||
    ((article?.headline || article?.title || '').toLowerCase().includes('nairobi')
      ? '/nairobi_skyline.png'
      : '/central_bank.png')
  );
}

function timeAgo(isoStr) {
  if (!isoStr) return null;
  const diffMs = Date.now() - new Date(isoStr).getTime();
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m ago` : `${m}m ago`;
}

// ── Static single-article hero (no carousel) ─────────────────────────────
function StaticHero({ article, label = 'Top Story', sublabel }) {
  const coverImg = getImage(article);
  return (
    <section className="border border-[var(--color-rule-strong)] bg-[var(--color-paper)] p-6 sm:p-8 rounded-xs shadow-xs">
      <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-widest pb-4 border-b border-[var(--color-rule)] mb-6">
        <span className="flex items-center gap-1.5 font-bold text-[var(--color-crimson)]">
          <Sparkles size={12} />
          {label}
        </span>
        <span className="flex items-center gap-3">
          {sublabel && <span className="hidden sm:inline">{sublabel}</span>}
          <span>{article.category || 'FINANCE'} • {article.county || 'National'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <Link href={`/article/${article.id}`} className="block overflow-hidden rounded-xs border border-[var(--color-rule)] aspect-video w-full bg-[var(--color-paper-subtle)]">
            <img src={coverImg} alt={article.headline || article.title} className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300" />
          </Link>

          <h2 className="font-serif-headline text-[1.8rem] sm:text-[2.2rem] font-bold leading-tight text-[var(--color-ink)] hover:text-[var(--color-crimson)] transition-colors">
            <Link href={`/article/${article.id}`}>{article.headline || article.title}</Link>
          </h2>

          <p className="text-[1.02rem] text-[var(--color-ink-secondary)] font-serif leading-relaxed">{article.subheadline}</p>

          {article.why_it_matters && (
            <div className="p-4 rounded-xs bg-[var(--color-paper-subtle)] border-l-[3px] border-[var(--color-navy)] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-navy)]">Why It Matters</span>
              <p className="text-[0.88rem] text-[var(--color-ink)] leading-relaxed">{article.why_it_matters}</p>
            </div>
          )}

          <div className="pt-2">
            <Link href={`/article/${article.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ink)] text-[var(--color-paper)] text-[12px] font-bold uppercase tracking-wider rounded-xs hover:opacity-90 transition-opacity touch-manipulation">
              <span>Read Story</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[var(--color-rule)] pt-6 lg:pt-0 lg:pl-6 space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)] pb-2">Key Highlights</h3>
          {Array.isArray(article.short_version) && article.short_version.length > 0 ? (
            <div className="space-y-3 text-[12px]">
              {article.short_version.slice(0, 4).map((b, idx) => (
                <div key={idx} className="space-y-1 pb-3 border-b border-[var(--color-rule)] last:border-0">
                  <p className="font-medium text-[var(--color-ink)] leading-snug">{b.point || b.statement}</p>
                  {b.citation && <span className="text-[10px] font-mono text-[var(--color-navy)] block">Source: {b.citation}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[var(--color-ink-tertiary)] italic">Key takeaways integrated in main article.</p>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Rotating carousel (2+ featured articles) ─────────────────────────────
function CarouselHero({ articles }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fading, setFading]           = useState(false);
  const rotationRef = useRef(null);
  const activeRef   = useRef(0);
  const count       = articles.length;

  const goTo = useCallback((nextIdx) => {
    if (nextIdx === activeRef.current) return;
    setFading(true);
    setTimeout(() => {
      activeRef.current = nextIdx;
      setActiveIndex(nextIdx);
      setFading(false);
    }, 300);
  }, []);

  const startRotation = useCallback(() => {
    if (rotationRef.current) clearInterval(rotationRef.current);
    rotationRef.current = setInterval(() => {
      goTo((activeRef.current + 1) % count);
    }, ROTATION_MS);
  }, [count, goTo]);

  useEffect(() => {
    startRotation();
    return () => clearInterval(rotationRef.current);
  }, [startRotation]);

  const handleNav = (idx) => {
    goTo(idx);
    startRotation(); // restart 7s countdown from this slide
  };

  const article  = articles[activeIndex];
  const coverImg = getImage(article);

  return (
    <section className="relative border border-[var(--color-rule-strong)] bg-[var(--color-paper)] rounded-xs shadow-xs overflow-hidden">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 px-4 pt-2">
        {articles.map((_, idx) => (
          <button key={idx} onClick={() => handleNav(idx)} className="flex-1 h-0.5 rounded-full overflow-hidden bg-[var(--color-rule-strong)] cursor-pointer" aria-label={`Story ${idx + 1}`}>
            <div className={`h-full bg-[var(--color-crimson)] ${idx === activeIndex ? 'animate-progress-fill' : idx < activeIndex ? 'w-full' : 'w-0'}`}
              style={idx === activeIndex ? { animationDuration: `${ROTATION_MS}ms` } : {}} />
          </button>
        ))}
      </div>

      <div className="p-6 sm:p-8 transition-opacity duration-300" style={{ opacity: fading ? 0 : 1 }}>
        {/* Top bar */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-widest pb-4 border-b border-[var(--color-rule)] mb-6">
          <span className="flex items-center gap-1.5 font-bold text-[var(--color-crimson)]">
            <Sparkles size={12} />
            Featured {activeIndex + 1} / {count}
          </span>
          <span className="flex items-center gap-3">
            {article.featured_at && <span className="hidden sm:inline">Featured {timeAgo(article.featured_at)}</span>}
            <span>{article.category || 'FINANCE'} • {article.county || 'National'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <Link href={`/article/${article.id}`} className="block overflow-hidden rounded-xs border border-[var(--color-rule)] aspect-video w-full bg-[var(--color-paper-subtle)]">
              <img src={coverImg} alt={article.headline || article.title} className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300" />
            </Link>

            <h2 className="font-serif-headline text-[1.8rem] sm:text-[2.2rem] font-bold leading-tight text-[var(--color-ink)] hover:text-[var(--color-crimson)] transition-colors">
              <Link href={`/article/${article.id}`}>{article.headline || article.title}</Link>
            </h2>

            <p className="text-[1.02rem] text-[var(--color-ink-secondary)] font-serif leading-relaxed">{article.subheadline}</p>

            {article.why_it_matters && (
              <div className="p-4 rounded-xs bg-[var(--color-paper-subtle)] border-l-[3px] border-[var(--color-navy)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-navy)]">Why It Matters</span>
                <p className="text-[0.88rem] text-[var(--color-ink)] leading-relaxed">{article.why_it_matters}</p>
              </div>
            )}

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <Link href={`/article/${article.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-ink)] text-[var(--color-paper)] text-[12px] font-bold uppercase tracking-wider rounded-xs hover:opacity-90 transition-opacity touch-manipulation">
                <span>Read Story</span><ArrowRight size={13} />
              </Link>
              <div className="flex items-center gap-1">
                <button onClick={() => handleNav((activeIndex - 1 + count) % count)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[var(--color-rule)] rounded-xs text-[var(--color-ink-secondary)] hover:border-[var(--color-rule-strong)] transition-colors touch-manipulation cursor-pointer" aria-label="Previous">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => handleNav((activeIndex + 1) % count)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center border border-[var(--color-rule)] rounded-xs text-[var(--color-ink-secondary)] hover:border-[var(--color-rule-strong)] transition-colors touch-manipulation cursor-pointer" aria-label="Next">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-[var(--color-rule)] pt-6 lg:pt-0 lg:pl-6 space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] border-b border-[var(--color-rule)] pb-2">Key Highlights</h3>
            {Array.isArray(article.short_version) && article.short_version.length > 0 ? (
              <div className="space-y-3 text-[12px]">
                {article.short_version.slice(0, 4).map((b, idx) => (
                  <div key={idx} className="space-y-1 pb-3 border-b border-[var(--color-rule)] last:border-0">
                    <p className="font-medium text-[var(--color-ink)] leading-snug">{b.point || b.statement}</p>
                    {b.citation && <span className="text-[10px] font-mono text-[var(--color-navy)] block">Source: {b.citation}</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[var(--color-ink-tertiary)] italic">Key takeaways integrated in main article.</p>
            )}
            {/* Dot indicators */}
            <div className="flex items-center gap-2 pt-2">
              {articles.map((_, idx) => (
                <button key={idx} onClick={() => handleNav(idx)} className={`w-2 h-2 rounded-full transition-all touch-manipulation cursor-pointer ${idx === activeIndex ? 'bg-[var(--color-crimson)] scale-125' : 'bg-[var(--color-rule-strong)] hover:bg-[var(--color-ink-tertiary)]'}`} aria-label={`Story ${idx + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Root export: decides which hero to show ───────────────────────────────
export default function FeaturedHero({ fallback }) {
  const [featured, setFeatured] = useState(null); // null = loading
  const [loading, setLoading]   = useState(true);

  const fetchFeatured = useCallback(async () => {
    try {
      const res = await fetch('/api/featured', { cache: 'no-store' });
      if (res.ok) setFeatured(await res.json());
      else setFeatured([]);
    } catch {
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
    const poll = setInterval(fetchFeatured, POLL_MS);
    return () => clearInterval(poll);
  }, [fetchFeatured]);

  // Loading skeleton — avoids layout shift
  if (loading) {
    return (
      <div className="border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] rounded-xs p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-28 bg-[var(--color-rule-strong)] rounded" />
          <div className="aspect-video w-full lg:w-7/12 bg-[var(--color-rule)] rounded" />
          <div className="h-7 w-3/4 bg-[var(--color-rule-strong)] rounded" />
          <div className="h-4 w-1/2 bg-[var(--color-rule)] rounded" />
        </div>
      </div>
    );
  }

  // ① Editor has featured articles → carousel or single featured hero
  if (featured && featured.length > 1) {
    return <CarouselHero articles={featured} />;
  }
  if (featured && featured.length === 1) {
    return <StaticHero article={featured[0]} label="Featured Story" sublabel={`Featured ${timeAgo(featured[0].featured_at)}`} />;
  }

  // ② Nothing featured → auto-fallback to most recent article (the "Top Story")
  if (fallback) {
    return <StaticHero article={fallback} label="Top Story" />;
  }

  return null;
}
