'use client';

import {
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Stack,
  Badge,
  RingProgress,
  ThemeIcon,
  Paper,
  Box,
} from '@mantine/core';
import {
  IconUsers,
  IconDoor,
  IconQrcode,
  IconArrowUpRight,
  IconArrowDownRight,
  IconBuilding,
} from '@tabler/icons-react';

/* Mock data — จะเชื่อมกับ API จริงภายหลัง */
const STATS = [
  {
    title: 'ผู้เข้าใช้วันนี้',
    titleEn: "Today's Visitors",
    value: '142',
    diff: 12,
    icon: IconUsers,
    color: 'skyBlue',
  },
  {
    title: 'อยู่ภายในขณะนี้',
    titleEn: 'Currently Inside',
    value: '89',
    diff: -3,
    icon: IconBuilding,
    color: 'emerald',
  },
  {
    title: 'สแกนทั้งหมด',
    titleEn: 'Total Scans',
    value: '1,543',
    diff: 8,
    icon: IconQrcode,
    color: 'skyBlue',
  },
  {
    title: 'ประตู Active',
    titleEn: 'Active Gates',
    value: '8/10',
    diff: 0,
    icon: IconDoor,
    color: 'navy',
  },
];

const RECENT_EVENTS = [
  { time: '10:28 น.', member: 'สมชาย รักเรียน', gate: 'ประตูหน้า', dir: 'เข้า', status: 'ALLOWED' },
  { time: '10:25 น.', member: 'John Smith', gate: 'Library Gate', dir: 'ออก', status: 'ALLOWED' },
  { time: '10:22 น.', member: '王小明', gate: '前门', dir: 'เข้า', status: 'ALLOWED' },
  { time: '10:18 น.', member: 'สมหญิง ใจดี', gate: 'ประตูหลัง', dir: 'เข้า', status: 'DENIED' },
  { time: '10:15 น.', member: 'อำนาจ จิตต์ดี', gate: 'ประตูหน้า', dir: 'ออก', status: 'ALLOWED' },
];

const GATE_STATUS = [
  { name: 'ประตูหน้า (Front Gate)', status: 'ACTIVE', in: 45, out: 32, lastScan: '10:28' },
  { name: 'ประตูหลัง (Back Gate)', status: 'ACTIVE', in: 23, out: 18, lastScan: '10:25' },
  { name: 'ห้องสมุด (Library)', status: 'MAINTENANCE', in: 0, out: 0, lastScan: '09:00' },
  { name: 'อาคาร B (Building B)', status: 'ACTIVE', in: 31, out: 22, lastScan: '10:20' },
];

export default function AdminDashboard() {
  return (
    <Stack gap="lg">
      {/* Page Header */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} c="var(--text-primary)">
            แดชบอร์ด
          </Title>
          <Text size="sm" c="var(--text-secondary)">
            ภาพรวมระบบ QR Gate Access · วันที่ {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </div>
        <Badge color="emerald" variant="light" size="lg" leftSection={
          <Box className="pulse-dot" style={{ background: '#10B981' }} />
        }>
          ระบบทำงานปกติ
        </Badge>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
        {STATS.map((stat) => (
          <Card key={stat.title} className="stat-card" withBorder p="lg">
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="var(--text-muted)" fw={500} tt="uppercase">
                {stat.title}
              </Text>
              <ThemeIcon
                color={stat.color}
                variant="light"
                size="lg"
                radius="md"
              >
                <stat.icon size={20} stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Text size="xl" fw={700} c="var(--text-primary)">
              {stat.value}
            </Text>
            {stat.diff !== 0 && (
              <Group gap={4} mt={4}>
                {stat.diff > 0 ? (
                  <IconArrowUpRight size={14} color="#10B981" />
                ) : (
                  <IconArrowDownRight size={14} color="#EF4444" />
                )}
                <Text size="xs" c={stat.diff > 0 ? 'teal' : 'red'}>
                  {Math.abs(stat.diff)}% เทียบเมื่อวาน
                </Text>
              </Group>
            )}
          </Card>
        ))}
      </SimpleGrid>

      {/* Two columns: Recent Events + Gate Status */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Recent Events */}
        <Card withBorder p="lg">
          <Group justify="space-between" mb="md">
            <Text fw={600} size="md">เหตุการณ์ล่าสุด</Text>
            <Badge color="skyBlue" variant="light" size="sm">Live</Badge>
          </Group>
          <Stack gap="xs">
            {RECENT_EVENTS.map((evt, i) => (
              <Paper
                key={i}
                p="sm"
                withBorder
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Group justify="space-between">
                  <Group gap="sm">
                    <Text size="xs" c="var(--text-muted)" w={60}>
                      {evt.time}
                    </Text>
                    <Text size="sm" fw={500}>{evt.member}</Text>
                  </Group>
                  <Group gap="xs">
                    <Badge
                      size="xs"
                      color={evt.dir === 'เข้า' ? 'teal' : 'blue'}
                      variant="light"
                    >
                      {evt.dir}
                    </Badge>
                    <Badge
                      size="xs"
                      color={evt.status === 'ALLOWED' ? 'teal' : 'red'}
                      variant="filled"
                    >
                      {evt.status}
                    </Badge>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Card>

        {/* Gate Status */}
        <Card withBorder p="lg">
          <Group justify="space-between" mb="md">
            <Text fw={600} size="md">สถานะประตู</Text>
            <Badge color="navy" variant="light" size="sm">4 Gates</Badge>
          </Group>
          <Stack gap="xs">
            {GATE_STATUS.map((gate) => (
              <Paper
                key={gate.name}
                p="sm"
                withBorder
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Group justify="space-between">
                  <Group gap="sm">
                    <Box
                      className="pulse-dot"
                      style={{
                        background: gate.status === 'ACTIVE' ? '#10B981' :
                          gate.status === 'MAINTENANCE' ? '#F59E0B' : '#EF4444',
                      }}
                    />
                    <Text size="sm" fw={500}>{gate.name}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="xs" c="teal">▲ {gate.in}</Text>
                    <Text size="xs" c="blue">▼ {gate.out}</Text>
                    <Text size="xs" c="var(--text-muted)">
                      {gate.lastScan}
                    </Text>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>

          {/* Capacity Ring */}
          <Group justify="center" mt="md">
            <RingProgress
              size={120}
              thickness={12}
              roundCaps
              label={
                <Text ta="center" size="lg" fw={700}>
                  89%
                </Text>
              }
              sections={[
                { value: 89, color: 'teal' },
              ]}
            />
            <Stack gap={2}>
              <Text size="sm" fw={500}>อัตราการใช้งาน</Text>
              <Text size="xs" c="var(--text-muted)">89 / 100 คน</Text>
            </Stack>
          </Group>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
