import { z } from 'zod';
import { MemberType, MemberStatus, UserRole } from '@prisma/client';

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
const citizenIdValidator = z.string()
  .length(13, 'เลขบัตรประชาชนต้องมี 13 หลัก')
  .refine(validateThaiCitizenId, { message: 'เลขบัตรประชาชนไม่ถูกต้องตามหลักการคำนวณ' });

// Schema สำหรับจัดการสมาชิก (Member)
export const memberSchema = z.object({
  memberNo: z.string().min(1, 'ต้องมีเลขที่สมาชิก').max(30),
  citizenId: citizenIdValidator.optional().or(z.literal('')),
  firstNameTh: z.string().min(1, 'ต้องมีชื่อจริง (ไทย)'),
  lastNameTh: z.string().min(1, 'ต้องมีนามสกุล (ไทย)'),
  firstNameEn: z.string().optional(),
  lastNameEn: z.string().optional(),
  firstNameZh: z.string().optional(),
  lastNameZh: z.string().optional(),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  memberType: z.nativeEnum(MemberType).default(MemberType.GUEST),
  status: z.nativeEnum(MemberStatus).default(MemberStatus.ACTIVE),
  expireDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  photo: z.string().optional().refine((val) => !val || val.length < 3 * 1024 * 1024, {
    message: 'ขนาดรูปภาพต้องไม่เกิน 2MB (Base64)',
  }),
});

// Schema สำหรับจัดการผู้ใช้ระบบ (User/Admin)
export const userSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  fullName: z.string().min(1, 'ต้องมีชื่อ-นามสกุล'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  role: z.nativeEnum(UserRole).default(UserRole.VIEWER),
});

// Schema สำหรับลงทะเบียนด้วยบัตรประชาชน
export const idCardRegisterSchema = z.object({
  citizenId: citizenIdValidator,
  fullNameTh: z.string().min(1, 'ต้องมีชื่อเต็มภาษาไทย'),
  fullNameEn: z.string().optional(),
  birthDate: z.string().length(8, 'รูปแบบวันเกิดไม่ถูกต้อง (YYYYMMDD)').optional(),
  deviceId: z.string().uuid().optional(),
});
