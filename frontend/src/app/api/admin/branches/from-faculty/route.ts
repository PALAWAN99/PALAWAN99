import { NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { KKU_GATE_PREFIX_LABELS } from '@/lib/gate-display-label';
import { logAction } from '@/lib/audit';
import { prisma } from '@/lib/prisma';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import {
  ApiCreated,
  ApiUnauthorized,
  ApiConflict,
  ApiBadRequest,
  handleError,
} from '@/lib/api-response';

const bodySchema = z.object({
  facultyKey: z.string().min(1).max(20),
});

/** POST /api/admin/branches/from-faculty — สร้างสาขาในระบบจากคีย์คณะ (cel, en, nkc, …) */
export async function POST(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session) return ApiUnauthorized();

  try {
    const { facultyKey } = bodySchema.parse(await req.json());
    const key = facultyKey.trim().toLowerCase();
    const labels = KKU_GATE_PREFIX_LABELS[key];
    if (!labels || key === 'other' || key === 'test') {
      return ApiBadRequest('ไม่สามารถสร้างสาขาจากคีย์นี้ได้');
    }

    const code = key.toUpperCase();
    const existing = await prisma.branch.findUnique({ where: { code } });
    if (existing) {
      return ApiConflict(`มีสาขารหัส ${code} อยู่แล้ว (${existing.nameTh})`);
    }

    const branch = await prisma.branch.create({
      data: {
        code,
        nameTh: labels.th,
        nameEn: labels.en,
        nameZh: labels.zh,
        address: `Pennueng · คณะ/หน่วยงาน ${labels.th}`,
        isActive: true,
      },
    });

    await logAction({
      action: 'CREATE',
      resource: 'BRANCH',
      resourceId: branch.id,
      after: branch,
      req,
    });

    return ApiCreated(branch, `สร้างสาขา ${labels.th} (${code}) เรียบร้อยแล้ว`);
  } catch (error) {
    return handleError(error);
  }
}
