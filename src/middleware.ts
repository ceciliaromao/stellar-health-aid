import { NextRequest, NextResponse } from "next/server";
import { createCrossmint, CrossmintAuth } from "@crossmint/server-sdk";

const PUBLIC_PATHS = [
  '/api/auth/sync',
  '/api/auth/logout',
];

function isPublicPath(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;

  // Check if the route is in the public route list
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }

  // Allows only GET requests to '/api/images'
  if (pathname.match('/api/images') && request.method === 'GET') {
    return true;
  }

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Configure allowed origins following Next.js official CORS pattern
  const allowedOrigins = [
    'https://stellar-health-aid.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  const corsOptions: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-form-token, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    // Permite popups de OAuth (evita bloqueios de window.close/postMessage)
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    'Cross-Origin-Embedder-Policy': 'unsafe-none',
  };

  // Check the origin from the request
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS';

  if (isPreflight) {
    const preflightHeaders: Record<string, string> = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    } as Record<string, string>;
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Apply auth only for protected paths (api/dashboard) when not public
  const isProtected = pathname.startsWith('/api') || pathname.startsWith('/dashboard');
  if (isProtected && !isPublicPath(request)) {
    const jwt = request.cookies.get('crossmint-jwt')?.value;
    const refreshToken = request.cookies.get('crossmint-refresh-token')?.value;

    if (!refreshToken) {
      if (pathname.startsWith('/api')) {
        const res = NextResponse.json({ ok: false, error: 'Not authenticated' }, { status: 401 });
        if (isAllowedOrigin) res.headers.set('Access-Control-Allow-Origin', origin);
        Object.entries(corsOptions).forEach(([k, v]) => res.headers.set(k, v));
        return res;
      }
      // redirect for dashboard
      const res = NextResponse.redirect(new URL('/login', request.url));
      if (isAllowedOrigin) res.headers.set('Access-Control-Allow-Origin', origin);
      Object.entries(corsOptions).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }

    try {
      const crossmint = createCrossmint({ apiKey: process.env.SERVER_CROSSMINT_API_KEY! });
      const crossmintAuth = CrossmintAuth.from(crossmint);
      const session = await crossmintAuth.getSession({ jwt, refreshToken });

      const requestHeaders = new Headers(request.headers);
      if (session.userId) requestHeaders.set('x-user-id', session.userId);

      const res = NextResponse.next({ request: { headers: requestHeaders } });

      // refresh cookies if present
      const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const };
      if ((session as any).jwt) res.cookies.set('crossmint-jwt', (session as any).jwt, cookieOptions);
      if ((session as any).refreshToken) res.cookies.set('crossmint-refresh-token', (session as any).refreshToken, cookieOptions);

      if (isAllowedOrigin) res.headers.set('Access-Control-Allow-Origin', origin);
      Object.entries(corsOptions).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    } catch (e) {
      if (pathname.startsWith('/api')) {
        const res = NextResponse.json({ ok: false, error: 'Invalid session' }, { status: 401 });
        if (isAllowedOrigin) res.headers.set('Access-Control-Allow-Origin', origin);
        Object.entries(corsOptions).forEach(([k, v]) => res.headers.set(k, v));
        return res;
      }
      const res = NextResponse.redirect(new URL('/login', request.url));
      if (isAllowedOrigin) res.headers.set('Access-Control-Allow-Origin', origin);
      Object.entries(corsOptions).forEach(([k, v]) => res.headers.set(k, v));
      return res;
    }
  }

  // Handle simple requests - apply CORS headers to NextResponse.next()
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};