import { z } from 'zod';
import { MemberType, MemberStatus, UserRole } from '@prisma/client';

// Schema สำหรับจัดการสมาชิก (Member)
export const memberSchema = z.object({
  memberNo: z.string().min(1, 'ต้องมีเลขที่สมาชิก').max(30),
  citizenId: z.string().length(13, 'เลขบัตรประชาชนต้องมี 13 หลัก').optional().or(z.literal('')),
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
});

// Schema สำหรับจัดการผู้ใช้ระบบ (User/Admin)
export const userSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  fullName: z.string().min(1, 'ต้องมีชื่อ-นามสกุล'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  role: z.nativeEnum(UserRole).default(UserRole.VIEWER),
});
