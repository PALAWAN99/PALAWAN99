'use client';

import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(
  () => import('./GoogleAnalytics').then((m) => m.GoogleAnalytics),
  { ssr: false },
);

/** GA scripts only after mount — avoids document hydration mismatches. */
export function ClientAnalytics() {
  return <GoogleAnalytics />;
}
