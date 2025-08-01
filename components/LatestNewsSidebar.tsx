'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type Post = {
  title: string;
  createdAt: string;
  slug: string;
};

export default function LatestNewsSidebar() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const res = await fetch('/api/blogs/latest');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch latest posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestPosts();
  }, []);

  const trendingTags = ['#Bitcoin', '#Solana', '#XRP'];

  return (
    <aside className="w-full max-w-md p-4 bg-white rounded-md shadow-md">
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

      {loading ? (
        <p>Loading latest posts...</p>
      ) : posts.length === 0 ? (
        <p>No latest posts found.</p>
      ) : (
        <ul className="max-h-96 overflow-y-auto space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block text-lg font-semibold text-blue-700 hover:underline"
              >
                {post.title}
              </Link>
              <time className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </time>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
