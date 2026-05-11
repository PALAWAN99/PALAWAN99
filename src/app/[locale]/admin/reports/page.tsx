'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Group,
  Grid,
  Card,
  Paper,
  Select,
  Button,
  Loader,
  Center,
  ThemeIcon,
  Badge,
} from '@mantine/core';
import {
  IconFileExport,
  IconChartBar,
  IconUsers,
  IconDoorEnter,
  IconAlertCircle,
  IconCalendar,
  IconFileText,
  IconFileTypePdf,
} from '@tabler/icons-react';
import { Menu } from '@mantine/core';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#38BDF8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ReportsPage() {
  const t = useTranslations('Report');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [days, setDays] = useState('7');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/reports/stats?days=${days}`);
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [days]);

  if (loading && !data) {
    return (
      <Center py={100}>
        <Stack align="center">
          <Loader size="lg" color="navy" />
          <Text c="dimmed">{t('generate')}...</Text>
        </Stack>
      </Center>
    );
  }

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (!data) return;
    const { exportToExcel, exportToPDF } = await import('@/lib/export-utils');
    
    // เตรียมข้อมูลรายวัน
    const dailyData = data.dailyStats.map((s: any) => ({
      'วันที่': s.date,
      'จำนวนการเข้า-ออก': s.count
    }));

    // เตรียมข้อมูลรายประตู
    const gateData = data.gateStats.map((s: any) => ({
      'ประตู': s.name,
      'จำนวนครั้ง': s.value
    }));

    if (format === 'excel') {
      exportToExcel(dailyData, `Daily_Traffic_Report_Last_${days}_Days`);
    } else {
      const headers = ['วันที่', 'จำนวนการเข้า-ออก'];
      const body = dailyData.map((d: any) => [d['วันที่'], d['จำนวนการเข้า-ออก']]);
      exportToPDF(headers, body, `Traffic_Report`, `รายงานสรุปการเข้า-ออกรายวัน (ย้อนหลัง ${days} วัน)`);
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs" mb={4}>
            <IconChartBar size={28} color="var(--color-navy)" />
            <Title order={2} c="var(--text-primary)">{t('title')}</Title>
          </Group>
          <Text size="sm" c="var(--text-secondary)">{t('subtitle')}</Text>
        </div>
        <Group>
          <Select
            label={t('dateRange')}
            value={days}
            onChange={(v) => setDays(v || '7')}
            data={[
              { value: '7', label: `7 ${t('daily')}` },
              { value: '30', label: `30 ${t('daily')}` },
              { value: '90', label: `90 ${t('daily')}` },
            ]}
            leftSection={<IconCalendar size={16} />}
            size="sm"
            w={150}
          />
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <Button 
                leftSection={<IconFileExport size={18} />} 
                variant="filled" 
                color="navy"
                size="sm"
                style={{ alignSelf: 'flex-end' }}
              >
                {t('export')}
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>เลือกรูปแบบไฟล์</Menu.Label>
              <Menu.Item 
                leftSection={<IconFileText size={16} />} 
                onClick={() => handleExport('excel')}
              >
                Excel (.xlsx)
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconFileTypePdf size={16} />} 
                onClick={() => handleExport('pdf')}
              >
                PDF Report (.pdf)
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {/* Summary Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title={t('totalAccess')} 
            value={data?.summary?.totalAccess || 0} 
            icon={<IconDoorEnter size={24} />} 
            color="blue"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title={t('totalMembers')} 
            value={data?.summary?.totalMembers || 0} 
            icon={<IconUsers size={24} />} 
            color="teal"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title={t('activeGates')} 
            value={data?.summary?.activeGates || 0} 
            icon={<IconChartBar size={24} />} 
            color="orange"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <StatCard 
            title={t('deniedAccess')} 
            value={data?.summary?.deniedAccess || 0} 
            icon={<IconAlertCircle size={24} />} 
            color="red"
          />
        </Grid.Col>
      </Grid>

      <Grid>
        {/* Main Chart */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper withBorder p="xl" radius="md" h={400}>
            <Text fw={700} mb="xl" size="lg">{t('dailyStats')}</Text>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={data?.dailyStats || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }}
                />
                <Bar dataKey="count" fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>

        {/* Pie Chart */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper withBorder p="xl" radius="md" h={400}>
            <Text fw={700} mb="md" size="lg">{t('statsByGate')}</Text>
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={data?.gateStats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(data?.gateStats || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card withBorder radius="md" p="xl">
      <Group justify="space-between">
        <ThemeIcon color={color} variant="light" size={48} radius="md">
          {icon}
        </ThemeIcon>
      </Group>
      <Stack gap={0} mt="lg">
        <Text size="sm" c="dimmed" fw={500}>{title}</Text>
        <Text size="xl" fw={700} style={{ fontSize: '2rem' }}>{value.toLocaleString()}</Text>
      </Stack>
    </Card>
  );
}
