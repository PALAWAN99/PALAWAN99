import '@/lib/env';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MIN_TTL_SECONDS } from '@/lib/qr-policy-ttl';
import { z } from 'zod';

const policySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  ttlSeconds: z.number().min(MIN_TTL_SECONDS),
  oneTimeUse: z.boolean().default(false),
  maxUsesPerDay: z.number().default(10),
  isDefault: z.boolean().default(false),
});

export async function GET() {
  try {
    const policies = await prisma.qrPolicy.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(policies);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = policySchema.parse(body);

    // ถ้านโยบายนี้เป็น Default ให้ไปเอาตัวอื่นออกจาก Default ก่อน
    if (data.isDefault) {
      await prisma.qrPolicy.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const policy = await prisma.qrPolicy.create({ data });
    return NextResponse.json(policy);
  } catch (error) {
    console.error('[QR_POLICY_POST]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (updateData.isDefault) {
      await prisma.qrPolicy.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const policy = await prisma.qrPolicy.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(policy);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
