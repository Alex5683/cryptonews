"use client";

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || []);
        } else {
          setError(data.error || 'Failed to fetch categories');
        }
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  async function handleAddOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    if (!name || !slug) {
      setMessage('Name and slug are required');
      return;
    }
    try {
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, name, slug } : { name, slug };
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(editingId ? 'Category updated' : 'Category added');
        setName('');
        setSlug('');
        setEditingId(null);
        // Refresh categories
        const refreshed = await fetch('/api/admin/categories');
        const refreshedData = await refreshed.json();
        setCategories(refreshedData.categories || []);
      } else {
        setMessage(data.error || 'Failed to save category');
      }
    } catch (error) {
      setMessage('Failed to save category');
    }
  }

  async function handleEdit(category: Category) {
    setName(category.name);
    setSlug(category.slug);
    setEditingId(category._id);
    setMessage('');
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Category deleted');
        setCategories(prev => prev.filter(cat => cat._id !== id));
      } else {
        setMessage(data.error || 'Failed to delete category');
      }
    } catch (error) {
      setMessage('Failed to delete category');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Manage Categories</h1>
        {message && <p className="mb-4 text-red-600">{message}</p>}
        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && (
          <>
            <form onSubmit={handleAddOrUpdate} className="mb-6 max-w-md space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block font-medium mb-1">Slug</label>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setSlug('');
                    setEditingId(null);
                    setMessage('');
                  }}
                  className="ml-4 px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </form>

            <table className="min-w-full border border-gray-300 rounded">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Slug</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{category.slug}</td>
                    <td className="border border-gray-300 px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  );
}
