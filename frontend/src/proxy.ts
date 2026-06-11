import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { localePathPrefix } from './i18n/path-utils';
import { auth } from './auth.proxy';
import {
  stripBasePath,
  withBasePath,
} from './lib/base-path';

const intlMiddleware = createMiddleware(routing);



function applyIntlMiddleware(req: NextRequest): NextResponse | undefined {
  // 0. If this is an internal rewrite run where next-intl has already negotiated the locale,
  // bypass to prevent next-intl from resolving prefix-free locale paths as redirections.
  if (req.headers.has('x-next-intl-locale')) {
    return;
  }

  const originalUrl = req.nextUrl.clone();
  
  // 1. Strip the base path from nextUrl.pathname so next-intl sees a clean pathname (e.g., / or /en or /zh)
  req.nextUrl.pathname = stripBasePath(originalUrl.pathname);

  // 2. Run next-intl middleware
  const res = intlMiddleware(req);
  if (!res) return res;

  const headers = new Headers(res.headers);
  let hasChanges = false;

  // 3. Fix Location header (for redirects)
  const location = res.headers.get('Location');
  if (location) {
    try {
      const parsed = new URL(location, originalUrl.origin);
      if (parsed.origin === originalUrl.origin) {
        const relativePath = stripBasePath(parsed.pathname);
        headers.set('Location', new URL(withBasePath(relativePath) + parsed.search, originalUrl.origin).toString());
        hasChanges = true;
      }
    } catch (e) {
      console.error('[Middleware] Failed to adjust redirect location:', e);
    }
  }

  // 4. Fix x-middleware-rewrite header (for internal rewrites)
  const rewrite = res.headers.get('x-middleware-rewrite');
  if (rewrite) {
    try {
      const parsed = new URL(rewrite, originalUrl.origin);
      if (parsed.origin === originalUrl.origin) {
        const relativePath = stripBasePath(parsed.pathname);
        const origin = process.env.INTERNAL_MIDDLEWARE_ORIGIN ?? originalUrl.origin;
        headers.set('x-middleware-rewrite', new URL(withBasePath(relativePath) + parsed.search, origin).toString());
        hasChanges = true;
      }
    } catch (e) {
      console.error('[Middleware] Failed to adjust rewrite header:', e);
    }
  }

  if (hasChanges) {
    return new NextResponse(res.body, { status: res.status, headers });
  }

  return res;
}

export default auth((req) => {
  const { nextUrl } = req;
  console.log('[Middleware Run] pathname:', nextUrl.pathname, 'headers:', {
    'x-next-intl-locale': req.headers.get('x-next-intl-locale'),
    'x-middleware-rewrite': req.headers.get('x-middleware-rewrite'),
    'referer': req.headers.get('referer'),
    'accept-language': req.headers.get('accept-language'),
  });

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
