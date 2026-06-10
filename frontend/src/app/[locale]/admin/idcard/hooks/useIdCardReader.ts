'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { ThaiIdData } from '@/lib/idcard/reader';
import {
  citizenInfoToThaiIdData,
  hasCitizenPreview,
  mergeCitizenInfo,
} from '@/lib/idcard/map-citizen';
import {
  fetchReaders,
  readCard,
  resetReaderConnection,
  subscribeCardEvents,
  type CitizenInfo,
  type CardEvent,
  type ReaderInfo,
} from '@/lib/api';
import {
  CARD_API_BASE_CHANGED,
  discoverAndConfigureLocalCardApi,
  formatCardApiFetchError,
  getCardApiBase,
  isCardApiProxyMode,
  usesExtensionBridge,
  usesLocalCardApi,
  usesServerCardApi,
} from '@/lib/card-api-base';
import { whenCardExtensionReady } from '@/lib/card-api-extension';
import { getReaderPollDelayMs } from '@/lib/idcard/reader-poll';

const READ_TIMEOUT_MS = 120_000;

function isNativeHostErrorMessage(message: string): boolean {
  return (
    message.includes('Native Host') ||
    message.includes('native messaging host') ||
    message.includes('native host')
  );
}

function readersSnapshotEqual(
  a: ReaderInfo[],
  b: ReaderInfo[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (r, i) => r.name === b[i]?.name && r.has_card === b[i]?.has_card,
  );
}

type UseIdCardReaderOptions = {
  /** Wait for ?localCardApi= / saved localhost before first fetch (no port scan on load). */
  cardApiConfigReady?: boolean;
  /** KKU Card API desktop configured on this counter PC. */
  localDesktopApiActive?: boolean;
  /** Filter mode to only handle contact (idcard) or contactless (rfid) readers */
  mode?: 'idcard' | 'rfid';
};

