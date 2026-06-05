'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { readRfid, type RfidResult } from '@/lib/api';

export type RfidScanRecord = {
  id: number;
  timestamp: string;
  result: RfidResult;
};

const POLL_INTERVAL_MS = 2000;
const POLL_INTERVAL_NO_CARD_MS = 3500;

function isNoCardResult(result: RfidResult | null): boolean {
  if (!result || result.success) return false;
  const err = result.error ?? '';
  return (
    err.includes('ไม่พบบัตร') ||
    err.includes('NO_TAG') ||
    err.includes('POLLING') ||
    err.includes('EMPTY')
  );
}

export function useRfidReader(initialAutoScan = false) {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState<RfidResult | null>(null);
  const [history, setHistory] = useState<RfidScanRecord[]>([]);
  const [autoScan, setAutoScan] = useState(initialAutoScan);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const lastResultRef = useRef<RfidResult | null>(null);

  const doScan = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsScanning(true);
    try {
      const result = await readRfid();
      if (!mountedRef.current) return;
      lastResultRef.current = result;
      setLastResult(result);
      if (result.success) {
        setHistory((prev) => {
          const isDuplicate =
            prev.length > 0 && prev[0].result.uid_hex === result.uid_hex;
          if (isDuplicate) return prev;
          return [
            {
              id: Date.now(),
              timestamp: new Date().toLocaleTimeString('th-TH'),
              result,
            },
            ...prev,
          ].slice(0, 20);
        });
      }
    } catch (e) {
      if (!mountedRef.current) return;
      const msg = e instanceof Error ? e.message : String(e);
      const fail = { success: false, error: msg } satisfies RfidResult;
      lastResultRef.current = fail;
      setLastResult(fail);
    } finally {
      if (mountedRef.current) setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!autoScan) {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    let active = true;

    const scheduleNext = () => {
      if (!active || !autoScan) return;
      const delay = isNoCardResult(lastResultRef.current)
        ? POLL_INTERVAL_NO_CARD_MS
        : POLL_INTERVAL_MS;
      pollingRef.current = setTimeout(poll, delay);
    };

    const poll = async () => {
      if (!active || !autoScan) return;
      if (typeof document !== 'undefined' && document.hidden) {
        scheduleNext();
        return;
      }
      await doScan();
      scheduleNext();
    };

    poll();

    const onVisibility = () => {
      if (!document.hidden && autoScan && active && !pollingRef.current) {
        void doScan().then(scheduleNext);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      active = false;
      document.removeEventListener('visibilitychange', onVisibility);
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [autoScan, doScan]);

  return {
    isScanning,
    lastResult,
    history,
    autoScan,
    setAutoScan,
    doScan,
    clearHistory: () => setHistory([]),
  };
}

export function formatUidHex(hex: string): string {
  return hex.match(/.{1,2}/g)?.join(' ') || hex;
}
