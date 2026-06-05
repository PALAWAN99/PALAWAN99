import type { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { inferApiAction } from './infer-action';
import { normalizeRoutePattern, shouldSkipRouteLog } from './paths';
import { getLocaleFromPath, getRequestMeta } from './request-meta';
import { writeRouteLog } from './write';

type RouteContext = { params: Promise<Record<string, string>> };

export type LoggedApiOptions = {
  action?: string;
};

export function withLoggedApi(
  handler: (req: NextRequest, ctx: RouteContext) => Promise<Response>,
  options?: LoggedApiOptions,
) {
  return async (req: NextRequest, ctx: RouteContext): Promise<Response> => {
    const path = req.nextUrl.pathname;
    if (shouldSkipRouteLog(path)) {
      return handler(req, ctx);
    }

    const start = Date.now();
    let statusCode = 500;
    let errorMessage: string | undefined;
    const session = await auth().catch(() => null);
    const meta = getRequestMeta(req);

    try {
      const res = await handler(req, ctx);
      statusCode = res.status;
      return res;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      const durationMs = Date.now() - start;

      void writeRouteLog({
        source: 'FRONTEND_API',
        method: req.method,
        path,
        routePattern: normalizeRoutePattern(path),
        action: options?.action ?? inferApiAction(req.method, path),
        statusCode,
        durationMs,
        userId: session?.user?.id ?? null,
        ipAddress: meta.ipAddress,
        userAgent: meta.userAgent,
        referer: meta.referer,
        locale: getLocaleFromPath(path),
        errorMessage: errorMessage ?? null,
      });
    }
  };
}
