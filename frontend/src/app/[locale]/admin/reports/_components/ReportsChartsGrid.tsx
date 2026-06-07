'use client';

import { useRef } from 'react';
import {
  Paper,
  Text,
  Center,
  Stack,
  ThemeIcon,
  SimpleGrid,
  Card,
  ActionIcon,
  Menu,
} from '@mantine/core';
import { IconChartBar, IconDoor, IconDownload, IconFileSpreadsheet, IconPhoto } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ReportsAnalyticsPayload } from '@/types/reports-analytics';

const COLORS = ['#38BDF8', '#10B981', '#1E3A5F', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
const CHART_HEIGHT = 300;

function ChartShell({
  title,
  children,
  onDownloadExcel,
}: {
  title: string;
  children: React.ReactNode;
  onDownloadExcel?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = chartContainerRef.current?.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const { width, height } = svg.getBoundingClientRect();
    canvas.width = width * 2;  // 2x for retina
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(2, 2);
    const img = new Image();
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = `${title.replace(/\s+/g, '-')}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  };

  return (
    <Paper withBorder p="lg" radius="md" h="100%" pos="relative" ref={containerRef}>
      <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
        {onDownloadExcel ? (
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" title="Download options">
                <IconDownload size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconPhoto size={14} />} onClick={handleDownload}>
                ดาวน์โหลดรูปภาพ (PNG)
              </Menu.Item>
              <Menu.Item leftSection={<IconFileSpreadsheet size={14} />} onClick={onDownloadExcel}>
                ดาวน์โหลดข้อมูล (Excel)
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={handleDownload}
            title="Download PNG"
          >
            <IconDownload size={16} />
          </ActionIcon>
        )}
      </div>
      <Text fw={700} mb="md" size="md">
        {title}
      </Text>
      <div ref={chartContainerRef}>
        <ChartBox>{children}</ChartBox>
      </div>
    </Paper>
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
  const hasData = data.summary.totalScans > 0;

  const handleDownloadExcelDailyTrend = async () => {
    const { exportToExcel } = await import('@/lib/export-utils');
    const excelData = data.dailyTrend.map((row) => ({
      'วันที่ (Date)': row.date,
      'จำนวนผู้เข้า (Check-in)': row.in,
      'จำนวนผู้ออก (Check-out)': row.out,
      'รวมการใช้งานทั้งหมด (Total)': row.total,
    }));
    exportToExcel(excelData, 'Daily_Access_Summary');
  };

  if (!hasData) {
    return <EmptyChart label={tc('noData')} />;
  }

  return (
    <Stack gap="md">
      {/* 2-column grid for the first 4 charts */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* 1. BarChart — daily total access */}
        <ChartShell title={t('chartDailyTotal')} onDownloadExcel={handleDownloadExcelDailyTrend}>
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

        {/* 2. AreaChart — stacked in/out area */}
        <ChartShell title={t('chartInOutArea')} onDownloadExcel={handleDownloadExcelDailyTrend}>
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

        {/* 3. PieChart — gate traffic share */}
        <ChartShell title={t('chartGateShare')}>
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

        {/* 4. LineChart — allowed vs denied trend */}
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
      </SimpleGrid>

      {/* 5. ComposedChart — deny rate (full width) */}
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
    </Stack>
  );
}
