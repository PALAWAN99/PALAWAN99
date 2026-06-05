import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { fetchPennuengDashboard } from '@/lib/pennueng-dashboard';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiServiceUnavailable,
  handleError,
} from '@/lib/api-response';

/**
 * GET /api/admin/dashboard/pennueng
 * สถิติและกราฟจาก Pennueng SQL Server (gatestatement / mbmembmaster)
 */
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
    const data = await fetchPennuengDashboard();
    return ApiSuccess(data);
  } catch (error) {
    console.error('[pennueng-dashboard]', error);
    return handleError(error);
  }
}
