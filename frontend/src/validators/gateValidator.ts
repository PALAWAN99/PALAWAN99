import { z } from 'zod';

export const gateDirectionSchema = z.enum(['IN', 'OUT', 'BIDIRECTIONAL']);
export const gateStatusSchema = z.enum(['ACTIVE', 'MAINTENANCE', 'DISABLED']);

export const createGateSchema = z.object({
  gateCode: z.string().min(1).max(20).toUpperCase(),
  nameTh: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  nameEn: z.string().min(1, "Please enter English name"),
  nameZh: z.string().min(1, "请输入中文名称"),
  branchId: z.string().uuid("Invalid branch ID format"),
  direction: gateDirectionSchema.default('BIDIRECTIONAL'),
  status: gateStatusSchema.default('ACTIVE'),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const createBranchSchema = z.object({
  code: z.string().min(1).max(20).toUpperCase(),
  nameTh: z.string().min(1, "กรุณากรอกชื่อภาษาไทย"),
  nameEn: z.string().min(1, "Please enter English name"),
  nameZh: z.string().min(1, "请输入中文名称"),
  address: z.string().optional(),
  isActive: z.boolean().default(true),
});
