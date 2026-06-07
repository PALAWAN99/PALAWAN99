import '@/lib/env';
import nodemailer from 'nodemailer';
import dns from 'node:dns';
import { promisify } from 'node:util';

const dnsLookup = promisify(dns.lookup);

const smtpHost = process.env.SMTP_HOST ?? '';
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER ?? '';
const smtpPass = process.env.SMTP_PASS ?? '';
const smtpFrom = process.env.SMTP_FROM ?? `"KKU Library" <${smtpUser}>`;
const smtpSecure = smtpPort === 465;

async function resolveHostToIp(host: string): Promise<string> {
  if (!host || /^[0-9.]+$/.test(host)) return host;
  try {
    const result = await dnsLookup(host, { family: 4 });
    console.log(`[DNS] Resolved ${host} to IP via OS: ${result.address}`);
    return result.address;
  } catch (err) {
    console.error(`[DNS] Failed to resolve ${host} via dns.lookup:`, err);
    return host; // Fallback to hostname
  }
}

export function validateSmtpConfig() {
  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }
}

export interface SendQrEmailOptions {
  to: string;
  memberName: string;
  qrImageDataUrl: string; // base64 PNG data URL
  expiresAt: string;      // ISO string
  isTemporary?: boolean;
}

export async function sendQrEmail(opts: SendQrEmailOptions): Promise<void> {
  validateSmtpConfig();

  // Resolve host to IP using OS resolver to bypass Node.js c-ares DNS bugs (queryA ETIMEOUT)
  const resolvedHost = await resolveHostToIp(smtpHost);

  const transporter = nodemailer.createTransport({
    host: resolvedHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
    tls: {
      rejectUnauthorized: false, // Bypass certificate verification for direct IP connections or proxy inspection
      servername: smtpHost,      // Maintain SNI for SSL handshake
    },
    connectionTimeout: 15000, // 15s connection timeout
    greetingTimeout: 15000,   // 15s greeting timeout
    socketTimeout: 20000,     // 20s socket timeout
  });

  const expiry = new Date(opts.expiresAt).toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  // Strip "data:image/png;base64," prefix for CID attachment
  const base64Data = opts.qrImageDataUrl.replace(/^data:image\/png;base64,/, '');

  await transporter.sendMail({
    from: smtpFrom,
    to: opts.to,
    subject: `QR Code เข้าห้องสมุด มข. — ใช้ได้ถึง ${expiry}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#1e3a5f;margin-bottom:4px">QR Code เข้าห้องสมุด</h2>
        <p style="color:#6b7280;font-size:14px;margin-top:0">มหาวิทยาลัยขอนแก่น</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
        <p style="font-size:15px">สวัสดี <strong>${opts.memberName}</strong></p>
        <p style="font-size:14px;color:#374151">QR Code สำหรับเข้า-ออกห้องสมุดของคุณ:</p>
        <div style="text-align:center;margin:24px 0">
          <img src="cid:qrcode" alt="QR Code" width="220" height="220"
               style="border:1px solid #e5e7eb;border-radius:8px;padding:8px"/>
        </div>
        ${opts.isTemporary ? '<p style="font-size:13px;color:#d97706;text-align:center">⚠️ QR ชั่วคราว — ใช้ได้ครั้งเดียว</p>' : ''}
        <p style="font-size:13px;color:#6b7280;text-align:center">
          ใช้ได้ถึง: <strong style="color:#111827">${expiry}</strong>
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
        <p style="font-size:12px;color:#9ca3af;text-align:center">
          อีเมลนี้ส่งโดยระบบอัตโนมัติ — กรุณาอย่าตอบกลับ
        </p>
      </div>
    `,
    attachments: [
      {
        filename: 'qrcode.png',
        content: base64Data,
        encoding: 'base64',
        cid: 'qrcode',
      },
    ],
  });
}
