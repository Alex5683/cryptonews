"use client";

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

interface Post {
  _id: string;
  title: string;
  slug: string;
  categoryId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/admin/blogs');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts || []);
        } else {
          setError(data.error || 'Failed to fetch posts');
        }
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Manage Posts</h1>
        {loading && <p>Loading posts...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{post.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{post.categoryId?.name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(post.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
