import { z } from 'zod';
import { MemberType, MemberStatus } from '@prisma/client';
import { citizenIdValidator } from './common';

export const memberSchema = z.object({
  memberNo: z.string().min(1, 'ต้องมีเลขที่สมาชิก').max(30),
  citizenId: citizenIdValidator.optional().or(z.literal('')),
  firstNameTh: z.string().min(1, 'ต้องมีชื่อจริง (ไทย)'),
  lastNameTh: z.string().min(1, 'ต้องมีนามสกุล (ไทย)'),
  firstNameEn: z.string().optional().or(z.literal('')),
  lastNameEn: z.string().optional().or(z.literal('')),
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  memberType: z.nativeEnum(MemberType).default(MemberType.STUDENT),
  status: z.nativeEnum(MemberStatus).default(MemberStatus.ACTIVE),
  expireDate: z.string().optional().or(z.literal('')).transform((val) => val ? new Date(val) : undefined),
  photo: z.string().optional().refine((val) => !val || val.length < 5 * 1024 * 1024, {
    message: 'ขนาดรูปภาพต้องไม่เกิน 5MB (Base64)',
  }),
  metadata: z.any().optional(),
});

export type MemberInput = z.infer<typeof memberSchema>;
