import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname.startsWith('/login');

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.userId = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  providers: [], // Will be filled in auth.ts
} satisfies NextAuthConfig;
