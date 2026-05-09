import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/qr-engine';
import { issueQrSchema } from '@/lib/schemas/gate';
import dayjs from 'dayjs';
import { ZodError } from 'zod';

/**
 * POST /api/qr/issue
 * ออก QR Code สำหรับสมาชิก
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { memberId, purpose, duration } = body;

    // 1. ตรวจสอบสมาชิก
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }

    if (member.status !== 'ACTIVE') {
      return NextResponse.json({ message: 'Member is not active' }, { status: 403 });
    }

    // 2. สร้าง Token
    const { token, hash } = generateToken();

    // 3. คำนวณวันหมดอายุ
    let expiresAt = dayjs().add(1, 'day').toDate(); // Default 1 day

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
    return NextResponse.json({
      success: true,
      data: {
        tokenId: qrToken.id,
        qrContent: token, // คืนค่า raw token
        purpose: qrToken.purpose,
        expiresAt: qrToken.expiresAt,
      }
    });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 422 });
    }
    console.error('[QR_ISSUE_POST]', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
