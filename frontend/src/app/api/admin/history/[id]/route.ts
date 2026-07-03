import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { logAction } from '@/lib/audit';
import {
  ApiForbidden,
  ApiNotFound,
  ApiServiceUnavailable,
  ApiSuccess,
  ApiUnauthorized,
  ApiValidationError,
  handleError,
} from '@/lib/api-response';
import {
  getPennuengGateStatementById,
  updatePennuengGateStatement,
} from '@/lib/pennueng-gate-statement';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import { gateHistoryRecordSchema } from '@/validators/gateHistoryRecordValidator';

type RouteCtx = { params: Promise<{ id: string }> };

/** GET/PATCH /api/admin/history/[id] */
export async function GET(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'ACCESS_EVENT', 'READ')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { id: raw } = await params;
    const id = parseInt(raw, 10);
    if (Number.isNaN(id)) return ApiNotFound('ไม่พบรายการ');

    const row = await getPennuengGateStatementById(id);
    if (!row) return ApiNotFound('ไม่พบรายการ');
    return ApiSuccess(row);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'ACCESS_EVENT', 'UPDATE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { id: raw } = await params;
    const id = parseInt(raw, 10);
    if (Number.isNaN(id)) return ApiNotFound('ไม่พบรายการ');

    const before = await getPennuengGateStatementById(id);
    if (!before) return ApiNotFound('ไม่พบรายการ');

    const body = await req.json();
    const parsed = gateHistoryRecordSchema.safeParse(body);
    if (!parsed.success) return ApiValidationError(parsed.error);

    const after = await updatePennuengGateStatement(id, parsed.data);

    await logAction({
      action: 'UPDATE',
      resource: 'ACCESS_EVENT',
      resourceId: String(id),
      before,
      after,
      req,
    });

    return ApiSuccess(after, 'แก้ไขรายการเข้า-ออกเรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
