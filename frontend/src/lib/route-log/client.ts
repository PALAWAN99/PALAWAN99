'use client';

import { apiPath } from '@/lib/base-path';
import { normalizeRoutePattern, shouldSkipRouteLog } from './paths';

const ROUTE_LOG_INGEST = apiPath('/api/logs/route');

/** บันทึก action ฝั่ง client (เช่น กดปุ่มอ่านบัตร, ยินยอม PDPA) */
export function logClientAction(
  action: string,
  options?: {
    path?: string;
    metadata?: Record<string, unknown>;
    statusCode?: number;
  },
) {
  if (typeof window === 'undefined') return;
  if (process.env.NEXT_PUBLIC_ROUTE_LOG_ENABLED === 'false') return;

  const path = options?.path ?? window.location.pathname;
  if (shouldSkipRouteLog(path)) return;

  const sessionId =
    sessionStorage.getItem('route_log_session_id') ?? crypto.randomUUID();

  const body = JSON.stringify({
    logs: [
      {
        source: 'FRONTEND_PAGE',
        method: 'ACTION',
        path,
        routePattern: normalizeRoutePattern(path),
        action,
        statusCode: options?.statusCode ?? 200,
        sessionId,
        metadata: options?.metadata ?? null,
      },
    ],
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(ROUTE_LOG_INGEST, new Blob([body], { type: 'application/json' }));
    return;
  }

  void fetch(ROUTE_LOG_INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  });
}
