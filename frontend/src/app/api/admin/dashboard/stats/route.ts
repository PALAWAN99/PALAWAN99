import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Dashboard stats should be accessible by all admin staff
  // We can add a specific check if needed, but usually any logged-in admin can see stats

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

    return NextResponse.json({
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
    console.error('Stats API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
