import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import crypto from 'crypto';
import { ApiSuccess, ApiCreated, ApiUnauthorized, ApiBadRequest, handleError } from '@/lib/api-response';

// GET: ดึงรายการอุปกรณ์ทั้งหมด
export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as { role: string } | undefined;
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return ApiUnauthorized();
    }

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

    return ApiSuccess(devices);
  } catch (error) {
    return handleError(error);
  }
}

// POST: ลงทะเบียนอุปกรณ์ใหม่
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as { role: string } | undefined;
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return ApiUnauthorized();
    }

    const body = await req.json();
    
    // Validate with Zod
    const { deviceSchema } = await import('@/validators/deviceValidator');
    const validation = deviceSchema.safeParse(body);
    
    if (!validation.success) {
      return ApiBadRequest('ข้อมูลอุปกรณ์ไม่ถูกต้อง', validation.error.flatten().fieldErrors);
    }

    const { name, deviceCode, gateId, deviceType } = validation.data;

    // สร้าง Secret สำหรับอุปกรณ์
    const rawSecret = crypto.randomBytes(32).toString('hex');
    const secretHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

    const device = await prisma.deviceRegistry.create({
      data: {
        name,
        deviceCode,
        gateId,
        deviceType,
        secretHash,
        status: 'OFFLINE',
      }
    });

    // ส่งคืนข้อมูลอุปกรณ์พร้อม Secret (ส่งให้แค่ครั้งเดียวตอนสร้าง)
    return ApiCreated({ 
      ...device, 
      plainSecret: rawSecret 
    }, 'ลงทะเบียนอุปกรณ์ใหม่เรียบร้อยแล้ว');

  } catch (error) {
    return handleError(error);
  }
}
