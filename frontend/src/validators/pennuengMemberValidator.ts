import { z } from 'zod';
import { sanitizeMemberTypeDescription } from '@/lib/sanitizeMemberTypeDescription';

export const pennuengMemberSchema = z.object({
  memberNo: z.string().min(1, 'ต้องระบุรหัสสมาชิก').max(30),
  memberType: z.string().min(1, 'ต้องเลือกประเภทสมาชิก').max(10),
  name: z.string().min(1, 'ต้องระบุชื่อ').max(100),
  surname: z.string().min(1, 'ต้องระบุนามสกุล').max(100),
  groupCode: z.string().max(20).optional().nullable(),
  departmentCode: z.string().max(20).optional().nullable(),
  prenameCode: z.string().max(10).optional().nullable(),
  sex: z.string().max(10).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  tel: z.string().max(30).optional().nullable(),
  email: z
    .union([z.string().email('รูปแบบอีเมลไม่ถูกต้อง'), z.literal('')])
    .optional()
    .nullable()
    .transform((v) => (v === '' || v == null ? null : v)),
  birthDate: z.string().optional().nullable(),
  personId: z.string().max(20).optional().nullable(),
  expireDate: z.string().optional().nullable(),
  description: z
    .string()
    .max(500)
    .optional()
    .nullable()
    .transform((val) => (val == null ? null : sanitizeMemberTypeDescription(val)))
    .refine((val) => (val == null ? true : !/[<>]/.test(val)), { message: 'Description must not contain HTML tags' }),
});

export const pennuengMemberUpdateSchema = pennuengMemberSchema.partial().omit({ memberNo: true });

export type PennuengMemberInput = z.infer<typeof pennuengMemberSchema>;
export type PennuengMemberUpdateInput = z.infer<typeof pennuengMemberUpdateSchema>;
