import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import {
  ApiForbidden,
  ApiServiceUnavailable,
  ApiSuccess,
  ApiUnauthorized,
  handleError,
} from '@/lib/api-response';
import { fetchPennuengGateSettings } from '@/lib/pennueng-gate-settings';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { isSqlServerConfigured } from '@/lib/sqlserver';

/** GET /api/admin/settings/gates — รายการ gatemaster สำหรับจัดการ IP */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'SETTING', 'MANAGE') && !checkAccess(session, 'GATE', 'READ')) {
    return ApiForbidden();
  }

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
  }

  try {
    const gates = await fetchPennuengGateSettings();
    return ApiSuccess({ gates });
  } catch (error) {
    console.error('[settings/gates GET]', error);
    return handleError(error);
  }
}
