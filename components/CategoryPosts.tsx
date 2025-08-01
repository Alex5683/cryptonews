import BlogPost from '@/models/BlogPost';
import connectMongoDB from '@/lib/mongodb';
import BlogCard from './BlogCard';

async function getCategoryPosts(categoryId: string) {
  try {
    await connectMongoDB();
    const posts = await BlogPost.find({ categoryId })
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

interface CategoryPostsProps {
  categoryId: string;
}

export default async function CategoryPosts({ categoryId }: CategoryPostsProps) {
  const posts = await getCategoryPosts(categoryId);

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">No articles found in this category yet.</p>
        <p className="text-gray-500 mt-2">Check back soon for new content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post: any) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}