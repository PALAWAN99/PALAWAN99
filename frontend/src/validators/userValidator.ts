import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const userSchema = z.object({
  email: z.string().email('รูปแบบอีเมลไม่ถูกต้อง'),
  fullName: z.string().min(1, 'ต้องมีชื่อ-นามสกุล'),
  password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร').optional(),
  role: z.nativeEnum(UserRole).default(UserRole.VIEWER),
  isActive: z.boolean().default(true),
});

export const updateUserSchema = userSchema.partial();

export type UserInput = z.infer<typeof userSchema>;
export type UserUpdateInput = z.infer<typeof updateUserSchema>;
