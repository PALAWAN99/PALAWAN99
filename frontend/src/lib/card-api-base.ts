import { APP_BASE_PATH } from './base-path';

const STORAGE_KEY = 'cardApiBaseUrl';
/** Set when user or desktop auto-config explicitly chose localhost on a remote site. */
const LOCAL_EXPLICIT_KEY = 'cardApiLocalExplicit';
const DEFAULT_LOCAL = 'http://127.0.0.1:8000';
const LOCAL_PROBE_PORTS = [8000, 8001, 8002, 8003, 8010, 18080] as const;
const LOCAL_PROBE_MS = 1500;

export function isLocalhostCardApiUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === '127.0.0.1' || hostname === 'localhost';
  } catch {
    return /127\.0\.0\.1|localhost/i.test(url);
  }
}

/** Production subpath (/smart-access) → Card API on server via nginx unless explicitly disabled. */
export function isCardApiProxyMode(): boolean {
  if (
    process.env.NEXT_PUBLIC_CARD_API_PROXY === 'false' ||
    process.env.NEXT_PUBLIC_CARD_API_PROXY === '0'
  ) {
    return false;
  }
  if (
    process.env.NEXT_PUBLIC_CARD_API_PROXY === 'true' ||
    process.env.NEXT_PUBLIC_CARD_API_PROXY === '1'
  ) {
    return true;
  }
  return Boolean(APP_BASE_PATH);
}

function cardApiProxyBase(): string | null {
  if (!isCardApiProxyMode() || !APP_BASE_PATH) return null;

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${APP_BASE_PATH}/card-api`;
  }
  const origin = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (origin) {
    try {
      return `${new URL(origin).origin}${APP_BASE_PATH}/card-api`;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Default Card API URL:
 * - explicit NEXT_PUBLIC_API_URL, or
 * - same-origin /smart-access/card-api when deployed with base path (reader on Linux server), or
 * - localhost (Windows PC with USB at counter).
 */
export function getDefaultCardApiBase(): string {
  // Production build must not use localhost from server .env (common misconfig).
  if (typeof window !== 'undefined' && APP_BASE_PATH) {
    const { origin, hostname } = window.location;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${origin}${APP_BASE_PATH}/card-api`;
    }
  }

  const proxied = cardApiProxyBase();
  if (proxied) return proxied;

  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit && !isLocalhostCardApiUrl(explicit)) {
    return explicit.replace(/\/$/, '');
  }

  return DEFAULT_LOCAL;
}

/** Chrome extension Native Messaging bridge (see extension/README.md). */
export function usesExtensionBridge(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement?.dataset?.kkuCardBridge === 'active';
}

/**
 * Route Card API calls through Native Messaging only when Bridge is on and
 * we are not also using localhost (KKU Card API desktop). Avoids stale native
 * hosts missing methods like readRfid while desktop app is running.
 */
export function usesExtensionBridgeForApi(): boolean {
  if (typeof window === 'undefined') return false;
  if (!usesExtensionBridge()) return false;
  return !isLocalhostCardApiUrl(getCardApiBase());
}

/** True when Card API runs on this PC (localhost or extension bridge). */
export function usesLocalCardApi(): boolean {
  if (typeof window === 'undefined') return false;
  return usesExtensionBridge() || isLocalhostCardApiUrl(getCardApiBase());
}

/** Fetching /smart-access/card-api on the server (cannot see USB on counter PC). */
export function usesServerCardApi(): boolean {
  if (typeof window === 'undefined') return false;
  if (!isCardApiProxyMode() || usesLocalCardApi()) return false;
  const base = getCardApiBase();
  return base.includes('/card-api');
}

function isRemoteProductionHost(): boolean {
  if (typeof window === 'undefined') return false;
  const { hostname } = window.location;
  return hostname !== 'localhost' && hostname !== '127.0.0.1';
}

