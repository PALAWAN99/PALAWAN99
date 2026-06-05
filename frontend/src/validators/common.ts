import { z } from 'zod';

/**
 * ฟังก์ชันตรวจสอบเลขบัตรประชาชนไทย (Checksum)
 */
export function validateThaiCitizenId(id: string): boolean {
  if (!id || id.length !== 13 || !/^\d{13}$/.test(id)) return false;
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }
  
  const check = (11 - (sum % 11)) % 10;
  return check === parseInt(id.charAt(12));
}

// Zod custom validator สำหรับเลขบัตรประชาชน
export const citizenIdValidator = z.string()
  .length(13, 'เลขบัตรประชาชนต้องมี 13 หลัก')
  .refine(validateThaiCitizenId, { message: 'เลขบัตรประชาชนไม่ถูกต้องตามหลักการคำนวณ' });
