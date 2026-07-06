import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export type NotificationLevel = 'critical' | 'warning' | 'info';

export interface NotifyPayload {
  type: string;
  title: string;
  message: string;
  level: NotificationLevel;
  userId?: string; // ถ้าระบุจะส่งให้คนนั้นคนเดียว ถ้าไม่ระบุจะส่งตาม Role
  roles?: UserRole[]; // ส่งให้กลุ่ม Role
  metadata?: any;
}

export class NotificationService {
  /**
   * ส่งการแจ้งเตือน
   */
  static async notify(payload: NotifyPayload) {
    try {
      // 1. หาผู้รับ
      const recipients = await this.getRecipients(payload);
      
      // 2. บันทึกลง Database (In-app)
      if (recipients.length > 0) {
        await prisma.notification.createMany({
          data: recipients.map((user: any) => ({
            userId: user.id,
            type: payload.type,
            title: payload.title,
            message: payload.message,
            level: payload.level,
            metadata: payload.metadata || {},
          })),
        });
      }

      // 3. ส่ง LINE Notify (ถ้าตั้งค่าไว้)
      if (['critical', 'warning'].includes(payload.level)) {
        await this.sendLineNotify(`[${payload.level.toUpperCase()}] ${payload.title}\n${payload.message}`);
      }

      // 4. ส่ง Email (ถ้าเป็น critical)
      if (payload.level === 'critical') {
        // Implement email sending here if needed
      }

      return { success: true, count: recipients.length };
    } catch (error) {
      console.error('NotificationService Error:', error);
      return { success: false, error };
    }
  }

  /**
   * ค้นหาผู้รับตามเงื่อนไข
   */
  private static async getRecipients(payload: NotifyPayload) {
    if (payload.userId) {
      const user = await prisma.user.findUnique({ where: { id: payload.userId } });
      return user ? [user] : [];
    }

    const roles = payload.roles || [UserRole.SUPER_ADMIN, UserRole.ADMIN];
    return prisma.user.findMany({
      where: {
        role: { in: roles },
        isActive: true,
      },
    });
  }

  /**
   * ส่ง LINE Notify
   */
  private static async sendLineNotify(message: string) {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'line_notify_token' }
    });

    const token = setting?.value || process.env.LINE_NOTIFY_TOKEN;
    if (!token) return;

    try {
      await fetch('https://notify-api.line.me/api/notify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ message }),
      });
    } catch (error) {
      console.error('LINE Notify Error:', error);
    }
  }
}
