import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateDeviceSchema = z.object({
  name: z.string().min(1).optional(),
  gateId: z.string().uuid().optional(),
  deviceType: z.string().optional(),
  status: z.enum(['ONLINE', 'OFFLINE', 'MAINTENANCE']).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = updateDeviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid data', details: result.error.format() }, { status: 400 });
    }

    const updatedDevice = await prisma.deviceRegistry.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json(updatedDevice);
  } catch (error) {
    console.error('[DEVICE_PATCH]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.deviceRegistry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DEVICE_DELETE]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
