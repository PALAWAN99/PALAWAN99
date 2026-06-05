import 'server-only';
import { loadRootEnv } from '../../load-root-env';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

if (typeof window !== 'undefined') {
  console.warn('[Prisma] Client skipped on browser.');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveDatabaseUrl(): string {
  loadRootEnv();

  const url = process.env.DATABASE_URL?.trim();
  if (url) return url;

  const isBuild =
    process.env.npm_lifecycle_event === 'build' ||
    process.env.NEXT_PHASE === 'phase-production-build';

  if (isBuild) {
    return 'postgresql://build:build@127.0.0.1:5432/build';
  }

  throw new Error(
    'DATABASE_URL is not set. Add it to the repository root `.env`, ensure `frontend/.env` links to it, then restart `npm run dev`.',
  );
}

function createPrismaClient(): PrismaClient {
  const connectionString = resolveDatabaseUrl();
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

/** ตรวจว่า Prisma client รันไทม์มี delegate changelog (หลัง HMR บางครั้ง `in` ไม่ reliable) */
function prismaHasChangelogDelegate(client: PrismaClient | undefined): boolean {
  if (!client) return false;
  const delegate = Reflect.get(client as object, 'changelogEntry') as { count?: unknown } | undefined;
  return typeof delegate?.count === 'function';
}

function getPrisma(): PrismaClient {
  const existing = globalForPrisma.prisma;
  const stale = existing && !prismaHasChangelogDelegate(existing);
  if (stale) {
    void existing.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined;
  }
  if (!globalForPrisma.prisma) {
    const created = createPrismaClient();
    if (!prismaHasChangelogDelegate(created)) {
      void created.$disconnect().catch(() => {});
      throw new Error(
        '[prisma] ChangelogEntry ไม่มีใน Prisma client — รัน `cd frontend && npx prisma generate` แล้วรีสตาร์ท dev server',
      );
    }
    globalForPrisma.prisma = created;
  }
  return globalForPrisma.prisma;
}

/** ตัด singleton (เช่น หลัง HMR) แล้วสร้าง client ใหม่ในครั้งถัดไปที่เข้าถึง prisma */
export async function resetPrismaSingleton(): Promise<void> {
  const existing = globalForPrisma.prisma;
  if (existing) {
    await existing.$disconnect().catch(() => {});
  }
  globalForPrisma.prisma = undefined;
}

/** Lazy Prisma client so root `.env` is loaded before the first query (fixes RSC / Server Actions). */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, client);
    return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(client) : value;
  },
});
