import React from 'react';

export function SkeletonLead() {
  return (
    <div className="border border-[var(--color-rule-strong)] bg-[var(--color-paper-subtle)] p-6 sm:p-8 rounded-xs space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--color-rule)]">
        <div className="h-3 bg-[var(--color-rule-strong)] w-24 rounded-xs" />
        <div className="h-3 bg-[var(--color-rule-strong)] w-32 rounded-xs" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-video w-full bg-[var(--color-rule-strong)] rounded-xs" />
          <div className="h-8 bg-[var(--color-rule-strong)] w-5/6 rounded-xs" />
          <div className="h-4 bg-[var(--color-rule-strong)] w-full rounded-xs" />
          <div className="h-4 bg-[var(--color-rule-strong)] w-4/5 rounded-xs" />
        </div>
        <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-[var(--color-rule)] pt-6 lg:pt-0 lg:pl-6">
          <div className="h-3 bg-[var(--color-rule-strong)] w-28 rounded-xs mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2 pb-3 border-b border-[var(--color-rule)]">
                <div className="h-3 bg-[var(--color-rule-strong)] w-full rounded-xs" />
                <div className="h-3 bg-[var(--color-rule-strong)] w-3/4 rounded-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] p-5 rounded-xs space-y-4 animate-pulse">
          <div className="aspect-video w-full bg-[var(--color-rule-strong)] rounded-xs" />
          <div className="flex gap-2">
            <div className="h-3 bg-[var(--color-rule-strong)] w-16 rounded-xs" />
            <div className="h-3 bg-[var(--color-rule-strong)] w-20 rounded-xs" />
          </div>
          <div className="h-5 bg-[var(--color-rule-strong)] w-full rounded-xs" />
          <div className="h-5 bg-[var(--color-rule-strong)] w-4/5 rounded-xs" />
          <div className="h-3 bg-[var(--color-rule-strong)] w-full rounded-xs" />
        </div>
      ))}
    </div>
  );
}
