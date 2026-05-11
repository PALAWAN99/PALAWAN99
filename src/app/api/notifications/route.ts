import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { NotificationService } from '@/services/notificationService';

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    const notifications = await NotificationService.getNotifications(userId as string);
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { action, id } = await req.json();
    if (action === 'MARK_READ' && id) {
      await NotificationService.markAsRead(id);
      return NextResponse.json({ success: true });
    }
    if (action === 'MARK_ALL_READ') {
      await NotificationService.markAllAsRead(session.user.id as string);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
