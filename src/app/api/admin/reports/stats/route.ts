import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '7');
    
    const startDate = dayjs().subtract(days, 'day').startOf('day').toDate();

    // 1. ดึงสถิติรายวัน (Access Count by Day)
    const accessByDay = await prisma.accessEvent.groupBy({
      by: ['createdAt'],
      _count: { id: true },
      where: {
        createdAt: { gte: startDate }
      },
    });

    // 2. ดึงสถิติตามประตู (Access Count by Gate)
    const accessByGate = await prisma.accessEvent.groupBy({
      by: ['gateId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    // ดึงชื่อประตูมาประกอบ
    const gates = await prisma.gate.findMany({
      where: { id: { in: accessByGate.map(g => g.gateId) } },
      select: { id: true, nameTh: true }
    });

    const gateStats = accessByGate.map(g => ({
      name: gates.find(gate => gate.id === g.gateId)?.nameTh || 'Unknown',
      value: g._count.id
    }));

    // 3. สรุปยอดรวม
    const summary = {
      totalAccess: await prisma.accessEvent.count({ where: { createdAt: { gte: startDate } } }),
      totalMembers: await prisma.member.count(),
      activeGates: await prisma.gate.count({ where: { status: 'ACTIVE' } }),
      deniedAccess: await prisma.accessEvent.count({ 
        where: { 
          decision: 'DENIED',
          createdAt: { gte: startDate }
        } 
      }),
    };

    return NextResponse.json({
      summary,
      gateStats,
      // จัดรูปแบบข้อมูลสำหรับ Chart (Bar Chart)
      dailyStats: accessByDay.map(d => ({
        date: dayjs(d.createdAt).format('DD MMM'),
        count: d._count.id
      }))
    });
  } catch (error) {
    console.error('Report API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
