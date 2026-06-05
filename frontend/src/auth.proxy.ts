import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/** Edge-safe auth for proxy only (no Prisma/bcrypt). */
export const { auth } = NextAuth(authConfig);
