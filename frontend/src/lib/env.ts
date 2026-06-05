import '../../load-root-env';
import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL ต้องเป็น URL ที่ถูกต้อง (เช่น postgresql://...)'),

  // Auth (Auth.js / NextAuth)
  AUTH_SECRET: z.string().min(1, 'AUTH_SECRET ห้ามว่าง'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL ต้องเป็น URL ที่ถูกต้อง').optional(),

  // QR Security
  QR_SECRET: z.string().min(32, 'QR_SECRET ต้องมีความยาวอย่างน้อย 32 ตัวอักษร'),

  // Upstash Redis (Optional for Production Rate Limiting)
  UPSTASH_REDIS_REST_URL: z.string().url('UPSTASH_REDIS_REST_URL ต้องเป็น URL ที่ถูกต้อง').optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // App Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL ต้องเป็น URL ที่ถูกต้อง').optional(),
});

// ตรวจสอบข้อมูล ENV
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    '❌ Invalid Environment Variables:',
    JSON.stringify(parsed.error.format(), null, 2)
  );
  
  // หยุดเมื่อรัน production จริง (ไม่รวม `next build` ที่ยังไม่มี env ครบใน CI/local)
  const isProductionBuild = process.env.npm_lifecycle_event === 'build';
  if (process.env.NODE_ENV === 'production' && !isProductionBuild) {
    throw new Error('ระบบไม่สามารถเริ่มทำงานได้เนื่องจากตั้งค่า Environment Variables ไม่ถูกต้อง');
  }
}

export const env = parsed.success ? parsed.data : (process.env as unknown as z.infer<typeof envSchema>);
