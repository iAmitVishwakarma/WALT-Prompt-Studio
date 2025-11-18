import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. If user is logged in
  if (token) {
    // If they try to go to login, register, or the landing page, send them to Dashboard
    if (pathname.startsWith('/auth') || pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // 2. If user is NOT logged in
  if (!token) {
    // If they try to access protected routes (dashboard, api/vault), send to Login
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/vault')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};