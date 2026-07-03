'use client';

import { useTranslations } from 'next-intl';
import { Title, Text, Stack, Group } from '@mantine/core';
import { IconHistory } from '@tabler/icons-react';
import { GateHistoryPanel } from './_components/GateHistoryPanel';

type Props = {
  initialMemberNo?: string | null;
};

export default function HistoryClient({ initialMemberNo = null }: Props) {
  const t = useTranslations('History');

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <div>
          <Group gap="xs" mb={4}>
            <IconHistory size={28} color="var(--color-navy)" />
            <Title order={2}>{t('title')}</Title>
          </Group>
          <Text size="sm" c="dimmed">
            {t('subtitle')}
          </Text>
        </div>
      </Group>
      <GateHistoryPanel initialMemberNo={initialMemberNo} />
    </Stack>
  );
}
