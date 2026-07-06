import { NextResponse } from 'next/server';

import { LRUCache } from 'lru-cache';

// เก็บข้อมูลการเรียกใช้ API ในหน่วยความจำ (In-memory)
// หมายเหตุ: ในระบบใหญ่ควรใช้ Redis แทน
const tokenCache = new LRUCache({
  max: 500,
  ttl: 60 * 1000, // 1 นาที
});

export function rateLimit(ip: string, limit: number = 60) {
  const tokenCount = (tokenCache.get(ip) as number[]) || [0];
  if (tokenCount[0] === 0) {
    tokenCache.set(ip, [1]);
  }
  
  tokenCount[0] += 1;
  const currentUsage = tokenCount[0];
  const isRateLimited = currentUsage >= limit;
  
  return {
    isRateLimited,
    currentUsage,
    limit,
  };
}

/**
 * Helper สำหรับเช็ค Rate Limit ใน API Route
 */
export function checkRateLimit(req: Request, limit: number = 60) {
  const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { isRateLimited, currentUsage, limit: maxLimit } = rateLimit(ip, limit);
  
  if (isRateLimited) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: '1 minute' },
      { status: 429 }
    );
  }
  
  return null; // ผ่าน
}
