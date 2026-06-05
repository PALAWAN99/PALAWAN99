import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function createAuditLog({
  action,
  resource,
  resourceId,
  before,
  after,
  req,
}: {
  action: string;
  resource: string;
  resourceId?: string;
  before?: unknown;
  after?: unknown;
  req?: Request;
}) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    let ipAddress = 'unknown';
    let userAgent = 'unknown';

    if (req) {
      ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';
      userAgent = req.headers.get('user-agent') || 'unknown';
    }

    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        resource,
        resourceId: resourceId ?? null,
        dataBefore: before ? JSON.parse(JSON.stringify(before)) : null,
        dataAfter: after ? JSON.parse(JSON.stringify(after)) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('[AUDIT_LOG_ERROR]', error);
    // ไม่ควรให้ error การ log ขวางการทำงานหลักของระบบ แต่ควรแจ้งเตือนทางอื่น
  }
}
