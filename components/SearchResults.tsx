import BlogPost from '@/models/BlogPost';
import connectMongoDB from '@/lib/mongodb';
import BlogCard from './BlogCard';

async function searchBlogPosts(query: string) {
  if (!query) return [];
  
  try {
    await connectMongoDB();
    const posts = await BlogPost.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ]
    })
    .populate('categoryId', 'name slug')
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error searching blog posts:', error);
    return [];
  }
}

interface SearchResultsProps {
  query: string;
}

export default async function SearchResults({ query }: SearchResultsProps) {
  const posts = await searchBlogPosts(query);

  if (!query) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">Enter a search term to find articles.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">No articles found for "{query}".</p>
        <p className="text-gray-500 mt-2">Try different keywords or browse our categories.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-6">
        Found {posts.length} article{posts.length !== 1 ? 's' : ''}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post: any) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}