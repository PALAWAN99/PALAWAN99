import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  createPennuengMember,
  fetchPennuengMemberTypes,
  listPennuengMembers,
} from '@/lib/pennueng-members';
import { pennuengMemberSchema } from '@/validators/pennuengMemberValidator';
import {
  ApiSuccess,
  ApiCreated,
  ApiUnauthorized,
  ApiForbidden,
  ApiBadRequest,
  ApiServiceUnavailable,
  ApiValidationError,
  handleError,
} from '@/lib/api-response';

/** GET /api/admin/pennueng-members — รายชื่อจาก Pennueng SQL Server */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const typesOnly = searchParams.get('types') === '1';

    if (typesOnly) {
      const types = await fetchPennuengMemberTypes();
      return ApiSuccess({ types });
    }

    const result = await listPennuengMembers({
      search,
      page,
      limit,
      memberType: type,
    });
    return ApiSuccess(result);
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/admin/pennueng-members — สร้างสมาชิกใน mbmembmaster */
export async function POST(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'CREATE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
  }

  try {
    const body = await req.json();
    const parsed = pennuengMemberSchema.safeParse({
      ...body,
      email: body.email || null,
    });
    if (!parsed.success) return ApiValidationError(parsed.error);

    const member = await createPennuengMember(parsed.data);

    await logAction({
      action: 'CREATE',
      resource: 'MEMBER',
      resourceId: member.memberNo,
      after: member,
      req,
    });

    return ApiCreated(member, 'เพิ่มสมาชิก Pennueng เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
