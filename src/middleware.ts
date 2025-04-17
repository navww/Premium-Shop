import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the user data from localStorage (client-side only)
  const user = request.cookies.get('user');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProfilePage = request.nextUrl.pathname.startsWith('/profile');

  // If trying to access profile pages without being logged in
  if (isProfilePage && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If trying to access auth pages while logged in
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/auth/:path*'],
};
