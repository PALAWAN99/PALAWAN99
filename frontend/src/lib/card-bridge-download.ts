import { apiPath, withBasePath } from './base-path';
import { APP_VERSION } from './app-meta';

/** Chrome extension zips shown publicly for both macOS and Windows. */
export const EXTENSION_PUBLIC_DOWNLOAD_ENABLED = true;

export function isExtensionDownloadVisible(os: 'mac' | 'windows'): boolean {
  if (os === 'windows') return true;
  return EXTENSION_PUBLIC_DOWNLOAD_ENABLED;
}

/** Chrome Card Bridge zip (run `npm run extension:pack` before deploy). */
export const CARD_BRIDGE_ZIP_FILENAME = 'kku-smart-access-card-bridge.zip';

/** API route serves zip reliably under basePath (static /downloads/ often 404 in standalone). */
export function cardBridgeZipUrl(): string {
  const path = apiPath('/api/card-bridge-extension');
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return path;
}

/** One-click installer zip (Mac or Windows). Hidden from UI when EXTENSION_PUBLIC_DOWNLOAD_ENABLED is false. */
export function cardBridgeEasyInstallUrl(os: 'mac' | 'windows'): string {
  const q = os === 'windows' ? 'windows' : 'mac';
  const path = apiPath(`/api/card-bridge-easy-install?os=${q}&v=${APP_VERSION}`);
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return path;
}

/** Legacy static path (fallback). */
export function cardBridgeStaticZipUrl(): string {
  return withBasePath(`/downloads/${CARD_BRIDGE_ZIP_FILENAME}`);
}

/** Desktop Card API (.dmg Mac / .zip Windows) — primary install path for counters. */
export function cardAgentDownloadUrl(os: 'mac' | 'windows'): string {
  const q = os === 'windows' ? 'windows' : 'mac';
  const path = apiPath(`/api/card-agent?os=${q}&v=${APP_VERSION}`);
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${path}`;
  }
  return path;
}
