import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createBranchSchema } from '@/lib/schemas/gate';
import { logAction } from '@/lib/audit';
import { ApiSuccess, ApiCreated, ApiConflict, handleError } from '@/lib/api-response';

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

    return ApiSuccess(branches);
  } catch (error) {
    return handleError(error);
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
      return ApiConflict('รหัสสาขานี้มีอยู่ในระบบแล้ว');
    }

    const branch = await prisma.branch.create({
      data: validatedData
    });

    // บันทึก Audit Log
    await logAction({
      action: 'CREATE',
      resource: 'BRANCH',
      resourceId: branch.id,
      after: branch,
      req,
    });

    return ApiCreated(branch, 'สร้างสาขาใหม่เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
