import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

// Schema สำหรับสร้างอุปกรณ์ใหม่
const createDeviceSchema = z.object({
  deviceCode: z.string().min(1),
  name: z.string().min(1),
  gateId: z.string().uuid(),
  deviceType: z.string().default('SCANNER'),
  secret: z.string().min(6), // รหัสผ่านสำหรับอุปกรณ์ใช้เชื่อมต่อ
});

/**
 * GET /api/admin/devices
 * ดึงรายการอุปกรณ์ทั้งหมด
 */
export async function GET() {
  try {
    const devices = await prisma.deviceRegistry.findMany({
      include: {
        gate: {
          select: {
            nameTh: true,
            gateCode: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(devices);
  } catch (error) {
    console.error('[DEVICES_GET]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/devices
 * ลงทะเบียนอุปกรณ์ใหม่
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = createDeviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
    }

    const { deviceCode, name, gateId, deviceType, secret } = result.data;

    // Hash secret ก่อนบันทึก
    const secretHash = crypto.createHash('sha256').update(secret).digest('hex');

    const device = await prisma.deviceRegistry.create({
      data: {
        deviceCode,
        name,
        gateId,
        deviceType,
        secretHash,
        status: 'OFFLINE',
      }
    });

    return NextResponse.json(device);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'รหัสอุปกรณ์นี้มีอยู่ในระบบแล้ว' }, { status: 409 });
    }
    console.error('[DEVICES_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
