import { z } from 'zod';

const ipField = z
  .string()
  .trim()
  .max(45)
  .optional()
  .nullable()
  .transform((v) => (v === '' ? null : v ?? null))
  .refine((v) => v === null || /^(\d{1,3}\.){3}\d{1,3}$/.test(v), {
    message: 'รูปแบบ IP ไม่ถูกต้อง',
  });

export const pennuengGateSettingsUpdateSchema = z.object({
  gateIp: ipField,
  gateSubnet: ipField,
  gateGateway: ipField,
  gatePort: z
    .string()
    .trim()
    .max(20)
    .optional()
    .nullable()
    .transform((v) => (v === '' ? null : v ?? null)),
  serverIp: ipField,
  rfidIp: ipField,
  inputIp: ipField,
  gateStatus: z.union([z.literal(0), z.literal(1)]).optional(),
});

export type PennuengGateSettingsUpdateInput = z.infer<typeof pennuengGateSettingsUpdateSchema>;
