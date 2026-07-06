import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// ป้องกันไม่ให้ไฟล์นี้ถูกรันในฝั่ง Browser
if (typeof window !== 'undefined') {
  console.warn('[Prisma] Client skipped on browser.');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (typeof window !== 'undefined') return null as any;

  // Prisma 7: ใช้ adapter-better-sqlite3 โดยส่ง URL ของไฟล์ฐานข้อมูล
  const adapter = new PrismaBetterSqlite3({
    url: 'file:./dev.db',
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalForPrisma.prisma = prisma;
}
