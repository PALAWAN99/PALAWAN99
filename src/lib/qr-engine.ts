import crypto from 'crypto';
import { prisma } from './prisma';
import dayjs from 'dayjs';

/**
 * QR Security Configuration
 */
const QR_CONFIG = {
  SECRET: process.env.QR_SECRET || 'qr-gate-secret-key-2024',
  ALGORITHM: 'sha256',
  VERSION: 'v1',
};

/**
 * สร้าง Token แบบ Signed และคืนค่า Hash สำหรับเก็บลงฐานข้อมูล
 * รูปแบบ Token: v1:[memberId]:[timestamp]:[signature]
 */
export function generateToken(memberId: string) {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(8).toString('hex');
  
  // สร้างข้อมูลที่จะใช้เซ็น
  const payload = `${QR_CONFIG.VERSION}:${memberId}:${timestamp}:${nonce}`;
  
  // สร้าง Signature (HMAC) เพื่อป้องกันการปลอมแปลง
  const signature = crypto
    .createHmac(QR_CONFIG.ALGORITHM, QR_CONFIG.SECRET)
    .update(payload)
    .digest('hex')
    .substring(0, 16); // ใช้แค่ 16 ตัวแรกเพื่อให้ QR ไม่ยาวเกินไป

  const token = `${payload}:${signature}`;
  
  // สร้าง Hash สำหรับเก็บลง DB (ป้องกันคนเห็น DB แล้วเอาไปปลอม QR ได้ทันที)
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  
  return { token, hash };
}

/**
 * ตรวจสอบ Token ว่าถูกต้องและใช้งานได้หรือไม่
 */
export async function validateQrToken(token: string, gateId: string) {
  // 1. ตรวจสอบรูปแบบเบื้องต้น (Signature Check)
  const parts = token.split(':');
  if (parts.length !== 5 || parts[0] !== QR_CONFIG.VERSION) {
    return { isValid: false, decision: 'DENIED', reason: 'INVALID_FORMAT', message: 'รูปแบบรหัส QR ไม่ถูกต้อง' };
  }

  const [version, memberId, timestamp, nonce, signature] = parts;
  const expectedPayload = `${version}:${memberId}:${timestamp}:${nonce}`;
  const expectedSignature = crypto
    .createHmac(QR_CONFIG.ALGORITHM, QR_CONFIG.SECRET)
    .update(expectedPayload)
    .digest('hex')
    .substring(0, 16);

  if (signature !== expectedSignature) {
    return { isValid: false, decision: 'DENIED', reason: 'INVALID_SIGNATURE', message: 'รหัส QR ถูกปลอมแปลง' };
  }

  // 2. ตรวจสอบความสดใหม่ (Rotating QR - อายุ 60 วินาที)
  // ป้องกันการ Capture หน้าจอแล้วเอามาใช้ภายหลัง
  const tokenTime = parseInt(timestamp);
  const now = Date.now();
  if (now - tokenTime > 60 * 1000) { // 60 วินาที
    return { isValid: false, decision: 'DENIED', reason: 'QR_EXPIRED', message: 'รหัส QR หมดอายุแล้ว (กรุณาใช้รหัสใหม่)' };
  }

  // 3. ค้นหาในฐานข้อมูลด้วย Hash
  const hash = crypto.createHash('sha256').update(token).digest('hex');

  const qrToken = await prisma.qrToken.findUnique({
    where: { tokenHash: hash },
    include: {
      member: true,
    },
  });

  // 3. ตรวจสอบสถานะในระบบ
  if (!qrToken) {
    return { isValid: false, decision: 'DENIED', reason: 'TOKEN_NOT_FOUND', message: 'รหัส QR นี้ไม่มีอยู่ในระบบหรือหมดอายุแล้ว' };
  }

  if (qrToken.revokedAt) {
    return { isValid: false, decision: 'DENIED', reason: 'TOKEN_REVOKED', message: 'รหัส QR ถูกยกเลิกแล้ว' };
  }

  // 4. ตรวจสอบ One-time QR
  if (qrToken.usedAt) {
    return { isValid: false, decision: 'DENIED', reason: 'ALREADY_USED', message: 'รหัส QR ถูกใช้งานไปแล้ว' };
  }

  // 5. ตรวจสอบวันหมดอายุ (ExpiresAt)
  if (dayjs().isAfter(dayjs(qrToken.expiresAt))) {
    return { isValid: false, decision: 'DENIED', reason: 'TOKEN_EXPIRED', message: 'รหัส QR หมดอายุแล้ว' };
  }

  // 6. ตรวจสอบสถานะสมาชิก
  if (qrToken.member.status !== 'ACTIVE') {
    return { isValid: false, decision: 'DENIED', reason: 'MEMBER_INACTIVE', message: 'สถานะสมาชิกไม่ปกติ' };
  }

  // 7. ตรวจสอบข้อมูลประตู
  const gate = await prisma.gate.findUnique({
    where: { id: gateId },
  });

  if (!gate) {
    return { isValid: false, decision: 'DENIED', reason: 'GATE_NOT_FOUND', message: 'ไม่พบข้อมูลประตู' };
  }

  if (gate.status !== 'ACTIVE') {
    return { isValid: false, decision: 'DENIED', reason: 'GATE_DISABLED', message: 'ประตูนี้ปิดใช้งานชั่วคราว' };
  }

  return {
    isValid: true,
    decision: 'ALLOWED',
    message: 'อนุญาตให้เข้า-ออก',
    qrToken,
    member: qrToken.member,
    gate,
  };
}
