import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { NotificationService } from '@/services/notificationService';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiUnauthorized, ApiBadRequest, handleError } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return ApiUnauthorized();

  try {
    const notifications = await NotificationService.getNotifications(userId as string);
    return ApiSuccess(notifications);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return ApiUnauthorized();

  try {
    const { action, id } = await req.json();
    if (action === 'MARK_READ' && id) {
      await NotificationService.markAsRead(id);
      return ApiSuccess({ success: true }, 'อ่านการแจ้งเตือนแล้ว');
    }
    if (action === 'MARK_ALL_READ') {
      await NotificationService.markAllAsRead(session.user.id as string);
      return ApiSuccess({ success: true }, 'อ่านการแจ้งเตือนทั้งหมดแล้ว');
    }
    return ApiBadRequest('คำสั่งไม่ถูกต้อง (Invalid action)');
  } catch (error) {
    return handleError(error);
  }
}
