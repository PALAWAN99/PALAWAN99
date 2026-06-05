import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  getPennuengMemberByNo,
  softDeletePennuengMember,
  updatePennuengMember,
} from '@/lib/pennueng-members';
import { pennuengMemberUpdateSchema } from '@/validators/pennuengMemberValidator';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiServiceUnavailable,
  ApiValidationError,
  ApiOk,
  handleError,
} from '@/lib/api-response';

type RouteCtx = { params: Promise<{ memberNo: string }> };

function decodeMemberNo(raw: string) {
  return decodeURIComponent(raw).trim();
}

/** GET /api/admin/pennueng-members/[memberNo] */
export async function GET(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { memberNo: raw } = await params;
    const member = await getPennuengMemberByNo(decodeMemberNo(raw));
    if (!member) return ApiNotFound('ไม่พบสมาชิก');
    return ApiSuccess(member);
  } catch (error) {
    return handleError(error);
  }
}

/** PATCH /api/admin/pennueng-members/[memberNo] */
export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'UPDATE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { memberNo: raw } = await params;
    const memberNo = decodeMemberNo(raw);
    const before = await getPennuengMemberByNo(memberNo);
    if (!before) return ApiNotFound('ไม่พบสมาชิก');

    const body = await req.json();
    const parsed = pennuengMemberUpdateSchema.safeParse({
      ...body,
      email: body.email === '' ? null : body.email,
    });
    if (!parsed.success) return ApiValidationError(parsed.error);

    const after = await updatePennuengMember(memberNo, parsed.data);

    await logAction({
      action: 'UPDATE',
      resource: 'MEMBER',
      resourceId: memberNo,
      before,
      after,
      req,
    });

    return ApiSuccess(after, 'แก้ไขสมาชิกเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/admin/pennueng-members/[memberNo] — soft delete */
export async function DELETE(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'DELETE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { memberNo: raw } = await params;
    const memberNo = decodeMemberNo(raw);
    const before = await getPennuengMemberByNo(memberNo);
    if (!before) return ApiNotFound('ไม่พบสมาชิก');

    await softDeletePennuengMember(memberNo, session.user.id);

    await logAction({
      action: 'DELETE',
      resource: 'MEMBER',
      resourceId: memberNo,
      before,
      req,
    });

    return ApiOk('ย้ายสมาชิกไปถังขยะ (soft delete) เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
