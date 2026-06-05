/** Locale prefix for non-default locales only (`/en`, `/zh`). Default Thai uses ``. */
export function localePathPrefix(pathname: string): string {
  const match = pathname.match(/^\/(en|zh)(?=\/|$)/);
  return match ? `/${match[1]}` : '';
}
