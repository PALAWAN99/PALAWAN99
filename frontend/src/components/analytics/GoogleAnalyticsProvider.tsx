'use client';

import { Suspense } from 'react';
import { GoogleAnalyticsPageView } from './GoogleAnalyticsPageView';

export function GoogleAnalyticsProvider() {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return null;

  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsPageView />
    </Suspense>
  );
}
