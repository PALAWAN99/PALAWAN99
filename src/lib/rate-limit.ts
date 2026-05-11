import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// ============================================
// Rate Limiter — In-memory (LRU Cache)
// สำหรับ Production ขนาดใหญ่ ควรใช้ Redis (Upstash)
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * สร้าง Rate Limiter แต่ละตัวแยกตาม Tier
 * - STRICT: สำหรับ public-facing API (QR validate, registration) — ป้องกัน spam
 * - STANDARD: สำหรับ admin API ทั่วไป — จำกัดการใช้งานพอสมควร
 * - RELAXED: สำหรับ device heartbeat / internal — ให้ถี่ได้
 */

// Shared cache สำหรับทุก Tier (แยก key ด้วย prefix)
const cache = new LRUCache<string, RateLimitEntry>({
  max: 1000,       // เก็บ IP ได้สูงสุด 1,000 ตัว
  ttl: 60 * 1000,  // หมดอายุหลัง 1 นาที
});

/**
 * ตรวจสอบ Rate Limit
 * @param identifier - IP address หรือ key อื่นๆ
 * @param limit - จำนวนครั้งสูงสุดต่อนาที
 * @param windowMs - ช่วงเวลา (default: 60 วินาที)
 */
export function rateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60_000
): { isRateLimited: boolean; currentUsage: number; limit: number; remaining: number } {
  const now = Date.now();
  const entry = cache.get(identifier);

  if (!entry || now >= entry.resetAt) {
    // เริ่มนับใหม่
    cache.set(identifier, { count: 1, resetAt: now + windowMs });
    return { isRateLimited: false, currentUsage: 1, limit, remaining: limit - 1 };
  }

  // เพิ่มจำนวนครั้ง
  entry.count += 1;
  cache.set(identifier, entry);

  const isRateLimited = entry.count > limit;
  return {
    isRateLimited,
    currentUsage: entry.count,
    limit,
    remaining: Math.max(0, limit - entry.count),
  };
}

/**
 * Helper สำหรับเช็ค Rate Limit ใน API Route
 * คืน NextResponse 429 ถ้าเกิน limit หรือ null ถ้าผ่าน
 */
export function checkRateLimit(req: Request, limit: number = 60): NextResponse | null {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const result = rateLimit(ip, limit);

  if (result.isRateLimited) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'คำขอมากเกินไป กรุณารอสักครู่แล้วลองใหม่',
        retryAfter: 60,
      },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return null; // ผ่าน
}

// ============================================
// Preset Rate Limiters สำหรับแต่ละ Tier
// ============================================

/** QR Validate / ID Card Register — เข้มงวดสุด (30 req/min) */
export function checkStrictRateLimit(req: Request): NextResponse | null {
  return checkRateLimit(req, 30);
}

/** Admin API ทั่วไป (100 req/min) */
export function checkStandardRateLimit(req: Request): NextResponse | null {
  return checkRateLimit(req, 100);
}

/** Device Heartbeat / Internal (200 req/min) */
export function checkRelaxedRateLimit(req: Request): NextResponse | null {
  return checkRateLimit(req, 200);
}

/** Auth / Login — เข้มมาก กันเดา password (10 req/min) */
export function checkAuthRateLimit(req: Request): NextResponse | null {
  return checkRateLimit(req, 10);
}
