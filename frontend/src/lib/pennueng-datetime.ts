/** Pennueng SQL Server stores Thailand wall-clock in `datetime` (no TZ). node-mssql maps it to UTC `Date`. */
const BANGKOK_TZ = 'Asia/Bangkok';

function wallClockParts(value: Date) {
  return {
    y: value.getUTCFullYear(),
    mo: value.getUTCMonth(),
    da: value.getUTCDate(),
    h: value.getUTCHours(),
    mi: value.getUTCMinutes(),
    s: value.getUTCSeconds(),
    ms: value.getUTCMilliseconds(),
  };
}

/** ISO string with +07:00 so clients format correctly in Asia/Bangkok. */
export function pennuengSqlDateToIso(value: Date): string {
  const { y, mo, da, h, mi, s, ms } = wallClockParts(value);
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${y}-${pad(mo + 1)}-${pad(da)}T${pad(h)}:${pad(mi)}:${pad(s)}.${String(ms).padStart(3, '0')}+07:00`;
}

function bangkokPartsFromInstant(instant: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: BANGKOK_TZ,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    })
      .formatToParts(instant)
      .filter((p) => p.type !== 'literal')
      .map((p) => [p.type, parseInt(p.value, 10)]),
  ) as { year: number; month: number; day: number; hour: number; minute: number; second: number };
  const hour = parts.hour === 24 ? 0 : parts.hour;
  return { ...parts, hour };
}

/** Client ISO (+07:00) → Date for mssql (UTC fields = Bangkok wall clock). */
export function isoToPennuengSqlDate(iso: string): Date {
  const { year, month, day, hour, minute, second } = bangkokPartsFromInstant(new Date(iso));
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

/** Mantine DateTimePicker value → Bangkok wall-clock ISO for API. */
export function pickerValueToBangkokIso(value: Date): string {
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}+07:00`;
}

export function bangkokNowIso(): string {
  return pickerValueToBangkokIso(new Date());
}

export function formatPennuengBangkok(
  value: Date | string,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' },
): string {
  const iso = typeof value === 'string' ? value : pennuengSqlDateToIso(value);
  return new Date(iso).toLocaleString('th-TH', { timeZone: BANGKOK_TZ, ...options });
}
