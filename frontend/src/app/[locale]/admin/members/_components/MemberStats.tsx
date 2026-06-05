import { SimpleGrid, Card, Group, ThemeIcon, Text } from '@mantine/core';
import { IconUsers, IconUserCheck, IconUserX } from '@tabler/icons-react';

interface MemberStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
  filterStatus: string | null;
  onFilterStatus: (status: string | null) => void;
}

export function MemberStats({ stats, filterStatus, onFilterStatus }: MemberStatsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
      <Card 
        withBorder 
        p="md" 
        radius="md" 
        onClick={() => onFilterStatus(null)}
        style={{ 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderBottom: !filterStatus ? '3px solid var(--mantine-color-blue-filled)' : undefined
        }}
      >
        <Group>
          <ThemeIcon size={44} radius="md" variant="light" color="blue">
            <IconUsers size={24} />
          </ThemeIcon>
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>สมาชิกทั้งหมด</Text>
            <Text size="xl" fw={700}>{stats.total.toLocaleString()}</Text>
          </div>
        </Group>
      </Card>
      
      <Card 
        withBorder 
        p="md" 
        radius="md" 
        onClick={() => onFilterStatus('ACTIVE')}
        style={{ 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderBottom: filterStatus === 'ACTIVE' ? '3px solid var(--mantine-color-green-filled)' : undefined
        }}
      >
        <Group>
          <ThemeIcon size={44} radius="md" variant="light" color="green">
            <IconUserCheck size={24} />
          </ThemeIcon>
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>กำลังใช้งาน</Text>
            <Text size="xl" fw={700}>{stats.active.toLocaleString()}</Text>
          </div>
        </Group>
      </Card>
      
      <Card 
        withBorder 
        p="md" 
        radius="md" 
        onClick={() => onFilterStatus('INACTIVE')}
        style={{ 
          cursor: 'pointer', 
          transition: 'all 0.2s ease',
          borderBottom: filterStatus === 'INACTIVE' ? '3px solid var(--mantine-color-red-filled)' : undefined
        }}
      >
        <Group>
          <ThemeIcon size={44} radius="md" variant="light" color="red">
            <IconUserX size={24} />
          </ThemeIcon>
          <div>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600}>ไม่ใช้งาน</Text>
            <Text size="xl" fw={700}>{stats.inactive.toLocaleString()}</Text>
          </div>
        </Group>
      </Card>
    </SimpleGrid>
  );
}
