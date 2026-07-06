import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

/**
 * GET /api/gate/dashboard
 * ดึงข้อมูลสถานะและเหตุการณ์ล่าสุดสำหรับหน้าจอเจ้าหน้าที่ประตู
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gateCode = searchParams.get('gateCode');

    if (!gateCode) {
      return NextResponse.json({ error: 'ต้องระบุ gateCode' }, { status: 400 });
    }

    // 1. หาข้อมูลประตู
    const gate = await prisma.gate.findUnique({
      where: { gateCode },
      include: {
        branch: true,
        devices: true,
      },
    });

    if (!gate) {
      return NextResponse.json({ error: 'ไม่พบประตูนี้' }, { status: 404 });
    }

    // 2. ดึงเหตุการณ์ล่าสุด (10 รายการ)
    const recentEvents = await prisma.accessEvent.findMany({
      where: { gateId: gate.id },
      take: 10,
      orderBy: { scannedAt: 'desc' },
      include: {
        member: {
          select: {
            firstNameTh: true,
            lastNameTh: true,
            memberNo: true,
          }
        }
      }
    });

    // 3. คำนวณสถิติของวันนี้
    const startOfToday = dayjs().startOf('day').toDate();
    
    const todayIn = await prisma.accessEvent.count({
      where: {
        gateId: gate.id,
        direction: 'IN',
        decision: 'ALLOWED',
        scannedAt: { gte: startOfToday }
      }
    });

    const todayOut = await prisma.accessEvent.count({
      where: {
        gateId: gate.id,
        direction: 'OUT',
        decision: 'ALLOWED',
        scannedAt: { gte: startOfToday }
      }
    });

    const todayDenied = await prisma.accessEvent.count({
      where: {
        gateId: gate.id,
        decision: 'DENIED',
        scannedAt: { gte: startOfToday }
      }
    });

    // 4. ตรวจสอบสถานะอุปกรณ์ (ถ้ามีอุปกรณ์ไหนออนไลน์ ประตูถือว่าออนไลน์)
    const isOnline = gate.devices.some((d: any) => d.status === 'ONLINE');

    return NextResponse.json({
      gate: {
        id: gate.id,
        name: gate.nameTh,
        branch: gate.branch.nameTh,
        isOnline,
        isOpen: gate.isOpen,
      },
      stats: {
        todayIn,
        todayOut,
        todayDenied,
      },
      recentEvents: recentEvents.map((e: any) => ({
        id: e.id,
        member: e.member,
        direction: e.direction,
        decision: e.decision,
        scannedAt: e.scannedAt,
      }))
    });

  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
