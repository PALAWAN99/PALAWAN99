import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { fetchReportGateOptions } from '@/lib/reports-analytics';

/**
 * GET /api/admin/reports/gates
 */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();

  try {
    const gates = await fetchReportGateOptions();
    return ApiSuccess({ gates });
  } catch (error) {
    console.error('[reports/gates]', error);
    return handleError(error);
  }
}
