import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryPosts from '@/components/CategoryPosts';
import Category from '@/models/Category';
import connectMongoDB from '@/lib/mongodb';

async function getCategory(slug: string) {
  try {
    await connectMongoDB();
    const category = await Category.findOne({ slug }).lean();
    return category ? JSON.parse(JSON.stringify(category)) : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{category.name}</h1>
          <p className="text-gray-600">
            Explore all articles in the {category.name} category
          </p>
        </div>

        <CategoryPosts categoryId={category._id} />
      </main>

      <Footer />
    </div>
  );
}