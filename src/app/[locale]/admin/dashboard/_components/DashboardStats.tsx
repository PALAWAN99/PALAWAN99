import { SimpleGrid, Card, Group, Text, ThemeIcon } from '@mantine/core';
import { IconUsers, IconDoor, IconBuilding, IconQrcode } from '@tabler/icons-react';

interface DashboardStatsProps {
  stats: any;
  t: (key: string) => string;
}

export function DashboardStats({ stats, t }: DashboardStatsProps) {
  const statsCards = [
    {
      titleKey: 'Dashboard.totalMembers',
      value: stats?.members.total.toLocaleString() ?? '0',
      icon: IconUsers,
      color: 'skyBlue',
    },
    {
      titleKey: 'Dashboard.gateStatus',
      value: stats ? `${stats.gates.active}/${stats.gates.total}` : '0/0',
      icon: IconDoor,
      color: 'navy',
    },
    {
      titleKey: 'Common.gates',
      value: stats?.gates.total.toLocaleString() ?? '0',
      icon: IconBuilding,
      color: 'emerald',
    },
    {
      titleKey: 'Dashboard.recentActivity',
      value: stats?.todayEvents.toLocaleString() ?? '0',
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
          <Text size="2rem" fw={800}>
            {stat.value}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  );
}
