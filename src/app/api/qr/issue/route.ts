import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/qr-engine';
import { issueQrSchema } from '@/lib/schemas/gate';
import dayjs from 'dayjs';
import { ApiSuccess, ApiNotFound, ApiForbidden, handleError } from '@/lib/api-response';

/**
 * POST /api/qr/issue
 * ออก QR Code สำหรับสมาชิก
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberId, purpose } = issueQrSchema.parse(body);

    // 1. ตรวจสอบสมาชิก
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      return ApiNotFound('ไม่พบสมาชิกที่ระบุ');
    }

    if (member.status !== 'ACTIVE') {
      return ApiForbidden('สมาชิกถูกระงับการใช้งานหรือหมดอายุ');
    }

    // 2. สร้าง Token (Signed with memberId)
    const { token, hash } = generateToken(memberId);

    // 3. กำหนดวันหมดอายุ
    const { duration } = body;
    let expiresAt = dayjs().endOf('day').toDate(); // Default: end of today (Dev1 behavior)

    if (duration === '1H') expiresAt = dayjs().add(1, 'hour').toDate();
    else if (duration === '1D') expiresAt = dayjs().add(1, 'day').toDate();
    else if (duration === '7D') expiresAt = dayjs().add(7, 'days').toDate();
    else if (duration === '30D') expiresAt = dayjs().add(30, 'days').toDate();
    else {
      // ถ้านโยบายมี TTL ให้ใช้นโยบายเป็นหลัก
      const policy = await prisma.qrPolicy.findFirst({ where: { isDefault: true } });
      if (policy?.ttlSeconds) {
        expiresAt = dayjs().add(policy.ttlSeconds, 'seconds').toDate();
      }
    }

    const issuedDate = dayjs().toDate();

    // 4. บันทึกลงฐานข้อมูล
    const qrToken = await prisma.qrToken.create({
      data: {
        tokenHash: hash,
        memberId,
        purpose,
        issuedDate,
        expiresAt,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'unknown',
      }
    });

    // 5. ส่งค่า Token กลับ (ตัวนี้จะเอาไปเจนเป็น QR Code ที่ฝั่ง Client)
    return ApiSuccess({
      tokenId: qrToken.id,
      qrContent: token, // คืนค่า raw token
      purpose: qrToken.purpose,
      expiresAt: qrToken.expiresAt,
    }, 'ออกรหัส QR Code เรียบร้อยแล้ว');

  } catch (error) {
    return handleError(error);
  }
}
