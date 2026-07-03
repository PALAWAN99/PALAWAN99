import { NextRequest } from 'next/server';
import dayjs from 'dayjs';
import { z } from 'zod';
import { auth } from '@/auth';
import { logAction } from '@/lib/audit';
import {
  ApiBadRequest,
  ApiCreated,
  ApiForbidden,
  ApiServiceUnavailable,
  ApiSuccess,
  ApiUnauthorized,
  ApiValidationError,
  handleError,
} from '@/lib/api-response';
import { fetchPennuengGateHistory } from '@/lib/pennueng-gate-history';
import { createPennuengGateStatement } from '@/lib/pennueng-gate-statement';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import { gateHistoryRecordSchema } from '@/validators/gateHistoryRecordValidator';

const PAGE_SIZE = 100;

const querySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gateId: z.string().trim().optional(),
  search: z.string().trim().optional(),
  memberNo: z.string().trim().optional(),
  memberType: z.string().trim().optional(),
  decision: z.string().trim().optional(),
  direction: z.string().trim().optional(),
  department: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(1000).optional(),
  all: z.coerce.boolean().optional(),
});

function assertSqlReady() {
  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
  }
  return null;
}

/**
 * GET /api/admin/history?startDate=&endDate=&memberNo=&search=&page=
 * POST /api/admin/history — เพิ่มรายการ gatestatement (manual)
 */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'ACCESS_EVENT', 'READ')) return ApiForbidden();

  const unavailable = assertSqlReady();
  if (unavailable) return unavailable;

  try {
    const { searchParams } = new URL(req.url);
    const parsed = querySchema.safeParse({
      startDate: searchParams.get('startDate') ?? dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
      endDate: searchParams.get('endDate') ?? dayjs().format('YYYY-MM-DD'),
      gateId: searchParams.get('gateId') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      memberNo: searchParams.get('memberNo') ?? undefined,
      memberType: searchParams.get('memberType') ?? undefined,
      decision: searchParams.get('decision') ?? undefined,
      direction: searchParams.get('direction') ?? undefined,
      department: searchParams.get('department') ?? undefined,
      page: searchParams.get('page') ?? '1',
      pageSize: searchParams.get('pageSize') ?? undefined,
      all: searchParams.get('all') ?? undefined,
    });

    if (!parsed.success) {
      return ApiBadRequest('พารามิเตอร์ startDate/endDate ไม่ถูกต้อง (YYYY-MM-DD)');
    }

    let { startDate, endDate, gateId, search, memberNo, memberType, decision, direction, department, page, pageSize, all } =
      parsed.data;
    if (dayjs(endDate).isBefore(dayjs(startDate))) {
      [startDate, endDate] = [endDate, startDate];
    }

    const data = await fetchPennuengGateHistory({
      startDate,
      endDate,
      gateId: gateId || undefined,
      search: search || undefined,
      memberNo: memberNo || undefined,
      memberType: memberType || undefined,
      decision: decision || undefined,
      direction: direction || undefined,
      department: department || undefined,
      page,
      pageSize: pageSize || PAGE_SIZE,
      all,
    });

    return ApiSuccess(data);
  } catch (error) {
    console.error('[admin/history GET]', error);
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'ACCESS_EVENT', 'CREATE')) return ApiForbidden();

  const unavailable = assertSqlReady();
  if (unavailable) return unavailable;

  try {
    const body = await req.json();
    const parsed = gateHistoryRecordSchema.safeParse(body);
    if (!parsed.success) return ApiValidationError(parsed.error);

    const row = await createPennuengGateStatement(parsed.data);

    await logAction({
      action: 'CREATE',
      resource: 'ACCESS_EVENT',
      resourceId: String(row.id),
      after: row,
      req,
    });

    return ApiCreated(row, 'เพิ่มรายการเข้า-ออกเรียบร้อยแล้ว');
  } catch (error) {
    console.error('[admin/history POST]', error);
    return handleError(error);
  }
}
