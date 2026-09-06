import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { EditorialEvidenceImage } from '../../../components/EditorialEvidenceImage';
import { fetchArticleByIdServer } from '../../../lib/api';
import { resolveImageUrl } from '../../../lib/imageUtils';
import { Clock, MapPin, ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export default async function ArticleDeepDive({ params }) {
  const { id: articleId } = await params;
  const article = await fetchArticleByIdServer(articleId, 60);

  const publishedAt = article?.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  // Determine evidence image source and provenance details
  const titleLower = (article?.headline || article?.title || '').toLowerCase();
  const county = (article?.county || 'National');
  let evidenceSrc = resolveImageUrl(article?.cover_image_url);
  if (!evidenceSrc) {
    if (titleLower.includes('nairobi') || county.toLowerCase() === 'nairobi') {
      evidenceSrc = '/nairobi_skyline.png';
    } else if (titleLower.includes('central bank') || titleLower.includes('monetary') || (article?.category || '').toLowerCase() === 'finance') {
      evidenceSrc = '/central_bank.png';
    } else {
      evidenceSrc = '/devolution.png';
    }
  }

  const renderFormattedBody = (content) => {
    if (!content) return null;
    
    // Clean out markdown headers (###) and section titles to present a pure flowing editorial story
    const cleanedText = content
      .replace(/^#+\s*(WHAT WE KNOW|THE NUMBERS|POLICY & ECONOMIC IMPACT|LOOKING AHEAD|CONTEXT|SUMMARY)?\s*/gmi, '')
      .trim();

    const blocks = cleanedText.split(/\n\n+/);
    return blocks.map((block, idx) => {
      let trimmed = block.trim();
      if (!trimmed) return null;

      trimmed = trimmed
        .replace(/^(WHAT WE KNOW|THE NUMBERS|POLICY & ECONOMIC IMPACT|LOOKING AHEAD)\s*\n/i, '')
        .trim();

      if (!trimmed) return null;

      return (
        <p key={idx} className="font-serif text-[1.12rem] leading-[1.85] text-[var(--color-ink-secondary)] mb-6">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10 space-y-8">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)] transition-colors font-mono"
        >
          <ArrowLeft size={14} />
          Back to Front Page
        </Link>

        {article ? (
          <article className="space-y-8">
            
            {/* Meta Header & Title */}
            <div className="space-y-4 border-b border-[var(--color-rule-strong)] pb-6">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[var(--color-navy)] font-bold">
                <span>{article.category || 'FINANCE'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {article.county || 'National'}
                </span>
                {publishedAt && (
                  <>
                    <span>•</span>
                    <span>{publishedAt}</span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {article.read_time_minutes || 4} min read
                </span>
              </div>

              <h1 className="font-serif-headline text-[2.2rem] sm:text-[3rem] font-bold leading-tight text-[var(--color-ink)]">
                {article.headline || article.title}
              </h1>

              {article.subheadline && (
                <p className="text-[1.2rem] font-serif text-[var(--color-ink-secondary)] leading-relaxed">
                  {article.subheadline}
                </p>
              )}
            </div>

            {/* Institutional Documentary Evidence Image (Integrated directly under headline) */}
            <EditorialEvidenceImage
              src={evidenceSrc}
              alt={article.headline || article.title}
              caption={article.subheadline || `${article.category || 'Finance'} coverage for ${article.county || 'Kenya'}.`}
            />

            {/* Pure Continuous Long-Form Editorial Body */}
            {article.body_content ? (
              <div className="py-2 space-y-2">
                {renderFormattedBody(article.body_content)}
              </div>
            ) : article.why_it_matters ? (
              <div className="py-2 space-y-4">
                <p className="font-serif text-[1.12rem] leading-[1.85] text-[var(--color-ink)]">
                  {article.why_it_matters}
                </p>
              </div>
            ) : null}

            {/* Confirmed Facts Section */}
            {Array.isArray(article.what_we_know) && article.what_we_know.length > 0 && (
              <div className="pt-8 border-t border-[var(--color-rule-strong)] space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] font-mono">
                  What We Know ({article.what_we_know.length})
                </h3>

                <div className="space-y-3">
                  {article.what_we_know.map((claim, idx) => (
                    <div key={idx} className="p-4 rounded-xs border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] text-[13px] space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="flex items-center gap-1 font-bold text-[var(--color-emerald)]">
                          <CheckCircle size={12} />
                          Confirmed
                        </span>
                      </div>
                      <p className="font-serif text-[0.95rem] text-[var(--color-ink)]">
                        "{claim.statement}"
                      </p>
                      {claim.source && (
                        <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] block">
                          Source: {claim.source}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources & References Section */}
            {Array.isArray(article.sources) && article.sources.length > 0 && (
              <div className="pt-6 border-t border-[var(--color-rule-strong)] space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-ink-tertiary)] font-mono">
                  Sources & References ({article.sources.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                  {article.sources.map((src, idx) => (
                    <div key={idx} className="p-3 rounded-xs border border-[var(--color-rule)] bg-[var(--color-paper-subtle)] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[var(--color-navy)]">
                        <FileText size={13} />
                        <span>{src.publisher || 'Official Source'}</span>
                      </div>
                      <p className="font-medium text-[var(--color-ink)] leading-snug">{src.title}</p>
                      <span className="text-[10px] font-mono text-[var(--color-ink-tertiary)] block">{src.document_type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </article>
        ) : (
          <div className="py-24 text-center border border-dashed border-[var(--color-rule)] rounded-xs p-8 text-[var(--color-ink-tertiary)]">
            Story '{articleId}' not found.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