/** Counter PC on lib.kku.ac.th must opt in to localhost (desktop app), not stale localStorage. */
function shouldUseStoredLocalhost(stored: string): boolean {
  if (!isLocalhostCardApiUrl(stored)) return true;
  if (!isRemoteProductionHost() || !isCardApiProxyMode()) return true;
  try {
    return sessionStorage.getItem(LOCAL_EXPLICIT_KEY) === '1';
  } catch {
    return false;
  }
}

export function markCardApiLocalExplicit(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(LOCAL_EXPLICIT_KEY, '1');
  } catch {
    // ignore
  }
}

export function clearCardApiLocalExplicit(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(LOCAL_EXPLICIT_KEY);
  } catch {
    // ignore
  }
}

/** Runtime base URL (localStorage override from ตั้งค่าเครื่องอ่าน). */
export function getCardApiBase(): string {
  const fallback = getDefaultCardApiBase();

  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)?.trim();
    if (!stored) return fallback;
    const normalized = stored.replace(/\/$/, '');
    if (!shouldUseStoredLocalhost(normalized)) return fallback;
    return normalized;
  } catch {
    return fallback;
  }
}

export const CARD_API_BASE_CHANGED = 'kku-card-api-base-changed';

export function setCardApiBase(url: string): void {
  if (typeof window === 'undefined') return;
  const trimmed = url.trim().replace(/\/$/, '');
  if (trimmed) {
    localStorage.setItem(STORAGE_KEY, trimmed);
    if (isLocalhostCardApiUrl(trimmed)) markCardApiLocalExplicit();
    else clearCardApiLocalExplicit();
  } else {
    localStorage.removeItem(STORAGE_KEY);
    clearCardApiLocalExplicit();
  }
  window.dispatchEvent(new Event(CARD_API_BASE_CHANGED));
}

export function getCardApiStorageKey(): string {
  return STORAGE_KEY;
}

/** Apply launch hints from desktop app — avoids WAF blocking full http://127.0.0.1 URLs in query. */
function applyCardApiPort(portRaw: string | null): string | null {
  if (!portRaw?.trim()) return null;
  const port = Number.parseInt(portRaw.trim(), 10);
  if (!Number.isFinite(port) || port < 1 || port > 65535) return null;
  const base = `http://127.0.0.1:${port}`;
  setCardApiBase(base);
  markCardApiLocalExplicit();
  return base;
}

/** Apply ?cardApiPort= / ?localCardApi= / ?cardApi= from desktop app launch. */
export function applyCardApiFromUrlParam(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);

  const portFromQuery = params.get('cardApiPort') ?? params.get('localCardApiPort');
  if (portFromQuery) {
    const base = applyCardApiPort(portFromQuery);
    if (base) {
      const clean = new URL(window.location.href);
      clean.searchParams.delete('cardApiPort');
      clean.searchParams.delete('localCardApiPort');
      clean.searchParams.delete('localCardApi');
      clean.searchParams.delete('cardApi');
      window.history.replaceState({}, '', `${clean.pathname}${clean.search}${clean.hash}`);
    }
    return base;
  }

  const hash = window.location.hash.replace(/^#/, '');
  if (hash) {
    const hashParams = new URLSearchParams(hash);
    const portFromHash = hashParams.get('cardApiPort') ?? hashParams.get('localCardApiPort');
    if (portFromHash) {
      const base = applyCardApiPort(portFromHash);
      if (base) {
        window.history.replaceState({}, '', window.location.pathname + window.location.search);
      }
      return base;
    }
  }

  const raw = params.get('localCardApi') ?? params.get('cardApi');
  if (!raw?.trim()) return null;
  try {
    const url = new URL(raw.trim());
    if (url.hostname !== '127.0.0.1' && url.hostname !== 'localhost') return null;
    const base = url.origin.replace(/\/$/, '');
    setCardApiBase(base);
    markCardApiLocalExplicit();
    const clean = new URL(window.location.href);
    clean.searchParams.delete('localCardApi');
    clean.searchParams.delete('cardApi');
    window.history.replaceState({}, '', `${clean.pathname}${clean.search}${clean.hash}`);
    return base;
  } catch {
    return null;
  }
}

