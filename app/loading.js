import Header from '../components/Header';
import Footer from '../components/Footer';
import { SkeletonLead, SkeletonGrid } from '../components/SkeletonCard';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-12">
        <SkeletonLead />
        <SkeletonGrid count={6} />
      </main>
      <Footer />
    </div>
  );
}
