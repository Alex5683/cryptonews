import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: string;
    thumbnailUrl: string;
    views: number;
    createdAt: string;
    categoryId: {
      name: string;
      slug: string;
    };
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.thumbnailUrl || 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg'}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="default" className="bg-white/90 text-gray-800">
            {post.categoryId.name}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{post.views} views</span>
            </div>
          </div>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}
