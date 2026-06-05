import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import { restorePennuengMember } from '@/lib/pennueng-members';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiServiceUnavailable,
  ApiOk,
  handleError,
} from '@/lib/api-response';

type RouteCtx = { params: Promise<{ memberNo: string }> };

/** POST /api/admin/pennueng-members/[memberNo]/restore */
export async function POST(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'UPDATE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { memberNo: raw } = await params;
    const memberNo = decodeURIComponent(raw).trim();
    const after = await restorePennuengMember(memberNo);

    await logAction({
      action: 'UPDATE',
      resource: 'MEMBER',
      resourceId: memberNo,
      after: { ...after, restored: true },
      req,
    });

    return ApiSuccess(after, 'กู้คืนสมาชิกเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
