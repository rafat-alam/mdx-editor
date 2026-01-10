import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const { pathname } = req.nextUrl;

  const protectedPaths1 = [
    '/api/ai',
    '/api/auth/change-email',
    '/api/auth/last-active',
    '/api/auth/me',
    '/api/edit/add-file',
    '/api/edit/add-folder',
    '/api/edit/add-repo',
    '/api/edit/remove',
    '/api/edit/rename',
    '/api/edit/rename-repo',
    '/api/edit/save',
    '/api/edit/set-repo-vis',
  ];

  const protectedPaths2 = [
    '/api/auth/forgot-pass',
    '/api/auth/resend-otp',
    '/api/auth/signup',
    '/api/auth/verify-otp',
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
      const res = NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
      res.cookies.delete("next-auth.session-token");
      res.cookies.delete("__Secure-next-auth.session-token");
      res.cookies.delete("next-auth.csrf-token");
      res.cookies.delete("__Secure-next-auth.csrf-token");
      return res;
    }
  }

  if (needs_auth && !token) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  if (guest_only && token) {
    return NextResponse.json({ message: "Access Forbidden!" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/',
    '/about',
    '/editor',
    '/forgot-pass',
    '/r/:path*',
    '/signin',
    '/signup',
    '/u/:path*'
  ],
};