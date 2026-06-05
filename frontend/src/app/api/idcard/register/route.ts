import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkStrictRateLimit } from '@/lib/rate-limit';
import { idCardRegisterSchema } from '@/validators/idCardValidator';
import { ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';
import { registerWithIdCard } from '@/services/idCardService';

/**
 * API สำหรับลงทะเบียนด้วยบัตรประชาชน
 */
export async function POST(req: NextRequest) {
  // 1. Check Rate Limit (30 req/min — strict for registration)
  const rateLimitError = await checkStrictRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    // 2. ตรวจสอบสิทธิ์ (ต้องเป็นเจ้าหน้าที่ที่มีสิทธิ์เท่านั้น)
    const session = await auth();
    if (!session) {
      return ApiUnauthorized();
    }

    const body = await req.json();
    
    // 3. Validate with Zod
    const validated = idCardRegisterSchema.parse(body);

    // 4. Delegate to Service
    const result = await registerWithIdCard(validated);

    return ApiSuccess(result, 'ลงทะเบียนและออก QR Code เรียบร้อยแล้ว');

  } catch (error) {
    return handleError(error);
  }
}
