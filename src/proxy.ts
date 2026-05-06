import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth: proxy } = NextAuth(authConfig);

export const config = {
  // Match all paths except static files and api routes that don't need auth
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
