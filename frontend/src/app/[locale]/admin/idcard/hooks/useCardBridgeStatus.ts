'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getNativeHostError,
  whenCardExtensionReady,
} from '@/lib/card-api-extension';

export function useCardBridgeStatus() {
  const [bridgeActive, setBridgeActive] = useState(false);
  const [nativeHostError, setNativeHostError] = useState<string | null>(null);

  const refreshBridge = useCallback(() => {
    void whenCardExtensionReady().then((ok) => {
      setBridgeActive(ok);
      setNativeHostError(ok ? null : getNativeHostError());
    });
  }, []);

  useEffect(() => {
    refreshBridge();
    const onFocus = () => refreshBridge();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshBridge]);

  return { bridgeActive, nativeHostError, refreshBridge };
}