export function useIdCardReader(options: UseIdCardReaderOptions = {}) {
  const { cardApiConfigReady = true, localDesktopApiActive = false, mode } = options;
  const t = useTranslations('IdCard');
  const [readers, setReaders] = useState<ReaderInfo[]>([]);
  const [readersFetching, setReadersFetching] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [cardApiReachable, setCardApiReachable] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [cardData, setCardData] = useState<ThaiIdData | null>(null);
  const [streamingCitizen, setStreamingCitizen] = useState<CitizenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [cardPresentFromEvent, setCardPresentFromEvent] = useState(false);
  const partialRef = useRef<Partial<CitizenInfo>>({});
  const readDoneRef = useRef(false);
  const prevHadCardRef = useRef(false);
  const cardApiReachableRef = useRef(false);
  const hasReaderRef = useRef(false);
  const hasCardFromApiRef = useRef(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasReadDataRef = useRef(false);
  const [autoPollEnabled, setAutoPollEnabled] = useState(false);
  const [apiBaseEpoch, setApiBaseEpoch] = useState(0);

  useEffect(() => {
    const onBaseChanged = () => setApiBaseEpoch((n) => n + 1);
    window.addEventListener(CARD_API_BASE_CHANGED, onBaseChanged);
    return () => window.removeEventListener(CARD_API_BASE_CHANGED, onBaseChanged);
  }, []);

  const proxyPollingOnly = isCardApiProxyMode() && !usesLocalCardApi();
  const manualConnectMode =
    usesLocalCardApi() && !usesExtensionBridge() && !proxyPollingOnly;
  const awaitingCounterDesktop =
    usesServerCardApi() &&
    !usesExtensionBridge() &&
    !localDesktopApiActive &&
    !manualConnectMode;
  const isLoadingReaders =
    readersFetching ||
    (!cardApiConfigReady && !manualConnectMode && !awaitingCounterDesktop);
  const hasReader = readers.length > 0;
  const hasCardFromApi = readers.some((r) => r.has_card);

  const hasCard = hasCardFromApi || cardPresentFromEvent;
  const readerOperational =
    hasReader || hasCard || cardData !== null || streamingCitizen !== null;

  useEffect(() => {
    hasReaderRef.current = hasReader;
    hasCardFromApiRef.current = hasCardFromApi;
  }, [hasReader, hasCardFromApi]);

  useEffect(() => {
    hasReadDataRef.current = cardData !== null || streamingCitizen !== null;
  }, [cardData, streamingCitizen]);

  const liveConnected =
    proxyPollingOnly ? cardApiReachable : cardApiReachable || wsConnected;
  const isBackendOffline =
    !readerOperational &&
    !cardApiReachable &&
    !liveConnected &&
    !!error &&
    (error.includes('Card API') ||
      error.includes('เชื่อมต่อ') ||
      error.includes('Backend') ||
      error.includes('8000') ||
      error.includes('127.0.0.1'));

  const syncReaders = useCallback(async (): Promise<boolean> => {
    if (awaitingCounterDesktop) return false;
    try {
      const { readers: list } = await fetchReaders();
      const filteredList = list.filter((r) => {
        const nameLower = r.name.toLowerCase();
        const isContactless = nameLower.includes('contactless') || nameLower.includes('rfid');
        if (mode === 'idcard') return !isContactless;
        if (mode === 'rfid') return isContactless;
        return true;
      });

      const hasCardNow = filteredList.some((r) => r.has_card);
      if (!hasCardNow && prevHadCardRef.current) {
        setCardPresentFromEvent(false);
        setCardData(null);
        setStreamingCitizen(null);
        setProgress(0);
        setProgressMsg('');
      } else if (hasCardNow) {
        setCardPresentFromEvent(true);
      }
      prevHadCardRef.current = hasCardNow;
      cardApiReachableRef.current = true;
      setCardApiReachable(true);
      if (manualConnectMode) setAutoPollEnabled(true);
      setReaders((prev) => (readersSnapshotEqual(prev, filteredList) ? prev : filteredList));
      setError(null);
      return filteredList.length > 0;
    } catch (err) {
      if (!hasReadDataRef.current) {
        cardApiReachableRef.current = false;
        setCardApiReachable(false);
        if (manualConnectMode) setAutoPollEnabled(false);
        if (pollTimerRef.current) {
          clearTimeout(pollTimerRef.current);
          pollTimerRef.current = null;
        }
        setReaders([]);
      }
      const msg = formatCardApiFetchError(err);
      // Extension Bridge enabled but Native Host failed — desktop Card API may still work.
      if (isNativeHostErrorMessage(msg) && usesLocalCardApi()) {
        setError(null);
        return false;
      }
      if (!hasReadDataRef.current) {
        setError(msg);
      }
      return false;
    }
  }, [manualConnectMode, awaitingCounterDesktop, mode]);

  const loadReaders = useCallback(async () => {
    setReadersFetching(true);
    try {
      await syncReaders();
    } finally {
      setReadersFetching(false);
    }
  }, [syncReaders]);

  useEffect(() => {
    if (!cardApiConfigReady || manualConnectMode || awaitingCounterDesktop) return;
    let cancelled = false;
    (async () => {
      setReadersFetching(true);
      if (usesExtensionBridge()) {
        await whenCardExtensionReady();
      }
      try {
        await syncReaders();
      } finally {
        if (!cancelled) setReadersFetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [syncReaders, cardApiConfigReady, apiBaseEpoch, manualConnectMode, awaitingCounterDesktop]);

  useEffect(() => {
    if (!cardApiConfigReady || !localDesktopApiActive || awaitingCounterDesktop) return;
    if (autoPollEnabled || cardApiReachableRef.current) return;
    let cancelled = false;
    void (async () => {
      const ok = await syncReaders();
      if (!cancelled && ok) setAutoPollEnabled(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [
    cardApiConfigReady,
    localDesktopApiActive,
    awaitingCounterDesktop,
    syncReaders,
    apiBaseEpoch,
    autoPollEnabled,
  ]);

  useEffect(() => {
    if (!cardApiConfigReady || isReading) return;
    if (awaitingCounterDesktop) return;
    if (manualConnectMode && !autoPollEnabled) return;

    let cancelled = false;
    const serverOnly = usesServerCardApi() && !usesExtensionBridge();

    const schedule = (delayMs: number) => {
      if (cancelled) return;
      if (manualConnectMode && !autoPollEnabled) return;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      pollTimerRef.current = setTimeout(() => void runPoll(), delayMs);
    };

    const runPoll = async () => {
      if (cancelled) return;
      if (manualConnectMode && !autoPollEnabled) return;
      if (!cardApiReachableRef.current && manualConnectMode) return;

      if (document.hidden) {
        schedule(
          getReaderPollDelayMs({
            cardApiReachable: cardApiReachableRef.current,
            serverOnly,
            hasReader: hasReaderRef.current,
            hasCardFromApi: hasCardFromApiRef.current,
            documentHidden: true,
          }),
        );
        return;
      }

      await syncReaders();
      if (cancelled) return;
      if (manualConnectMode && !cardApiReachableRef.current) return;

      schedule(
        getReaderPollDelayMs({
          cardApiReachable: cardApiReachableRef.current,
          serverOnly,
          hasReader: hasReaderRef.current,
          hasCardFromApi: hasCardFromApiRef.current,
          documentHidden: false,
        }),
      );
    };

    schedule(
      getReaderPollDelayMs({
        cardApiReachable: cardApiReachableRef.current,
        serverOnly,
        hasReader: hasReaderRef.current,
        hasCardFromApi: hasCardFromApiRef.current,
        documentHidden: document.hidden,
      }),
    );

    const onVisible = () => {
      if (document.hidden || cancelled) return;
      if (manualConnectMode && !autoPollEnabled) return;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      void syncReaders().then(() => {
        if (cancelled || (manualConnectMode && !cardApiReachableRef.current)) return;
        schedule(
          getReaderPollDelayMs({
            cardApiReachable: cardApiReachableRef.current,
            serverOnly,
            hasReader: hasReaderRef.current,
            hasCardFromApi: hasCardFromApiRef.current,
            documentHidden: false,
          }),
        );
      });
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    };
  }, [
    isReading,
    syncReaders,
    apiBaseEpoch,
    cardApiConfigReady,
    autoPollEnabled,
    manualConnectMode,
    awaitingCounterDesktop,
  ]);

  const handleCardEvent = useCallback(
    (event: CardEvent) => {
      const nameLower = (event.reader || '').toLowerCase();
      const isContactless = nameLower.includes('contactless') || nameLower.includes('rfid');
      if (mode === 'idcard' && isContactless) return;
      if (mode === 'rfid' && !isContactless) return;

      if (event.event === 'card_inserted') {
        setCardPresentFromEvent(true);
        setReaders((prev) =>
          prev.length > 0
            ? prev.map((r) => ({ ...r, has_card: true }))
            : [{ name: event.reader || 'DUALi DE-620', has_card: true }],
        );
        setError(null);
      } else if (event.event === 'card_removed') {
        setCardPresentFromEvent(false);
        setCardData(null);
        setStreamingCitizen(null);
        setProgress(0);
        setProgressMsg('');
        setReaders((prev) => prev.map((r) => ({ ...r, has_card: false })));
      }
      void syncReaders();
    },
    [syncReaders, mode],
  );

  useEffect(() => {
    if (proxyPollingOnly) return;
    if (awaitingCounterDesktop) return;
    if (manualConnectMode && (!cardApiReachable || !autoPollEnabled)) return;
    let cancelled = false;
    const unsubscribe = subscribeCardEvents(handleCardEvent, {
      onConnect: () => {
        if (!cancelled) setWsConnected(true);
      },
      onDisconnect: () => {
        if (!cancelled) setWsConnected(false);
      },
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [
    handleCardEvent,
    proxyPollingOnly,
    manualConnectMode,
    awaitingCounterDesktop,
    cardApiReachable,
    autoPollEnabled,
  ]);

  const handleConnectLocal = useCallback(async () => {
    setReadersFetching(true);
    setError(null);
    try {
      const base = await discoverAndConfigureLocalCardApi({ userInitiated: true });
      if (!base) {
        setError(t('errorDesktopApiNotRunning'));
        setCardApiReachable(false);
        cardApiReachableRef.current = false;
        return;
      }
      setApiBaseEpoch((n) => n + 1);
      const ok = await syncReaders();
      if (ok) setAutoPollEnabled(true);
    } finally {
      setReadersFetching(false);
    }
  }, [syncReaders, t]);

  const handleRefresh = useCallback(async () => {
    setReadersFetching(true);
    try {
      if (cardApiReachableRef.current) {
        try {
          await resetReaderConnection();
        } catch {
          // still refresh reader list
        }
      }
      const ok = await syncReaders();
      if (ok || cardApiReachableRef.current) {
        if (manualConnectMode) setAutoPollEnabled(true);
      }
    } finally {
      setReadersFetching(false);
    }
  }, [syncReaders, manualConnectMode]);

  const attachPhoto = useCallback((photo: string) => {
    setStreamingCitizen((prev) =>
      prev ? { ...prev, photo_base64: photo } : prev,
    );
    setCardData((prev: ThaiIdData | null) =>
      prev ? { ...prev, photoBase64: photo } : prev,
    );
  }, []);

  const finishRead = useCallback(
    (opts?: { errorMessage?: string }) => {
      readDoneRef.current = true;
      setIsReading(false);
      if (opts?.errorMessage) {
        setError(opts.errorMessage);
        setProgress(0);
        setProgressMsg('');
        setStreamingCitizen(null);
      }
    },
    [],
  );

  const tryFallbackRead = useCallback(
    async (rawError: string): Promise<boolean> => {
      const shouldFallback =
        rawError.includes('not found on USB') ||
        rawError.includes('Vendor protocol') ||
        rawError.includes('No such device');
      if (!shouldFallback) return false;

      try {
        setProgress((prev) => Math.max(prev, 15));
        setProgressMsg(t('readingRetry'));
        const result = await readCard(undefined, false);
        if (result.success && result.data) {
          cardApiReachableRef.current = true;
          setCardApiReachable(true);
          setWsConnected(true);
          setError(null);
          setCardData(citizenInfoToThaiIdData(result.data));
          setStreamingCitizen(result.data);
          setIsReading(false);
          readDoneRef.current = true;
          setProgress(100);
          setProgressMsg('');
          return true;
        }

        if (result.error) {
          finishRead({
            errorMessage:
              result.error.includes('EMPTY') || result.error.includes('NO IC CARD')
                ? t('errorInsertCard')
                : result.error,
          });
          return true;
        }
      } catch {
        // fall back to original error below
      }

      return false;
    },
    [finishRead, t],
  );

  const handleRead = useCallback(async () => {
    if (!hasReader) {
      setError(t('errorConnect'));
      return;
    }
    if (!hasCard) {
      setError(t('errorInsertCard'));
      return;
    }

    setIsReading(true);
    setError(null);
    setCardData(null);
    setStreamingCitizen(null);
    setProgress(2);
    setProgressMsg(t('reading'));
    partialRef.current = {};
    readDoneRef.current = false;

    const cardApi = getCardApiBase();
    const evtSource = new EventSource(`${cardApi}/api/read-card-stream`);

    evtSource.onopen = () => {
      cardApiReachableRef.current = true;
      setCardApiReachable(true);
      setWsConnected(true);
      setError(null);
      if (manualConnectMode) setAutoPollEnabled(true);
    };

    const timeoutId = window.setTimeout(() => {
      evtSource.close();
      finishRead({ errorMessage: t('errorReadTimeout') });
    }, READ_TIMEOUT_MS);

    const clearReadTimeout = () => window.clearTimeout(timeoutId);

    const applyPartial = () => {
      const merged = mergeCitizenInfo(partialRef.current);
      if (hasCitizenPreview(merged)) {
        setStreamingCitizen(merged);
      }
    };

    evtSource.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data) as {
          progress?: number;
          step?: number;
          total?: number;
          message?: string;
          field?: string;
          value?: unknown;
          done?: boolean;
          data?: CitizenInfo;
          error?: string;
        };

        if (payload.progress !== undefined) {
          setProgress((prev) => Math.max(prev, payload.progress ?? 0));
        } else if (
          payload.step !== undefined &&
          payload.total !== undefined &&
          payload.total > 0
        ) {
          setProgress((prev) =>
            Math.max(prev, Math.round((payload.step! / payload.total!) * 100)),
          );
        }

        if (payload.message) setProgressMsg(payload.message);

        if (payload.field && payload.value !== undefined) {
          const f = payload.field;
          const v = payload.value;
          if (f === 'th_name' && typeof v === 'object' && v !== null) {
            partialRef.current = { ...partialRef.current, ...(v as Partial<CitizenInfo>) };
          } else {
            partialRef.current = { ...partialRef.current, [f]: v } as Partial<CitizenInfo>;
          }
          applyPartial();
        }

        if (payload.done && payload.data) {
          clearReadTimeout();
          cardApiReachableRef.current = true;
          setCardApiReachable(true);
          setWsConnected(true);
          setError(null);
          setCardData(citizenInfoToThaiIdData(payload.data));
          setStreamingCitizen(payload.data);
          evtSource.close();
          setIsReading(false);
          readDoneRef.current = true;
          setProgress(100);
          setProgressMsg('');
        } else if (payload.error) {
          clearReadTimeout();
          readDoneRef.current = true;
          evtSource.close();
          const rawError = payload.error;
          void (async () => {
            const recovered = await tryFallbackRead(rawError);
            if (recovered) return;
            finishRead({
              errorMessage:
                rawError.includes('EMPTY') || rawError.includes('NO IC CARD')
                  ? t('errorInsertCard')
                  : rawError,
            });
          })();
        }
      } catch {
        // ignore malformed chunks
      }
    };

    evtSource.onerror = () => {
      if (readDoneRef.current) return;
      if (evtSource.readyState === EventSource.CLOSED) {
        clearReadTimeout();
        finishRead({ errorMessage: t('errorRead') });
      }
    };
  }, [hasReader, hasCard, t, finishRead, manualConnectMode, tryFallbackRead]);

  return {
    readers,
    isLoadingReaders,
    wsConnected: liveConnected,
    cardApiReachable,
    hasReader,
    hasCard,
    isBackendOffline,
    needsManualConnect:
      (manualConnectMode || awaitingCounterDesktop) &&
      !cardApiReachable &&
      !isLoadingReaders,
    isReading,
    cardData,
    streamingCitizen,
    setCardData,
    error,
    setError,
    progress,
    progressMsg,
    handleRead,
    handleRefresh,
    handleConnectLocal,
    loadReaders,
    attachPhoto,
  };
}
