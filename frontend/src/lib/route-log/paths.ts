const SKIP_PATH_PREFIXES = [
  '/api/logs/route',
  '/api/health',
  '/_next/',
  '/favicon',
];

export function shouldSkipRouteLog(path: string): boolean {
  if (!path) return true;
  return SKIP_PATH_PREFIXES.some((p) => path.startsWith(p));
}

/** แปลง path จริงเป็น pattern สำหรับ aggregate (ซ่อน uuid / id ตัวเลข) */
export function normalizeRoutePattern(path: string): string {
  return path
    .replace(
      /\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi,
      '/:id',
    )
    .replace(/\/\d+(?=\/|$)/g, '/:id')
    .replace(/\/+$/, '') || '/';
}
