'use client';

import { useTranslations, useLocale } from 'next-intl';
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
    titleKey: 'Dashboard.totalMembers',
    value: '142',
    diff: 12,
    icon: IconUsers,
    color: 'skyBlue',
  },
  {
    titleKey: 'Dashboard.activeGates', // Note: Using appropriate key
    value: '89',
    diff: -3,
    icon: IconBuilding,
    color: 'emerald',
  },
  {
    titleKey: 'Common.gates',
    value: '1,543',
    diff: 8,
    icon: IconQrcode,
    color: 'skyBlue',
  },
  {
    titleKey: 'Dashboard.gateStatus',
    value: '8/10',
    diff: 0,
    icon: IconDoor,
    color: 'navy',
  },
];

const RECENT_EVENTS = [
  { time: '10:28', member: 'สมชาย รักเรียน', gate: 'ประตูหน้า', dir: 'IN', status: 'ALLOWED' },
  { time: '10:25', member: 'John Smith', gate: 'Library Gate', dir: 'OUT', status: 'ALLOWED' },
  { time: '10:22', member: '王小明', gate: '前门', dir: 'IN', status: 'ALLOWED' },
  { time: '10:18', member: 'สมหญิง ใจดี', gate: 'ประตูหลัง', dir: 'IN', status: 'DENIED' },
  { time: '10:15', member: 'อำนาจ จิตต์ดี', gate: 'ประตูหน้า', dir: 'OUT', status: 'ALLOWED' },
];

const GATE_STATUS = [
  { name: 'ประตูหน้า (Front Gate)', status: 'ACTIVE', in: 45, out: 32, lastScan: '10:28' },
  { name: 'ประตูหลัง (Back Gate)', status: 'ACTIVE', in: 23, out: 18, lastScan: '10:25' },
  { name: 'ห้องสมุด (Library)', status: 'MAINTENANCE', in: 0, out: 0, lastScan: '09:00' },
  { name: 'อาคาร B (Building B)', status: 'ACTIVE', in: 31, out: 22, lastScan: '10:20' },
];

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

/* Mock data สำหรับกราฟ */
const CHART_DATA = [
  { name: '08:00', in: 12, out: 4 },
  { name: '10:00', in: 45, out: 12 },
  { name: '12:00', in: 30, out: 25 },
  { name: '14:00', in: 25, out: 30 },
  { name: '16:00', in: 60, out: 45 },
  { name: '18:00', in: 15, out: 55 },
];

const GATE_TRAFFIC = [
  { name: 'Main Gate', value: 450, color: '#38BDF8' },
  { name: 'Side Gate', value: 210, color: '#10B981' },
  { name: 'Office B', value: 180, color: '#1E3A5F' },
  { name: 'Parking', value: 320, color: '#0EA5E9' },
];

export default function AdminDashboard() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <Stack gap="xl">
      {/* Page Header */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} fw={800} style={{ letterSpacing: '-0.02em' }}>
            {t('Common.dashboard')}
          </Title>
          <Text size="sm" c="var(--text-secondary)" fw={500}>
            {t('Dashboard.welcome')} · {new Date().toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </div>
        <Badge color="emerald" variant="light" size="lg" p="md" leftSection={
          <Box className="pulse-dot" style={{ background: '#10B981' }} />
        }>
          SYSTEM ONLINE
        </Badge>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
        {STATS.map((stat) => (
          <Card key={stat.titleKey} className="stat-card" p="xl">
            <Group justify="space-between" mb="sm">
              <Text size="xs" c="var(--text-muted)" fw={600} tt="uppercase" lts="0.05em">
                {t(stat.titleKey)}
              </Text>
              <ThemeIcon color={stat.color} variant="light" size="lg" radius="md">
                <stat.icon size={20} stroke={1.5} />
              </ThemeIcon>
            </Group>
            <Text size="2rem" fw={800} c="var(--text-primary)" lts="-0.02em">
              {stat.value}
            </Text>
            {stat.diff !== 0 && (
              <Group gap={6} mt="xs">
                <Badge 
                  size="sm" 
                  color={stat.diff > 0 ? 'teal' : 'red'} 
                  variant="light"
                  leftSection={stat.diff > 0 ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
                >
                  {Math.abs(stat.diff)}%
                </Badge>
                <Text size="xs" c="var(--text-muted)" fw={500}>vs yesterday</Text>
              </Group>
            )}
          </Card>
        ))}
      </SimpleGrid>

      {/* Charts Row */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder p="xl" radius="lg">
          <Text fw={700} mb="xl" size="lg">Traffic Overview (Real-time)</Text>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                />
                <ChartTooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-primary)', 
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)'
                  }} 
                />
                <Area type="monotone" dataKey="in" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="out" stroke="#10B981" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card withBorder p="xl" radius="lg">
          <Text fw={700} mb="xl" size="lg">Top Gates Activity</Text>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GATE_TRAFFIC} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="var(--text-primary)" 
                  fontSize={12} 
                  width={80} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <ChartTooltip cursor={{fill: 'rgba(56, 189, 248, 0.05)'}} />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                  style={{ cursor: 'pointer' }}
                  onClick={(data) => {
                    if (data && data.name) {
                      router.push(`/admin/events?gate=${data.name}`);
                    }
                  }}
                >
                  {GATE_TRAFFIC.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Text size="xs" c="dimmed" ta="center" mt="sm">Tip: Click on a bar to view detailed logs for that gate</Text>
        </Card>
      </SimpleGrid>

      {/* Two columns: Recent Events + Gate Status */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Recent Events */}
        <Card withBorder p="lg" radius="lg">
          <Group justify="space-between" mb="md">
            <Text fw={700} size="md">{t('Dashboard.recentActivity')}</Text>
            <Badge color="skyBlue" variant="light" size="sm">Live</Badge>
          </Group>
          <Stack gap="xs">
            {RECENT_EVENTS.map((evt, i) => (
              <Paper key={i} p="sm" withBorder style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Text size="xs" c="var(--text-muted)" fw={600} w={50}>{evt.time}</Text>
                    <Text size="sm" fw={600}>{evt.member}</Text>
                  </Group>
                  <Group gap="xs">
                    <Badge size="xs" color={evt.dir === 'IN' ? 'teal' : 'blue'} variant="light">{evt.dir}</Badge>
                    <Badge size="xs" color={evt.status === 'ALLOWED' ? 'emerald' : 'red'} variant="filled">{evt.status}</Badge>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Card>

        {/* Gate Status List */}
        <Card withBorder p="lg" radius="lg">
          <Group justify="space-between" mb="md">
            <Text fw={700} size="md">{t('Dashboard.gateStatus')}</Text>
            <Badge color="navy" variant="light" size="sm">4 Gates Active</Badge>
          </Group>
          <Stack gap="xs">
            {GATE_STATUS.map((gate) => (
              <Paper key={gate.name} p="sm" withBorder style={{ borderColor: 'var(--border-color)' }}>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Box className="pulse-dot" style={{ background: gate.status === 'ACTIVE' ? '#10B981' : '#F59E0B' }} />
                    <Text size="sm" fw={600}>{gate.name}</Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="xs" fw={700} c="teal">▲ {gate.in}</Text>
                    <Text size="xs" fw={700} c="blue">▼ {gate.out}</Text>
                  </Group>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
