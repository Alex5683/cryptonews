import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchResults from '@/components/SearchResults';
import { Search } from 'lucide-react';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Search Results</h1>
          </div>
          {query && (
            <p className="text-gray-600">
              Showing results for: <span className="font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        }>
          <SearchResults query={query} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}