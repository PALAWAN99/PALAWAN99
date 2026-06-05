'use client';

import { useMemo } from 'react';
import {
  Paper,
  Text,
  Grid,
  Center,
  Stack,
  ThemeIcon,
  SimpleGrid,
  Card,
} from '@mantine/core';
import { IconChartBar, IconDoor } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import type { ReportsAnalyticsPayload } from '@/types/reports-analytics';

const COLORS = ['#38BDF8', '#10B981', '#1E3A5F', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
const CHART_HEIGHT = 300;

function ChartShell({
  title,
  children,
  span = 6,
}: {
  title: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <Grid.Col span={{ base: 12, lg: span }}>
      <Paper withBorder p="lg" radius="md" h="100%">
        <Text fw={700} mb="md" size="md">
          {title}
        </Text>
        <ChartBox>{children}</ChartBox>
      </Paper>
    </Grid.Col>
  );
}

function ChartBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: CHART_HEIGHT, width: '100%', minWidth: 0, minHeight: CHART_HEIGHT }}>
      {children}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <Center h={CHART_HEIGHT}>
      <Stack align="center" gap={4}>
        <IconDoor size={36} opacity={0.2} />
        <Text c="dimmed" size="sm">
          {label}
        </Text>
      </Stack>
    </Center>
  );
}

function normalizeRadar(data: ReportsAnalyticsPayload['gateRadar']) {
  if (data.length === 0) return [];
  const max = {
    total: Math.max(...data.map((d) => d.total), 1),
    allowed: Math.max(...data.map((d) => d.allowed), 1),
    denied: Math.max(...data.map((d) => d.denied), 1),
    in: Math.max(...data.map((d) => d.in), 1),
    out: Math.max(...data.map((d) => d.out), 1),
  };
  return data.map((row) => ({
    gate: row.gate,
    total: Math.round((row.total / max.total) * 100),
    allowed: Math.round((row.allowed / max.allowed) * 100),
    denied: Math.round((row.denied / max.denied) * 100),
    in: Math.round((row.in / max.in) * 100),
    out: Math.round((row.out / max.out) * 100),
  }));
}

function TreemapContent(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  value?: number;
  index?: number;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name = '', index = 0 } = props;
  if (width < 30 || height < 24) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={COLORS[index % COLORS.length]}
        stroke="#fff"
        strokeWidth={2}
        rx={4}
      />
      {width > 56 && height > 28 ? (
        <text x={x + 8} y={y + 18} fill="#fff" fontSize={11} fontWeight={600}>
          {name.length > 12 ? `${name.slice(0, 11)}…` : name}
        </text>
      ) : null}
    </g>
  );
}

export function ReportsSummaryCards({ data }: { data: ReportsAnalyticsPayload }) {
  const t = useTranslations('Report');
  const cards = [
    { title: t('totalAccess'), value: data.summary.totalScans, color: 'blue' },
    { title: t('allowedAccess'), value: data.summary.allowed, color: 'teal' },
    { title: t('deniedAccess'), value: data.summary.denied, color: 'red' },
    { title: t('uniqueMembers'), value: data.summary.uniqueMembers, color: 'grape' },
    { title: t('avgDailyScans'), value: data.summary.avgDailyScans, color: 'orange' },
    { title: t('denyRate'), value: `${data.summary.denyRate}%`, color: 'pink' },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
      {cards.map((card) => (
        <Card key={card.title} withBorder radius="md" p="lg">
          <GroupLikeSummary title={card.title} value={card.value} color={card.color} />
        </Card>
      ))}
    </SimpleGrid>
  );
}

function GroupLikeSummary({
  title,
  value,
  color,
}: {
  title: string;
  value: number | string;
  color: string;
}) {
  return (
    <Stack gap="xs">
      <ThemeIcon color={color} variant="light" size={42} radius="md">
        <IconChartBar size={22} />
      </ThemeIcon>
      <Text size="sm" c="dimmed" fw={500}>
        {title}
      </Text>
      <Text size="xl" fw={800}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
    </Stack>
  );
}

