'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Center, Loader } from '@mantine/core';

/** ย้ายไป `/admin/infrastructure?tab=branches` */
export default function BranchesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/infrastructure?tab=branches');
  }, [router]);

  return (
    <Center h="40vh">
      <Loader size="md" />
    </Center>
  );
}
