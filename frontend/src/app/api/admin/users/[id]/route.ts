import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { UserService } from '@/services/userService';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';
import { updateUserSchema } from '@/validators/userValidator';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiValidationError,
  ApiOk,
  handleError,
} from '@/lib/api-response';

type RouteCtx = { params: Promise<{ id: string }> };

/** GET /api/admin/users/[id] */
export async function GET(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'USER', 'READ')) return ApiForbidden();

  try {
    const { id } = await params;
    const user = await UserService.getUserById(id);
    if (!user) return ApiNotFound('ไม่พบผู้ใช้');
    return ApiSuccess(user);
  } catch (error) {
    return handleError(error);
  }
}

/** PATCH /api/admin/users/[id] — แก้ไข / ระงับ / รีเซ็ตรหัสผ่าน */
export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'USER', 'UPDATE')) return ApiForbidden();

  try {
    const { id } = await params;
    const before = await UserService.getUserById(id);
    if (!before) return ApiNotFound('ไม่พบผู้ใช้');

    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return ApiValidationError(parsed.error);
    }

    const after = await UserService.updateUser(id, parsed.data, session.user.id);

    await logAction({
      action: 'UPDATE',
      resource: 'USER',
      resourceId: id,
      before,
      after,
      req,
    });

    return ApiSuccess(after, 'อัปเดตผู้ใช้เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/admin/users/[id] */
export async function DELETE(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'USER', 'DELETE')) return ApiForbidden();

  try {
    const { id } = await params;
    const before = await UserService.getUserById(id);
    if (!before) return ApiNotFound('ไม่พบผู้ใช้');

    await UserService.deleteUser(id, session.user.id);

    await logAction({
      action: 'DELETE',
      resource: 'USER',
      resourceId: id,
      before,
      req,
    });

    return ApiOk('ลบผู้ใช้เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
