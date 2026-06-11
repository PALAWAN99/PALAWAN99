/** Current application release (semver, without "v" prefix). */
export const APP_VERSION = '1.0.100';

export const APP_VERSION_LABEL = `v${APP_VERSION}`;

export function appCopyright(year = new Date().getFullYear()): string {
  return `© ${year} KKU Library`;
}
