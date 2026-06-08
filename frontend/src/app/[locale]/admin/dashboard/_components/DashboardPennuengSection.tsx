'use client';

import {
  SimpleGrid,
  Card,
  Text,
  Group,
  ThemeIcon,
  Skeleton,
  Stack,
  Center,
  Badge,
  Alert,
} from '@mantine/core';
import {
  IconDatabase,
  IconUsers,
  IconDoor,
  IconScan,
  IconAlertCircle,
  IconChartPie,
  IconChartBar,
} from '@tabler/icons-react';
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

import { PennuengDonutChart } from './PennuengDonutChart';
import { PennuengHorizontalBarChart } from './PennuengHorizontalBarChart';
import { PennuengVerticalBarChart } from './PennuengVerticalBarChart';
import { DashboardStudentsCurriculumCharts } from './DashboardStudentsCurriculumCharts';
import { DrillDownFilters } from './DashboardDrillDownModal';

import type {
  PennuengDashboardStats,
  PennuengGateStatusRow,
  PennuengGateTraffic,
  PennuengHourlyPoint,
  PennuengMemberTypeSlice,
} from '@/types/pennueng-dashboard';

interface DashboardPennuengSectionProps {
  stats: PennuengDashboardStats | null;
  chartData: PennuengHourlyPoint[];
  gateTraffic: PennuengGateTraffic[];
  gateStatus: PennuengGateStatusRow[];
  memberTypes: PennuengMemberTypeSlice[];
  topCurricula: PennuengMemberTypeSlice[];
  loading: boolean;
  error: string | null;
  unavailable: boolean;
  /** แสดงเฉพาะกราฟประเภทสมาชิก (ข้อมูลหลักอยู่ในแดชบอร์ดด้านบนแล้ว) */
  compact?: boolean;
  onDrillDown?: (filter: DrillDownFilters) => void;
  t: (key: string) => string;
}

function buildTodayOutcomeSlices(
  stats: PennuengDashboardStats | null,
  successLabel: string,
  deniedLabel: string,
  otherLabel: string,
): PennuengMemberTypeSlice[] {
  if (!stats) return [];
  const rows: PennuengMemberTypeSlice[] = [
    { name: successLabel, value: stats.todaySuccess },
    { name: deniedLabel, value: stats.todayDenied },
  ];
  const pending = Math.max(0, stats.todayScans - stats.todaySuccess - stats.todayDenied);
  if (pending > 0) {
    rows.push({ name: otherLabel, value: pending });
  }
  return rows.filter((r) => r.value > 0);
}

function PennuengChartCard({
  title,
  data,
  loading,
  emptyLabel,
  variant = 'donut',
  mergeSmall = true,
  mockBadge = false,
  barColor,
  denseBar,
}: {
  title: string;
  data: PennuengMemberTypeSlice[];
  loading: boolean;
  emptyLabel: string;
  variant?: 'donut' | 'bar' | 'column';
  mergeSmall?: boolean;
  mockBadge?: boolean;
  barColor?: string;
  denseBar?: boolean;
}) {
  const Icon = variant === 'donut' ? IconChartPie : IconChartBar;

  return (
    <Card withBorder p="xl" radius="lg" style={{ height: '100%' }}>
      <Group gap="xs" mb="md" wrap="wrap">
        <Icon size={20} />
        <Text fw={700} size="lg">
          {title}
        </Text>
        {mockBadge ? (
          <Badge variant="light" color="orange" size="sm">
            MOCK
          </Badge>
        ) : (
          <Badge variant="light" color="navy" size="sm">
            SQL Server
          </Badge>
        )}
      </Group>
      <Skeleton visible={loading} radius="md">
        {!loading && data.length > 0 ? (
          variant === 'bar' ? (
            <PennuengHorizontalBarChart
              data={data}
              barColor={barColor}
              dense={denseBar}
              yAxisMinWidth={220}
              yAxisMaxWidth={320}
            />
          ) : variant === 'column' ? (
            <PennuengVerticalBarChart data={data} yMax={100} />
          ) : (
            <PennuengDonutChart data={data} height={200} mergeSmall={mergeSmall} />
          )
        ) : (
          <Center h={240}>
            <Text c="dimmed" size="sm">
              {emptyLabel}
            </Text>
          </Center>
        )}
      </Skeleton>
    </Card>
  );
}

