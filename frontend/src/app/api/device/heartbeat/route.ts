import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkRelaxedRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, handleError } from '@/lib/api-response';

// Schema สำหรับตรวจสอบข้อมูลที่ส่งมาจากเครื่องสแกน
const heartbeatSchema = z.object({
  deviceCode: z.string().min(1, 'ต้องมีรหัสอุปกรณ์'),
  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE']).default('ONLINE'),
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * POST /api/device/heartbeat
 * ใช้สำหรับให้อุปกรณ์ (Scanner/Kiosk) ส่งสัญญาณแจ้งสถานะ
 */
export async function POST(req: NextRequest) {
  // Check Rate Limit (200 req/min — relaxed for device heartbeat)
  const rateLimitError = await checkRelaxedRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    
    // 1. Validate ข้อมูล
    const validated = heartbeatSchema.parse(body);
    const { deviceCode, status } = validated;

    // 2. ตรวจสอบว่าเครื่องนี้มีในระบบไหม
    const device = await prisma.deviceRegistry.findUnique({
      where: { deviceCode },
    });

    if (!device) {
      throw new Error(`Device not found: ${deviceCode}`);
    }

    // 3. อัปเดตสถานะและเวลาที่เห็นล่าสุด
    const updatedDevice = await prisma.deviceRegistry.update({
      where: { deviceCode },
      data: {
        status,
        lastSeenAt: new Date(),
      },
      include: {
        gate: {
          select: {
            nameTh: true,
            gateCode: true,
          }
        }
      }
    });

    // 4. Trigger แจ้งเตือนถ้าสถานะไม่ใช่ ONLINE
    if (status !== 'ONLINE') {
      const { NotificationService } = await import('@/lib/notifications/service');
      await NotificationService.notify({
        type: 'DEVICE_STATUS',
        title: `อุปกรณ์ ${status}`,
        message: `อุปกรณ์ ${updatedDevice.name} (${deviceCode}) ที่ประตู ${updatedDevice.gate.nameTh} เปลี่ยนสถานะเป็น ${status}`,
        level: status === 'OFFLINE' ? 'critical' : 'warning',
        metadata: { deviceId: updatedDevice.id, gateId: updatedDevice.gateId }
      });
    }

    return ApiSuccess({
      code: updatedDevice.deviceCode,
      status: updatedDevice.status,
      lastSeen: updatedDevice.lastSeenAt,
      gate: updatedDevice.gate.nameTh,
    }, 'อัปเดตสถานะอุปกรณ์เรียบร้อย');

  } catch (error) {
    return handleError(error);
  }
}
