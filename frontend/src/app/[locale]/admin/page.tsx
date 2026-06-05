'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';
import { Center, Loader } from '@mantine/core';
import { AdminUsersClient } from './_components/AdminUsersClient';

/** Roles ที่ดูรายชื่อผู้ใช้ login ได้ — คนอื่นไปแดชบอร์ด */
const USER_LIST_ROLES = new Set(['SUPER_ADMIN', 'ADMIN']);

/** /admin — รายชื่อผู้ใช้ที่ login web app ได้ */
export default function AdminHomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.role) return;
    if (!USER_LIST_ROLES.has(session.user.role)) {
      router.replace('/admin/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Center h="40vh">
        <Loader size="md" color="navy" />
      </Center>
    );
  }

  if (session?.user?.role && !USER_LIST_ROLES.has(session.user.role)) {
    return (
      <Center h="40vh">
        <Loader size="md" color="navy" />
      </Center>
    );
  }

  return <AdminUsersClient />;
}
