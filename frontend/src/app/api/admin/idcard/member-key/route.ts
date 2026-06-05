import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { findPennuengMemberByAccessKey } from '@/lib/pennueng-member-key';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiBadRequest,
  ApiServiceUnavailable,
  handleError,
} from '@/lib/api-response';

/** GET /api/admin/idcard/member-key?key= */
export async function GET(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const key = req.nextUrl.searchParams.get('key')?.trim() ?? '';
    if (!key) return ApiBadRequest('ต้องระบุ key');

    const row = await findPennuengMemberByAccessKey(key);
    return ApiSuccess({ found: Boolean(row), row });
  } catch (error) {
    return handleError(error);
  }
}
