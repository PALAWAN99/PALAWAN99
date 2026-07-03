import { z } from 'zod';

export const gateHistoryRecordSchema = z.object({
  operateDate: z.string().min(1, 'ต้องระบุวันเวลา'),
  direction: z.enum(['IN', 'OUT']),
  decision: z.enum(['ALLOWED', 'DENIED']),
  gateId: z.string().min(1, 'ต้องเลือกประตู').max(50),
  memberNo: z.string().max(30).optional().nullable(),
  memberKey: z.string().max(100).optional().nullable(),
  memberType: z.string().max(10).optional().nullable(),
  name: z.string().min(1, 'ต้องระบุชื่อ').max(100),
  surname: z.string().max(100).optional().nullable(),
  personId: z.string().max(20).optional().nullable(),
  remark: z.string().max(500).optional().nullable(),
});

export type GateHistoryRecordInput = z.infer<typeof gateHistoryRecordSchema>;
