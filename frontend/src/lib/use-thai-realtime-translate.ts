'use client';

import { useCallback, useRef, useState } from 'react';
import { unwrapApiData } from '@/lib/parse-api-response';

const DEFAULT_DEBOUNCE_MS = 280;

type TranslateResult = { nameEn: string; nameZh: string };

/**
 * Debounced Thai → EN/ZH via POST /api/admin/translate.
 * Cancels stale requests so fields update while the user is still typing.
 */
export function useThaiRealtimeTranslate(onResult: (data: TranslateResult) => void) {
  const [translating, setTranslating] = useState(false);
  const userEditedI18n = useRef(false);
  const translateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const seqRef = useRef(0);

  const clearTranslateTimer = useCallback(() => {
    if (translateTimerRef.current) {
      clearTimeout(translateTimerRef.current);
      translateTimerRef.current = null;
    }
  }, []);

  const cancelInFlight = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    userEditedI18n.current = false;
    clearTranslateTimer();
    cancelInFlight();
    seqRef.current += 1;
    setTranslating(false);
  }, [cancelInFlight, clearTranslateTimer]);

  const markUserEditedI18n = useCallback(() => {
    userEditedI18n.current = true;
    clearTranslateTimer();
    cancelInFlight();
    setTranslating(false);
  }, [cancelInFlight, clearTranslateTimer]);

  const runTranslate = useCallback(
    async (thai: string) => {
      const trimmed = thai.trim();
      if (trimmed.length < 2 || userEditedI18n.current) return;

      cancelInFlight();
      const controller = new AbortController();
      abortRef.current = controller;
      const seq = ++seqRef.current;
      setTranslating(true);

      try {
        const res = await fetch('/api/admin/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
          signal: controller.signal,
        });
        const json = await res.json();
        if (!res.ok || seq !== seqRef.current || userEditedI18n.current) return;
        const data = unwrapApiData<TranslateResult>(json);
        onResult(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        /* แปลไม่สำเร็จ — ไม่บังคับ */
      } finally {
        if (seq === seqRef.current) setTranslating(false);
      }
    },
    [cancelInFlight, onResult],
  );

  const scheduleFromThai = useCallback(
    (thai: string) => {
      clearTranslateTimer();
      if (userEditedI18n.current) return;

      const trimmed = thai.trim();
      if (trimmed.length < 2) {
        cancelInFlight();
        setTranslating(false);
        return;
      }

      translateTimerRef.current = setTimeout(() => {
        translateTimerRef.current = null;
        void runTranslate(thai);
      }, DEFAULT_DEBOUNCE_MS);
    },
    [cancelInFlight, clearTranslateTimer, runTranslate],
  );

  return {
    translating,
    scheduleFromThai,
    markUserEditedI18n,
    reset,
  };
}