/** Probe localhost ports (only call after user installs/opens KKU Card API). */
export async function discoverLocalCardApiBase(
  ports: readonly number[] = LOCAL_PROBE_PORTS,
): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  for (const port of ports) {
    const base = `http://127.0.0.1:${port}`;
    try {
      const res = await fetch(`${base}/api/readers`, {
        signal: AbortSignal.timeout(LOCAL_PROBE_MS),
      });
      if (res.ok) return base;
    } catch {
      // try next port
    }
  }
  return null;
}

export type DiscoverLocalCardApiOptions = {
  /** Must be true (button click). Never probe on passive page load. */
  userInitiated?: boolean;
};

/**
 * User-initiated: scan localhost ports when KKU Card API is running.
 * Use from 「ตรวจสอบ Bridge อีกครั้ง」 / 「เชื่อมต่อ Card API」 — not on page load.
 */
export async function discoverAndConfigureLocalCardApi(
  options: DiscoverLocalCardApiOptions = {},
): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (usesExtensionBridge()) return null;
  if (!options.userInitiated) return null;

  const discovered = await discoverLocalCardApiBase();
  if (discovered) {
    setCardApiBase(discovered);
    markCardApiLocalExplicit();
    return discovered;
  }
  return null;
}

/**
 * On page load: saved localhost, optional URL/hash hints, then silent localhost probe on counter PCs.
 * Never put http://127.0.0.1 in navigation URLs — campus WAF (Fortinet) blocks them before Next.js runs.
 */
export async function autoConfigureLocalCardApi(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  if (usesExtensionBridge()) return null;

  const fromUrl = applyCardApiFromUrlParam();
  if (fromUrl) return fromUrl;

  const base = getCardApiBase();
  if (isLocalhostCardApiUrl(base) && shouldUseStoredLocalhost(base)) {
    return base;
  }

  // Counter PC on lib.kku.ac.th: probe localhost after page load (fetch bypasses WAF).
  if (isRemoteProductionHost() && isCardApiProxyMode()) {
    const discovered = await discoverLocalCardApiBase();
    if (discovered) {
      setCardApiBase(discovered);
      markCardApiLocalExplicit();
      return discovered;
    }
  }

  return null;
}

/** User-facing message when Card API is unreachable. */
export function formatCardApiFetchError(err: unknown, base = getCardApiBase()): string {
  const proxy = isCardApiProxyMode();
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return proxy
        ? `Card API ไม่ตอบภายใน 8 วินาที — ตรวจ container smart-access-backend และ nginx ${base}`
        : `Card API ไม่ตอบภายใน 8 วินาที — ตรวจว่าแอป KKU Card API ยังเปิดอยู่ที่ ${base}`;
    }
    const msg = err.message.toLowerCase();
    if (
      msg.includes('communicating with the native messaging host') ||
      msg.includes('native host')
    ) {
      return (
        'Native Host ทำงานไม่สำเร็จ — รัน Install-Windows.bat จาก zip ติดตั้งใหม่ → ทดสอบ Native Host ใน popup → ' +
        'ตรวจ log: %APPDATA%\\KKU-Card-Bridge\\native-host-errors.log (ต้องมี Python 3 + venv)'
      );
    }
    if (
      msg === 'failed to fetch' ||
      msg.includes('networkerror') ||
      msg.includes('connection refused') ||
      msg.includes('err_connection_refused')
    ) {
      return proxy
        ? `เชื่อมต่อ Card API ไม่ได้ (${base}) — ตรวจ docker backend, nginx /smart-access/card-api/, และ USB ที่เซิร์ฟเวอร์`
        : `เชื่อมต่อ Card API ไม่ได้ (${base}) — เปิดแอป KKU Card API บนเครื่องนี้ หรือตั้ง URL ใน ตั้งค่าเครื่องอ่าน`;
    }
    return err.message;
  }
  return `เชื่อมต่อ Card API ไม่ได้ (${base})`;
}
