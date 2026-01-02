import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get('next-auth.session-token')?.value ??
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  const { pathname } = request.nextUrl;

  const protectedPaths1: any = [
    // '/api/ai',
    // '/editor'
  ];

  const protectedPaths2: any = [
    // '/signup',
    // '/signin',
    // '/forgot-pass',
  ];

  const isProtected1 = protectedPaths1.some((path: any) => pathname.startsWith(path));
  const isProtected2 = protectedPaths2.some((path: any) => pathname.startsWith(path));
  if (isProtected1 && !token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  
  if (isProtected1 && isProtected2 && token) {
    return NextResponse.next();
  }

  if (isProtected2 && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/api/ai',
    '/editor',
    '/forgot-pass/:path*',
    '/signin',
    '/signup/:path*'
  ],
};
