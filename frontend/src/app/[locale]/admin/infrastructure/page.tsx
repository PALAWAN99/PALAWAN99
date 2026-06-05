'use client';

import { Suspense, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Center, Loader, Stack, Tabs } from '@mantine/core';
import { IconBuilding, IconDoor, IconDevices } from '@tabler/icons-react';

import { BranchesPanel } from './BranchesPanel';
import { GatesPanel } from './GatesPanel';
import { DevicesPanel } from './DevicesPanel';

const TAB_VALUES = ['branches', 'gates', 'devices'] as const;
type TabValue = (typeof TAB_VALUES)[number];

function normalizeTab(raw: string | null): TabValue {
  if (raw && TAB_VALUES.includes(raw as TabValue)) return raw as TabValue;
  return 'branches';
}

function InfrastructurePageInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tab = useMemo(() => normalizeTab(searchParams.get('tab')), [searchParams]);

  useEffect(() => {
    const raw = searchParams.get('tab');
    if (raw && TAB_VALUES.includes(raw as TabValue)) return;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set('tab', 'branches');
    router.replace(`${pathname}?${qs.toString()}`);
  }, [pathname, router, searchParams]);

  const handleTabChange = useCallback(
    (value: string | null) => {
      if (!value || !TAB_VALUES.includes(value as TabValue)) return;
      const qs = new URLSearchParams(searchParams.toString());
      qs.set('tab', value);
      router.replace(`${pathname}?${qs.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <Stack gap="lg">
      <Tabs value={tab} onChange={handleTabChange} variant="pills" radius="md">
        <Tabs.List mb="md">
          <Tabs.Tab value="branches" leftSection={<IconBuilding size={18} />}>
            {t('Common.branches')}
          </Tabs.Tab>
          <Tabs.Tab value="gates" leftSection={<IconDoor size={18} />}>
            {t('Common.gates')}
          </Tabs.Tab>
          <Tabs.Tab value="devices" leftSection={<IconDevices size={18} />}>
            {t('Common.devices')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="branches" pt="xs">
          <BranchesPanel />
        </Tabs.Panel>
        <Tabs.Panel value="gates" pt="xs">
          <GatesPanel />
        </Tabs.Panel>
        <Tabs.Panel value="devices" pt="xs">
          <DevicesPanel />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}

export default function InfrastructurePage() {
  return (
    <Suspense
      fallback={
        <Center h="40vh">
          <Loader size="md" />
        </Center>
      }
    >
      <InfrastructurePageInner />
    </Suspense>
  );
}
