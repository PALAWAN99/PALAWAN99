import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { translateThToEnZh } from '@/lib/translate-th';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiBadRequest,
  handleError,
} from '@/lib/api-response';

/**
 * POST /api/admin/translate
 * Body: { text: string } — แปลจากไทย → อังกฤษ + จีน (สำหรับฟอร์มสาขา/ชื่อ)
 */
export async function POST(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  const canTranslate =
    checkAccess(session, 'BRANCH', 'CREATE') || checkAccess(session, 'BRANCH', 'UPDATE');
  if (!canTranslate) return ApiForbidden();

  try {
    const body = (await req.json()) as { text?: unknown };
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (text.length < 2) {
      return ApiBadRequest('ข้อความสั้นเกินไป');
    }
    if (text.length > 500) {
      return ApiBadRequest('ข้อความยาวเกินไป (สูงสุด 500 ตัวอักษร)');
    }

    const { nameEn, nameZh } = await translateThToEnZh(text);
    return ApiSuccess({ nameEn, nameZh });
  } catch (error) {
    return handleError(error);
  }
}
