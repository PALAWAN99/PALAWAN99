import { NextRequest } from 'next/server';
import { eventEmitter } from '@/lib/event-emitter';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  if (!checkAccess(session, 'ACCESS_EVENT', 'READ')) {
    return new Response('Forbidden', { status: 403 });
  }

  let clientDisconnected = false;

  const stream = new ReadableStream({
    start(controller) {
      // Send connection acknowledgement
      controller.enqueue(new TextEncoder().encode(': connected\n\n'));

      const onAccessEvent = (event: any) => {
        if (clientDisconnected) return;
        try {
          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`)
          );
        } catch (err) {
          console.error('Error writing to stream', err);
        }
      };

      eventEmitter.on('access-event', onAccessEvent);

      // Heartbeat / Keep-alive to keep the connection open
      const keepAliveInterval = setInterval(() => {
        if (clientDisconnected) return;
        try {
          controller.enqueue(new TextEncoder().encode(': keepalive\n\n'));
        } catch (err) {
          // Client might have disconnected
        }
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clientDisconnected = true;
        clearInterval(keepAliveInterval);
        eventEmitter.off('access-event', onAccessEvent);
        try {
          controller.close();
        } catch (_) {}
      });
    },
    cancel() {
      clientDisconnected = true;
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
