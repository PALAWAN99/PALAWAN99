import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import {
  ApiBadRequest,
  ApiForbidden,
  ApiNotFound,
  ApiServiceUnavailable,
  ApiSuccess,
  ApiUnauthorized,
  handleError,
} from '@/lib/api-response';
import { logAction } from '@/lib/audit';
import {
  fetchPennuengGateSettingById,
  updatePennuengGateSettings,
} from '@/lib/pennueng-gate-settings';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import { pennuengGateSettingsUpdateSchema } from '@/validators/pennuengGateSettingsValidator';

type RouteContext = { params: Promise<{ gateId: string }> };

/** PATCH /api/admin/settings/gates/[gateId] — อัปเดต IP/สถานะใน gatemaster */
export async function PATCH(req: NextRequest, context: RouteContext) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'SETTING', 'MANAGE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
  }

  const { gateId } = await context.params;
  const trimmedId = gateId?.trim();
  if (!trimmedId) return ApiBadRequest('gateId ไม่ถูกต้อง');

  try {
    const before = await fetchPennuengGateSettingById(trimmedId);
    if (!before) return ApiNotFound('ไม่พบประตูใน gatemaster');

    const body = await req.json();
    const parsed = pennuengGateSettingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return ApiBadRequest('ข้อมูล IP ไม่ถูกต้อง', parsed.error.flatten().fieldErrors);
    }

    const after = await updatePennuengGateSettings(trimmedId, parsed.data);

    await logAction({
      action: 'UPDATE',
      resource: 'SETTING',
      resourceId: trimmedId,
      before,
      after,
      req,
    });

    return ApiSuccess(after, 'อัปเดต IP ประตูเรียบร้อย');
  } catch (error) {
    console.error('[settings/gates PATCH]', error);
    return handleError(error);
  }
}
