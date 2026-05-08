<<<<<<< HEAD
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// ป้องกันไม่ให้ไฟล์นี้ถูกรันในฝั่ง Browser
if (typeof window !== 'undefined') {
  console.warn('[Prisma] Client skipped on browser.');
}

function createPrismaClient() {
  if (typeof window !== 'undefined') return null as any;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}
=======
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
>>>>>>> origin/upload/gate-system

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

<<<<<<< HEAD
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalForPrisma.prisma = prisma;
}

=======
function createPrismaClient() {
  // Prisma 7: ใช้ adapter-better-sqlite3 โดยส่ง URL ของไฟล์ฐานข้อมูล
  const adapter = new PrismaBetterSqlite3({
    url: 'file:./dev.db',
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
>>>>>>> origin/upload/gate-system
