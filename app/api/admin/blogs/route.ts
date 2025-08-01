import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const data = await request.json();

    const { title, slug, content, categoryId, thumbnailUrl } = data;

    if (!title || !slug || !content || !categoryId || !thumbnailUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newPost = new BlogPost({
      title,
      slug,
      content,
      categoryId,
      thumbnailUrl,
      views: 0,
      likes: [],
    });

    await newPost.save();

    return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectMongoDB();
    const posts = await BlogPost.find().populate('categoryId').sort({ createdAt: -1 });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
