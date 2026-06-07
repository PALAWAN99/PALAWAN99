import { NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from './env';

// ============================================
// Rate Limiter — Dual-mode (In-memory & Upstash Redis)
// ============================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// 1. In-memory fallback (LRU Cache) - สำหรับ Dev หรือระบบย่อยที่ไม่จำเป็นต้องใช้ Redis
const cache = new LRUCache<string, RateLimitEntry>({
  max: 1000,       // เก็บ IP ได้สูงสุด 1,000 ตัว
  ttl: 60 * 1000,  // หมดอายุหลัง 1 นาที
});

// 2. ตรวจสอบและตั้งค่า Upstash Redis อัตโนมัติ (Production)
const isRedisConfigured = !!(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
const redisClient = isRedisConfigured
  ? new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// เก็บ instance ของ Upstash Ratelimit เพื่อไม่ให้สร้างใหม่ทุก request
const upstashLimiters = new Map<string, Ratelimit>();

function getUpstashLimiter(limit: number, windowMs: number): Ratelimit | null {
  if (!redisClient) return null;
  const cacheKey = `${limit}:${windowMs}`;
  
  if (!upstashLimiters.has(cacheKey)) {
    upstashLimiters.set(
      cacheKey,
      new Ratelimit({
        redis: redisClient,
        // แปลง ms เป็นวินาที เช่น 60000ms -> 60s
        limiter: Ratelimit.slidingWindow(limit, `${windowMs / 1000} s`),
        prefix: `kku-gate:ratelimit:${limit}:${windowMs}`,
        analytics: true,
      })
    );
  }
  return upstashLimiters.get(cacheKey) || null;
}

/**
 * ตรวจสอบ Rate Limit
 * @param identifier - IP address หรือ key อื่นๆ
 * @param limit - จำนวนครั้งสูงสุดต่อนาที
 * @param windowMs - ช่วงเวลา (default: 60 วินาที)
 */
export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60_000
): Promise<{ isRateLimited: boolean; currentUsage: number; limit: number; remaining: number }> {
  
  // --- Mode 1: Upstash Redis (Production / Distributed) ---
  if (isRedisConfigured) {
    const limiter = getUpstashLimiter(limit, windowMs);
    if (limiter) {
      try {
        const { success, limit: limitVal, remaining } = await limiter.limit(identifier);
        return {
          isRateLimited: !success,
          currentUsage: limitVal - remaining,
          limit: limitVal,
          remaining: remaining,
        };
      } catch (err) {
        console.error('⚠️ Upstash Redis connection failed, falling back to in-memory rate limiting:', err);
      }
    }
  }

  // --- Mode 2: In-memory LRU Cache (Development / Fallback) ---
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
export async function checkRateLimit(req: Request, limit: number = 60): Promise<NextResponse | undefined> {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  const result = await rateLimit(ip, limit);

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

  return undefined; // ผ่าน
}

// ============================================
// Preset Rate Limiters สำหรับแต่ละ Tier
// ============================================

/** QR Validate / ID Card Register — เข้มงวดสุด (30 req/min) */
export async function checkStrictRateLimit(req: Request): Promise<NextResponse | undefined> {
  return checkRateLimit(req, 30);
}

/** Admin API ทั่วไป (100 req/min) */
export async function checkStandardRateLimit(req: Request): Promise<NextResponse | undefined> {
  return checkRateLimit(req, 100);
}

/** Device Heartbeat / Internal (200 req/min) */
export async function checkRelaxedRateLimit(req: Request): Promise<NextResponse | undefined> {
  return checkRateLimit(req, 200);
}

/** Auth / Login — เข้มมาก กันเดา password (10 req/min) */
export async function checkAuthRateLimit(req: Request): Promise<NextResponse | undefined> {
  return checkRateLimit(req, 10);
}
