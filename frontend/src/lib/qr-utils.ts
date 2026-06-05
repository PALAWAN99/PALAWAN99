import { prisma } from '@/lib/prisma';
import { QrPurpose } from '@prisma/client';
import { generateToken } from './qr-engine';
import dayjs from 'dayjs';

/**
 * ออก QR Token ใหม่สำหรับสมาชิก
 * โดยปกติจะหมดอายุตอนเที่ยงคืนของวันที่ออก (รายวัน)
 */
export async function issueQrToken(memberId: string, purpose: QrPurpose = 'ENTRY') {
  // ใช้ Logic การสร้าง Token ที่มีระบบ Security (Signed)
  const { token, hash } = generateToken(memberId);
  
  // คำนวณวันหมดอายุ (เที่ยงคืนวันนี้)
  const expiresAt = dayjs().endOf('day').toDate();
  const issuedDate = dayjs().startOf('day').toDate();

  const qrToken = await prisma.qrToken.create({
    data: {
      tokenHash: hash,
      memberId,
      purpose,
      issuedDate,
      expiresAt,
    },
  });

  return {
    ...qrToken,
    rawToken: token // ส่งตัวที่ยังไม่ Hash กลับไปด้วยเพื่อใช้แสดงผล QR
  };
}
