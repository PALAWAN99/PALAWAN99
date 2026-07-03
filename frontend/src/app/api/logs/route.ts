import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiOk, ApiBadRequest, handleError } from '@/lib/api-response';
import { checkRelaxedRateLimit } from '@/lib/rate-limit';
import { getRequestMeta } from '@/lib/route-log/request-meta';
import { writeRouteLogs } from '@/lib/route-log/write';
import type { RouteLogInput } from '@/lib/route-log/types';

// จำกัดจำนวน log ต่อคำขอ กัน payload ใหญ่ผิดปกติจาก client ที่ถูกดัดแปลง
const MAX_LOGS_PER_REQUEST = 20;

const logEntrySchema = z.object({
  source: z.enum(['FRONTEND_PAGE', 'FRONTEND_API', 'BACKEND_FASTAPI']),
  level: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).optional(),
  method: z.string().max(10).nullable().optional(),
  path: z.string().min(1).max(500),
  routePattern: z.string().max(500).nullable().optional(),
  action: z.string().max(120).nullable().optional(),
  statusCode: z.number().int().nullable().optional(),
  durationMs: z.number().nullable().optional(),
  userId: z.string().uuid().nullable().optional(),
  sessionId: z.string().max(64).nullable().optional(),
  referer: z.string().max(500).nullable().optional(),
  locale: z.string().max(10).nullable().optional(),
  errorMessage: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

const payloadSchema = z.object({
  logs: z.array(logEntrySchema).min(1).max(MAX_LOGS_PER_REQUEST),
});

/**
 * POST /api/logs — รับ log จากฝั่ง client (page view, client action)
 * ไม่ต้องล็อกอิน เพราะหน้าสาธารณะ (เช่น QR landing) ก็ต้องส่ง log ได้เช่นกัน
 */
export async function POST(req: NextRequest) {
  const rateLimitError = await checkRelaxedRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    const body = await req.json();
    const parsed = payloadSchema.safeParse(body);
    if (!parsed.success) return ApiBadRequest('รูปแบบ log ไม่ถูกต้อง', parsed.error.issues);

    const meta = getRequestMeta(req);
    const entries: RouteLogInput[] = parsed.data.logs.map((entry) => ({
      ...entry,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    }));

    const count = await writeRouteLogs(entries);
    return ApiOk(`บันทึก log สำเร็จ ${count} รายการ`);
  } catch (error) {
    return handleError(error);
  }
}
