'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// import AdminHeader from '@/components/admin/AdminHeader'; // Uncomment if AdminHeader exists

interface Category {
  _id: string;
  name: string;
}

export default function CreateNewPost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState<string>('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [commentsEnabled, setCommentsEnabled] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      // Auto-generate slug from title if slug is empty
      if (!slug) {
        const generatedSlug = title
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        setSlug(generatedSlug);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-0 focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  const [content, setContent] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    }
    fetchCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          categoryId,
          thumbnailUrl,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          metaTitle,
          metaDescription,
          authorId,
          isPublished,
          publishedAt: publishedAt ? new Date(publishedAt) : null,
          isFeatured,
          commentsEnabled,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Post created successfully!');
        setTitle('');
        setSlug('');
        setContent('');
        setThumbnailUrl('');
        setCategoryId('');
        setTags('');
        setMetaTitle('');
        setMetaDescription('');
        setAuthorId('');
        setIsPublished(false);
        setPublishedAt('');
        setIsFeatured(false);
        setCommentsEnabled(true);
        editor?.commands.clearContent();
      } else {
        setMessage(data.error || 'Failed to create post');
      }
    } catch (error) {
      setMessage('Failed to create post');
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <AdminHeader /> Uncomment if AdminHeader exists */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Create New Post</h1>
        {message && <p className="mb-4 text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="max-w-full grid grid-cols-[25%_75%] gap-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
            <div>
              <label htmlFor="thumbnailUrl" className="block font-medium mb-1">Thumbnail URL</label>
              <input
                id="thumbnailUrl"
                type="text"
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="categoryId" className="block font-medium mb-1">Category</label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tags" className="block font-medium mb-1">Tags (comma separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="metaTitle" className="block font-medium mb-1">Meta Title</label>
              <input
                id="metaTitle"
                type="text"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="metaDescription" className="block font-medium mb-1">Meta Description</label>
              <textarea
                id="metaDescription"
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label htmlFor="authorId" className="block font-medium mb-1">Author ID</label>
              <input
                id="authorId"
                type="text"
                value={authorId}
                onChange={e => setAuthorId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isPublished"
                type="checkbox"
                checked={isPublished}
                onChange={e => setIsPublished(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isPublished" className="font-medium">Published</label>
            </div>
            <div>
              <label htmlFor="publishedAt" className="block font-medium mb-1">Published At</label>
              <input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={e => setPublishedAt(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="isFeatured"
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isFeatured" className="font-medium">Featured</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="commentsEnabled"
                type="checkbox"
                checked={commentsEnabled}
                onChange={e => setCommentsEnabled(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="commentsEnabled" className="font-medium">Comments Enabled</label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Post
            </button>
          </div>
          <div>
            <label htmlFor="content" className="block font-medium mb-1">Content</label>
            <div className="border border-gray-300 rounded px-3 py-2 min-h-[400px] h-full">
              <EditorContent editor={editor} />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
