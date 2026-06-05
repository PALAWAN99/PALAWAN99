'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Center, Loader } from '@mantine/core';

/** ย้ายไป `/admin/infrastructure?tab=devices` */
export default function DevicesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/infrastructure?tab=devices');
  }, [router]);

  return (
    <Center h="40vh">
      <Loader size="md" />
    </Center>
  );
}
