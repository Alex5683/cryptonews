'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TrendingUp, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">Admin Panel</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/admin/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/admin/blogs" className="text-gray-700 hover:text-blue-600">
              Posts
            </Link>
            <Link href="/admin/categories" className="text-gray-700 hover:text-blue-600">
              Categories
            </Link>
            <Link href="/admin/comments" className="text-gray-700 hover:text-blue-600">
              Comments
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" target="_blank">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}