import { SimpleGrid, Card, Group, Text, ThemeIcon, Skeleton } from '@mantine/core';
import { IconUsers, IconDoor, IconAlertCircle, IconQrcode } from '@tabler/icons-react';

interface DashboardStatsProps {
  stats: any;
  loading?: boolean;
  t: (key: string) => string;
}

export function DashboardStats({ stats, loading, t }: DashboardStatsProps) {
  const statsCards = [
    {
      titleKey: 'Dashboard.totalMembers',
      value: stats?.members?.total?.toLocaleString() ?? '0',
      icon: IconUsers,
      color: 'skyBlue',
    },
    {
      titleKey: 'Dashboard.gateStatus',
      value: stats?.gates ? `${stats.gates.active}/${stats.gates.total}` : '0/0',
      icon: IconDoor,
      color: 'navy',
    },
    {
      // i18n: add 'Dashboard.offlineGates' → 'ประตูออฟไลน์' to all translation files
      titleKey: 'Dashboard.offlineGates',
      value: stats?.gates ? String(stats.gates.total - stats.gates.active) : '0',
      icon: IconAlertCircle,
      color: 'red',
    },
    {
      titleKey: 'Dashboard.recentActivity',
      value: stats?.todayEvents?.toLocaleString() ?? '0',
      icon: IconQrcode,
      color: 'skyBlue',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
      {statsCards.map((stat) => (
        <Card key={stat.titleKey} withBorder p="xl" radius="md">
          <Group justify="space-between" mb="sm">
            <Text size="xs" c="dimmed" fw={600} tt="uppercase">
              {t(stat.titleKey)}
            </Text>
            <ThemeIcon color={stat.color} variant="light" size="lg" radius="md">
              <stat.icon size={20} stroke={1.5} />
            </ThemeIcon>
          </Group>
          <Skeleton visible={loading} radius="md">
            <Text size="2rem" fw={800}>
              {stat.value}
            </Text>
          </Skeleton>
        </Card>
      ))}
    </SimpleGrid>
  );
}
