const PAGE_SOURCE = 'kku-smart-access-page';
const BRIDGE_SOURCE = 'kku-card-bridge';
const REQUEST_TIMEOUT_MS = 30_000;

let bridgeActive = false;
let nativeHostOk = false;
let nativeHostError: string | null = null;
const readyWaiters: Array<() => void> = [];

function markActive(nativeOk = true, nativeErr: string | null = null): void {
  nativeHostOk = nativeOk;
  nativeHostError = nativeErr;
  if (!nativeOk) {
    bridgeActive = false;
    if (typeof document !== 'undefined') {
      delete document.documentElement.dataset.kkuCardBridge;
    }
    return;
  }
  if (bridgeActive) return;
  bridgeActive = true;
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.kkuCardBridge = 'active';
  }
  readyWaiters.splice(0).forEach((fn) => fn());
}

export function getNativeHostError(): string | null {
  return nativeHostError;
}

if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data = event.data as {
      source?: string;
      type?: string;
      nativeOk?: boolean;
      nativeError?: string;
    };
    if (data?.source === BRIDGE_SOURCE && data?.type === 'ready') {
      if (data.nativeOk === false) {
        markActive(false, data.nativeError ?? 'Native host error');
      } else {
        markActive(true, null);
      }
    }
    if (data?.source === BRIDGE_SOURCE && data?.type === 'contextInvalidated') {
      bridgeActive = false;
      delete document.documentElement.dataset.kkuCardBridge;
    }
  });
  window.postMessage({ source: PAGE_SOURCE, type: 'ping' }, '*');
}

/** Chrome extension bridge enabled (Native Messaging on this PC). */
export function isCardExtensionActive(): boolean {
  return bridgeActive;
}

export function whenCardExtensionReady(): Promise<boolean> {
  if (bridgeActive) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), 1500);
    readyWaiters.push(() => {
      clearTimeout(timer);
      resolve(true);
    });
    window.postMessage({ source: PAGE_SOURCE, type: 'ping' }, '*');
  });
}

export async function cardExtensionRequest<T>(
  method: string,
  params?: Record<string, unknown>,
): Promise<T> {
  if (!bridgeActive) {
    const ok = await whenCardExtensionReady();
    if (!ok) {
      throw new Error(
        'Chrome Card Bridge ไม่พร้อม — ติดตั้ง extension และเปิด Bridge ใน popup',
      );
    }
  }

  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const timer = setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('Card bridge timeout (30s)'));
    }, REQUEST_TIMEOUT_MS);

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = event.data as {
        source?: string;
        id?: string;
        result?: T;
        error?: string;
      };
      if (data?.source !== BRIDGE_SOURCE || data.id !== id) return;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      if (data.error) {
        reject(new Error(data.error));
        return;
      }
      const payload = data.result as Record<string, unknown> | undefined;
      if (payload && typeof payload.error === 'string' && payload.success !== true) {
        reject(new Error(payload.error));
        return;
      }
      resolve(data.result as T);
    };

    window.addEventListener('message', onMessage);
    window.postMessage(
      { source: PAGE_SOURCE, type: 'request', id, method, params: params ?? {} },
      '*',
    );
  });
}

export function subscribeExtensionCardEvents(
  onEvent: (payload: {
    event: string;
    reader: string;
    timestamp: string;
  }) => void,
): () => void {
  const onMessage = (event: MessageEvent) => {
    if (event.source !== window) return;
    const data = event.data as {
      source?: string;
      type?: string;
      payload?: { event: string; reader: string; timestamp: string };
    };
    if (data?.source === BRIDGE_SOURCE && data?.type === 'cardEvent' && data.payload) {
      onEvent(data.payload);
    }
  };
  window.addEventListener('message', onMessage);
  return () => window.removeEventListener('message', onMessage);
}
