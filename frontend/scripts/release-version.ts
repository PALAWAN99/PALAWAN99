/**
 * Workflow ปล่อย release: อัปเดต APP_VERSION + บันทึก changelog ด้วยเลขเวอร์ชันเดียวกัน
 *
 * ใช้ (จาก frontend/):
 *   npm run release:version -- --description "สรุปการเปลี่ยนแปลงหลักของรอบนี้"
 *   → เพิ่มเลขแพตช์อัตโนมัติ (เช่น 1.0.1 → 1.0.2) จาก APP_VERSION ปัจจุบัน
 *
 * ระบุเลขเอง:
 *   npm run release:version -- --version 1.1.0 --description "..."
 *
 * ทางเลือก:
 *   --title "หัวข้อ (ไทย)"   (ค่าเริ่มต้น: ปล่อย vX.Y.Z)
 *   --type FEATURE|FIX|...    (ค่าเริ่มต้น: FEATURE)
 *
 * ถ้าบันทึก DB ไม่สำเร็จ จะคืนค่า app-meta.ts เป็นเวอร์ชันเดิม
 */
import fs from 'node:fs';
import path from 'node:path';
import '../load-root-env';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { addChangelogEntry, type AddChangelogInput } from '../src/lib/changelog/add-entry';
import {
  assertSemver,
  bumpPatch,
  normalizeSemverVersion,
  readAppVersionFromFile,
} from './version-utils';

/** สคริปต์ CLI ต้องการ delegate นี้ — cast แยกจาก PrismaClient ทั่วไปเพื่อไม่ชน typings ที่ IDE อาจ cache เก่า */
type PrismaWithChangelog = PrismaClient & {
  changelogEntry: {
    count: (args?: object) => Promise<number>;
  };
};

type ReleaseChangeType = 'FEATURE' | 'FIX' | 'IMPROVEMENT' | 'SECURITY' | 'OTHER';

const CHANGE_TYPES = new Set<ReleaseChangeType>([
  'FEATURE',
  'FIX',
  'IMPROVEMENT',
  'SECURITY',
  'OTHER',
]);

function readArg(name: string): string | undefined {
  const flag = `--${name}`;
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith('--')) return undefined;
  return next;
}

function parseType(raw: string | undefined): ReleaseChangeType {
  const upper = (raw ?? 'FEATURE').toUpperCase() as ReleaseChangeType;
  if (!CHANGE_TYPES.has(upper)) {
    throw new Error(`Invalid --type "${raw}". Use: FEATURE | FIX | IMPROVEMENT | SECURITY | OTHER`);
  }
  return upper;
}

const APP_META = path.join(__dirname, '../src/lib/app-meta.ts');

function patchAppVersion(content: string, version: string): string {
  if (!content.match(/export const APP_VERSION = '[^']*'/)) {
    throw new Error(`[release] ไม่พบบรรทัด APP_VERSION ใน ${APP_META}`);
  }
  return content.replace(/export const APP_VERSION = '[^']*'/, `export const APP_VERSION = '${version}'`);
}

async function main() {
  const description = readArg('description')?.trim();
  if (!description) {
    console.error('Missing --description (สรุป release สั้นๆ ภาษาไทย)');
    process.exit(1);
  }

  const previous = fs.readFileSync(APP_META, 'utf8');
  const previousVersion = readAppVersionFromFile();

  const rawVersion = readArg('version');
  let version: string;
  if (rawVersion?.trim()) {
    version = normalizeSemverVersion(rawVersion);
    assertSemver(version, '[release]');
  } else {
    version = bumpPatch(previousVersion);
    console.log(`📌 ไม่ระบุ --version → เพิ่มแพตช์อัตโนมัติ: ${previousVersion} → ${version}`);
  }

  const title = (readArg('title')?.trim() || `ปล่อย v${version}`).slice(0, 200);

  if (previousVersion === version) {
    console.warn(`⚠️  APP_VERSION อยู่ที่ ${version} อยู่แล้ว — จะบันทึก changelog ต่อด้วยเลขเดิม`);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in root .env');
  }

  const updated = patchAppVersion(previous, version);

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) }) as PrismaWithChangelog;

  try {
    if (typeof prisma.changelogEntry?.count !== 'function') {
      throw new Error('[release] Prisma ไม่มี changelogEntry — รัน npx prisma generate');
    }

    fs.writeFileSync(APP_META, updated, 'utf8');

    try {
      const entry = await addChangelogEntry(prisma as PrismaClient, {
        version,
        title,
        description,
        changeType: parseType(readArg('type')) as NonNullable<AddChangelogInput['changeType']>,
      });
      console.log(`✅ Release ${version}`);
      console.log(`   app-meta.ts → APP_VERSION = ${version}`);
      console.log(`   changelog: ${entry.title}`);
      console.log(`   ดูที่ /admin/changelog — commit ไฟล์ app-meta.ts พร้อมโค้ดรอบนี้`);
    } catch (dbErr) {
      fs.writeFileSync(APP_META, previous, 'utf8');
      throw dbErr;
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
