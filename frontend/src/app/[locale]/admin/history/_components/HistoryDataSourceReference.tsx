'use client';

import { useEffect, useMemo, useState } from 'react';
import { Alert, Anchor, Code, Collapse, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconDatabase, IconInfoCircle, IconLink } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { apiPath } from '@/lib/base-path';

function fullApiUrl(path: string, origin: string): string {
  return origin ? `${origin}${apiPath(path)}` : apiPath(path);
}

export function HistoryDataSourceReference() {
  const t = useTranslations('History');
  const [opened, setOpened] = useState(false);
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const urls = useMemo(
    () => ({
      list: fullApiUrl('/api/admin/history', origin),
      item: fullApiUrl('/api/admin/history/{id}', origin),
      gates: fullApiUrl('/api/admin/reports/gates', origin),
      page: origin ? `${origin}${apiPath('/admin/history')}` : apiPath('/admin/history'),
    }),
    [origin],
  );

  return (
    <Alert variant="light" color="teal" radius="md" icon={<IconInfoCircle size={18} />}>
      <UnstyledButton onClick={() => setOpened((value) => !value)} w="100%">
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Text size="sm" fw={600}>
            {t('dataSourceTitle')}
          </Text>
          <IconChevronDown
            size={16}
            style={{
              transform: opened ? 'rotate(180deg)' : undefined,
              transition: 'transform 150ms ease',
            }}
          />
        </Group>
      </UnstyledButton>

      <Collapse expanded={opened}>
        <Stack gap="sm" mt="sm">
          <Group gap="xs" align="flex-start" wrap="nowrap">
            <IconDatabase size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <div>
              <Text size="xs" fw={600}>
                {t('dataSourceDatabase')}
              </Text>
              <Text size="xs" c="dimmed">
                {t('dataSourceDatabaseValue')}
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                {t('dataSourceMemberKey')}: {t('dataSourceMemberKeyValue')}
              </Text>
            </div>
          </Group>

          <Group gap="xs" align="flex-start" wrap="nowrap">
            <IconLink size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
              <Text size="xs" fw={600}>
                {t('dataSourceApiList')}
              </Text>
              <Text size="xs" c="dimmed">
                {t('dataSourcePageUrl')}
              </Text>
              <Anchor href={urls.page} size="xs" ff="monospace" target="_blank" rel="noopener noreferrer">
                {urls.page}
              </Anchor>
              <Text size="xs" c="dimmed" mt={4}>
                GET — {t('dataSourceApiGet')}
              </Text>
              <Code block fz="xs" style={{ wordBreak: 'break-all' }}>
                {urls.list}?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&page=1
              </Code>
              <Text size="xs" c="dimmed">
                POST — {t('dataSourceApiPost')}
              </Text>
              <Code block fz="xs" style={{ wordBreak: 'break-all' }}>
                {urls.list}
              </Code>
              <Text size="xs" c="dimmed">
                PATCH / DELETE — {t('dataSourceApiMutate')}
              </Text>
              <Code block fz="xs" style={{ wordBreak: 'break-all' }}>
                {urls.item}
              </Code>
              <Text size="xs" c="dimmed">
                GET — {t('dataSourceApiGates')}
              </Text>
              <Code block fz="xs" style={{ wordBreak: 'break-all' }}>
                {urls.gates}
              </Code>
            </Stack>
          </Group>
        </Stack>
      </Collapse>
    </Alert>
  );
}
