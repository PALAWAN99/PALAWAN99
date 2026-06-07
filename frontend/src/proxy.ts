import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { localePathPrefix } from './i18n/path-utils';
import { auth } from './auth.proxy';
import {
  fixIntlBasePathRewrite,
  stripBasePath,
  withBasePath,
} from './lib/base-path';

const intlMiddleware = createMiddleware(routing);



function applyIntlMiddleware(req: NextRequest): NextResponse | undefined {
  // Always run next-intl middleware so it injects x-next-intl-locale header.
  // Skipping it for /en or /zh paths breaks useLocale() in server components.
  const res = intlMiddleware(req);
  if (!res) return res;

  const rewrite = res.headers.get('x-middleware-rewrite');
  if (!rewrite) return res;

  // Fix rewrite URL when NEXT_PUBLIC_BASE_PATH is set (e.g. /smart-access)
  const fixed = fixIntlBasePathRewrite(rewrite);
  if (!fixed) return res;

  const origin =
    process.env.INTERNAL_MIDDLEWARE_ORIGIN ??
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const headers = new Headers(res.headers);
  headers.set('x-middleware-rewrite', new URL(fixed, origin).toString());
  return new NextResponse(res.body, { status: res.status, headers });
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const pathname = stripBasePath(nextUrl.pathname);

  const isApiRoute = pathname.startsWith('/api');
  const isNextInternal = pathname.startsWith('/_next');
  const isPublicFile = pathname.includes('.');

  if (isApiRoute || isNextInternal || isPublicFile) {
    return;
  }

  const isAdminPath =
    pathname.startsWith('/admin') || /^\/(en|zh)\/admin/.test(pathname);
  const isGatePath =
    pathname.startsWith('/gate') || /^\/(en|zh)\/gate/.test(pathname);
  const isLoginPath =
    pathname === '/login' || /^\/(en|zh)\/login/.test(pathname);

  if (isAdminPath || isGatePath) {
    if (!isLoggedIn) {
      const prefix = localePathPrefix(pathname);
      return Response.redirect(new URL(withBasePath(`${prefix}/login`), nextUrl));
    }

    const isSuperAdminSettings = pathname.includes('/admin/settings');
    if (isSuperAdminSettings && userRole !== 'SUPER_ADMIN') {
      const prefix = localePathPrefix(pathname);
      return Response.redirect(new URL(withBasePath(`${prefix}/admin/dashboard`), nextUrl));
    }
  }

  if (isLoginPath && isLoggedIn) {
    const prefix = localePathPrefix(pathname);
    return Response.redirect(new URL(withBasePath(`${prefix}/admin/dashboard`), nextUrl));
  }

  return applyIntlMiddleware(req);
});

/**
 * Matcher must be a static literal (Next.js build-time analysis).
 * Production uses NEXT_PUBLIC_BASE_PATH=/smart-access — without the extra segments below,
 * `/smart-access/_next/static/*` still hits auth proxy and can return 403/HTML instead of JS.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|smart-access/_next/static|smart-access/_next/image).*)',
    '/',
  ],
};
