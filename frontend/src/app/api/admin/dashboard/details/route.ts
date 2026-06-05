import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = dayjs();
    const start = today.startOf('day').toDate();
    const end = today.endOf('day').toDate();

    // 1. Fetch Chart Data (Last 12 hours)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const hourStart = today.subtract(i * 2, 'hour');
      const hourLabel = hourStart.format('HH:00');
      
      const [countIn, countOut] = await Promise.all([
        prisma.accessEvent.count({
          where: {
            direction: 'IN',
            scannedAt: { gte: hourStart.subtract(2, 'hour').toDate(), lte: hourStart.toDate() }
          }
        }),
        prisma.accessEvent.count({
          where: {
            direction: 'OUT',
            scannedAt: { gte: hourStart.subtract(2, 'hour').toDate(), lte: hourStart.toDate() }
          }
        })
      ]);

      chartData.push({ name: hourLabel, in: countIn, out: countOut });
    }

    // 2. Fetch Top Gates Activity
    const topGates = await prisma.accessEvent.groupBy({
      by: ['gateId'],
      _count: { _all: true },
      orderBy: { _count: { gateId: 'desc' } },
      take: 5
    });

    const gateTraffic = await Promise.all(topGates.map(async (item: { gateId: string; _count: { _all: number } }, idx: number) => {
      const gate = await prisma.gate.findUnique({ where: { id: item.gateId } });
      const colors = ['#38BDF8', '#10B981', '#1E3A5F', '#0EA5E9', '#F59E0B'];
      return {
        name: gate?.nameTh || gate?.gateCode || 'Unknown',
        value: item._count._all,
        color: colors[idx % colors.length]
      };
    }));

    // 3. Fetch Gate Status List
    const allGates = await prisma.gate.findMany({
      orderBy: { nameTh: 'asc' },
      take: 10
    });

    const gateStatus = await Promise.all(allGates.map(async (gate: { id: string; nameTh: string; status: string }) => {
      const [countIn, countOut, lastEvent] = await Promise.all([
        prisma.accessEvent.count({ where: { gateId: gate.id, direction: 'IN', scannedAt: { gte: start, lte: end } } }),
        prisma.accessEvent.count({ where: { gateId: gate.id, direction: 'OUT', scannedAt: { gte: start, lte: end } } }),
        prisma.accessEvent.findFirst({
          where: { gateId: gate.id },
          orderBy: { scannedAt: 'desc' },
          select: { scannedAt: true }
        })
      ]);

      return {
        name: gate.nameTh,
        status: gate.status,
        in: countIn,
        out: countOut,
        lastScan: lastEvent ? dayjs(lastEvent.scannedAt).format('HH:mm') : '-'
      };
    }));

    return NextResponse.json({
      chartData,
      gateTraffic,
      gateStatus
    });
  } catch (error) {
    console.error('Dashboard Details API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
