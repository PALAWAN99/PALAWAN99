import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/qr/cleanup
 * ลบ Token ที่หมดอายุแล้วเพื่อคืนพื้นที่ฐานข้อมูล
 */
export async function GET() {
  try {
    const now = new Date();
    
    // ลบ Token ที่หมดอายุแล้วและยังไม่ถูกใช้งาน
    const result = await prisma.qrToken.deleteMany({
      where: {
        expiresAt: { lt: now },
        usedAt: null,
      }
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${result.count} expired tokens.`,
      timestamp: now,
    });
  } catch (error) {
    console.error('[QR_CLEANUP_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
