import { PrismaClient } from '@prisma/client';

// ป้องกันไม่ให้ไฟล์นี้ถูกรันในฝั่ง Browser
if (typeof window !== 'undefined') {
  console.warn('[Prisma] Client skipped on browser.');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  if (typeof window !== 'undefined') return null as any;

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  globalForPrisma.prisma = prisma;
}
