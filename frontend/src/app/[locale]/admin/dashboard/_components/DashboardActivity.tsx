'use client';

import { Card, Group, Text, Badge, Stack, Paper, Skeleton } from '@mantine/core';
import { IconLogin, IconLogout, IconUser, IconDoor } from '@tabler/icons-react';

import { formatPennuengBangkok } from '@/lib/pennueng-datetime';
import { DashboardEvent } from '../hooks/useDashboard';

interface DashboardActivityProps {
  recentEvents: DashboardEvent[];
  loading?: boolean;
  t: (key: string) => string;
}

export function DashboardActivity({ recentEvents, loading, t }: DashboardActivityProps) {
  return (
    <Card withBorder p="xl" radius="lg">
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={700} size="lg">
            {t('Dashboard.recentActivity')}
          </Text>
        </div>
        <Badge color="skyBlue" variant="light" size="sm">
          Live
        </Badge>
      </Group>
      <Skeleton visible={loading} radius="md" mih={recentEvents.length > 0 ? 0 : 160}>
        <Stack gap="sm">
          {recentEvents.map((evt, i) => {
            const isIn = evt.direction === 'IN';
            const allowed = evt.decision === 'ALLOWED';
            const time = formatPennuengBangkok(evt.scannedAt);
            const name = evt.member
              ? `${evt.member.firstNameTh} ${evt.member.lastNameTh}`.trim()
              : t('Dashboard.unknownMember');
            const memberType = evt.memberType?.trim() || '—';

            return (
              <Paper key={evt.id || i} p="md" withBorder radius="md">
                <Group justify="space-between" wrap="nowrap" align="flex-start" gap="md">
                  <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
                    <Badge
                      size="lg"
                      variant="light"
                      color={isIn ? 'teal' : 'blue'}
                      leftSection={isIn ? <IconLogin size={14} /> : <IconLogout size={14} />}
                    >
                      {isIn ? t('Dashboard.pennuengIn') : t('Dashboard.pennuengOut')}
                    </Badge>
                    <div style={{ minWidth: 0 }}>
                      <Group gap={6} wrap="nowrap">
                        <IconUser size={14} style={{ flexShrink: 0, opacity: 0.5 }} />
                        <Text size="sm" fw={600} lineClamp={1}>
                          {name}
                        </Text>
                      </Group>
                      <Group gap="xs" mt={6} wrap="wrap">
                        <Badge size="sm" variant="outline" color="gray">
                          {t('Dashboard.memberTypeLabel')}: {memberType}
                        </Badge>
                        {evt.gateName ? (
                          <Badge
                            size="sm"
                            variant="light"
                            color="indigo"
                            leftSection={<IconDoor size={12} />}
                          >
                            {evt.gateName}
                          </Badge>
                        ) : null}
                        <Text size="xs" c="dimmed">
                          {time} ({t('Dashboard.bangkokTime')})
                        </Text>
                      </Group>
                    </div>
                  </Group>
                  <Badge
                    size="sm"
                    color={allowed ? 'emerald' : 'red'}
                    variant={allowed ? 'light' : 'filled'}
                    style={{ flexShrink: 0 }}
                  >
                    {allowed ? t('Dashboard.scanAllowed') : t('Dashboard.scanDenied')}
                  </Badge>
                </Group>
              </Paper>
            );
          })}
          {recentEvents.length === 0 && (
            <Text c="dimmed" ta="center" py="xl">
              {t('Common.noData')}
            </Text>
          )}
        </Stack>
      </Skeleton>
    </Card>
  );
}
