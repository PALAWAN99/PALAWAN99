/** App base path for production subpath deploy (e.g. /smart-access). */
export const APP_BASE_PATH =
  (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '') || '';

export function stripBasePath(pathname: string): string {
  if (!APP_BASE_PATH) return pathname;
  if (pathname === APP_BASE_PATH) return '/';
  if (pathname.startsWith(`${APP_BASE_PATH}/`)) {
    return pathname.slice(APP_BASE_PATH.length) || '/';
  }
  return pathname;
}

export function withBasePath(path: string): string {
  if (!APP_BASE_PATH) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${APP_BASE_PATH}${normalized}`;
}

/** Static file under `public/` (or absolute http(s) URL from env). */
export function publicAssetPath(path: string): string {
  const trimmed = path.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return withBasePath(normalized);
}

/** Prefix `/api/...` routes for subpath deploy (fetch does not auto-apply basePath). */
export function apiPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return withBasePath(normalized);
}

export const AUTH_API_BASE_PATH = APP_BASE_PATH
  ? `${APP_BASE_PATH}/api/auth`
  : '/api/auth';

/** Public app URL (origin + NEXT_PUBLIC_BASE_PATH) for Auth.js redirects. */
export function appPublicUrl(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withPath = withBasePath(normalized);
  const fromEnv = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!fromEnv) return withPath;
  try {
    return `${new URL(fromEnv).origin}${withPath}`;
  } catch {
    return withPath;
  }
}

/**
 * next-intl + Next.js basePath can emit rewrites like `/th/smart-access/...`
 * instead of `/smart-access/th/...`, which 404s. Normalize to an internal pathname.
 */
export function fixIntlBasePathRewrite(rewriteHeader: string): string | null {
  if (!APP_BASE_PATH) return null;

  let pathname = rewriteHeader;
  if (!pathname.startsWith('/')) {
    try {
      pathname = new URL(rewriteHeader).pathname;
    } catch {
      return null;
    }
  }

  const broken = pathname.match(/^\/(th|en|zh)\/smart-access(\/.*)?$/);
  if (!broken) return null;

  const [, locale, rest = ''] = broken;
  if (rest.match(/^\/(en|zh)(\/|$)/)) {
    return `${APP_BASE_PATH}${rest}`;
  }
  if (!rest || rest === '/') {
    return `${APP_BASE_PATH}/${locale}`;
  }
  return `${APP_BASE_PATH}/${locale}${rest}`;
}
