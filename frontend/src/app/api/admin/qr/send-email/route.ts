import '@/lib/env';
import { NextResponse } from 'next/server';
import { sendQrEmail } from '@/lib/mailer';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email(),
  memberName: z.string().min(1),
  qrImageDataUrl: z.string().min(1), // base64 PNG data URL
  expiresAt: z.string(),
  isTemporary: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    console.log('[DEBUG SMTP ENV]', {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: process.env.SMTP_PORT,
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS_EXISTS: !!process.env.SMTP_PASS,
    });

    const body = await req.json();
    const data = emailSchema.parse(body);

    await sendQrEmail({
      to: data.email,
      memberName: data.memberName,
      qrImageDataUrl: data.qrImageDataUrl,
      expiresAt: data.expiresAt,
      isTemporary: data.isTemporary,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[QR_EMAIL_SEND_POST]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message === 'SMTP_NOT_CONFIGURED') {
      return NextResponse.json(
        { error: 'ยังไม่ได้ระบุการตั้งค่าเซิร์ฟเวอร์อีเมล (SMTP_HOST, SMTP_USER, SMTP_PASS ใน .env)' },
        { status: 400 }
      );
    }
    if (message.includes('ETIMEOUT') || message.includes('timeout')) {
      return NextResponse.json(
        { error: 'การเชื่อมต่อไปยังเซิร์ฟเวอร์อีเมลหมดเวลา (Timeout) กรุณาตรวจสอบการตั้งค่าเครือข่าย/SMTP Port' },
        { status: 504 }
      );
    }
    if (message.includes('auth') || message.includes('Authentication') || message.includes('denied') || message.includes('credentials')) {
      return NextResponse.json(
        { error: 'ชื่อผู้ใช้หรือรหัสผ่าน SMTP ไม่ถูกต้อง กรุณาตรวจสอบ SMTP_USER และ SMTP_PASS' },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