export function DashboardPennuengSection({
  stats,
  chartData,
  gateTraffic,
  gateStatus,
  memberTypes,
  topCurricula,
  loading,
  error,
  unavailable,
  compact = false,
  onDrillDown,
  t,
}: DashboardPennuengSectionProps) {
  if (unavailable) {
    return (
      <Alert icon={<IconDatabase size={16} />} color="gray" radius="md" variant="light">
        {t('Dashboard.pennuengUnavailable')}
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title={t('Dashboard.pennuengTitle')} color="red" radius="md">
        {error}
      </Alert>
    );
  }

  if (compact) {
    const todayOutcome = buildTodayOutcomeSlices(
      stats,
      t('Dashboard.pennuengTodaySuccess'),
      t('Dashboard.pennuengTodayDenied'),
      t('Common.other'),
    );

    return (
      <DashboardStudentsCurriculumCharts
        memberTypes={memberTypes}
        topCurricula={topCurricula}
        todayOutcome={todayOutcome}
        loading={loading}
        onDrillDown={onDrillDown}
        t={t}
      />
    );
  }

  const statCards = [
    {
      label: t('Dashboard.pennuengActiveMembers'),
      value: stats?.members.active?.toLocaleString() ?? '0',
      sub: stats ? `/ ${stats.members.total.toLocaleString()}` : '',
      icon: IconUsers,
      color: 'skyBlue',
    },
    {
      label: t('Dashboard.pennuengGates'),
      value: stats ? `${stats.gates.active}/${stats.gates.total}` : '0/0',
      icon: IconDoor,
      color: 'navy',
    },
    {
      label: t('Dashboard.pennuengTodayScans'),
      value: stats?.todayScans?.toLocaleString() ?? '0',
      icon: IconScan,
      color: 'emerald',
    },
    {
      label: t('Dashboard.pennuengTodayDenied'),
      value: stats?.todayDenied?.toLocaleString() ?? '0',
      icon: IconAlertCircle,
      color: 'orange',
    },
  ];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <IconDatabase size={22} color="var(--mantine-color-navy-filled)" />
          <Text fw={800} size="lg">
            {t('Dashboard.pennuengTitle')}
          </Text>
        </Group>
        <Badge variant="light" color="navy" size="lg">
          SQL Server · pennuengdb
        </Badge>
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
        {statCards.map((card) => (
          <Card key={card.label} withBorder p="lg" radius="md">
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                {card.label}
              </Text>
              <ThemeIcon color={card.color} variant="light" size="md" radius="md">
                <card.icon size={18} />
              </ThemeIcon>
            </Group>
            <Skeleton visible={loading}>
              <Group gap={4} align="baseline">
                <Text size="xl" fw={800}>
                  {card.value}
                </Text>
                {card.sub ? (
                  <Text size="sm" c="dimmed">
                    {card.sub}
                  </Text>
                ) : null}
              </Group>
            </Skeleton>
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder p="xl" radius="lg">
          <Text fw={700} mb="xl" size="lg">
            {t('Dashboard.pennuengTraffic')}
          </Text>
          <Skeleton visible={loading} h={280}>
            {!loading ? (
              <div style={{ height: 280, width: '100%', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={chartData}
                    onClick={(clickData) => {
                      console.log('Pennueng Traffic click data:', clickData);
                      if (clickData && clickData.activeLabel) {
                        const label = String(clickData.activeLabel);
                        onDrillDown?.({
                          title: `รายชื่อผู้ผ่านเข้าออกช่วงเวลา ${label}`,
                          search: label.includes(':') ? label : undefined,
                          source: 'pennueng',
                        });
                      }
                    }}
                    style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                  >
                    <defs>
                      <linearGradient id="penIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip />
                    <Area
                      type="monotone"
                      dataKey="in"
                      name={t('Dashboard.pennuengIn')}
                      stroke="#1E3A5F"
                      strokeWidth={2}
                      fill="url(#penIn)"
                    />
                    <Area
                      type="monotone"
                      dataKey="out"
                      name={t('Dashboard.pennuengOut')}
                      stroke="#10B981"
                      strokeWidth={2}
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </Skeleton>
        </Card>

        <Card withBorder p="xl" radius="lg">
          <Text fw={700} mb="xl" size="lg">
            {t('Dashboard.pennuengTopGates')}
          </Text>
          <Skeleton visible={loading} h={280}>
            {!loading && gateTraffic.length > 0 ? (
              <div style={{ height: 280, width: '100%', minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={gateTraffic} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={148}
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      barSize={18}
                      onClick={(barData) => {
                        console.log('Pennueng Top Gates click data:', barData);
                        if (barData) {
                          onDrillDown?.({
                            title: `รายชื่อผู้ผ่านประตู: ${barData.name || ''}`,
                            search: barData.name || undefined,
                            source: 'pennueng',
                          });
                        }
                      }}
                      style={{ cursor: onDrillDown ? 'pointer' : 'default' }}
                    >
                      {gateTraffic.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <Center h={280}>
                <Text c="dimmed" size="sm">
                  {t('Common.noData')}
                </Text>
              </Center>
            )}
          </Skeleton>
        </Card>
      </SimpleGrid>

      <DashboardStudentsCurriculumCharts
        memberTypes={memberTypes}
        topCurricula={topCurricula}
        todayOutcome={buildTodayOutcomeSlices(
          stats,
          t('Dashboard.pennuengTodaySuccess'),
          t('Dashboard.pennuengTodayDenied'),
          t('Common.other'),
        )}
        loading={loading}
        onDrillDown={onDrillDown}
        t={t}
      />

      <Card withBorder p="xl" radius="lg">
        <Text fw={700} mb="md" size="lg">
          {t('Dashboard.pennuengGateToday')}
        </Text>
        <Skeleton visible={loading}>
          <Stack gap="xs">
            {gateStatus.slice(0, 8).map((gate) => (
              <Group key={gate.name} justify="space-between" wrap="nowrap">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text size="sm" fw={600} truncate>
                    {gate.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {t('Dashboard.pennuengIn')}: {gate.in} · {t('Dashboard.pennuengOut')}: {gate.out}{' '}
                    · {gate.lastScan}
                  </Text>
                </div>
                <Badge
                  color={gate.status === 'ACTIVE' ? 'teal' : 'gray'}
                  variant="light"
                  size="sm"
                >
                  {gate.status === 'ACTIVE' ? t('Dashboard.online') : t('Dashboard.offline')}
                </Badge>
              </Group>
            ))}
          </Stack>
        </Skeleton>
      </Card>
    </Stack>
  );
}
