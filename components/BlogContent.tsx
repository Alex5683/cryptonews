'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface BlogContentProps {
  post: {
    _id: string;
    title: string;
    content: string;
    thumbnailUrl: string;
    views: number;
    likes: string[];
    createdAt: string;
    categoryId: {
      name: string;
      slug: string;
    };
  };
  comments: any[];
}

export default function BlogContent({ post, comments }: BlogContentProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/blogs/${post._id}/like`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96">
        <Image
          src={post.thumbnailUrl || 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg'}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6 md:p-8">
        {/* Category and Meta */}
        <div className="flex items-center justify-between mb-6">
          <Badge className="bg-blue-100 text-blue-800">
            {post.categoryId.name}
          </Badge>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
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

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Actions */}
        <div className="flex items-center justify-between py-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="flex items-center space-x-2"
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MessageCircle className="h-4 w-4" />
            <span>{comments.length} comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
          
          <CommentForm postId={post._id} />
          <CommentList comments={comments} />
        </div>
      </div>
    </article>
  );
}