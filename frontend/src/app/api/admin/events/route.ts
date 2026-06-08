import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { AccessEventService } from '@/services/accessEventService';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const gateId = searchParams.get('gateId') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const startDate = searchParams.get('startDate') || undefined;
  const endDate = searchParams.get('endDate') || undefined;
  const decision = searchParams.get('decision') || undefined;
  const direction = searchParams.get('direction') || undefined;
  const memberType = searchParams.get('memberType') || undefined;

  try {
    const result = await AccessEventService.getEvents({
      search,
      gateId,
      page,
      limit,
      startDate,
      endDate,
      decision,
      direction,
      memberType,
    });
    return ApiSuccess(result);
  } catch (error) {
    return handleError(error);
  }
}
