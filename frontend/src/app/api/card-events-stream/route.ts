import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function internalCardApiUrl(path: string): string {
  const base =
    process.env.CARD_API_INTERNAL_URL?.replace(/\/$/, '') ||
    'http://smart-access-backend:8000';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Proxy SSE to FastAPI — campus rev-proxy blocks WS/SSE to /smart-access/card-api/. */
export async function GET(_req: NextRequest) {
  let upstream: Response;
  try {
    upstream = await fetch(internalCardApiUrl('/api/card-events-stream'), {
      headers: { Accept: 'text/event-stream' },
    });
  } catch {
    return new Response('Card API stream unavailable', { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response('Card API stream unavailable', { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
