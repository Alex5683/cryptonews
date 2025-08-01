import BlogPost from '@/models/BlogPost';
import Category from '@/models/Category';
import connectMongoDB from '@/lib/mongodb';
import BlogCard from './BlogCard';

async function getBlogPosts() {
  try {
    if (!process.env.MONGODB_URI) {
      return [];
    }
    await connectMongoDB();
    const posts = await BlogPost.find({})
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .limit(9)
      .lean();
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogGrid() {
  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">No blog posts found. Check back soon!</p>
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