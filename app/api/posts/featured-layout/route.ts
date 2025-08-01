import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export async function GET() {
  try {
    await connectMongoDB();

    // Fetch latest 6 posts sorted by createdAt descending
    const latest = await BlogPost.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    // Fetch featured post sorted by views descending (top 1)
    const featured = await BlogPost.findOne({})
      .sort({ views: -1 })
      .lean();

    // Fetch next 4 high-view posts excluding the featured post
    const deepDives = await BlogPost.find({
      _id: { $ne: (featured as any)?._id }
    })
      .sort({ views: -1 })
      .limit(4)
      .lean();

    return NextResponse.json({
      latest: JSON.parse(JSON.stringify(latest)),
      featured: featured ? JSON.parse(JSON.stringify(featured)) : null,
      deepDives: JSON.parse(JSON.stringify(deepDives))
    });
  } catch (error) {
    console.error('Error fetching featured layout posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
