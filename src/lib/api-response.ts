import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

// ============================================
// Centralized API Response & Error Handling
// ============================================

/**
 * Standard API Response Format:
 * 
 * Success: { success: true, data: T, message?: string }
 * Error:   { success: false, error: { code: string, message: string, details?: any } }
 */

// ────────────────────────────────────────────
// Success Responses
// ────────────────────────────────────────────

/** 200 OK — ดึงข้อมูลสำเร็จ */
export function ApiSuccess<T>(data: T, message?: string) {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
  });
}

/** 201 Created — สร้างข้อมูลใหม่สำเร็จ */
export function ApiCreated<T>(data: T, message = 'สร้างข้อมูลสำเร็จ') {
  return NextResponse.json({
    success: true,
    data,
    message,
  }, { status: 201 });
}

/** 200 OK — ดำเนินการสำเร็จ (ไม่มี data คืน) */
export function ApiOk(message = 'ดำเนินการสำเร็จ') {
  return NextResponse.json({
    success: true,
    message,
  });
}

/** 200 OK — ดึงรายการสำเร็จ (พร้อม pagination) */
export function ApiPaginated<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// ────────────────────────────────────────────
// Error Responses
// ────────────────────────────────────────────

/** Error response builder (internal) */
function apiErrorResponse(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json({
    success: false,
    error: {
      code,
      message,
      ...(details && process.env.NODE_ENV === 'development' && { details }),
    },
  }, { status });
}

/** 400 Bad Request — ข้อมูลไม่ถูกต้อง */
export function ApiBadRequest(message = 'ข้อมูลไม่ถูกต้อง', details?: unknown) {
  return apiErrorResponse('BAD_REQUEST', message, 400, details);
}

/** 401 Unauthorized — ไม่ได้เข้าสู่ระบบ */
export function ApiUnauthorized(message = 'กรุณาเข้าสู่ระบบก่อน') {
  return apiErrorResponse('UNAUTHORIZED', message, 401);
}

/** 403 Forbidden — ไม่มีสิทธิ์ */
export function ApiForbidden(message = 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้') {
  return apiErrorResponse('FORBIDDEN', message, 403);
}

/** 404 Not Found — ไม่พบข้อมูล */
export function ApiNotFound(message = 'ไม่พบข้อมูลที่ต้องการ') {
  return apiErrorResponse('NOT_FOUND', message, 404);
}

/** 409 Conflict — ข้อมูลซ้ำ */
export function ApiConflict(message = 'ข้อมูลนี้มีอยู่ในระบบแล้ว') {
  return apiErrorResponse('CONFLICT', message, 409);
}

/** 422 Validation Error — Zod validation ไม่ผ่าน */
export function ApiValidationError(error: ZodError) {
  return apiErrorResponse('VALIDATION_ERROR', 'ข้อมูลไม่ผ่านการตรวจสอบ', 422, error.flatten().fieldErrors);
}

/** 500 Internal Server Error — ข้อผิดพลาดภายใน */
export function ApiInternalError(message = 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', details?: unknown) {
  return apiErrorResponse('INTERNAL_ERROR', message, 500, details);
}

/** 503 Service Unavailable — บริการไม่พร้อม */
export function ApiServiceUnavailable(message = 'บริการไม่พร้อมใช้งานชั่วคราว') {
  return apiErrorResponse('SERVICE_UNAVAILABLE', message, 503);
}

// ────────────────────────────────────────────
// Centralized Error Handler
// ────────────────────────────────────────────

/**
 * จัดการ Error ทุกประเภทแบบ Centralized
 * ใช้ใน catch block ของทุก API Route
 * 
 * @example
 * ```ts
 * try { ... } catch (error) { return handleError(error); }
 * ```
 */
export function handleError(error: unknown): NextResponse {
  console.error('[API_ERROR]', error);

  // Zod validation error
  if (error instanceof ZodError) {
    return ApiValidationError(error);
  }

  // Prisma known errors
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const prismaError = error as { code: string; message?: string; meta?: any };

    switch (prismaError.code) {
      case 'P2002': // Unique constraint violation
        const target = prismaError.meta?.target;
        return ApiConflict(
          target ? `ข้อมูล ${Array.isArray(target) ? target.join(', ') : target} ซ้ำกับที่มีอยู่แล้ว` : 'ข้อมูลนี้มีอยู่ในระบบแล้ว'
        );
      case 'P2025': // Record not found
        return ApiNotFound('ไม่พบข้อมูลที่ต้องการ');
      case 'P2003': // Foreign key constraint failed
        return ApiBadRequest('ข้อมูลอ้างอิงไม่ถูกต้อง (Foreign Key)');
      case 'P2014': // Required relation violation
        return ApiBadRequest('ไม่สามารถลบข้อมูลนี้ได้ เนื่องจากมีข้อมูลอื่นอ้างอิงอยู่');
    }
  }

  // Standard Error object
  if (error instanceof Error) {
    // Database connection error
    if (error.message.includes("Can't reach database") || error.message.includes('connect')) {
      return ApiServiceUnavailable('ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาติดต่อผู้ดูแลระบบ');
    }

    // Business logic errors (thrown intentionally)
    if (error.message.includes('already exists')) {
      return ApiConflict(error.message);
    }

    return ApiInternalError('เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error.message);
  }

  // Unknown error
  return ApiInternalError();
}
