import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for admin session
    const adminToken = request.cookies.get('admin-token');

    console.log('Middleware - admin-token cookie:', adminToken);
    console.log('Middleware - process.env.ADMIN_SECRET:', process.env.ADMIN_SECRET);
    
    if (!adminToken || adminToken.value !== process.env.ADMIN_SECRET) {
      console.log('Middleware - Redirecting to /admin/login due to missing or invalid admin-token');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
