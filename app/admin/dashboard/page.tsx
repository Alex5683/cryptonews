import Link from 'next/link';
import { FileText, MessageCircle, Eye, TrendingUp, Plus, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdminHeader from '@/components/admin/AdminHeader';
import BlogPost from '@/models/BlogPost';
import Comment from '@/models/Comment';
import connectMongoDB from '@/lib/mongodb';

async function getDashboardStats() {
  try {
    await connectMongoDB();
    
    const [totalPosts, pendingComments, totalViews] = await Promise.all([
      BlogPost.countDocuments(),
      Comment.countDocuments({ status: 'pending' }),
      BlogPost.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ])
    ]);

    return {
      totalPosts,
      pendingComments,
      totalViews: totalViews[0]?.totalViews || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalPosts: 0,
      pendingComments: 0,
      totalViews: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your blog.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Comments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingComments}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">New Post</h3>
          <p className="text-sm text-gray-600 mb-4">Create a new blog post</p>
          <Button asChild className="w-full">
            <Link href="/admin/blogs/new">Create Post</Link>
          </Button>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Manage Posts</h3>
          <p className="text-sm text-gray-600 mb-4">Edit and organize posts</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/blogs">View Posts</Link>
          </Button>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="p-3 bg-yellow-100 rounded-lg w-fit mx-auto mb-4">
            <MessageCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Comments</h3>
          <p className="text-sm text-gray-600 mb-4">Moderate user comments</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/comments">View Comments</Link>
          </Button>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="text-center">
          <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
            <Settings className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Categories</h3>
          <p className="text-sm text-gray-600 mb-4">Manage post categories</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/categories">Manage</Link>
          </Button>
        </div>
      </Card>
    </div>
  </main>
</div>
  );
}