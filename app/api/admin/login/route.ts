import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (password === process.env.ADMIN_SECRET) {
      const response = NextResponse.json({ success: true });
      
      // Set admin cookie
      response.cookies.set('admin-token', process.env.ADMIN_SECRET || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
