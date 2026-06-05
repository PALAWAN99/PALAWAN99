import { APP_BASE_PATH, apiPath } from './base-path';
import {
  formatCardApiFetchError,
  getCardApiBase,
  isCardApiProxyMode,
  usesExtensionBridgeForApi,
  usesLocalCardApi,
} from './card-api-base';
import {
  cardExtensionRequest,
  subscribeExtensionCardEvents,
} from './card-api-extension';

function cardEventsStreamUrl(): string {
  if (typeof window !== 'undefined' && usesLocalCardApi()) {
    return `${getCardApiBase()}/api/card-events-stream`;
  }
  if (typeof window !== 'undefined' && APP_BASE_PATH) {
    return `${window.location.origin}${apiPath('/api/card-events-stream')}`;
  }
  return `${apiBase()}/api/card-events-stream`;
}

function apiBase(): string {
  return getCardApiBase();
}

export interface ReaderInfo {
  name: string;
  has_card: boolean;
}

export interface CitizenInfo {
  cid: string;
  th_prefix: string;
  th_firstname: string;
  th_middlename: string;
  th_lastname: string;
  en_prefix: string;
  en_firstname: string;
  en_middlename: string;
  en_lastname: string;
  date_of_birth: string;
  gender: string;
  card_issuer: string;
  issue_date: string;
  expire_date: string;
  address: string;
  photo_base64: string | null;
}

export interface CardReadResponse {
  success: boolean;
  data: CitizenInfo | null;
  error: string | null;
}

export interface ReadersResponse {
  readers: ReaderInfo[];
}

export interface CardEvent {
  event: "card_inserted" | "card_removed";
  reader: string;
  timestamp: string;
}

const API_FETCH_TIMEOUT_MS = 8_000;

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = API_FETCH_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchReaders(): Promise<ReadersResponse> {
  if (usesExtensionBridgeForApi()) {
    return cardExtensionRequest<ReadersResponse>('getReaders');
  }
  const base = apiBase();
  try {
    const res = await fetchWithTimeout(`${base}/api/readers`);
    if (!res.ok) throw new Error("Failed to fetch readers");
    return res.json();
  } catch (err) {
    throw new Error(formatCardApiFetchError(err, base));
  }
}

