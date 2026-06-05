import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import {
  findPennuengMemberByCitizenId,
  getPennuengMemberTypeGroupDetail,
} from '@/lib/pennueng-members';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiBadRequest,
  ApiServiceUnavailable,
  handleError,
} from '@/lib/api-response';

/** GET /api/admin/idcard/pennueng-lookup?citizenId= */
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
    const citizenId = req.nextUrl.searchParams.get('citizenId')?.trim() ?? '';
    if (!citizenId) return ApiBadRequest('ต้องระบุ citizenId');

    const member = await findPennuengMemberByCitizenId(citizenId);
    if (!member) {
      return ApiSuccess({ found: false, member: null, groupDetail: null });
    }

    const groupDetail = await getPennuengMemberTypeGroupDetail(member.memberType);
    return ApiSuccess({ found: true, member, groupDetail });
  } catch (error) {
    return handleError(error);
  }
}
