'use client';

import { useTranslations } from 'next-intl';
import { Title, Text, Stack, Card, SimpleGrid, Badge, Group, ThemeIcon, Box, Progress, ActionIcon, Tooltip, Divider } from '@mantine/core';
import { IconDoor, IconSettings, IconPower, IconHistory } from '@tabler/icons-react';

const GATES = [
  { id: 'G-01', name: 'Main Entrance (North)', status: 'ONLINE', capacity: 85, location: 'Building A, Floor 1', lastUpdate: 'Just now' },
  { id: 'G-02', name: 'Side Exit (East)', status: 'ONLINE', capacity: 32, location: 'Building A, Floor 1', lastUpdate: '2 mins ago' },
  { id: 'G-03', name: 'Parking Gate', status: 'OFFLINE', capacity: 0, location: 'P1 Level', lastUpdate: '15 mins ago' },
  { id: 'G-04', name: 'VIP Lounge', status: 'ONLINE', capacity: 12, location: 'Building B, Floor 2', lastUpdate: '5 mins ago' },
  { id: 'G-05', name: 'Staff Entrance', status: 'MAINTENANCE', capacity: 0, location: 'Service Area', lastUpdate: '1 hour ago' },
  { id: 'G-06', name: 'Loading Dock', status: 'ONLINE', capacity: 54, location: 'Back Yard', lastUpdate: 'Just now' },
];

export default function GatesPage() {
  const t = useTranslations();

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <div>
          <Title order={2} fw={800}>{t('Common.gates')}</Title>
          <Text c="dimmed" size="sm">Real-time hardware status and gate activity monitoring.</Text>
        </div>
        <Badge size="xl" variant="dot" color="teal">4/6 Hardware Online</Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {GATES.map((gate) => (
          <Card key={gate.id} p="xl" radius="lg" withBorder className="stat-card">
            <Group justify="space-between" mb="md">
              <Badge 
                color={gate.status === 'ONLINE' ? 'teal' : gate.status === 'OFFLINE' ? 'red' : 'orange'} 
                variant="filled"
                size="sm"
              >
                {gate.status}
              </Badge>
              <Group gap="xs">
                <Tooltip label="Settings"><ActionIcon variant="subtle" color="gray"><IconSettings size={16} /></ActionIcon></Tooltip>
                <Tooltip label="Restart Hardware"><ActionIcon variant="subtle" color="red"><IconPower size={16} /></ActionIcon></Tooltip>
              </Group>
            </Group>

            <Stack gap={4} mb="lg">
              <Text fw={800} size="lg" lts="-0.02em">{gate.name}</Text>
              <Text size="xs" c="dimmed">{gate.location} • ID: {gate.id}</Text>
            </Stack>

            <Box mb="md">
              <Group justify="space-between" mb={4}>
                <Text size="xs" fw={700}>Traffic Density</Text>
                <Text size="xs" fw={700}>{gate.capacity}%</Text>
              </Group>
              <Progress 
                value={gate.capacity} 
                color={gate.capacity > 80 ? 'red' : gate.capacity > 50 ? 'orange' : 'teal'} 
                size="sm" 
                radius="xl" 
                animated={gate.status === 'ONLINE'}
                style={{ boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}
              />
            </Box>

            <Divider my="md" variant="dashed" />

            <Group justify="space-between">
              <Group gap={4}>
                <IconHistory size={14} color="var(--text-muted)" />
                <Text size="xs" c="dimmed">Last active: {gate.lastUpdate}</Text>
              </Group>
              <Badge variant="outline" size="xs">v2.4.1</Badge>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
