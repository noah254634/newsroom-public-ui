"use client";

import React from 'react';
import { resolveImageUrl } from '../lib/imageUtils';

export function EditorialEvidenceImage({
  src,
  alt = "Article photo",
  caption = "National Treasury & Planning Headquarters, Harambee Avenue.",
}) {
  const resolvedSrc = resolveImageUrl(src) || src;
  if (!resolvedSrc) return null;

  return (
    <figure className="my-8 w-full border border-[var(--color-rule-strong)] bg-[var(--color-paper-subtle)] p-2 rounded-xs">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black rounded-xs">
        <img
          src={resolvedSrc}
          alt={alt}
          onError={(e) => { e.target.src = '/central_bank.png'; }}
          className="w-full h-full object-cover grayscale-[25%] contrast-105 hover:grayscale-0 transition-all duration-500 ease-out"
        />
      </div>

      <figcaption className="mt-2.5 px-1 text-[12px] font-serif text-[var(--color-ink-secondary)] border-t border-[var(--color-rule)] pt-2">
        {caption}
      </figcaption>
    </figure>
  );
}

