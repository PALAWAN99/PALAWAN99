import type { ChangelogChangeType } from '@prisma/client';
import { prisma, resetPrismaSingleton } from '@/lib/prisma';
import { APP_VERSION, APP_VERSION_LABEL } from '@/lib/app-meta';

/** รายการแรกเมื่อตารางว่าง — สร้างอัตโนมัติจากเวอร์ชันปัจจุบัน */
function bootstrapRow(): {
  version: string;
  title: string;
  description: string;
  changeType: ChangelogChangeType;
  releasedAt: Date;
} {
  return {
    version: APP_VERSION,
    title: `${APP_VERSION_LABEL} — เปิดใช้งานบันทึกการเปลี่ยนแปลง`,
    description:
      'สร้างรายการแรกอัตโนมัติเมื่อฐานข้อมูลว่าง รายการถัดไป: ใช้ `npm run changelog:auto` หลัง commit (แนะนำ conventional commit เช่น feat:, fix:) หรือ `npm run changelog:add` สำหรับข้อความกำหนดเอง',
    changeType: 'FEATURE',
    releasedAt: new Date(),
  };
}

export async function ensureChangelogSeed(): Promise<void> {
  let delegate = prisma.changelogEntry;
  if (!delegate?.count) {
    await resetPrismaSingleton();
    delegate = prisma.changelogEntry;
  }
  if (!delegate?.count) {
    throw new Error(
      '[changelog] Prisma client ไม่มี changelogEntry — รัน `cd frontend && npx prisma generate` แล้วรีสตาร์ท `npm run dev`',
    );
  }
  const count = await delegate.count();
  if (count > 0) return;
  await delegate.create({ data: bootstrapRow() });
}
