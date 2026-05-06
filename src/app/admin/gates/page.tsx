import { Title, Text, Stack, Card, SimpleGrid, Badge, Group } from '@mantine/core';
import { IconDoor } from '@tabler/icons-react';

export default function GatesPage() {
  const MOCK_GATES = [
    { name: 'ประตูหน้า (Front Gate)', status: 'ACTIVE', branch: 'สำนักหอสมุด' },
    { name: 'ประตูหลัง (Back Gate)', status: 'ACTIVE', branch: 'สำนักหอสมุด' },
    { name: 'ห้องสมุดโซน A', status: 'MAINTENANCE', branch: 'สำนักหอสมุด' },
  ];

  return (
    <Stack gap="lg">
      <div>
        <Title order={2}>จัดการประตู / จุดเข้า-ออก</Title>
        <Text size="sm" c="dimmed">
          ตรวจสอบสถานะและตั้งค่าอุปกรณ์ควบคุมประตูทั้งหมด
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        {MOCK_GATES.map((gate) => (
          <Card key={gate.name} withBorder shadow="sm">
            <Group justify="space-between" mb="xs">
              <IconDoor size={24} color="var(--color-sky)" />
              <Badge color={gate.status === 'ACTIVE' ? 'emerald' : 'orange'}>
                {gate.status}
              </Badge>
            </Group>
            <Text fw={600}>{gate.name}</Text>
            <Text size="xs" c="dimmed">{gate.branch}</Text>
          </Card>
        ))}
      </SimpleGrid>
      
      <Card withBorder p="xl">
        <Text ta="center" c="dimmed">หน้าจัดการประตูฉบับเต็มกำลังอยู่ในระหว่างการพัฒนา</Text>
      </Card>
    </Stack>
  );
}
