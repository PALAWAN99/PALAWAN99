import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();

  if (!session) {
    return ApiUnauthorized();
  }

  try {
    const start = dayjs().startOf('day').toDate();
    const end = dayjs().endOf('day').toDate();

    // Run queries in parallel for performance
    const [
      totalMembers,
      activeMembers,
      totalGates,
      activeGates,
      todayAccessEvents,
    ] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { status: 'ACTIVE' } }),
      prisma.gate.count(),
      prisma.gate.count({ where: { status: 'ACTIVE' } }),
      prisma.accessEvent.count({
        where: {
          scannedAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    ]);

    return ApiSuccess({
      members: {
        total: totalMembers,
        active: activeMembers,
      },
      gates: {
        total: totalGates,
        active: activeGates,
      },
      todayEvents: todayAccessEvents,
    });
  } catch (error) {
    return handleError(error);
  }
}
