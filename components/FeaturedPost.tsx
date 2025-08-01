'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Category = {
  name: string;
  slug: string;
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  views: number;
  createdAt: string;
  thumbnailUrl: string;
  categoryId: Category;
};

export default function FeaturedLayout() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [deepDivePosts, setDeepDivePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/posts/featured-layout');
        const data = await res.json();

        // Assuming API returns { latest: Post[], featured: Post, deepDives: Post[] }
        setLatestPosts(data.latest);
        setFeaturedPost(data.featured);
        setDeepDivePosts(data.deepDives);
      } catch (error) {
        console.error('Failed to fetch featured layout posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000);
    if (diff < 1) return 'just now';
    if (diff === 1) return '1 minute ago';
    if (diff < 60) return `${diff} minutes ago`;
    const hours = Math.floor(diff / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  };

  const trendingTags = ['#Bitcoin', '#Solana', '#XRP'];

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Latest */}
      <section>
        <h2 className="text-2xl font-bold mb-4 lowercase">latest</h2>
        <div className="mb-4">
          <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md mr-2">
            TRENDING
          </span>
          <div className="inline-flex space-x-2">
            {trendingTags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ul className="space-y-4 max-h-[600px] overflow-y-auto">
          {latestPosts.slice(0, 6).map((post) => (
            <li key={post._id}>
              <Link
                href={`/blog/${post.slug}`}
                className="block text-lg font-semibold text-blue-700 hover:underline"
              >
                {post.title}
              </Link>
              <time className="text-gray-500 text-sm">{formatTimeAgo(post.createdAt)}</time>
            </li>
          ))}
        </ul>
      </section>

      {/* Deep Dives */}
      <section>
        <h2 className="text-2xl font-bold mb-4">deep dives</h2>
        <ul className="space-y-6">
          {deepDivePosts.slice(0, 4).map((post) => (
            <li key={post._id} className="flex space-x-4">
              <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={post.thumbnailUrl || 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg'}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block text-lg font-semibold text-blue-700 hover:underline"
                >
                  {post.title}
                </Link>
                <time className="text-gray-500 text-sm">{formatTimeAgo(post.createdAt)}</time>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Top Stories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">top stories</h2>
        {featuredPost ? (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col">
              <div className="relative h-64 w-full">
                <Image
                  src={featuredPost.thumbnailUrl || 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg'}
                  alt={featuredPost.title}
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4 line-clamp-2">
                  {featuredPost.title}
                </h3>
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatTimeAgo(featuredPost.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{featuredPost.views} views</span>
                  </div>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 w-fit"
                >
                  Read Full Article →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <p>No featured post available.</p>
        )}
      </section>

      
    </div>
  );
}
