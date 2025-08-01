"use client";

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

interface Comment {
  _id: string;
  postId: string;
  name: string;
  email?: string;
  content: string;
  status: 'pending' | 'approved' | 'deleted';
  createdAt: string;
}

export default function ModerateComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch('/api/admin/comments');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments || []);
        } else {
          setError(data.error || 'Failed to fetch comments');
        }
      } catch (err) {
        setError('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  async function updateStatus(id: string, status: 'approved' | 'deleted') {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments(prev =>
          prev.map(c => (c._id === id ? { ...c, status } : c))
        );
      } else {
        alert(data.error || 'Failed to update comment');
      }
    } catch (error) {
      alert('Failed to update comment');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Moderate Comments</h1>
        {loading && <p>Loading comments...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Content</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(comment => (
                <tr key={comment._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{comment.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{comment.content}</td>
                  <td className="border border-gray-300 px-4 py-2 capitalize">{comment.status}</td>
                  <td className="border border-gray-300 px-4 py-2 space-x-2">
                    {comment.status === 'pending' && (
                      <>
                        <button
                          disabled={updatingId === comment._id}
                          onClick={() => updateStatus(comment._id, 'approved')}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={updatingId === comment._id}
                          onClick={() => updateStatus(comment._id, 'deleted')}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {comment.status !== 'pending' && <span>No actions</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
