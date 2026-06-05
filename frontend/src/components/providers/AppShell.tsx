'use client';

import { useEffect, useState } from 'react';
import { ClientAnalytics } from '@/components/analytics/ClientAnalytics';
import { GoogleAnalyticsProvider } from '@/components/analytics/GoogleAnalyticsProvider';
import { RouteLogProvider } from '@/components/analytics/RouteLogProvider';
import { StripExtensionAttrs } from '@/components/StripExtensionAttrs';
import { MantineAppProvider } from '@/components/providers/MantineAppProvider';

/**
 * Defer Mantine + analytics until after mount so SSR HTML matches the first client paint.
 * Fixes React #418 on `<html>` from Mantine inline styles / color scheme.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div id="app-boot" suppressHydrationWarning />;
  }

  return (
    <>
      <ClientAnalytics />
      <StripExtensionAttrs />
      <MantineAppProvider>
        <GoogleAnalyticsProvider />
        <RouteLogProvider />
        {children}
      </MantineAppProvider>
    </>
  );
}
