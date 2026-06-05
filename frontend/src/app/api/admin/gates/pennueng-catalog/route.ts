import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { fetchPennuengGateCatalog } from '@/lib/pennueng-gate-catalog';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiServiceUnavailable,
  handleError,
} from '@/lib/api-response';

/** GET /api/admin/gates/pennueng-catalog — รายการประตูจาก Pennueng + สถานะลงทะเบียนในระบบ */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable(
      'ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_HOST, SQLSERVER_DATABASE, … ใน .env)',
    );
  }

  try {
    const rows = await fetchPennuengGateCatalog();
    const registered = rows.filter((r) => r.registered).length;
    return ApiSuccess({
      rows,
      total: rows.length,
      registered,
      unregistered: rows.length - registered,
    });
  } catch (error) {
    console.error('[pennueng-gate-catalog]', error);
    return handleError(error);
  }
}
