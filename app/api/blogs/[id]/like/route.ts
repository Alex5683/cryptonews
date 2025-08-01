import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongoDB();
    
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';
    
    const post = await BlogPost.findById(params.id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const hasLiked = post.likes.includes(clientIP);
    
    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter((ip: string) => ip !== clientIP);
    } else {
      // Like
      post.likes.push(clientIP);
    }
    
    await post.save();
    
    return NextResponse.json({
      liked: !hasLiked,
      likeCount: post.likes.length,
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}