'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const RouteLogTracker = dynamic(
  () => import('./RouteLogTracker').then((m) => m.RouteLogTracker),
  { ssr: false },
);

export function RouteLogProvider() {
  if (process.env.NEXT_PUBLIC_ROUTE_LOG_ENABLED === 'false') return null;

  return (
    <Suspense fallback={null}>
      <RouteLogTracker />
    </Suspense>
  );
}
