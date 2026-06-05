import fs from 'node:fs';
import path from 'node:path';

/** รูปแบบเวอร์ชันแอป (ไม่รองรับ pre-release tag) */
export const SEMVER = /^\d+\.\d+\.\d+$/;

const APP_META = path.join(__dirname, '../src/lib/app-meta.ts');

export function normalizeSemverVersion(raw: string): string {
  const t = raw.trim();
  return t.startsWith('v') || t.startsWith('V') ? t.slice(1) : t;
}

export function assertSemver(version: string, label: string): void {
  if (!SEMVER.test(version)) {
    throw new Error(`${label}: เวอร์ชันไม่ถูกต้อง "${version}" ต้องเป็นรูปแบบ X.Y.Z`);
  }
}

export function readAppVersionFromFile(): string {
  const content = fs.readFileSync(APP_META, 'utf8');
  const m = content.match(/export const APP_VERSION = '([^']*)'/);
  if (!m?.[1]) {
    throw new Error(`[version] ไม่พบ APP_VERSION ใน ${APP_META}`);
  }
  return m[1];
}

export function writeAppVersion(version: string): void {
  const content = fs.readFileSync(APP_META, 'utf8');
  if (!content.match(/export const APP_VERSION = '[^']*'/)) {
    throw new Error(`[version] ไม่พบบรรทัด APP_VERSION ใน ${APP_META}`);
  }
  const updated = content.replace(/export const APP_VERSION = '[^']*'/, `export const APP_VERSION = '${version}'`);
  fs.writeFileSync(APP_META, updated, 'utf8');
}

/** เพิ่มเลขแพตช์ (Z+1) เท่านั้น */
export function bumpPatch(version: string): string {
  assertSemver(version, 'bumpPatch');
  const [a, b, c] = version.split('.').map((s) => Number(s));
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
    throw new Error(`bumpPatch: invalid parts "${version}"`);
  }
  return `${a}.${b}.${c + 1}`;
}
