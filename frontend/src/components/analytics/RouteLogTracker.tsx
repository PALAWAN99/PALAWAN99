'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { apiPath } from '@/lib/base-path';
import { normalizeRoutePattern, shouldSkipRouteLog } from '@/lib/route-log/paths';
import { inferPageAction } from '@/lib/route-log/infer-action';

const ROUTE_LOG_INGEST = apiPath('/api/logs/route');

const SESSION_KEY = 'route_log_session_id';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function sendPageLog(payload: {
  path: string;
  action: string;
  userId?: string | null;
  sessionId: string;
  durationMs?: number;
}) {
  const body = JSON.stringify({
    logs: [
      {
        source: 'FRONTEND_PAGE',
        method: 'GET',
        path: payload.path,
        routePattern: normalizeRoutePattern(payload.path),
        action: payload.action,
        statusCode: 200,
        durationMs: payload.durationMs ?? null,
        userId: payload.userId ?? null,
        sessionId: payload.sessionId,
        referer: typeof document !== 'undefined' ? document.referrer || null : null,
        locale: payload.path.match(/^\/(en|zh)(\/|$)/)?.[1] ?? 'th',
        metadata: {
          title: typeof document !== 'undefined' ? document.title : null,
        },
      },
    ],
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(ROUTE_LOG_INGEST, blob);
    return;
  }

  void fetch(ROUTE_LOG_INGEST, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  });
}

export function RouteLogTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const lastPath = useRef<string | null>(null);
  const viewStart = useRef<number>(Date.now());

  useEffect(() => {
    if (!pathname || shouldSkipRouteLog(pathname)) return;

    const query = searchParams.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;

    if (lastPath.current === fullPath) return;

    const previous = lastPath.current;
    if (previous) {
      const durationMs = Date.now() - viewStart.current;
      sendPageLog({
        path: previous,
        action: inferPageAction(previous),
        userId: session?.user?.id,
        sessionId: getOrCreateSessionId(),
        durationMs,
      });
    }

    lastPath.current = fullPath;
    viewStart.current = Date.now();

    sendPageLog({
      path: fullPath,
      action: inferPageAction(fullPath),
      userId: session?.user?.id,
      sessionId: getOrCreateSessionId(),
    });
  }, [pathname, searchParams, session?.user?.id]);

  return null;
}
