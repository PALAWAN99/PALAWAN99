import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/gate/sensor
 * จำลองเหตุการณ์ Sensor ตรวจจับคนเดินผ่าน (เพื่อสั่งปิดประตู)
 */
export async function POST(req: NextRequest) {
  try {
    const { gateId } = await req.json();

    if (!gateId) {
      return NextResponse.json({ error: 'ต้องระบุ gateId' }, { status: 400 });
    }

    const gate = await prisma.gate.update({
      where: { id: gateId },
      data: {
        isOpen: false // เมื่อเดินผ่านแล้วให้ปิดประตู
      }
    });

    return NextResponse.json({
      success: true,
      isOpen: gate.isOpen,
      message: 'ตรวจพบการเดินผ่าน ประตูปิดอัตโนมัติ'
    });

  } catch (error) {
    console.error('[GATE_SENSOR_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
