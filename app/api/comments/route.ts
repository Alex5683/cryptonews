import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    
    const { postId, name, email, content } = await request.json();
    
    if (!postId || !name || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const comment = new Comment({
      postId,
      name: name.trim(),
      email: email?.trim() || '',
      content: content.trim(),
      status: 'pending',
    });
    
    await comment.save();
    
    return NextResponse.json({ success: true, message: 'Comment submitted for approval' });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}