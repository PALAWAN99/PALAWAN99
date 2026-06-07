import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGateSchema } from '@/lib/schemas/gate';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { ApiSuccess, ApiCreated, ApiNotFound, ApiConflict, handleError } from '@/lib/api-response';

/**
 * GET /api/admin/gates
 * รายการประตูทั้งหมด พร้อมข้อมูลสาขา
 */
export async function GET(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

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

    return ApiSuccess(gates);
  } catch (error) {
    return handleError(error);
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
      return ApiConflict('รหัสประตูนี้มีอยู่ในระบบแล้ว');
    }

    // ตรวจสอบว่า Branch มีอยู่จริง
    const branch = await prisma.branch.findUnique({
      where: { id: validatedData.branchId }
    });

    if (!branch) {
      return ApiNotFound('ไม่พบสาขาที่ระบุ');
    }

    const gate = await prisma.gate.create({
      data: {
        ...validatedData,
        metadata: validatedData.metadata as any
      }
    });

    // บันทึก Audit Log
    const { logAction } = await import('@/lib/audit');
    await logAction({
      action: 'CREATE',
      resource: 'GATE',
      resourceId: gate.id,
      after: gate,
      req,
    });

    return ApiCreated(gate, 'สร้างข้อมูลประตูใหม่เรียบร้อยแล้ว');
  } catch (error) {
    return handleError(error);
  }
}
