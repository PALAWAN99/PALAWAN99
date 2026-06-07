import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface AuditLogParams {
  action: string;
  resource: string;
  resourceId?: string;
  before?: any;
  after?: any;
  metadata?: any;
  req?: Request;
}

/**
 * บันทึกประวัติการใช้งานระบบ (Audit Log)
 * ใช้ใน API Route
 */
export async function logAction({
  action,
  resource,
  resourceId,
  before,
  after,
  metadata,
  req
}: AuditLogParams) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    
    // ดึง IP และ User Agent จาก Request (ถ้ามี)
    const ipAddress = req?.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req?.headers.get('user-agent') || 'unknown';

    const finalAfter = after || metadata || null;

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        resource,
        resourceId,
        dataBefore: before ? JSON.parse(JSON.stringify(before)) : null,
        dataAfter: finalAfter ? JSON.parse(JSON.stringify(finalAfter)) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to save audit log:', error);
  }
}
