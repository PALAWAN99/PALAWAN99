import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGateSchema } from '@/lib/schemas/gate';
import { ZodError } from 'zod';

/**
 * GET /api/admin/gates
 * รายการประตูทั้งหมด พร้อมข้อมูลสาขา
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');

    const gates = await prisma.gate.findMany({
      where: branchId ? { branchId } : {},
      orderBy: { createdAt: 'desc' },
      include: {
        branch: {
          select: {
            nameTh: true,
            code: true
          }
        }
      }
    });

    return NextResponse.json(gates);
  } catch (error) {
    console.error('[GATE_GET]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/gates
 * สร้างประตูใหม่
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createGateSchema.parse(body);

    // ตรวจสอบ Gate Code ซ้ำ
    const existingGate = await prisma.gate.findUnique({
      where: { gateCode: validatedData.gateCode }
    });

    if (existingGate) {
      return NextResponse.json(
        { message: 'Gate code already exists' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า Branch มีอยู่จริง
    const branch = await prisma.branch.findUnique({
      where: { id: validatedData.branchId }
    });

    if (!branch) {
      return NextResponse.json(
        { message: 'Branch not found' },
        { status: 404 }
      );
    }

    const gate = await prisma.gate.create({
      data: validatedData
    });

    return NextResponse.json(gate, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Validation Error', errors: error.issues },
        { status: 422 }
      );
    }

    console.error('[GATE_POST]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
