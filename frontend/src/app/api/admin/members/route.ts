import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { MemberService } from '@/services/memberService';
import { checkAccess } from '@/lib/rbac';
import { memberSchema } from '@/validators/memberValidator';
import { logAction } from '@/lib/audit';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiCreated, ApiUnauthorized, ApiForbidden, ApiBadRequest, handleError } from '@/lib/api-response';
import { withLoggedApi } from '@/lib/route-log';

// GET: ดึงรายการสมาชิก
export const GET = withLoggedApi(async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const result = await MemberService.getMembers(search, page, limit, type, status);
    return ApiSuccess(result);
  } catch (error) {
    return handleError(error);
  }
});

// POST: เพิ่มสมาชิกใหม่
export const POST = withLoggedApi(async function POST(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'CREATE')) return ApiForbidden();

  try {
    const body = await req.json();

    // Validate with Zod
    const validation = memberSchema.safeParse(body);
    if (!validation.success) {
      return ApiBadRequest('ข้อมูลสมาชิกไม่ถูกต้อง', validation.error.flatten().fieldErrors);
    }

    const data = validation.data;
    const member = await MemberService.createMember(data);

    // บันทึก Audit Log
    await logAction({
      action: 'CREATE',
      resource: 'MEMBER',
      resourceId: member.id,
      after: member,
      req,
    });

    return ApiCreated(member);
  } catch (error) {
    return handleError(error);
  }
});