/** Ask backend to close the USB reader singleton; next use reconnects fresh. */
export async function resetReaderConnection(): Promise<{
  success: boolean;
  error?: string;
}> {
  if (usesExtensionBridgeForApi()) {
    return cardExtensionRequest('resetReader');
  }
  const res = await fetch(`${apiBase()}/api/readers/reset`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to reset reader");
  return res.json();
}

export async function readCard(
  reader?: string,
  skipPhoto?: boolean
): Promise<CardReadResponse> {
  const sp = new URLSearchParams();
  if (reader) sp.set("reader", reader);
  if (skipPhoto) sp.set("skip_photo", "true");
  const qs = sp.toString();
  if (usesExtensionBridgeForApi()) {
    return cardExtensionRequest<CardReadResponse>('readCard', {
      reader: reader ?? undefined,
      skipPhoto: skipPhoto ?? false,
    });
  }
  const res = await fetch(`${apiBase()}/api/read-card${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to read card");
  return res.json();
}

export async function readPhoto(
  reader?: string
): Promise<{ success: boolean; photo_base64?: string; error?: string }> {
  const params = reader ? `?reader=${encodeURIComponent(reader)}` : "";
  if (usesExtensionBridgeForApi()) {
    return cardExtensionRequest('readPhoto', { reader: reader ?? undefined });
  }
  const res = await fetch(`${apiBase()}/api/read-card/photo${params}`);
  if (!res.ok) throw new Error("Failed to read photo");
  return res.json();
}

export function exportJsonUrl(reader?: string): string {
  const params = reader ? `?reader=${encodeURIComponent(reader)}` : "";
  return `${apiBase()}/api/export/json${params}`;
}

export function exportCsvUrl(reader?: string): string {
  const params = reader ? `?reader=${encodeURIComponent(reader)}` : "";
  return `${apiBase()}/api/export/csv${params}`;
}

export interface RfidResult {
  success: boolean;
  uid_hex?: string;
  uid_decimal?: string;
  uid_bytes?: number[];
  uid_length?: number;
  card_type?: string;
  error?: string;
}

export async function readRfid(): Promise<RfidResult> {
  if (usesExtensionBridgeForApi()) {
    return cardExtensionRequest<RfidResult>('readRfid');
  }
  const res = await fetchWithTimeout(`${apiBase()}/api/rfid/read`);
  if (!res.ok) throw new Error("Failed to read RFID");
  return res.json();
}

export interface DiagnosticInfo {
  usb_detected: boolean;
  usb_vid: string | null;
  usb_pid: string | null;
  usb_product: string | null;
  usb_serial: string | null;
  usb_mode: string | null;
  usb_interface_class: string | null;
  pcsc_readers: string[];
  pcsc_available: boolean;
  pyusb_available: boolean;
  vendor_protocol_available: boolean;
  mock_mode: boolean;
  message: string;
}

const DIAGNOSTIC_TIMEOUT_MS = 8_000;

export async function fetchDiagnostic(): Promise<DiagnosticInfo> {
  if (usesExtensionBridgeForApi()) {
    return cardExtensionRequest<DiagnosticInfo>('diagnostic');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DIAGNOSTIC_TIMEOUT_MS);
  try {
    const res = await fetch(`${apiBase()}/api/diagnostic`, {
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("Failed to fetch diagnostic");
    return res.json();
  } catch (err) {
    throw new Error(formatCardApiFetchError(err, apiBase()));
  } finally {
    clearTimeout(timer);
  }
}

function parseCardEventPayload(raw: string): CardEvent | null {
  try {
    return JSON.parse(raw) as CardEvent;
  } catch {
    return null;
  }
}

export function createCardEventSocket(
  onEvent: (event: CardEvent) => void,
): WebSocket | null {
  const wsUrl = apiBase().replace(/^http/, "ws") + "/ws/card-events";
  try {
    const ws = new WebSocket(wsUrl);
    ws.onmessage = (msg) => {
      const event = parseCardEventPayload(String(msg.data));
      if (event) onEvent(event);
    };
    return ws;
  } catch {
    return null;
  }
}

/** Live card events: SSE via Next.js on production (rev-proxy blocks WSS to /card-api/). */
export function subscribeCardEvents(
  onEvent: (event: CardEvent) => void,
  handlers?: { onConnect?: () => void; onDisconnect?: () => void },
): () => void {
  let ws: WebSocket | null = null;
  let es: EventSource | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  const cleanup = () => {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    ws?.close();
    ws = null;
    es?.close();
    es = null;
  };

  const connectSse = () => {
    if (closed || es) return;
    es = new EventSource(cardEventsStreamUrl());
    es.onopen = () => handlers?.onConnect?.();
    es.onmessage = (msg) => {
      const event = parseCardEventPayload(msg.data);
      if (event) onEvent(event);
    };
    es.onerror = () => {
      handlers?.onDisconnect?.();
      es?.close();
      es = null;
      if (!closed) {
        reconnectTimer = setTimeout(connectSse, 3000);
      }
    };
  };

  const fallbackToSse = () => {
    if (closed || es) return;
    ws?.close();
    ws = null;
    connectSse();
  };

  if (usesExtensionBridgeForApi()) {
    handlers?.onConnect?.();
    return subscribeExtensionCardEvents((payload) => {
      if (payload.event === 'card_inserted' || payload.event === 'card_removed') {
        onEvent({
          event: payload.event,
          reader: payload.reader,
          timestamp: payload.timestamp,
        });
      }
    });
  }

  // Server-side card-api on lib.kku.ac.th: rev-proxy breaks live streams — polling only.
  if (isCardApiProxyMode() && !usesLocalCardApi()) {
    handlers?.onConnect?.();
    return cleanup;
  }

  if (usesLocalCardApi()) {
    connectSse();
    return cleanup;
  }

  ws = createCardEventSocket(onEvent);
  if (!ws) {
    connectSse();
    return cleanup;
  }

  ws.onopen = () => handlers?.onConnect?.();
  ws.onerror = fallbackToSse;
  ws.onclose = () => {
    handlers?.onDisconnect?.();
    if (!closed && !es) fallbackToSse();
  };

  return cleanup;
}
