import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateQrToken } from '@/lib/qr-engine';
import { validateQrSchema } from '@/lib/schemas/gate';
import { checkStrictRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, handleError } from '@/lib/api-response';

/**
 * POST /api/qr/validate
 * ตรวจสอบ QR Code จากเครื่องสแกนหน้าประตู
 */
export async function POST(req: NextRequest) {
  // 1. Check Rate Limit (30 req/min — strict for QR scan)
  const rateLimitError = await checkStrictRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    const { token, gateId, deviceCode, direction } = validateQrSchema.parse(body);

    // 1. ตรวจสอบตรรกะการเข้า-ออก
    const validation = await validateQrToken(token, gateId);

    if (!validation.isValid) {
      const deniedMemberId = validation.qrToken?.memberId;
      if (deniedMemberId) {
        // คำนวณทิศทางสำหรับ Log การปฏิเสธ
        let deniedDirection: import('@prisma/client').GateDirection = 'IN';
        try {
          const tempGate = await prisma.gate.findUnique({ where: { id: gateId } });
          if (tempGate) {
            deniedDirection = tempGate.direction === 'BIDIRECTIONAL'
              ? (direction as import('@prisma/client').GateDirection || 'IN')
              : tempGate.direction;
          }
        } catch (_) {}

        await prisma.accessEvent.create({
          data: {
            gateId,
            memberId: deniedMemberId,
            direction: deniedDirection,
            source: 'QR_CODE',
            decision: 'DENIED',
            reasonCode: validation.reason,
            scannedAt: new Date(),
            metadata: {
              deviceCode,
              tokenPreview: token.substring(0, 8) + '...',
              ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
              error: validation.message,
            },
          },
        });
      }

      return ApiSuccess({
        decision: validation.decision,
        reasonCode: validation.reason,
        message: validation.message
      });
    }

    const { qrToken, member, gate } = validation;
    if (!qrToken || !member || !gate) {
       return handleError(new Error('Validation successful but data is missing'));
    }

    // คำนวณทิศทางจริงตามเงื่อนไข:
    // - หากประตูเป็นแบบทางเดียว (IN หรือ OUT) ให้ใช้ค่านั้นเสมอ
    // - หากประตูเป็นแบบสองทาง (BIDIRECTIONAL) ให้ใช้ค่า direction ที่ client ส่งมา (หากไม่มีให้ fallback เป็น IN)
    const finalDirection: import('@prisma/client').GateDirection = gate.direction === 'BIDIRECTIONAL'
      ? (direction as import('@prisma/client').GateDirection || 'IN')
      : gate.direction;

    // 2. บันทึกประวัติการเข้า-ออก (Allowed เบื้องต้น)
    // หมายเหตุ: บันทึกหลังเช็ค transaction สำเร็จเพื่อความถูกต้อง
    
    // 3. อัปเดตสถานะ QR แบบ Atomic เพื่อป้องกัน Race Condition (Double Scanning)
    const transactionResult = await prisma.$transaction(async (tx) => {
      const updated = await tx.qrToken.updateMany({
        where: { id: qrToken.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      if (updated.count === 0) return null; // already used
      return updated;
    });

    if (!transactionResult) {
      // บันทึกประวัติการปฏิเสธการเข้า-ออก เนื่องจากสแกนซ้ำซ้อน (Race Condition)
      await prisma.accessEvent.create({
        data: {
          gateId: gate.id,
          memberId: member.id,
          direction: finalDirection,
          source: 'QR_CODE',
          decision: 'DENIED',
          reasonCode: 'ALREADY_USED',
          scannedAt: new Date(),
          metadata: {
            deviceCode,
            tokenPreview: token.substring(0, 8) + '...',
            ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
            error: 'รหัส QR ถูกใช้งานไปแล้ว (ตรวจพบ Race Condition ในการสแกนซ้ำซ้อน)',
          },
        },
      });

      return ApiSuccess({
        decision: 'DENIED',
        reasonCode: 'ALREADY_USED',
        message: 'รหัส QR ถูกใช้งานไปแล้ว'
      });
    }

    // 4. บันทึกประวัติการเข้า-ออกสำเร็จ (ALLOWED)
    const event = await prisma.accessEvent.create({
      data: {
        gateId: gate.id,
        memberId: member.id,
        qrTokenId: qrToken.id,
        direction: finalDirection,
        source: 'QR_CODE',
        decision: 'ALLOWED',
        scannedAt: new Date(),
        metadata: {
          deviceCode,
          tokenPreview: token.substring(0, 8) + '...',
          ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
          userAgent: req.headers.get('user-agent') || 'device-scanner',
        }
      }
    });

    // 5. สั่งเปิดประตู (อยู่นอก transaction ได้เนื่องจากไม่ใช่ส่วน critical)
    await prisma.gate.update({
      where: { id: gate.id },
      data: { isOpen: true }
    });

    return ApiSuccess({
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
    return handleError(error);
  }
}
