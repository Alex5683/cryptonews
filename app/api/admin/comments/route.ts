import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function GET() {
  try {
    await connectMongoDB();
    const comments = await Comment.find().sort({ createdAt: -1 });
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const { id, status } = data;

    if (!id || !['pending', 'approved', 'deleted'].includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    comment.status = status;
    await comment.save();

    return NextResponse.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
