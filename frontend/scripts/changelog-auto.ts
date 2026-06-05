/**
 * สร้างรายการ changelog อัตโนมัติจาก commit ล่าสุด (conventional commit)
 *
 * ใช้:
 *   cd frontend && npm run changelog:auto
 *
 * ติดตั้ง git hook ให้รันหลังทุก commit:
 *   ./scripts/install-git-hooks.sh
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import '../load-root-env';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { APP_VERSION } from '../src/lib/app-meta';
import { addChangelogEntry } from '../src/lib/changelog/add-entry';
import {
  formatChangelogDescription,
  inferChangeTypeFromSubject,
  subjectToTitle,
} from '../src/lib/changelog/git-parser';

/** รันจาก `frontend/` — ราก monorepo อยู่ขึ้นไปหนึ่งระดับ */
const REPO_ROOT = path.resolve(process.cwd(), '..');

function getLastCommit(): { hash: string; subject: string; body: string } {
  const out = execSync('git log -1 --format=%H%n%s%n%b', {
    encoding: 'utf8',
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trimEnd();
  const lines = out.split('\n');
  const hash = lines[0]?.trim() ?? '';
  const subject = lines[1]?.trim() ?? '';
  const body = lines.slice(2).join('\n').trim();
  if (!hash || !subject) {
    throw new Error('ไม่พบ git commit (รันใน repo ที่มี .git)');
  }
  return { hash, subject, body };
}

async function main() {
  const { hash, subject, body } = getLastCommit();
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in root .env');
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const delegate = prisma.changelogEntry;
    if (!delegate?.findFirst) {
      throw new Error('รัน: cd frontend && npx prisma generate');
    }

    const existing = await delegate.findFirst({
      where: { description: { contains: `changelog-git:${hash}` } },
    });
    if (existing) {
      console.log(`⏭️  ข้าม — changelog สำหรับ commit ${hash.slice(0, 7)} มีแล้ว`);
      return;
    }

    const changeType = inferChangeTypeFromSubject(subject);
    const title = subjectToTitle(subject);
    const description = formatChangelogDescription(body, hash);

    const entry = await addChangelogEntry(prisma, {
      version: APP_VERSION,
      title,
      description,
      changeType,
    });
    console.log(`✅ Changelog auto (${entry.changeType}) v${entry.version}: ${entry.title}`);
    console.log(`   commit ${hash.slice(0, 7)} → /admin/changelog`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
