/** QrPolicy.ttlSeconds is stored in DB; UI shows hours. */

export const MIN_TTL_HOURS = 1;
export const MIN_TTL_SECONDS = MIN_TTL_HOURS * 3600;

export function ttlSecondsToHours(seconds: number): number {
  return seconds / 3600;
}

export function ttlHoursToSeconds(hours: number): number {
  return Math.round(hours * 3600);
}

export function formatTtlHours(seconds: number): string {
  const h = ttlSecondsToHours(seconds);
  return Number.isInteger(h) ? String(h) : h.toFixed(1);
}
