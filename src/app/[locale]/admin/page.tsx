'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Title,
  Text,
  SimpleGrid,
  Card,
  Group,
  Stack,
  Badge,
  ThemeIcon,
  Paper,
  Box,
  LoadingOverlay,
  Center,
} from '@mantine/core';
import {
  IconUsers,
  IconDoor,
  IconQrcode,
  IconBuilding,
  IconLayoutDashboard,
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
    titleKey: 'Dashboard.activeGates',
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

// ข้อมูลตั้งต้นก่อนโหลดจริง
const INITIAL_CHART_DATA = [
  { name: '08:00', in: 0, out: 0 },
  { name: '10:00', in: 0, out: 0 },
  { name: '12:00', in: 0, out: 0 },
  { name: '14:00', in: 0, out: 0 },
  { name: '16:00', in: 0, out: 0 },
  { name: '18:00', in: 0, out: 0 },
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

// ข้อมูลตั้งต้นสำหรับสถิติประตู
const INITIAL_GATE_TRAFFIC = [
  { name: 'Main Gate', value: 0, color: '#38BDF8' },
];

interface GateTrafficItem {
  name: string;
  value: number;
  color: string;
}

export default function AdminDashboard() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [stats, setStats] = useState<{
    members: { total: number; active: number };
    gates: { total: number; active: number };
    todayEvents: number;
  } | null>(null);
  const [recentEvents, setRecentEvents] = useState<Array<{
    id: string;
    scannedAt: string;
    direction: string;
    decision: string;
    member?: { firstNameTh: string; lastNameTh: string };
  }>>([]);
  const [chartData, setChartData] = useState<Array<{ name: string; in: number; out: number }>>(INITIAL_CHART_DATA);
  const [gateTraffic, setGateTraffic] = useState<Array<GateTrafficItem>>(INITIAL_GATE_TRAFFIC);
  const [gateStatus, setGateStatus] = useState<Array<{ name: string; status: string; in: number; out: number; lastScan: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, eventsRes, detailsRes] = await Promise.all([
          fetch('/api/admin/dashboard/stats'),
          fetch('/api/admin/events?limit=5'),
          fetch('/api/admin/dashboard/details')
        ]);
        
        const statsData = await statsRes.json();
        const eventsData = await eventsRes.json();
        const detailsData = await detailsRes.json();
        
        setStats(statsData);
        if (Array.isArray(eventsData)) {
          setRecentEvents(eventsData);
        }
        if (detailsData.chartData) setChartData(detailsData.chartData);
        if (detailsData.gateTraffic) setGateTraffic(detailsData.gateTraffic);
        if (detailsData.gateStatus) setGateStatus(detailsData.gateStatus);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const statsCards = stats ? [
    {
      titleKey: 'Dashboard.totalMembers',
      value: stats.members.total.toLocaleString(),
      diff: 0,
      icon: IconUsers,
      color: 'skyBlue',
    },
    {
      titleKey: 'Dashboard.gateStatus',
      value: `${stats.gates.active}/${stats.gates.total}`,
      diff: 0,
      icon: IconDoor,
      color: 'navy',
    },
    {
      titleKey: 'Common.gates',
      value: stats.gates.total.toLocaleString(),
      diff: 0,
      icon: IconBuilding,
      color: 'emerald',
    },
    {
      titleKey: 'Dashboard.recentActivity',
      value: stats.todayEvents.toLocaleString(),
      diff: 0,
      icon: IconQrcode,
      color: 'skyBlue',
    },
  ] : STATS;

  return (
    <Stack gap="xl">
      <LoadingOverlay visible={loading} />
      {/* Page Header */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} fw={800} style={{ letterSpacing: '-0.02em' }}>
            <Group gap="xs"><IconLayoutDashboard size={28} color="var(--mantine-color-blue-filled)" />{t('Common.dashboard')}</Group>
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
        {statsCards.map((stat) => (
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
          </Card>
        ))}
      </SimpleGrid>

      {/* Charts Row */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder p="xl" radius="lg">
          <Text fw={700} mb="xl" size="lg">{t('Dashboard.trafficOverview')}</Text>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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
          <Text fw={700} mb="xl" size="lg">{t('Dashboard.topGates')}</Text>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              {gateTraffic.length > 0 && gateTraffic[0].value > 0 ? (
                <BarChart data={gateTraffic} layout="vertical">
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
                    onClick={(data: any) => {
                      if (data && data.name) {
                        router.push(`/admin/events?gate=${data.name}`);
                      }
                    }}
                  >
                    {gateTraffic.map((entry: GateTrafficItem, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <Center h="100%">
                  <Stack align="center" gap={4}>
                    <IconDoor size={40} opacity={0.2} />
                    <Text c="dimmed" size="sm">{t('Common.noData')}</Text>
                  </Stack>
                </Center>
              )}
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
            {recentEvents.map((evt, i: number) => (
              <Paper key={evt.id || i} p="sm" withBorder style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
                <Group justify="space-between">
                  <Group gap="sm">
                    <Text size="xs" c="var(--text-muted)" fw={600} w={50}>
                      {new Date(evt.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text size="sm" fw={600}>
                      {evt.member?.firstNameTh} {evt.member?.lastNameTh}
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
        </Card>

        {/* Gate Status List */}
        <Card withBorder p="lg" radius="lg">
          <Group justify="space-between" mb="md">
            <Text fw={700} size="md">{t('Dashboard.gateStatus')}</Text>
            <Badge color="navy" variant="light" size="sm">4 Gates Active</Badge>
          </Group>
          <Stack gap="xs">
            {gateStatus.map((gate) => (
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
            {gateStatus.length === 0 && <Text c="dimmed" ta="center" py="xl">{t('Common.noData')}</Text>}
          </Stack>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
