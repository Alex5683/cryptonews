import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogGrid from '@/components/BlogGrid';
import FeaturedPost from '@/components/FeaturedPost';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          {/* <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Tech Insights Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the latest trends, analysis, and insights in technology, finance, and innovation.
            </p>
          </div> */}
          
          <Suspense fallback={<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />}>
            <FeaturedPost />
          </Suspense>
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-200 to-transparent ml-6 rounded"></div>
          </div>
          
          <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>}>
            <BlogGrid />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}