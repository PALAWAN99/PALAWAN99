import type { NextAuthConfig } from 'next-auth';
import { UserRole } from '@prisma/client';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      
      // ตรวจสอบว่าเป็นหน้า Admin หรือไม่ (รองรับภาษา /th/admin, /en/admin, /zh/admin)
      const isAdminPath = pathname.startsWith('/admin') || 
                         /^\/(th|en|zh)\/admin/.test(pathname);
      
      const isLoginPath = pathname.startsWith('/login') || 
                         /^\/(th|en|zh)\/login/.test(pathname);

      if (isAdminPath) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoginPath) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id as string;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  providers: [], // Will be filled in auth.ts
} satisfies NextAuthConfig;
