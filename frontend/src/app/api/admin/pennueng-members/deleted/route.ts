import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { listPennuengSoftDeleted } from '@/lib/pennueng-members';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  handleError,
} from '@/lib/api-response';

/** GET /api/admin/pennueng-members/deleted — รายการ soft delete (PostgreSQL) */
export async function GET(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'READ')) return ApiForbidden();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await listPennuengSoftDeleted({ search, page, limit });
    return ApiSuccess(result);
  } catch (error) {
    return handleError(error);
  }
}
