import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { ApiSuccess, ApiUnauthorized, ApiForbidden, handleError } from '@/lib/api-response';

// GET: ดึงรายการประวัติการใช้งาน (Audit Logs)
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return ApiUnauthorized();
  }

  // เฉพาะ SUPER_ADMIN เท่านั้นที่ดู Audit Log ได้ตาม Matrix
  if (!checkAccess(session, 'AUDIT_LOG', 'READ')) {
    return ApiForbidden();
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const resource = searchParams.get('resource') || undefined;

    const logs = await prisma.auditLog.findMany({
      where: {
        resource: resource,
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return ApiSuccess(logs);
  } catch (error) {
    return handleError(error);
  }
}
