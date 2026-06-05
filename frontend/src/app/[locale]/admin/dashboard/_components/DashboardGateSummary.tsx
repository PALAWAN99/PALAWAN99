'use client';

import { Card, Group, Text, Badge, Stack, Skeleton, Box, SimpleGrid, ThemeIcon } from '@mantine/core';
import { IconDoor, IconArrowDown, IconArrowUp } from '@tabler/icons-react';

import type { GateStatusInfo } from '../hooks/useDashboard';

interface DashboardGateSummaryProps {
  gates: GateStatusInfo[];
  loading?: boolean;
  t: (key: string) => string;
}

function GateRow({ gate, maxTotal, t }: { gate: GateStatusInfo; maxTotal: number; t: (key: string) => string }) {
  const total = gate.in + gate.out;
  const inPct = maxTotal > 0 ? (gate.in / maxTotal) * 100 : 0;
  const outPct = maxTotal > 0 ? (gate.out / maxTotal) * 100 : 0;
  const isActive = gate.status === 'ACTIVE';

  return (
    <Box
      p="md"
      style={{
        borderRadius: 12,
        border: '1px solid var(--mantine-color-gray-2)',
        background: 'var(--mantine-color-gray-0)',
      }}
    >
      <Group justify="space-between" align="flex-start" mb="sm" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
          <ThemeIcon size={36} radius="md" variant="light" color={isActive ? 'teal' : 'gray'}>
            <IconDoor size={18} />
          </ThemeIcon>
          <div style={{ minWidth: 0 }}>
            <Text size="sm" fw={700} lineClamp={2}>
              {gate.name}
            </Text>
            {gate.code && gate.code !== gate.name ? (
              <Text size="xs" c="dimmed" lineClamp={1}>
                {gate.code}
              </Text>
            ) : null}
            <Text size="xs" c="dimmed">
              {t('Dashboard.gateLastScan')}: {gate.lastScan}
            </Text>
          </div>
        </Group>
        <Badge color={isActive ? 'teal' : 'gray'} variant="light" size="sm">
          {isActive ? t('Dashboard.online') : t('Dashboard.offline')}
        </Badge>
      </Group>

      <SimpleGrid cols={3} spacing="xs" mb="sm">
        <Box>
          <Group gap={4}>
            <IconArrowDown size={14} color="#10B981" />
            <Text size="xs" c="dimmed">
              {t('Dashboard.pennuengIn')}
            </Text>
          </Group>
          <Text size="lg" fw={800} c="teal">
            {gate.in.toLocaleString()}
          </Text>
        </Box>
        <Box>
          <Group gap={4}>
            <IconArrowUp size={14} color="#0EA5E9" />
            <Text size="xs" c="dimmed">
              {t('Dashboard.pennuengOut')}
            </Text>
          </Group>
          <Text size="lg" fw={800} c="blue">
            {gate.out.toLocaleString()}
          </Text>
        </Box>
        <Box>
          <Text size="xs" c="dimmed">
            {t('Dashboard.gateTotalToday')}
          </Text>
          <Text size="lg" fw={800}>
            {total.toLocaleString()}
          </Text>
        </Box>
      </SimpleGrid>

      <Box>
        <Group justify="space-between" mb={4}>
          <Text size="xs" c="dimmed">
            {t('Dashboard.gateTrafficBarHint')}
          </Text>
          <Text size="xs" fw={600}>
            {total > 0 ? `${Math.round((total / maxTotal) * 100)}%` : '—'}
          </Text>
        </Group>
        <Box
          style={{
            display: 'flex',
            height: 10,
            borderRadius: 6,
            overflow: 'hidden',
            background: 'var(--mantine-color-gray-2)',
          }}
        >
          {gate.in > 0 ? (
            <Box
              style={{
                width: `${inPct}%`,
                minWidth: gate.in > 0 ? 4 : 0,
                background: '#10B981',
              }}
              title={`${t('Dashboard.pennuengIn')}: ${gate.in}`}
            />
          ) : null}
          {gate.out > 0 ? (
            <Box
              style={{
                width: `${outPct}%`,
                minWidth: gate.out > 0 ? 4 : 0,
                background: '#0EA5E9',
              }}
              title={`${t('Dashboard.pennuengOut')}: ${gate.out}`}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export function DashboardGateSummary({ gates, loading, t }: DashboardGateSummaryProps) {
  const sorted = [...gates].sort((a, b) => b.in + b.out - (a.in + a.out));
  const maxTotal = Math.max(...sorted.map((g) => g.in + g.out), 1);

  return (
    <Card withBorder p="xl" radius="lg">
      <Group justify="space-between" mb="lg" align="flex-end">
        <div>
          <Text fw={700} size="lg">
            {t('Dashboard.pennuengGateToday')}
          </Text>
        </div>
        <Group gap="md">
          <Group gap={6}>
            <Box w={12} h={12} style={{ borderRadius: 3, background: '#10B981' }} />
            <Text size="xs" c="dimmed">
              {t('Dashboard.pennuengIn')}
            </Text>
          </Group>
          <Group gap={6}>
            <Box w={12} h={12} style={{ borderRadius: 3, background: '#0EA5E9' }} />
            <Text size="xs" c="dimmed">
              {t('Dashboard.pennuengOut')}
            </Text>
          </Group>
        </Group>
      </Group>

      <Skeleton visible={loading} radius="md">
        {sorted.length > 0 ? (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {sorted.slice(0, 9).map((gate) => (
              <GateRow key={gate.name} gate={gate} maxTotal={maxTotal} t={t} />
            ))}
          </SimpleGrid>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            {t('Common.noData')}
          </Text>
        )}
      </Skeleton>
    </Card>
  );
}
