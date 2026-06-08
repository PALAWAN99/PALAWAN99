import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { auth } from '@/auth';
import {
  ApiBadRequest,
  ApiForbidden,
  ApiServiceUnavailable,
  ApiSuccess,
  ApiUnauthorized,
  handleError,
} from '@/lib/api-response';
import { fetchPennuengGateHistory } from '@/lib/pennueng-gate-history';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { isSqlServerConfigured } from '@/lib/sqlserver';

const PAGE_SIZE = 100;

const querySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gateId: z.string().trim().optional(),
  search: z.string().trim().optional(),
  memberType: z.string().trim().optional(),
  decision: z.string().trim().optional(),
  direction: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * GET /api/admin/history?startDate=&endDate=&gateId=&search=&page=
 */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'ACCESS_EVENT', 'READ')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
  }

  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse({
      startDate: searchParams.get('startDate') ?? dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      endDate: searchParams.get('endDate') ?? dayjs().format('YYYY-MM-DD'),
      gateId: searchParams.get('gateId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      memberType: searchParams.get('memberType') ?? undefined,
      decision: searchParams.get('decision') ?? undefined,
      direction: searchParams.get('direction') ?? undefined,
      page: searchParams.get('page') ?? '1',
      pageSize: searchParams.get('pageSize') ?? undefined,
    });

    if (!parsed.success) {
      return ApiBadRequest('พารามิเตอร์ startDate/endDate ไม่ถูกต้อง (YYYY-MM-DD)');
    }

    let { startDate, endDate, gateId, search, memberType, decision, direction, page, pageSize } = parsed.data;
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      [startDate, endDate] = [endDate, startDate];
    }

    const data = await fetchPennuengGateHistory({
      startDate,
      endDate,
      gateId: gateId || undefined,
      search: search || undefined,
      memberType: memberType || undefined,
      decision: decision || undefined,
      direction: direction || undefined,
      page,
      pageSize: pageSize || PAGE_SIZE,
    });

    return ApiSuccess(data);
  } catch (error) {
    console.error('[admin/history GET]', error);
    return handleError(error);
  }
}
