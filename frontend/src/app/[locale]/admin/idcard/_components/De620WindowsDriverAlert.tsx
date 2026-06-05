'use client';

import { Alert, Anchor, List, Stack, Text } from '@mantine/core';
import { IconUsb } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

function isWindowsOs(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Windows/i.test(navigator.userAgent);
}

type Props = {
  cardApiReachable: boolean;
  hasReader: boolean;
  loading?: boolean;
};

/** Shown when Card API responds but DE-620 is not listed (common on Windows without driver). */
export function De620WindowsDriverAlert({ cardApiReachable, hasReader, loading }: Props) {
  const t = useTranslations('IdCard');

  if (!isWindowsOs() || loading || !cardApiReachable || hasReader) {
    return null;
  }

  return (
    <Alert color="yellow" variant="light" icon={<IconUsb size={18} />} title={t('de620WindowsDriverTitle')}>
      <Stack gap="xs">
        <Text size="sm">{t('de620WindowsDriverBody')}</Text>
        <List size="sm" spacing={4}>
          <List.Item>
            <Text size="sm" component="span">
              {t('de620WindowsDriverOptionDuali')}
            </Text>
          </List.Item>
          <List.Item>
            <Text size="sm" component="span">
              {t('de620WindowsDriverOptionZadig')}{' '}
              <Anchor href="https://zadig.akeo.ie/" target="_blank" rel="noopener noreferrer" size="sm">
                zadig.akeo.ie
              </Anchor>
            </Text>
          </List.Item>
        </List>
        <Text size="xs" c="dimmed">
          {t('de620WindowsDriverAfter')}
        </Text>
      </Stack>
    </Alert>
  );
}
