import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

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
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
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
