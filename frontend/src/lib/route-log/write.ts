import { Prisma, type RouteLogLevel } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { normalizeRoutePattern, shouldSkipRouteLog } from './paths';
import type { RouteLogInput } from './types';

export function isRouteLogEnabled(): boolean {
  if (process.env.ROUTE_LOG_ENABLED === 'false') return false;
  return typeof window === 'undefined';
}

function levelFromStatus(status?: number | null): RouteLogLevel {
  if (!status) return 'INFO';
  if (status >= 500) return 'ERROR';
  if (status >= 400) return 'WARN';
  return 'INFO';
}

export async function writeRouteLogs(entries: RouteLogInput[]): Promise<number> {
  if (!isRouteLogEnabled() || entries.length === 0) return 0;

  const rows = entries
    .filter((e) => e.path && !shouldSkipRouteLog(e.path))
    .map((e) => ({
      source: e.source,
      level: e.level ?? levelFromStatus(e.statusCode),
      method: e.method?.slice(0, 10) ?? null,
      path: e.path.slice(0, 500),
      routePattern: (e.routePattern ?? normalizeRoutePattern(e.path)).slice(0, 500),
      action: e.action?.slice(0, 120) ?? null,
      statusCode: e.statusCode ?? null,
      durationMs: e.durationMs ?? null,
      userId: e.userId ?? null,
      sessionId: e.sessionId?.slice(0, 64) ?? null,
      ipAddress: e.ipAddress?.slice(0, 45) ?? null,
      userAgent: e.userAgent ?? null,
      referer: e.referer?.slice(0, 500) ?? null,
      locale: e.locale?.slice(0, 10) ?? null,
      errorMessage: e.errorMessage ?? null,
      metadata:
        e.metadata == null ? undefined : (e.metadata as Prisma.InputJsonValue),
    }));

  if (rows.length === 0) return 0;

  try {
    const result = await prisma.routeLog.createMany({ data: rows });
    return result.count;
  } catch (error) {
    logger.error('Failed to write route logs', {
      error: error instanceof Error ? error.message : String(error),
      count: rows.length,
    });
    return 0;
  }
}

export async function writeRouteLog(entry: RouteLogInput): Promise<void> {
  await writeRouteLogs([entry]);
}
