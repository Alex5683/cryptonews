import BlogPost from '@/models/BlogPost';
import connectMongoDB from '@/lib/mongodb';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

async function getLatestPosts(excludeId: string) {
  try {
    await connectMongoDB();
    const posts = await BlogPost.find({ _id: { $ne: excludeId } })
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
}

interface BlogSidebarProps {
  currentPostId: string;
}

export default async function BlogSidebar({ currentPostId }: BlogSidebarProps) {
  const latestPosts = await getLatestPosts(currentPostId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Latest Posts */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Latest Articles</h2>
        </div>
        
        <div className="space-y-4">
          {latestPosts.map((post: any) => (
            <article key={post._id} className="group">
              <Link href={`/blog/${post.slug}`} className="flex space-x-3">
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={post.thumbnailUrl || 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                    {post.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Card>

      {/* Newsletter Signup */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <h2 className="text-lg font-semibold mb-2">Stay Updated</h2>
        <p className="text-gray-600 text-sm mb-4">
          Get the latest insights and analysis delivered to your inbox.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all">
            Subscribe
          </button>
        </div>
      </Card>
    </div>
  );
}