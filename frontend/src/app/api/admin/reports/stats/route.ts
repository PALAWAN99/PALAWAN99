import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { auth } from '@/auth';
import { ApiBadRequest, ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { fetchReportsAnalytics } from '@/lib/reports-analytics';

const querySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gateIds: z.array(z.string().min(1)).default([]),
});

function parseGateIds(raw: string | null): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
}

/**
 * GET /api/admin/reports/stats?startDate=&endDate=&gateIds=
 */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();

  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse({
      startDate: searchParams.get('startDate') ?? dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      endDate: searchParams.get('endDate') ?? dayjs().format('YYYY-MM-DD'),
      gateIds: parseGateIds(searchParams.get('gateIds')),
    });

    if (!parsed.success) {
      return ApiBadRequest('พารามิเตอร์ startDate/endDate ไม่ถูกต้อง (YYYY-MM-DD)');
    }

    let { startDate, endDate, gateIds } = parsed.data;
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      [startDate, endDate] = [endDate, startDate];
    }

    const data = await fetchReportsAnalytics({ startDate, endDate, gateIds });
    return ApiSuccess(data);
  } catch (error) {
    console.error('[reports/stats]', error);
    return handleError(error);
  }
}
