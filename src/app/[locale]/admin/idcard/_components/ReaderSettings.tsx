'use client';

import { Card, Stack, Group, Text, Divider, Grid, Paper, Badge } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function ReaderSettings() {
  const t = useTranslations('IdCard');

  return (
    <Card withBorder radius="md" p="xl">
      <Stack gap="md">
        <Group>
          <IconSettings size={20} color="var(--color-sky)" />
          <Text fw={700}>{t('settingsTitle')}</Text>
        </Group>
        <Divider />
        
        <Text size="sm">
          {t('settingsDesc')}
        </Text>

        <Grid gap="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="md">
              <Stack gap="xs">
                <Text fw={600} size="sm">{t('supportedVids')}</Text>
                <Group gap="xs">
                  <Badge variant="outline">0x072F (ACS)</Badge>
                  <Badge variant="outline">0x04E6 (SCM)</Badge>
                  <Badge variant="outline">0x076B (HID)</Badge>
                  <Badge variant="outline">0x08E6 (Gemalto)</Badge>
                </Group>
                <Text size="xs" c="dimmed" mt="xs">
                  Source: src/lib/idcard/reader.ts
                </Text>
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="md">
              <Stack gap="xs">
                <Text fw={600} size="sm">{t('systemStatus')}</Text>
                <Group justify="space-between">
                  <Text size="xs">Web USB Support</Text>
                  <Badge color="green">Supported</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="xs">HTTPS / Localhost</Text>
                  <Badge color="green">Secure</Badge>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Card>
  );
}
