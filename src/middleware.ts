import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const { pathname } = req.nextUrl;

  const protectedPaths1 = [
    '/api/ai',
    '/api/edit/',
    '/settings'
  ];

  const protectedPaths2 = [
    '/api/auth/forgot-pass/',
    '/api/auth/signup/',
    '/signin',
    '/signup',
    '/forgot-pass',
  ];

  const needs_auth = protectedPaths1.some((path) => pathname.startsWith(path));
  const guest_only = protectedPaths2.some((path) => pathname.startsWith(path));

  if (token) {
    const redis_res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/session:${token.user_id}`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/set/last-active:${token.user_id}/${Date.now()}`, {
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    });

    const data = await redis_res.json();

    if (!data.result || data.result !== token.session_id) {
      let res = NextResponse.redirect(new URL('/signin', req.url));
      if(pathname.startsWith('/api')) {
        res = NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
      }
      res.cookies.delete("next-auth.session-token");
      res.cookies.delete("__Secure-next-auth.session-token");
      res.cookies.delete("next-auth.csrf-token");
      res.cookies.delete("__Secure-next-auth.csrf-token");
      return res;
    }
  }

  if (needs_auth && !token) {
    if(pathname.startsWith('/api')) {
      return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (guest_only && token) {
    if(pathname.startsWith('/api')) {
      return NextResponse.json({ message: "Access Forbidden!" }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/',
    '/about',
    '/editor/:path*',
    '/forgot-pass',
    '/public-repos',
    '/settings',
    '/signin',
    '/signup',
    '/u/:path*'
  ],
};