import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/gate/control
 * ควบคุมประตูแบบ Manual (เปิด/ปิด)
 */
export async function POST(req: NextRequest) {
  try {
    const { gateId, action } = await req.json();

    if (!gateId || !['OPEN', 'CLOSE'].includes(action)) {
      return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const gate = await prisma.gate.update({
      where: { id: gateId },
      data: {
        isOpen: action === 'OPEN'
      }
    });

    // บันทึก Audit Log สำหรับการควบคุม Manual
    await prisma.auditLog.create({
      data: {
        action: `MANUAL_${action}`,
        resource: 'GATE',
        resourceId: gateId,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'dashboard-manual',
      }
    });

    return NextResponse.json({
      success: true,
      isOpen: gate.isOpen,
      message: `สั่ง ${action === 'OPEN' ? 'เปิด' : 'ปิด'} ประตูสำเร็จ`
    });

  } catch (error) {
    console.error('[GATE_CONTROL_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
