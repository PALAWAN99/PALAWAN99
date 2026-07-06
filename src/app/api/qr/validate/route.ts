import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateQrToken } from '@/lib/qr-engine';
import { validateQrSchema } from '@/lib/schemas/gate';
import { ZodError } from 'zod';

/**
 * POST /api/qr/validate
 * ตรวจสอบ QR Code จากเครื่องสแกนหน้าประตู
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, gateId, deviceCode } = validateQrSchema.parse(body);

    // 1. ตรวจสอบตรรกะการเข้า-ออก
    const validation = await validateQrToken(token, gateId);

    // เตรียมข้อมูลพื้นฐานสำหรับ AccessEvent
    const eventData = {
      gateId,
      deviceCode, // เก็บไว้ใน metadata ถ้าไม่มีฟิลด์ตรง
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'device-scanner',
      scannedAt: new Date(),
    };

    if (!validation.isValid) {
      // บันทึกเหตุการณ์การปฏิเสธ (Denied)
      return NextResponse.json({
        decision: validation.decision,
        reasonCode: validation.reason,
        message: validation.message
      }, { status: 200 });
    }

    const { qrToken, member, gate } = validation;

    // 2. บันทึกประวัติการเข้า-ออก (Allowed)
    const event = await prisma.accessEvent.create({
      data: {
        gateId: gate.id,
        memberId: member.id,
        qrTokenId: qrToken.id,
        direction: gate.direction === 'BIDIRECTIONAL' ? 'IN' : gate.direction, // สมมติค่าเริ่มต้น
        source: 'QR_CODE',
        decision: 'ALLOWED',
        scannedAt: new Date(),
        metadata: {
          deviceCode,
          tokenPreview: token.substring(0, 8) + '...',
        }
      }
    });

    // 3. อัปเดตสถานะ QR ว่าถูกใช้งานแล้ว และสั่งเปิดประตู
    await Promise.all([
      prisma.qrToken.update({
        where: { id: qrToken.id },
        data: { usedAt: new Date() }
      }),
      prisma.gate.update({
        where: { id: gate.id },
        data: { isOpen: true }
      })
    ]);

    return NextResponse.json({
      decision: 'ALLOWED',
      member: {
        memberNo: member.memberNo,
        name: `${member.firstNameTh} ${member.lastNameTh}`,
        type: member.memberType,
      },
      event: {
        id: event.id,
        scannedAt: event.scannedAt
      }
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation Error', errors: error.issues }, { status: 422 });
    }
    console.error('[QR_VALIDATE_POST]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
