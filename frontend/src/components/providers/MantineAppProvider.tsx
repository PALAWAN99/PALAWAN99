'use client';

import '@/lib/patch-client-api';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { SessionProvider } from 'next-auth/react';
import { AUTH_API_BASE_PATH } from '@/lib/base-path';
import { theme } from '@/theme';

export function MantineAppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath={AUTH_API_BASE_PATH}>
      <MantineProvider
        theme={theme}
        defaultColorScheme="auto"
        deduplicateInlineStyles
      >
        <ModalsProvider>
          <Notifications position="top-right" zIndex={2077} />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </SessionProvider>
  );
}
