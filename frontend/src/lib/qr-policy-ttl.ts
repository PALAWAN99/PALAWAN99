/** QrPolicy.ttlSeconds is stored in DB; UI shows hours, days, months, years, or lifetime. */

export const MIN_TTL_HOURS = 1;
export const MIN_TTL_SECONDS = MIN_TTL_HOURS * 3600;

export type TtlUnit = 'hour' | 'day' | 'month' | 'year' | 'lifetime';

export const LIFETIME_TTL_SECONDS = 2147483647; // Max signed 32-bit int (~68 years)

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

export function decodeTtlSeconds(seconds: number): { value: number; unit: TtlUnit } {
  if (seconds >= LIFETIME_TTL_SECONDS - 10) { // Allow slight rounding / offset
    return { value: 1, unit: 'lifetime' };
  }

  // Check if it is a multiple of years (365 days = 31,536,000 seconds)
  if (seconds > 0 && seconds % 31536000 === 0) {
    return { value: seconds / 31536000, unit: 'year' };
  }

  // Check if it is a multiple of months (30 days = 2,592,000 seconds)
  if (seconds > 0 && seconds % 2592000 === 0) {
    return { value: seconds / 2592000, unit: 'month' };
  }

  // Check if it is a multiple of days (24 hours = 86,400 seconds)
  if (seconds > 0 && seconds % 86400 === 0) {
    return { value: seconds / 86400, unit: 'day' };
  }

  return { value: seconds / 3600, unit: 'hour' };
}

export function encodeTtlToSeconds(value: number, unit: TtlUnit): number {
  if (unit === 'lifetime') {
    return LIFETIME_TTL_SECONDS;
  }
  const cleanValue = Math.max(1, Math.round(value));
  if (unit === 'year') {
    return cleanValue * 31536000;
  }
  if (unit === 'month') {
    return cleanValue * 2592000;
  }
  if (unit === 'day') {
    return cleanValue * 86400;
  }
  return cleanValue * 3600; // hour
}

export function formatTtl(seconds: number, t: (key: string) => string): string {
  const { value, unit } = decodeTtlSeconds(seconds);
  if (unit === 'lifetime') {
    return t('Qr.policyTtlLifetime');
  }
  const unitStr = t(`Qr.policyTtl${unit.charAt(0).toUpperCase() + unit.slice(1)}sUnit`);
  return `${value} ${unitStr}`;
}
