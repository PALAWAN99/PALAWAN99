import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { auth } from './auth';

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // 1. ข้ามการจัดการสำหรับ API, _next และ Static files
  const isApiRoute = nextUrl.pathname.startsWith('/api');
  const isNextInternal = nextUrl.pathname.startsWith('/_next');
  const isPublicFile = nextUrl.pathname.includes('.');

  if (isApiRoute || isNextInternal || isPublicFile) {
    return;
  }

  // 2. จัดการเส้นทางภาษา (รองรับ /th/..., /en/..., /zh/...)
  const pathname = nextUrl.pathname;
  const isAdminPath = pathname.startsWith('/admin') || /^\/(th|en|zh)\/admin/.test(pathname);
  const isGatePath = pathname.startsWith('/gate') || /^\/(th|en|zh)\/gate/.test(pathname);
  const isLoginPath = pathname.startsWith('/login') || /^\/(th|en|zh)\/login/.test(pathname);

  // 3. Logic การป้องกัน Route
  if (isAdminPath || isGatePath) {
    if (!isLoggedIn) {
      // ถ้าไม่ได้ Login ให้ Redirect ไปหน้า Login (รักษา locale ไว้)
      const locale = pathname.match(/^\/(th|en|zh)/)?.[0] || '';
      return Response.redirect(new URL(`${locale}/login`, nextUrl));
    }

    // เช็คสิทธิ์เฉพาะ (ตัวอย่าง: หน้าตั้งค่าผู้ใช้ต้องเป็น SUPER_ADMIN)
    const isUserSettings = pathname.includes('/admin/users') || pathname.includes('/admin/settings');
    if (isUserSettings && userRole !== 'SUPER_ADMIN') {
      const locale = pathname.match(/^\/(th|en|zh)/)?.[0] || '';
      return Response.redirect(new URL(`${locale}/admin`, nextUrl));
    }
  }

  // 4. ถ้า Login แล้วเข้าหน้า Login ให้เตะกลับไปหน้า Admin
  if (isLoginPath && isLoggedIn) {
    const locale = pathname.match(/^\/(th|en|zh)/)?.[0] || '';
    return Response.redirect(new URL(`${locale}/admin`, nextUrl));
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
