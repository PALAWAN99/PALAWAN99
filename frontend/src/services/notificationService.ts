import { prisma } from '@/lib/prisma';

export class NotificationService {
  /**
   * สร้างการแจ้งเตือน
   */
  static async create({
    userId,
    title,
    message,
    level = 'info',
    type,
    metadata,
  }: {
    userId: string;
    title: string;
    message: string;
    level?: 'info' | 'warning' | 'critical';
    type: string;
    metadata?: unknown;
  }) {
    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        level,
        type,
        metadata: metadata ? (JSON.parse(JSON.stringify(metadata)) as any) : undefined,
      },
    });
  }

  /**
   * ดึงรายการแจ้งเตือนของผู้ใช้
   */
  static async getNotifications(userId: string, limit = 10) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * อ่านการแจ้งเตือน
   */
  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });
  }

  /**
   * อ่านการแจ้งเตือนทั้งหมดของผู้ใช้
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }
}
