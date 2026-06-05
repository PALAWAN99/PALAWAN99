import type { NextRequest } from 'next/server';

export function getClientIp(req: Request | NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? null;
  return req.headers.get('x-real-ip');
}

export function getRequestMeta(req: Request | NextRequest) {
  return {
    ipAddress: getClientIp(req),
    userAgent: req.headers.get('user-agent'),
    referer: req.headers.get('referer'),
  };
}

export function getLocaleFromPath(pathname: string): string | null {
  const m = pathname.match(/^\/(en|zh)(\/|$)/);
  return m?.[1] ?? 'th';
}
