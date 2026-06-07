import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();

  if (!session) {
    return ApiUnauthorized();
  }

  try {
    const searchParams = req.nextUrl.searchParams;
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    const start = startDateParam ? dayjs(startDateParam).startOf('day').toDate() : dayjs().startOf('day').toDate();
    const end = endDateParam ? dayjs(endDateParam).endOf('day').toDate() : dayjs().endOf('day').toDate();

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
