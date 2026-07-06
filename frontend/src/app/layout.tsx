import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'QR Gate Access — ระบบ QR เข้า-ออกประตู',
    template: '%s | QR Gate Access',
  },
  description: 'ระบบจัดการเข้า-ออกอาคารด้วย QR Code รองรับ 3 ภาษา (ไทย/English/中文) — QR Gate Access Control System',
  keywords: ['QR Code', 'Gate Access', 'Access Control', 'ระบบเข้า-ออก', '门禁系统'],
  authors: [{ name: 'QR Gate Team' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // สำหรับ Next.js 16/Turbopack เมื่อใช้ localized routes 
  // ตัว Root Layout จะทำหน้าที่เป็น Wrapper และส่งต่อให้ [locale]/layout จัดการโครงสร้าง HTML
  return children;
}
