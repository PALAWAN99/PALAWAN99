import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { listPennuengMemberKeys } from '@/lib/pennueng-member-key';
import { getPennuengMemberByNo } from '@/lib/pennueng-members';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiServiceUnavailable,
  handleError,
} from '@/lib/api-response';

type RouteCtx = { params: Promise<{ memberNo: string }> };

/** GET /api/admin/pennueng-members/[memberNo]/keys — รายการ mbmemberkey */
export async function GET(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { memberNo: raw } = await params;
    const memberNo = decodeURIComponent(raw).trim();
    const member = await getPennuengMemberByNo(memberNo);
    if (!member) return ApiNotFound('ไม่พบสมาชิก');

    const keys = await listPennuengMemberKeys(memberNo);
    return ApiSuccess({ memberNo, keys });
  } catch (error) {
    return handleError(error);
  }
}
