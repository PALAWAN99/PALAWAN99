/** Poll interval while waiting for card insert (reader online). */
export const POLL_WAITING_CARD_MS = 3000;
/** Default poll when reader is connected. */
export const POLL_DEFAULT_MS = 5000;
/** Server-hosted Card API (no local USB). */
export const POLL_SERVER_MS = 8000;
/** When Card API is unreachable — avoid hammering console/network. */
export const POLL_OFFLINE_MS = 45_000;
/** Tab in background — minimal probes. */
export const POLL_HIDDEN_MS = 120_000;

export function getReaderPollDelayMs(opts: {
  cardApiReachable: boolean;
  serverOnly: boolean;
  hasReader: boolean;
  hasCardFromApi: boolean;
  documentHidden: boolean;
}): number {
  if (opts.documentHidden) return POLL_HIDDEN_MS;
  if (!opts.cardApiReachable) return POLL_OFFLINE_MS;
  if (opts.serverOnly) return POLL_SERVER_MS;
  if (opts.hasReader && !opts.hasCardFromApi) return POLL_WAITING_CARD_MS;
  return POLL_DEFAULT_MS;
}
