import { NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { formatGateLabelFromCode } from '@/lib/gate-display-label';
import { normalizeGateCode } from '@/lib/gate-display-label';
import { prisma } from '@/lib/prisma';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import {
  ApiCreated,
  ApiUnauthorized,
  ApiConflict,
  ApiNotFound,
  handleError,
} from '@/lib/api-response';

const bodySchema = z.object({
  gateCode: z.string().min(1).max(20),
  branchId: z.string().uuid().optional(),
  nameTh: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  nameZh: z.string().min(1).optional(),
});

/** POST /api/admin/gates/pennueng-import — สร้างประตูจากรหัส Pennueng */
export async function POST(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();

  try {
    const body = bodySchema.parse(await req.json());
    const gateCode = body.gateCode.trim();

    const existing = await prisma.gate.findUnique({ where: { gateCode } });
    if (existing) {
      return ApiConflict(`ประตู ${gateCode} มีในระบบแล้ว`);
    }

    let branchId = body.branchId;
    if (!branchId) {
      const lib = await prisma.branch.findFirst({
        where: { code: { in: ['LIB', 'MAIN'] } },
        orderBy: { code: 'asc' },
      });
      const fallback = lib ?? (await prisma.branch.findFirst({ orderBy: { createdAt: 'asc' } }));
      if (!fallback) {
        return ApiNotFound('ไม่พบสาขาในระบบ — สร้างสาขาก่อนนำเข้าประตู');
      }
      branchId = fallback.id;
    } else {
      const branch = await prisma.branch.findUnique({ where: { id: branchId } });
      if (!branch) return ApiNotFound('ไม่พบสาขาที่ระบุ');
    }

    const nameTh = body.nameTh ?? formatGateLabelFromCode(gateCode, 'th');
    const nameEn = body.nameEn ?? formatGateLabelFromCode(gateCode, 'en');
    const nameZh = body.nameZh ?? nameTh;

    const gate = await prisma.gate.create({
      data: {
        gateCode,
        nameTh,
        nameEn,
        nameZh,
        branchId,
        direction: 'BIDIRECTIONAL',
        status: 'ACTIVE',
        metadata: { source: 'pennueng-import', pennuengCode: normalizeGateCode(gateCode) },
      },
    });

    const { logAction } = await import('@/lib/audit');
    await logAction({
      action: 'CREATE',
      resource: 'GATE',
      resourceId: gate.id,
      after: gate,
      req,
    });

    return ApiCreated(gate, `นำเข้าประตู ${gateCode} เรียบร้อยแล้ว`);
  } catch (error) {
    return handleError(error);
  }
}
