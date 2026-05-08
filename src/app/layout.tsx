import type { Metadata } from 'next';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { MantineAppProvider } from '@/components/providers/MantineAppProvider';
>>>>>>> origin/feature/qrcode-access-system
=======
import { MantineAppProvider } from '@/components/providers/MantineAppProvider';
>>>>>>> origin/upload/gate-system
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
<<<<<<< HEAD
<<<<<<< HEAD
  return children;
=======
=======
>>>>>>> origin/upload/gate-system
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <MantineAppProvider>
          {children}
        </MantineAppProvider>
      </body>
    </html>
  );
<<<<<<< HEAD
>>>>>>> origin/feature/qrcode-access-system
=======
>>>>>>> origin/upload/gate-system
}

