import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { fetchFacultyBranchOverview } from '@/lib/faculty-branch-overview';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';

/** GET /api/admin/branches/faculty-overview — จัดกลุ่มประตู Pennueng ตามคณะ/หน่วยงาน */
export async function GET(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();

  try {
    const data = await fetchFacultyBranchOverview();
    return ApiSuccess(data);
  } catch (error) {
    console.error('[faculty-branch-overview]', error);
    return handleError(error);
  }
}
