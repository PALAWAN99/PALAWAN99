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
  const rateLimitError = checkStrictRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    const { token, gateId, deviceCode } = validateQrSchema.parse(body);

    // 1. ตรวจสอบตรรกะการเข้า-ออก
    const validation = await validateQrToken(token, gateId);

    if (!validation.isValid) {
      // บันทึกประวัติการเข้า-ออก (Denied)
      await prisma.accessEvent.create({
        data: {
          gateId,
          memberId: validation.qrToken?.memberId || null,
          direction: 'IN',
          source: 'QR_CODE',
          decision: 'DENIED',
          reasonCode: validation.reason,
          scannedAt: new Date(),
          metadata: {
            deviceCode,
            tokenPreview: token.substring(0, 8) + '...',
            ip: req.headers.get('x-forwarded-for') || '127.0.0.1',
            error: validation.message
          }
        }
      });

      return ApiSuccess({
        decision: validation.decision,
        reasonCode: validation.reason,
        message: validation.message
      });
    }

    const { qrToken, member, gate } = validation;

    // 2. บันทึกประวัติการเข้า-ออก (Allowed)
    const event = await prisma.accessEvent.create({
      data: {
        gateId: gate.id,
        memberId: member.id,
        qrTokenId: qrToken.id,
        direction: gate.direction === 'BIDIRECTIONAL' ? 'IN' : gate.direction,
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
