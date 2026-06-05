import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateBranchSchema } from '@/lib/schemas/gate';
import { checkAccess } from '@/lib/rbac';
import { logAction } from '@/lib/audit';
import { normalizeBranchCode } from '@/lib/branch-code';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiConflict,
  ApiBadRequest,
  ApiValidationError,
  handleError,
} from '@/lib/api-response';

type RouteParams = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/branches/[id]
 * แก้ไขข้อมูลสาขา
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'BRANCH', 'UPDATE')) return ApiForbidden();

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateBranchSchema.safeParse(body);
    if (!parsed.success) {
      return ApiValidationError(parsed.error);
    }

    const before = await prisma.branch.findUnique({ where: { id } });
    if (!before) {
      return ApiNotFound('ไม่พบข้อมูลสาขา');
    }

    const data = parsed.data;
    if (data.code !== undefined) {
      const code = normalizeBranchCode(data.code);
      if (!code) {
        return ApiBadRequest('รหัสสาขาไม่ถูกต้อง');
      }
      if (code !== before.code) {
        const dup = await prisma.branch.findUnique({ where: { code } });
        if (dup) {
          return ApiConflict('รหัสสาขานี้มีอยู่ในระบบแล้ว');
        }
      }
      data.code = code;
    }

    const updatePayload: Record<string, unknown> = {};
    if (data.code !== undefined) updatePayload.code = data.code;
    if (data.nameTh !== undefined) updatePayload.nameTh = data.nameTh;
    if (data.nameEn !== undefined) updatePayload.nameEn = data.nameEn;
    if (data.nameZh !== undefined) updatePayload.nameZh = data.nameZh;
    if (data.address !== undefined) updatePayload.address = data.address;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

    const after = await prisma.branch.update({
      where: { id },
      data: updatePayload,
      include: {
        _count: { select: { gates: true } },
      },
    });

    await logAction({
      action: 'UPDATE',
      resource: 'BRANCH',
      resourceId: id,
      before,
      after,
      req,
    });

    return ApiSuccess(after, 'แก้ไขข้อมูลสาขาเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/admin/branches/[id]
 * ลบสาขา (ห้ามลบถ้ามีประตูผูกอยู่)
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'BRANCH', 'DELETE')) return ApiForbidden();

  try {
    const { id } = await params;
    const before = await prisma.branch.findUnique({
      where: { id },
      include: { _count: { select: { gates: true } } },
    });
    if (!before) {
      return ApiNotFound('ไม่พบข้อมูลสาขา');
    }

    if (before._count.gates > 0) {
      return ApiConflict(
        'ไม่สามารถลบสาขาได้ขณะมีประตูผูกอยู่ กรุณาย้ายหรือลบประตูก่อน',
      );
    }

    await prisma.branch.delete({ where: { id } });

    await logAction({
      action: 'DELETE',
      resource: 'BRANCH',
      resourceId: id,
      before,
      req,
    });

    return ApiSuccess({ id }, 'ลบข้อมูลสาขาเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
