import { z } from 'zod';

export const deviceSchema = z.object({
  name: z.string().min(1, 'ต้องมีชื่ออุปกรณ์'),
  deviceCode: z.string().min(1, 'ต้องมีรหัสอุปกรณ์'),
  gateId: z.string().min(1, 'ต้องระบุประตูที่ติดตั้ง'),
  deviceType: z.enum(['QR_SCANNER', 'KIOSK', 'ID_CARD_READER', 'MOBILE']).default('QR_SCANNER'),
  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE']).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type DeviceInput = z.infer<typeof deviceSchema>;
