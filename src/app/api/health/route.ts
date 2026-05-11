import { prisma } from '@/lib/prisma';
import { ApiSuccess, ApiServiceUnavailable } from '@/lib/api-response';
import { auth } from '@/auth';

export async function GET() {
  const start = Date.now();
  const checks: Record<string, any> = {};

  try {
    // 1. Check Database
    await prisma.$queryRaw`SELECT 1 as health_check`;
    checks.database = {
      status: 'up',
      latency: `${Date.now() - start}ms`
    };

    // 2. Check Auth Configuration
    const authSecretSet = !!process.env.AUTH_SECRET;
    const session = await auth(); // Just check if the call doesn't throw
    
    checks.auth = {
      status: authSecretSet ? 'up' : 'down',
      configured: authSecretSet,
      session_service: 'active'
    };

    return ApiSuccess({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      checks
    });
  } catch (error) {
    console.error('[HEALTH_CHECK_ERROR]', error);
    return ApiServiceUnavailable('ระบบขัดข้องบางประการ', {
      error: error instanceof Error ? error.message : 'Unknown error',
      checks
    });
  }
}
