'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Center, Loader } from '@mantine/core';

/** ย้ายไป `/admin` */
export default function AdminUsersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin');
  }, [router]);

  return (
    <Center h="40vh">
      <Loader size="md" color="navy" />
    </Center>
  );
}
