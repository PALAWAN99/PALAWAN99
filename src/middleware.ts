import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './auth';

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  // ข้ามการจัดการ i18n สำหรับ API และไฟล์ Static
  if (req.nextUrl.pathname.startsWith('/api') || 
      req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.includes('.')) {
    return;
  }

  return intlMiddleware(req);
});

export const config = {
  // Matcher ที่ครอบคลุมทั้งหน้าปกติและหน้าที่มี Locale prefix
  matcher: [
    // สแกนทุกหน้ายกเว้น API และ Static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // บังคับให้รันที่ root ด้วย
    '/'
  ],
};
