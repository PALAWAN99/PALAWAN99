import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const start = Date.now();

  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1 as health_check`;
    const dbLatency = Date.now() - start;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      stack: {
        framework: 'Next.js 16',
        orm: 'Prisma 7',
        database: 'PostgreSQL',
        ui: 'Mantine v9',
      },
      database: {
        connected: true,
        latencyMs: dbLatency,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: message,
        },
      },
      { status: 503 }
    );
  }
}
