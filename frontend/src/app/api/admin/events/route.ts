import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has permission to read access events
  if (!checkAccess(session, 'ACCESS_EVENT', 'READ')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const skip = parseInt(searchParams.get('skip') || '0');
  const gateId = searchParams.get('gateId') || undefined;
  const direction = searchParams.get('direction') || undefined;

  try {
    const [events, total] = await Promise.all([
      prisma.accessEvent.findMany({
        where: {
          gateId: gateId,
          direction: direction as any,
        },
        include: {
          gate: {
            select: { nameTh: true, nameEn: true, gateCode: true }
          },
          member: {
            select: { firstNameTh: true, lastNameTh: true, memberNo: true }
          }
        },
        orderBy: { scannedAt: 'desc' },
        take: limit,
        skip: skip,
      }),
      prisma.accessEvent.count({
        where: {
          gateId: gateId,
          direction: direction as any,
        }
      })
    ]);

    return NextResponse.json({
      data: events,
      pagination: {
        total,
        limit,
        skip,
      }
    });
  } catch (error) {
    console.error('Events API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
