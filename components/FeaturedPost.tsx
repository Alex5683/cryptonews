import BlogPost from '@/models/BlogPost';
import connectMongoDB from '@/lib/mongodb';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

async function getFeaturedPost() {
  try {
    if (!process.env.MONGODB_URI) {
      return null;
    }
    await connectMongoDB();
    const post = await BlogPost.findOne({})
      .populate('categoryId', 'name slug')
      .sort({ views: -1 })
      .lean();
    
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error('Error fetching featured post:', error);
    return null;
  }
}

export default async function FeaturedPost() {
  const post = await getFeaturedPost();

  if (!post) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">No Featured Posts Yet</h2>
        <p>Check back soon for featured content!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <Image
            src={post.thumbnailUrl || 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg'}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <div className="mb-4">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              Featured Article
            </Badge>
            <Badge variant="outline">
              {post.categoryId.name}
            </Badge>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4 line-clamp-2">
            {post.title}
          </h2>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 w-fit"
          >
            Read Full Article →
          </Link>
        </div>
      </div>
    </div>
  );
}