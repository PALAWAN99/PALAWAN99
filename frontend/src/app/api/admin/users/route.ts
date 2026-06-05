import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { UserService } from '@/services/userService';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';
import { ApiSuccess, ApiCreated, ApiUnauthorized, ApiForbidden, ApiBadRequest, handleError } from '@/lib/api-response';

// GET: ดึงข้อมูลรายชื่อผู้ใช้
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'USER', 'READ')) return ApiForbidden();

  try {
    const users = await UserService.getUsers();
    return ApiSuccess(users);
  } catch (error) {
    return handleError(error);
  }
}

// POST: สร้างผู้ใช้ใหม่ (Super Admin เท่านั้น)
export async function POST(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();
  if (!checkAccess(session, 'USER', 'CREATE')) return ApiForbidden();

  try {
    const body = await req.json();
    
    // Validate with Zod
    const { userSchema } = await import('@/validators/userValidator');
    const validation = userSchema.safeParse(body);
    
    if (!validation.success) {
      return ApiBadRequest('ข้อมูลผู้ใช้ไม่ถูกต้อง', validation.error.flatten().fieldErrors);
    }

    const user = await UserService.createUser(validation.data);

    // บันทึก Audit Log
    await logAction({
      action: 'CREATE',
      resource: 'USER',
      resourceId: user.id,
      after: user,
      req,
    });

    return ApiCreated(user, 'สร้างผู้ใช้ใหม่เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
