'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  autoConfigureLocalCardApi,
  discoverAndConfigureLocalCardApi,
} from '@/lib/card-api-base';

/** URL param / saved localhost on load; port scan only via discoverLocal(). */
export function useCardApiAutoConfig() {
  const [localApiBase, setLocalApiBase] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void autoConfigureLocalCardApi().then((base) => {
      if (cancelled) return;
      if (base) setLocalApiBase(base);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const discoverLocal = useCallback(async (): Promise<string | null> => {
    const base = await discoverAndConfigureLocalCardApi({ userInitiated: true });
    if (base) setLocalApiBase(base);
    return base;
  }, []);

  return { ready, localApiBase, discoverLocal };
}
