import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

/**
 * Upload Security Configuration
 */
const UPLOAD_CONFIG = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_MIME: ['image/jpeg', 'image/png', 'image/webp'],
  UPLOAD_DIR: path.join(process.cwd(), 'storage', 'members'),
};

/**
 * ตรวจสอบความปลอดภัยของรูปภาพก่อนบันทึก
 */
export async function validateImage(buffer: Buffer, mimeType: string) {
  // 1. ตรวจสอบขนาด
  if (buffer.length > UPLOAD_CONFIG.MAX_SIZE) {
    throw new Error('ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 2MB)');
  }

  // 2. ตรวจสอบ Mime Type (ป้องกันไฟล์สคริปต์หลอมตัวเป็นรูป)
  if (!UPLOAD_CONFIG.ALLOWED_MIME.includes(mimeType)) {
    throw new Error('ประเภทไฟล์ไม่ได้รับอนุญาต (รองรับเฉพาะ JPG, PNG, WebP)');
  }

  // 3. ตรวจสอบ Magic Bytes (ตรวจสอบว่าเป็นรูปจริง ไม่ใช่แค่เปลี่ยนนามสกุล)
  const header = buffer.toString('hex', 0, 4);
  const isJpg = header === 'ffd8ffe0' || header === 'ffd8ffe1' || header === 'ffd8ffee';
  const isPng = header === '89504e47';
  const isWebp = buffer.toString('hex', 8, 12) === '57454250'; // 'WEBP'

  if (!isJpg && !isPng && !isWebp) {
    throw new Error('เนื้อหาไฟล์ไม่ใช่รูปภาพที่ถูกต้อง');
  }

  return true;
}

/**
 * บันทึกไฟล์ลง Disk อย่างปลอดภัย
 * - เปลี่ยนชื่อเป็น UUID/Hash เพื่อป้องกันการเดาชื่อไฟล์และ Overwrite
 * - Sanitize path
 */
export async function saveUploadedFile(buffer: Buffer, originalName: string, mimeType: string) {
  await validateImage(buffer, mimeType);

  // 1. ตรวจสอบและสร้าง Directory
  try {
    await fs.access(UPLOAD_CONFIG.UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_CONFIG.UPLOAD_DIR, { recursive: true });
  }

  // 2. เจนชื่อไฟล์ใหม่ (ใช้ Hash + นามสกุลที่ถูกต้องตาม Mime Type)
  const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const filePath = path.join(UPLOAD_CONFIG.UPLOAD_DIR, safeName);

  // 3. บันทึกไฟล์ (Path ถูกกำหนดตายตัว ป้องกัน Path Traversal)
  await fs.writeFile(filePath, buffer);

  return {
    fileName: safeName,
    path: filePath,
  };
}

/**
 * ลบไฟล์เก่าออก (ถ้ามีการอัปเดต)
 */
export async function deleteFile(fileName: string) {
  if (!fileName) return;
  const filePath = path.join(UPLOAD_CONFIG.UPLOAD_DIR, fileName);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error('Delete file error:', error);
  }
}
