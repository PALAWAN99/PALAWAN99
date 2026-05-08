import { prisma } from '@/lib/prisma';
import { QrPurpose } from '@prisma/client';
/**
 * ออก QR Token ใหม่สำหรับสมาชิก
 * โดยปกติจะหมดอายุตอนเที่ยงคืนของวันที่ออก (รายวัน)
 */
export async function issueQrToken(memberId: string, purpose: QrPurpose = 'ENTRY') {
  const now = new Date();
  
  // คำนวณวันหมดอายุ (เที่ยงคืนวันนี้)
  const expiresAt = new Date(now);
  expiresAt.setHours(23, 59, 59, 999);

  // สร้าง Token Hash
  const tokenHash = crypto.randomUUID();

  const qrToken = await prisma.qrToken.create({
    data: {
      tokenHash,
      memberId,
      purpose,
      issuedDate: now,
      expiresAt: expiresAt,
    },
  });

  return qrToken;
}

/**
 * ตรวจสอบความถูกต้องของ Token
 */
export async function validateQrToken(tokenHash: string) {
  const token = await prisma.qrToken.findUnique({
    where: { tokenHash },
    include: { member: true },
  });

  if (!token) return { valid: false, reason: 'TOKEN_NOT_FOUND' };
  
  const now = new Date();
  if (token.expiresAt < now) return { valid: false, reason: 'TOKEN_EXPIRED' };
  if (token.revokedAt) return { valid: false, reason: 'TOKEN_REVOKED' };
  if (token.usedAt && token.purpose === 'ENTRY') {
     // ถ้าตั้งค่าเป็น Use Once (Optional)
     // return { valid: false, reason: 'TOKEN_ALREADY_USED' };
  }

  return { valid: true, token };
}
