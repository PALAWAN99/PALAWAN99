import { APP_BASE_PATH, apiPath } from './base-path';

/** Patch fetch/sendBeacon so `/api/*` works under NEXT_PUBLIC_BASE_PATH (e.g. /smart-access). */
function patchClientApiPaths(): void {
  if (typeof window === 'undefined' || !APP_BASE_PATH) return;

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      return nativeFetch(apiPath(input), init);
    }
    if (input instanceof Request) {
      const url = new URL(input.url);
      if (url.pathname.startsWith('/api/')) {
        const next = apiPath(`${url.pathname}${url.search}`);
        return nativeFetch(new Request(next, input), init);
      }
    }
    return nativeFetch(input, init);
  };

  if (navigator.sendBeacon) {
    const nativeBeacon = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url: string | URL, data?: BodyInit | null) => {
      if (typeof url === 'string' && url.startsWith('/api/')) {
        return nativeBeacon(apiPath(url), data);
      }
      return nativeBeacon(url, data);
    };
  }
}

patchClientApiPaths();
