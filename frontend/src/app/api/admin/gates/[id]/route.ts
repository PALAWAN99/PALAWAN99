import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateGateSchema } from '@/lib/schemas/gate';
import { checkAccess } from '@/lib/rbac';
import { logAction } from '@/lib/audit';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiConflict,
  ApiValidationError,
  handleError,
} from '@/lib/api-response';

/**
 * PATCH /api/admin/gates/[id]
 * แก้ไขข้อมูลประตู (บางฟิลด์)
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'GATE', 'UPDATE')) return ApiForbidden();

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateGateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiValidationError(parsed.error);
    }

    const before = await prisma.gate.findUnique({ where: { id } });
    if (!before) {
      return ApiNotFound('ไม่พบข้อมูลประตู');
    }

    const data = parsed.data;
    if (data.gateCode !== undefined && data.gateCode !== before.gateCode) {
      const dup = await prisma.gate.findUnique({ where: { gateCode: data.gateCode } });
      if (dup) {
        return ApiConflict('รหัสประตูนี้มีอยู่ในระบบแล้ว');
      }
    }

    if (data.branchId !== undefined) {
      const branch = await prisma.branch.findUnique({ where: { id: data.branchId } });
      if (!branch) {
        return ApiNotFound('ไม่พบสาขาที่ระบุ');
      }
    }

    const updatePayload: Record<string, unknown> = {};
    if (data.gateCode !== undefined) updatePayload.gateCode = data.gateCode;
    if (data.nameTh !== undefined) updatePayload.nameTh = data.nameTh;
    if (data.nameEn !== undefined) updatePayload.nameEn = data.nameEn;
    if (data.nameZh !== undefined) updatePayload.nameZh = data.nameZh;
    if (data.branchId !== undefined) updatePayload.branchId = data.branchId;
    if (data.direction !== undefined) updatePayload.direction = data.direction;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.deleteLocked !== undefined) updatePayload.deleteLocked = data.deleteLocked;
    if (data.metadata !== undefined) updatePayload.metadata = data.metadata as object;

    const after = await prisma.gate.update({
      where: { id },
      data: updatePayload,
      include: {
        branch: { select: { nameTh: true, code: true } },
      },
    });

    await logAction({
      action: 'UPDATE',
      resource: 'GATE',
      resourceId: id,
      before,
      after,
      req,
    });

    return ApiSuccess(after, 'แก้ไขข้อมูลประตูเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/admin/gates/[id]
 * ลบประตู (ห้ามลบถ้ามีอุปกรณ์หรือประวัติเหตุการณ์อ้างอิง)
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'GATE', 'DELETE')) return ApiForbidden();

  try {
    const { id } = await params;
    const before = await prisma.gate.findUnique({ where: { id } });
    if (!before) {
      return ApiNotFound('ไม่พบข้อมูลประตู');
    }

    if (before.deleteLocked) {
      return ApiConflict('ประตูนี้ถูกล็อกไม่ให้ลบ กรุณาปลดล็อกก่อน');
    }

    const deviceCount = await prisma.deviceRegistry.count({ where: { gateId: id } });
    if (deviceCount > 0) {
      return ApiConflict(
        'ไม่สามารถลบประตูได้ขณะมีอุปกรณ์ผูกอยู่ กรุณาย้ายหรือลบอุปกรณ์ก่อน',
      );
    }

    const hasEvents = await prisma.accessEvent.findFirst({
      where: { gateId: id },
      select: { id: true },
    });
    if (hasEvents) {
      return ApiConflict(
        'ไม่สามารถลบประตูได้ขณะมีประวัติเหตุการณ์ กรุณาใช้สถานะปิดการใช้งานแทน',
      );
    }

    await prisma.gate.delete({ where: { id } });

    await logAction({
      action: 'DELETE',
      resource: 'GATE',
      resourceId: id,
      before,
      req: _req,
    });

    return ApiSuccess({ id }, 'ลบข้อมูลประตูเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
