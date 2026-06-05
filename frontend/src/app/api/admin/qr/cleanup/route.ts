import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteExpiredPennuengMemberKeys } from '@/lib/pennueng-member-key';
import { isSqlServerConfigured } from '@/lib/sqlserver';

/**
 * GET /api/admin/qr/cleanup
 * ลบ Token / mbmemberkey ที่หมดอายุแล้ว
 */
export async function GET() {
  try {
    const now = new Date();

    const tokenResult = await prisma.qrToken.deleteMany({
      where: {
        expiresAt: { lt: now },
        usedAt: null,
      },
    });

    let memberKeys = { deletedKeys: 0, deletedQrTokens: 0 };
    if (isSqlServerConfigured()) {
      memberKeys = await deleteExpiredPennuengMemberKeys();
    }

    return NextResponse.json({
      success: true,
      message: `Cleaned ${tokenResult.count} expired qr_tokens; ${memberKeys.deletedKeys} mbmemberkey rows (${memberKeys.deletedQrTokens} linked tokens).`,
      qrTokens: tokenResult.count,
      mbmemberkey: memberKeys.deletedKeys,
      timestamp: now,
    });
  } catch (error) {
    console.error('[QR_CLEANUP_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
