import '../load-root-env';
import NextAuth from 'next-auth';
import type { UserRole } from '@prisma/client';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifyRecaptchaV3 } from '@/lib/recaptcha';
import { authConfig } from './auth.config';

const { jwt: _jwt, session: _session, ...authCallbacks } = authConfig.callbacks;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authCallbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role;
        token.userId = user.id as string;
      }
      if (!token.userId && token.sub) {
        token.userId = token.sub;
      }

      const userId = token.userId as string | undefined;
      if (userId && (!token.role || trigger === 'update')) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true, isActive: true },
        });
        if (dbUser?.isActive) {
          token.role = dbUser.role;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole;
        session.user.id = (token.userId ?? token.sub) as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        recaptchaToken: { label: 'reCAPTCHA', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const recaptcha = await verifyRecaptchaV3(
          (credentials.recaptchaToken as string) ?? '',
          'login',
        );
        if (!recaptcha.ok) {
          console.warn('[Auth] reCAPTCHA failed:', recaptcha.error);
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.isActive) return null;

        const valid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
});
