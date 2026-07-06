import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createBranchSchema } from '@/lib/schemas/gate';
import { ZodError } from 'zod';

/**
 * GET /api/admin/branches
 * รายการสาขา/อาคารทั้งหมด
 */
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { gates: true }
        }
      }
    });

    return NextResponse.json(branches);
  } catch (error) {
    console.error('[BRANCH_GET]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/branches
 * สร้างสาขาใหม่
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createBranchSchema.parse(body);

    // ตรวจสอบ Code ซ้ำ
    const existingBranch = await prisma.branch.findUnique({
      where: { code: validatedData.code }
    });

    if (existingBranch) {
      return NextResponse.json(
        { message: 'Branch code already exists' },
        { status: 400 }
      );
    }

    const branch = await prisma.branch.create({
      data: validatedData
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: 'Validation Error', errors: error.issues },
        { status: 422 }
      );
    }

    console.error('[BRANCH_POST]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
