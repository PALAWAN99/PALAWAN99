import { NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { logAction } from '@/lib/audit';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiBadRequest,
  handleError,
} from '@/lib/api-response';

const bodySchema = z.object({
  gateIds: z.array(z.string().uuid()).min(1, 'เลือกอย่างน้อย 1 ประตู'),
  branchId: z.string().uuid('รหัสสาขาไม่ถูกต้อง'),
});

/** PATCH /api/admin/gates/bulk-branch — ย้ายสาขาหลายประตูพร้อมกัน */
export async function PATCH(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'GATE', 'UPDATE')) return ApiForbidden();

  try {
    const { gateIds, branchId } = bodySchema.parse(await req.json());

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return ApiNotFound('ไม่พบสาขาที่ระบุ');

    const existing = await prisma.gate.findMany({
      where: { id: { in: gateIds } },
      select: { id: true },
    });
    if (existing.length !== gateIds.length) {
      return ApiBadRequest('มีรายการประตูที่ไม่พบในระบบ');
    }

    const result = await prisma.gate.updateMany({
      where: { id: { in: gateIds } },
      data: { branchId },
    });

    await logAction({
      action: 'UPDATE',
      resource: 'GATE',
      resourceId: gateIds.join(','),
      after: { branchId, count: result.count, gateIds },
      req,
    });

    return ApiSuccess(
      { updated: result.count, branch: { id: branch.id, nameTh: branch.nameTh, code: branch.code } },
      `ย้ายสาขา ${result.count} ประตูไปยัง ${branch.nameTh} เรียบร้อยแล้ว`,
    );
  } catch (error) {
    return handleError(error);
  }
}
