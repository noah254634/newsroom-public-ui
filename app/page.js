import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryFeed from '../components/CategoryFeed';
import FeaturedHero from '../components/FeaturedHero';
import { fetchArticlesServer } from '../lib/api';
import Link from 'next/link';

export const revalidate = 30;

export default async function Home() {
  const articles = await fetchArticlesServer('PUBLISHED', 30);

  // Lead article is the fallback hero when nothing is featured.
  // Secondary feed is everything else.
  const leadArticle       = articles.length > 0 ? articles[0] : null;
  const secondaryArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)] selection:bg-[var(--color-ink)] selection:text-[var(--color-paper)]">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-12">

        {/* Editorial hero section */}
        <FeaturedHero fallback={leadArticle} />

        {/* Secondary article feed */}
        <CategoryFeed secondaryArticles={secondaryArticles} />

      </main>

      <Footer />
    </div>
  );
}
