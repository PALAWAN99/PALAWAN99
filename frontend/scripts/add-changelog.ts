/**
 * บันทึกรายการ changelog ลง PostgreSQL (แสดงที่ /admin/changelog)
 *
 * ใช้:
 *   cd frontend && npm run changelog:add -- \
 *     --title "หัวข้อ" --description "รายละเอียด" --type FEATURE
 *
 * เลขเวอร์ชัน (ค่าเริ่มต้น):
 *   - เพิ่มแพตช์ใน `app-meta.ts` อัตโนมัติ (1.0.1 → 1.0.2) แล้วบันทึก changelog ด้วยเลขใหม่
 *   - `--no-bump` — ไม่แก้ app-meta ใช้เลขปัจจุบันในไฟล์
 *   - `--version 1.0.5` — บันทึก changelog ด้วยเลขนี้เท่านั้น (ไม่อัปเดต app-meta)
 */
import '../load-root-env';
import { PrismaPg } from '@prisma/adapter-pg';
import { ChangelogChangeType, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { addChangelogEntry } from '../src/lib/changelog/add-entry';
import {
  assertSemver,
  bumpPatch,
  normalizeSemverVersion,
  readAppVersionFromFile,
  writeAppVersion,
} from './version-utils';

const CHANGE_TYPES = new Set<ChangelogChangeType>([
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

function parseType(raw: string | undefined): ChangelogChangeType {
  const upper = (raw ?? 'FEATURE').toUpperCase() as ChangelogChangeType;
  if (!CHANGE_TYPES.has(upper)) {
    throw new Error(`Invalid --type "${raw}". Use: FEATURE | FIX | IMPROVEMENT | SECURITY | OTHER`);
  }
  return upper;
}

async function main() {
  const title = readArg('title');
  const description = readArg('description');
  const explicitVersion = readArg('version');
  const noBump = process.argv.includes('--no-bump');
  const changeType = parseType(readArg('type'));

  if (!title?.trim()) {
    console.error('Missing --title');
    process.exit(1);
  }
  if (!description?.trim()) {
    console.error('Missing --description');
    process.exit(1);
  }

  let versionForEntry: string;
  let bumpedFrom: string | undefined;

  if (explicitVersion?.trim()) {
    versionForEntry = normalizeSemverVersion(explicitVersion);
    assertSemver(versionForEntry, '[changelog:add]');
  } else if (noBump) {
    versionForEntry = readAppVersionFromFile();
  } else {
    const current = readAppVersionFromFile();
    versionForEntry = bumpPatch(current);
    writeAppVersion(versionForEntry);
    bumpedFrom = current;
    console.log(`📌 APP_VERSION ${current} → ${versionForEntry} (แพตช์อัตโนมัติ)`);
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in root .env');
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const entry = await addChangelogEntry(prisma, {
      version: versionForEntry,
      title: title.trim(),
      description: description.trim(),
      changeType,
    });
    console.log(`✅ Changelog saved (${entry.version}): ${entry.title}`);
    console.log(`   View: http://localhost:3000/admin/changelog`);
    if (bumpedFrom != null) {
      console.log(`   อย่าลืม commit frontend/src/lib/app-meta.ts พร้อมโค้ดรอบนี้`);
    }
  } catch (err) {
    if (bumpedFrom != null) {
      writeAppVersion(bumpedFrom);
      console.error(`↩️  คืน APP_VERSION เป็น ${bumpedFrom} เนื่องจากบันทึก DB ไม่สำเร็จ`);
    }
    throw err;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
