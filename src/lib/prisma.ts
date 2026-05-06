import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'node:path';

// สำคัญ: ต้องกำหนดค่าใน process.env ตั้งแต่ต้นไฟล์เพื่อให้ Prisma Internal ไม่พัง
if (typeof window === 'undefined') {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'file:./dev.db';
  }
}

// ป้องกันไม่ให้ไฟล์นี้ถูกรันในฝั่ง Browser
if (typeof window !== 'undefined') {
  console.warn('[Prisma] Client skipped on browser.');
}

function createPrismaClient() {
  if (typeof window !== 'undefined') return null as any;

  // บังคับให้มีค่าเสมอ ไม่พึ่งพาแค่ process.env อย่างเดียว
  const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
  console.log('[Prisma] Initializing with URL:', dbUrl);

  try {
    // ใน Prisma 7 @prisma/adapter-better-sqlite3 คาดหวัง Config Object ที่มี url
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.error('[Prisma] CRITICAL: Failed to initialize PrismaClient with adapter:', error);
    // สุดท้ายจริงๆ ถ้า adapter พัง ให้พยายามสร้างแบบปกติ
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalForPrisma.prisma = prisma;
}
