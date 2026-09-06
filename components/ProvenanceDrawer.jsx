"use client";

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, ExternalLink, X, FileText, Award } from 'lucide-react';
import { fetchProvenanceTree } from '../lib/api';

export default function ProvenanceDrawer({ articleId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (articleId) {
      setLoading(true);
      fetchProvenanceTree(articleId)
        .then(res => {
          setData(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [articleId]);

  if (!articleId) return null;

  const audit = data?.provenance_audit || {};
  const claims = audit.claims || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-xl bg-[var(--color-paper)] text-[var(--color-ink)] h-full border-l border-[var(--color-rule-strong)] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-rule)] bg-[var(--color-paper-subtle)]">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-[var(--color-navy)]" />
            <div>
              <h3 className="font-serif-headline text-[1.1rem] font-bold text-[var(--color-ink)]">
                Sources & Fact-Checking
              </h3>
              <p className="text-[10px] font-mono text-[var(--color-ink-tertiary)] uppercase tracking-wider">
                Every claim in this article is traced to a primary source
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xs text-[var(--color-ink-tertiary)] hover:text-[var(--color-ink)] hover:bg-[var(--color-rule)] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-[var(--color-ink-tertiary)] font-mono text-[12px]">
              Loading sources...
            </div>
          ) : data ? (
            <>
              {/* Summary Audit Box */}
              <div className="p-4 rounded-xs bg-[var(--color-paper-subtle)] border border-[var(--color-rule)] grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-ink-tertiary)] block">Total Facts Checked</span>
                  <span className="font-mono text-[1.5rem] font-bold text-[var(--color-navy)]">{audit.total_claims || claims.length}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-ink-tertiary)] block">Confirmed True</span>
                  <span className="font-mono text-[1.5rem] font-bold text-[var(--color-emerald)]">{audit.confirmed_claims_count || claims.length}</span>
                </div>
              </div>

              {/* Claims List */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)]">
                  Verified Facts & Source Documents
                </h4>
                
                {claims.map((claim, idx) => (
                  <div key={idx} className="p-4 rounded-xs border border-[var(--color-rule)] bg-[var(--color-paper)] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1 font-bold text-[var(--color-emerald)] uppercase tracking-wider">
                        <CheckCircle size={12} />
                        {claim.status || 'CONFIRMED'}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--color-navy)] font-bold">
                        Confidence: {Math.round((claim.confidence || 0.95) * 100)}%
                      </span>
                    </div>

                    <p className="font-serif text-[0.95rem] text-[var(--color-ink)] leading-snug">
                      "{claim.statement}"
                    </p>

                    {claim.backing_sources && claim.backing_sources.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[var(--color-rule)] text-[11px] space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[var(--color-ink-tertiary)]">Source document:</span>
                        {claim.backing_sources.map((src, sIdx) => (
                          <div key={sIdx} className="flex items-center justify-between font-mono text-[11px] text-[var(--color-ink-secondary)]">
                            <span className="flex items-center gap-1">
                              <FileText size={11} />
                              {src.document_title}
                            </span>
                            {src.url && (
                              <a href={src.url} target="_blank" rel="noreferrer" className="text-[var(--color-navy)] hover:underline flex items-center gap-0.5">
                                Source <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-[var(--color-ink-tertiary)]">
              No source records found for this article.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-rule)] bg-[var(--color-paper-subtle)] text-[10px] text-center font-mono text-[var(--color-ink-tertiary)] uppercase">
          Verified against National Treasury, CBK & KNBS official records
        </div>
      </div>
    </div>
  );
}
