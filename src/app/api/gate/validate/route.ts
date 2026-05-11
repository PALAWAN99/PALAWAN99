import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateQrToken } from '@/lib/qr-engine';
import { auth } from '@/auth';

import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // 1. Check Rate Limit (60 requests per minute per IP)
  const rateLimitError = checkRateLimit(req, 60);
  if (rateLimitError) return rateLimitError;

  try {
    // 1. ตรวจสอบสิทธิ์ (ต้องเป็นเจ้าหน้าที่ประตูหรือแอดมิน)
    const session = await auth();
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN', 'GATE_OFFICER'].includes(session.user.role as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { token, gateId, direction = 'IN' } = body;

    if (!token || !gateId) {
      return NextResponse.json({ error: 'Missing token or gateId' }, { status: 400 });
    }

    // 2. เรียกใช้ QR Engine ตรวจสอบ
    const result = await validateQrToken(token, gateId);

    // 3. บันทึกประวัติการเข้า-ออก (AccessEvent) ไม่ว่าจะผ่านหรือไม่ผ่าน
    await prisma.accessEvent.create({
      data: {
        gate: { connect: { id: gateId } },
        ...(result.member?.id ? { member: { connect: { id: result.member.id } } } : {}),
        ...(result.qrToken?.id ? { qrToken: { connect: { id: result.qrToken.id } } } : {}),
        direction: direction as any,
        source: 'QR_CODE',
        decision: result.decision as any,
        reasonCode: result.reason || undefined,
        scannedAt: new Date(),
      }
    });

    // 4. ถ้าผ่าน ให้บันทึกว่า QR นี้ถูกใช้แล้ว (กรณี One-time)
    if (result.isValid && result.qrToken) {
      await prisma.qrToken.update({
        where: { id: result.qrToken.id },
        data: { usedAt: new Date() }
      });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Validate API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
