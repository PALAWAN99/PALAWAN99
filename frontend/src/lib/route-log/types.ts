import type { RouteLogLevel, RouteLogSource } from '@prisma/client';

export type RouteLogInput = {
  source: RouteLogSource;
  level?: RouteLogLevel;
  method?: string | null;
  path: string;
  routePattern?: string | null;
  action?: string | null;
  statusCode?: number | null;
  durationMs?: number | null;
  userId?: string | null;
  sessionId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  locale?: string | null;
  errorMessage?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type RouteLogIngestPayload = {
  logs: RouteLogInput[];
};
