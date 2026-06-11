import '../load-root-env';
import type { NextAuthConfig } from 'next-auth';
import { appPublicUrl, stripBasePath, withBasePath } from './lib/base-path';

export const authConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  /** Path after Next.js basePath strip (see AUTH_API_BASE_PATH for client URLs). */
  basePath: '/api/auth',
  pages: {
    signIn: withBasePath('/login'),
    error: withBasePath('/login'),
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    redirect({ url, baseUrl }) {
      if (url.startsWith('/')) {
        return appPublicUrl(url);
      }
      try {
        const target = new URL(url);
        const base = new URL(baseUrl);
        if (target.origin === base.origin) {
          const prefix = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') || '';
          if (prefix && !target.pathname.startsWith(prefix)) {
            return appPublicUrl(`${target.pathname}${target.search}`);
          }
          return url;
        }
      } catch {
        return appPublicUrl('/admin/dashboard');
      }
      return appPublicUrl('/admin/dashboard');
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = stripBasePath(nextUrl.pathname);

      const isAdminPath =
        pathname.startsWith('/admin') || /^\/(en|zh)\/admin/.test(pathname);

      const isLoginPath =
        pathname === '/login' || /^\/(en|zh)\/login/.test(pathname);

      if (isAdminPath) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoginPath) {
        if (isLoggedIn) {
          return Response.redirect(new URL(withBasePath('/admin/dashboard'), nextUrl));
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
      if (!token.userId && token.sub) {
        token.userId = token.sub;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as typeof session.user.role;
        session.user.id = (token.userId ?? token.sub) as string;
      }
      return session;
    },
  },
  providers: [], // Will be filled in auth.ts
} satisfies NextAuthConfig;
