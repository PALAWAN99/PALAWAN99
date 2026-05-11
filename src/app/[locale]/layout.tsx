import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { MantineAppProvider } from '@/components/providers/MantineAppProvider';
import type { Metadata } from 'next';
import '../globals.css';

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <MantineAppProvider>
            {children}
          </MantineAppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
