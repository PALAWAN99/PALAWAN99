import { crypto } from 'next/dist/compiled/@edge-runtime/primitives';
import { prisma } from './prisma';
import dayjs from 'dayjs';

/**
 * QR Engine Logic
 * รับผิดชอบการสร้าง Hash, ตรวจสอบความถูกต้อง และจัดการสถานะของ QR Token
 */

// สำหรับใช้ใน Node.js environment (ถ้าไม่ใช่ edge)
const nodeCrypto = require('crypto');

/**
 * สร้าง Token แบบสุ่มและคืนค่า Hash
 */
export function generateToken() {
  const token = nodeCrypto.randomBytes(32).toString('hex');
  const hash = nodeCrypto.createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

/**
 * ตรวจสอบ Token ว่าถูกต้องและใช้งานได้หรือไม่
 */
export async function validateQrToken(token: string, gateId: string) {
  const hash = nodeCrypto.createHash('sha256').update(token).digest('hex');

  const qrToken = await prisma.qrToken.findUnique({
    where: { tokenHash: hash },
    include: {
      member: true,
    },
  });

  // 1. ตรวจสอบว่ามี Token นี้อยู่ในระบบไหม
  if (!qrToken) {
    return { 
      isValid: false, 
      decision: 'DENIED', 
      reason: 'TOKEN_NOT_FOUND',
      message: 'ไม่พบรหัส QR ในระบบ'
    };
  }

  // 2. ตรวจสอบว่าถูกยกเลิก (Revoked) หรือไม่
  if (qrToken.revokedAt) {
    return { 
      isValid: false, 
      decision: 'DENIED', 
      reason: 'TOKEN_REVOKED',
      message: 'รหัส QR ถูกยกเลิกแล้ว'
    };
  }

  // 3. ตรวจสอบว่าถูกใช้งานไปแล้วหรือไม่ (ถ้าเป็นนโยบาย One-time)
  if (qrToken.usedAt) {
    return { 
      isValid: false, 
      decision: 'DENIED', 
      reason: 'ALREADY_USED',
      message: 'รหัส QR ถูกใช้งานไปแล้ว'
    };
  }

  // 4. ตรวจสอบวันหมดอายุ (ExpiresAt)
  if (dayjs().isAfter(dayjs(qrToken.expiresAt))) {
    return { 
      isValid: false, 
      decision: 'DENIED', 
      reason: 'TOKEN_EXPIRED',
      message: 'รหัส QR หมดอายุแล้ว'
    };
  }

  // 5. ตรวจสอบสถานะสมาชิก
  if (qrToken.member.status !== 'ACTIVE') {
    return { 
      isValid: false, 
      decision: 'DENIED', 
      reason: 'MEMBER_INACTIVE',
      message: 'สถานะสมาชิกไม่ปกติ'
    };
  }

  // 6. ตรวจสอบว่าประตู (Gate) พร้อมใช้งานไหม
  const gate = await prisma.gate.findUnique({
    where: { id: gateId },
  });

  if (!gate) {
    return { 
      isValid: false, 
      decision: 'DENIED', 
      reason: 'GATE_NOT_FOUND',
      message: 'ไม่พบข้อมูลประตู'
    };
  }

  if (gate.status !== 'ACTIVE') {
    return { 
      isValid: false, 
      decision: 'DENIED', 
      reason: 'GATE_DISABLED',
      message: 'ประตูนี้ปิดใช้งานชั่วคราว'
    };
  }

  // ผ่านทุกเงื่อนไข
  return {
    isValid: true,
    decision: 'ALLOWED',
    message: 'อนุญาตให้เข้า-ออก',
    qrToken,
    member: qrToken.member,
    gate,
  };
}
