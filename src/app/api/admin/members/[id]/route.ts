import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { memberSchema } from '@/lib/validations';
import { logAction } from '@/lib/audit';
import { ApiSuccess, ApiUnauthorized, ApiForbidden, ApiNotFound, ApiValidationError, handleError } from '@/lib/api-response';

/**
 * GET /api/admin/members/[id]
 * ดูรายละเอียดสมาชิกรายบุคคล
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  try {
    const { id } = await params;
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) return ApiNotFound('ไม่พบข้อมูลสมาชิก');

    return ApiSuccess(member);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PATCH /api/admin/members/[id]
 * แก้ไขข้อมูลสมาชิก
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'UPDATE')) return ApiForbidden();

  try {
    const { id } = await params;
    const body = await req.json();

    // Partial validation for PATCH
    const validation = memberSchema.partial().safeParse(body);
    if (!validation.success) {
      return ApiValidationError(validation.error);
    }

    const before = await prisma.member.findUnique({ where: { id } });
    if (!before) return ApiNotFound('ไม่พบข้อมูลสมาชิกที่ต้องการแก้ไข');

    const updated = await prisma.member.update({
      where: { id },
      data: validation.data,
    });

    // บันทึก Audit Log (ละเอียด: ใคร แก้ใคร จากอะไรเป็นอะไร)
    await logAction({
      action: 'UPDATE',
      resource: 'MEMBER',
      resourceId: id,
      before,
      after: updated,
      req,
    });

    return ApiSuccess(updated, 'แก้ไขข้อมูลสมาชิกเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/admin/members/[id]
 * ลบสมาชิก
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'DELETE')) return ApiForbidden();

  try {
    const { id } = await params;
    
    const before = await prisma.member.findUnique({ where: { id } });
    if (!before) return ApiNotFound('ไม่พบข้อมูลสมาชิกที่ต้องการลบ');

    // ลบข้อมูลจริง
    await prisma.member.delete({ where: { id } });

    // บันทึก Audit Log (สำคัญ: ใคร ลบใคร)
    await logAction({
      action: 'DELETE',
      resource: 'MEMBER',
      resourceId: id,
      before,
      req,
    });

    return ApiSuccess({ id }, 'ลบข้อมูลสมาชิกเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