export function ReportsChartsGrid({ data }: { data: ReportsAnalyticsPayload }) {
  const t = useTranslations('Report');
  const tc = useTranslations('Common');
  const radarData = useMemo(() => normalizeRadar(data.gateRadar), [data.gateRadar]);
  const funnelData = useMemo(
    () =>
      data.funnel.map((step) => ({
        ...step,
        name:
          step.name === 'totalScans'
            ? t('totalAccess')
            : step.name === 'allowed'
              ? t('allowedAccess')
              : t('deniedAccess'),
      })),
    [data.funnel, t],
  );
  const scatterHourly = useMemo(
    () => data.hourlyDistribution.map((row, index) => ({ hour: index, count: row.count, label: row.hour })),
    [data.hourlyDistribution],
  );
  const hasData = data.summary.totalScans > 0;

  if (!hasData) {
    return <EmptyChart label={tc('noData')} />;
  }

  return (
    <Grid gap="md">
      <ChartShell title={t('chartDailyTotal')} span={8}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data.dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#38BDF8" radius={[4, 4, 0, 0]} name={t('totalAccess')} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartGateShare')} span={4}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <PieChart>
            <Pie data={data.gateShare} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
              {data.gateShare.map((entry, index) => (
                <Cell key={entry.name} fill={entry.color ?? COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartInOutArea')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart data={data.dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="in" stackId="1" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.35} name={t('directionIn')} />
            <Area type="monotone" dataKey="out" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.35} name={t('directionOut')} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartCumulative')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.cumulativeTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="cumulative" stroke="#1E3A5F" strokeWidth={3} dot={false} name={t('cumulativeAccess')} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartTopGates')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data.gateInOut} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" width={120} fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#0EA5E9" radius={[0, 4, 4, 0]} name={t('totalAccess')} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartGateInOutStack')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={data.gateInOut}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={60} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="in" stackId="a" fill="#38BDF8" name={t('directionIn')} />
            <Bar dataKey="out" stackId="a" fill="#10B981" name={t('directionOut')} />
            <Bar dataKey="denied" stackId="a" fill="#EF4444" name={t('deniedAccess')} />
          </BarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartAllowedDenied')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={data.dailyTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="allowed" stroke="#10B981" strokeWidth={2} name={t('allowedAccess')} />
            <Line type="monotone" dataKey="denied" stroke="#EF4444" strokeWidth={2} name={t('deniedAccess')} />
          </LineChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartGateRadar')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="gate" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
            <Radar name={t('totalAccess')} dataKey="total" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.25} />
            <Radar name={t('allowedAccess')} dataKey="allowed" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
            <Radar name={t('deniedAccess')} dataKey="denied" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartDenyRateComposed')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <ComposedChart data={data.denyRateTrend}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="total" fill="#38BDF8" name={t('totalAccess')} radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="denyRate" stroke="#EF4444" strokeWidth={2} name={t('denyRate')} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartMemberTypeTreemap')}>
        {data.memberTypeAccess.length > 0 ? (
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <Treemap
              data={data.memberTypeAccess}
              dataKey="value"
              nameKey="name"
              stroke="#fff"
              fill="#8884d8"
              content={<TreemapContent />}
            />
          </ResponsiveContainer>
        ) : (
          <EmptyChart label={tc('noData')} />
        )}
      </ChartShell>

      <ChartShell title={t('chartWeekdayRadial')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="95%"
            data={data.weekdayDistribution.map((row, index) => ({
              name: row.name,
              value: row.value,
              fill: COLORS[index % COLORS.length],
            }))}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 6]} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={6} label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }} />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartHourlyScatter')}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="hour" name={t('hour')} domain={[0, 23]} tickCount={12} fontSize={11} />
            <YAxis type="number" dataKey="count" name={t('totalAccess')} fontSize={11} />
            <ZAxis range={[80, 400]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => [value, name]} labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ''} />
            <Scatter data={scatterHourly} fill="#8B5CF6" name={t('totalAccess')} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartShell>

      <ChartShell title={t('chartAccessFunnel')} span={12}>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <FunnelChart>
            <Tooltip />
            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              {funnelData.map((entry, index) => (
                <Cell key={entry.name} fill={entry.fill ?? COLORS[index % COLORS.length]} />
              ))}
              <LabelList position="right" fill="#334155" stroke="none" dataKey="name" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </ChartShell>
    </Grid>
  );
}
