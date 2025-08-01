import { notFound } from 'next/navigation';
import BlogPost from '@/models/BlogPost';
import Comment from '@/models/Comment';
import connectMongoDB from '@/lib/mongodb';
import BlogContent from '@/components/BlogContent';
import BlogSidebar from '@/components/BlogSidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

async function getBlogPost(slug: string) {
  try {
    await connectMongoDB();
    const post = await BlogPost.findOne({ slug })
      .populate('categoryId', 'name slug')
      .lean();
    
    if (!post) return null;
    
    // Increment view count
    await BlogPost.updateOne({ slug }, { $inc: { views: 1 } });
    
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

async function getBlogComments(postId: string) {
  try {
    await connectMongoDB();
    const comments = await Comment.find({ 
      postId, 
      status: 'approved' 
    })
    .sort({ createdAt: -1 })
    .lean();
    
    return JSON.parse(JSON.stringify(comments));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  const comments = await getBlogComments(post._id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BlogContent post={post} comments={comments} />
          </div>
          <div className="lg:col-span-1">
            <BlogSidebar currentPostId={post._id} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    await connectMongoDB();
    const posts = await BlogPost.find({}, 'slug').lean();
    
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}