import type { Session } from 'next-auth';
import type { UserRole } from '@prisma/client';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess as checkAccessByRole, type Action, type Resource } from '@/lib/rbac';

/** Session with `user.id` and `user.role` filled from JWT or DB. */
export async function authWithRole(): Promise<Session | null> {
  const session = await auth();
  if (!session?.user) return session;

  const userId = session.user.id;
  if (!userId) return session;

  if (!session.user.role) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    });
    if (dbUser?.isActive) {
      session.user.role = dbUser.role;
    }
  }

  return session;
}

export async function checkAccess(
  session: Session | null,
  resource: Resource,
  action: Action,
): Promise<boolean> {
  if (!session?.user) return false;

  let role = session.user.role as UserRole | undefined;
  if (!role && session.user.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, isActive: true },
    });
    if (dbUser?.isActive) {
      role = dbUser.role;
      session.user.role = role;
    }
  }

  if (!role) return false;
  return checkAccessByRole({ user: { role } }, resource, action);
}
