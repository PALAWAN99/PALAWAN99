import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';

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
  // Check Rate Limit
  const rateLimitError = checkRateLimit(req, 120); // ให้ถี่กว่าปกติได้สำหรับ Heartbeat
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    
    // 1. Validate ข้อมูล
    const result = heartbeatSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: result.error.format() },
        { status: 400 }
      );
    }

    const { deviceCode, status } = result.data;

    // 2. ตรวจสอบว่าเครื่องนี้มีในระบบไหม
    const device = await prisma.deviceRegistry.findUnique({
      where: { deviceCode },
    });

    if (!device) {
      return NextResponse.json(
        { error: 'ไม่พบรหัสอุปกรณ์นี้ในระบบ' },
        { status: 404 }
      );
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

    // 4. Trigger แจ้งเตือนถ้าสถานะไม่ใช่ ONLINE (งาน Dev 4)
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

    return NextResponse.json({
      success: true,
      message: 'อัปเดตสถานะอุปกรณ์เรียบร้อย',
      device: {
        code: updatedDevice.deviceCode,
        status: updatedDevice.status,
        lastSeen: updatedDevice.lastSeenAt,
        gate: updatedDevice.gate.nameTh,
      }
    });

  } catch (error) {
    console.error('Heartbeat Error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}
