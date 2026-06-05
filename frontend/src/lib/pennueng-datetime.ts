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

export function formatPennuengBangkok(
  value: Date | string,
  options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' },
): string {
  const iso = typeof value === 'string' ? value : pennuengSqlDateToIso(value);
  return new Date(iso).toLocaleString('th-TH', { timeZone: BANGKOK_TZ, ...options });
}
