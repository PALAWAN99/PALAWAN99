import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateQrToken } from '@/lib/qr-engine';
import { auth } from '@/auth';
import { checkStrictRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiUnauthorized, ApiValidationError, handleError } from '@/lib/api-response';
import { emitAccessEvent } from '@/lib/event-emitter';

import { z } from 'zod';
import { gateDirectionSchema } from '@/lib/schemas/gate';

const validateRequestSchema = z.object({
  token: z.string().min(1),
  gateId: z.string().uuid(),
  direction: gateDirectionSchema.default('IN'),
});

export async function POST(req: NextRequest) {
  // 1. Check Rate Limit (30 req/min — strict for QR scan)
  const rateLimitError = checkStrictRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    // 1. ตรวจสอบสิทธิ์ (ต้องเป็นเจ้าหน้าที่ประตูหรือแอดมิน)
    const session = await auth();
    if (!session?.user?.role || !['SUPER_ADMIN', 'ADMIN', 'LIBRARIAN', 'STAFF'].includes(session.user.role as string)) {
      return ApiUnauthorized('คุณไม่มีสิทธิ์เข้าถึงฟังก์ชันนี้');
    }

    const body = await req.json();
    
    // Validate with Zod
    const validation = validateRequestSchema.safeParse(body);
    if (!validation.success) {
      return ApiValidationError(validation.error);
    }

    const { token, gateId, direction } = validation.data;

    // 2. เรียกใช้ QR Engine ตรวจสอบ
    const result = await validateQrToken(token, gateId);

    // 3. บันทึกประวัติการเข้า-ออก (AccessEvent) ไม่ว่าจะผ่านหรือไม่ผ่าน
    const accessEventData: any = {
      gate: { connect: { id: gateId } },
      direction: direction,
      source: 'QR_CODE',
      decision: result.decision,
      reasonCode: result.reason || undefined,
      scannedAt: new Date(),
    };

    if (result.member?.id) {
      accessEventData.member = { connect: { id: result.member.id } };
    }
    if (result.qrToken?.id) {
      accessEventData.qrToken = { connect: { id: result.qrToken.id } };
    }

    const event = await prisma.accessEvent.create({
      data: accessEventData
    });
    void emitAccessEvent(event.id);

    // 4. ถ้าผ่าน ให้บันทึกว่า QR นี้ถูกใช้แล้ว (กรณี One-time)
    if (result.isValid && result.qrToken) {
      await prisma.qrToken.update({
        where: { id: result.qrToken.id },
        data: { usedAt: new Date() }
      });
    }

    return ApiSuccess(result);

  } catch (error) {
    return handleError(error);
  }
}
