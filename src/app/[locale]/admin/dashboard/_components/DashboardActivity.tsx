import { SimpleGrid, Card, Group, Text, Badge, Stack, Paper, Box, Skeleton } from '@mantine/core';

import { DashboardEvent, GateStatusInfo } from '../hooks/useDashboard';

interface DashboardActivityProps {
  recentEvents: DashboardEvent[];
  gateStatus: GateStatusInfo[];
  loading?: boolean;
  t: (key: string) => string;
}

export function DashboardActivity({ recentEvents, gateStatus, loading, t }: DashboardActivityProps) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      {/* Recent Events */}
      <Card withBorder p="lg" radius="lg">
        <Group justify="space-between" mb="md">
          <Text fw={700} size="md">{t('Dashboard.recentActivity')}</Text>
          <Badge color="skyBlue" variant="light" size="sm">Live</Badge>
        </Group>
        <Skeleton visible={loading} radius="md" mih={recentEvents.length > 0 ? 0 : 200}>
          <Stack gap="xs">
            {recentEvents.map((evt, i) => (
              <Paper key={evt.id || i} p="sm" withBorder>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Text size="xs" c="dimmed" fw={600} w={50}>
                      {new Date(evt.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text size="sm" fw={600}>
                      {evt.member ? `${evt.member.firstNameTh} ${evt.member.lastNameTh}` : 'Guest/Unknown'}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Badge size="xs" color={evt.direction === 'IN' ? 'teal' : 'blue'} variant="light">{evt.direction}</Badge>
                    <Badge size="xs" color={evt.decision === 'ALLOWED' ? 'emerald' : 'red'} variant="filled">{evt.decision}</Badge>
                  </Group>
                </Group>
              </Paper>
            ))}
            {recentEvents.length === 0 && <Text c="dimmed" ta="center" py="xl">{t('Common.noData')}</Text>}
          </Stack>
        </Skeleton>
      </Card>

      {/* Gate Status */}
      <Card withBorder p="lg" radius="lg">
        <Group justify="space-between" mb="md">
          <Text fw={700} size="md">{t('Dashboard.gateStatus')}</Text>
          <Badge color="navy" variant="light" size="sm">Status</Badge>
        </Group>
        <Skeleton visible={loading} radius="md" mih={gateStatus.length > 0 ? 0 : 200}>
          <Stack gap="xs">
            {gateStatus.map((gate) => (
              <Paper key={gate.name} p="sm" withBorder>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Box style={{ 
                      width: 8, height: 8, borderRadius: '50%',
                      background: gate.status === 'ACTIVE' ? '#10B981' : '#F59E0B' 
                    }} />
                    <Text size="sm" fw={600}>{gate.name}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="xs" fw={700} c="teal">▲ {gate.in}</Text>
                    <Text size="xs" fw={700} c="blue">▼ {gate.out}</Text>
                  </Group>
                </Group>
              </Paper>
            ))}
            {gateStatus.length === 0 && <Text c="dimmed" ta="center" py="xl">{t('Common.noData')}</Text>}
          </Stack>
        </Skeleton>
      </Card>
    </SimpleGrid>
  );
}
