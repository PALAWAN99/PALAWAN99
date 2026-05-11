import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import crypto from 'crypto';

// GET: ดึงรายการอุปกรณ์ทั้งหมด
export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as { role: string } | undefined;
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    return NextResponse.json(devices);
  } catch (error: unknown) {
    console.error('Fetch devices error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: ลงทะเบียนอุปกรณ์ใหม่
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const user = session?.user as { role: string } | undefined;
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, deviceCode, gateId, deviceType } = body;

    if (!name || !deviceCode || !gateId || !deviceType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
    return NextResponse.json({ 
      ...device, 
      plainSecret: rawSecret 
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Create device error:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'Device Code already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
