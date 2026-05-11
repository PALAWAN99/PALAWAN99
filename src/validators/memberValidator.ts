import { z } from 'zod';
import { MemberType, MemberStatus } from '@prisma/client';

export function validateThaiCitizenId(id: string): boolean {
  if (!id || id.length !== 13 || !/^\d{13}$/.test(id)) return false;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }
  const check = (11 - (sum % 11)) % 10;
  return check === parseInt(id.charAt(12));
}

const citizenIdValidator = z.string()
  .length(13, 'เลขบัตรประชาชนต้องมี 13 หลัก')
  .refine(validateThaiCitizenId, { message: 'เลขบัตรประชาชนไม่ถูกต้องตามหลักการคำนวณ' });

export const memberSchema = z.object({
  memberNo: z.string().min(1, 'ต้องมีเลขที่สมาชิก').max(30),
  citizenId: citizenIdValidator.optional().or(z.literal('')),
  firstNameTh: z.string().min(1, 'ต้องมีชื่อจริง (ไทย)'),
  lastNameTh: z.string().min(1, 'ต้องมีนามสกุล (ไทย)'),
  firstNameEn: z.string().optional(),
  lastNameEn: z.string().optional(),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
  phone: z.string().max(20).optional(),
  memberType: z.nativeEnum(MemberType).default(MemberType.STUDENT),
  status: z.nativeEnum(MemberStatus).default(MemberStatus.ACTIVE),
  expireDate: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  photo: z.string().optional().refine((val) => !val || val.length < 3 * 1024 * 1024, {
    message: 'ขนาดรูปภาพต้องไม่เกิน 2MB (Base64)',
  }),
});
