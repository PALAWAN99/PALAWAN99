import { z } from 'zod';
import { citizenIdValidator } from './common';

export const idCardRegisterSchema = z.object({
  citizenId: citizenIdValidator,
  fullNameTh: z.string().min(1, 'ต้องมีชื่อเต็มภาษาไทย'),
  fullNameEn: z.string().optional(),
  birthDate: z.string().length(8, 'รูปแบบวันเกิดไม่ถูกต้อง (YYYYMMDD)').optional(),
  deviceId: z.string().uuid().optional(),
});

export type IdCardRegisterInput = z.infer<typeof idCardRegisterSchema>;
