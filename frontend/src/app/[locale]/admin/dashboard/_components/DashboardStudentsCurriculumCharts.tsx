'use client';

import {
  Card,
  Text,
  Group,
  Badge,
  Skeleton,
  Stack,
  SimpleGrid,
  Center,
} from '@mantine/core';
import { IconChartBar, IconChartPie } from '@tabler/icons-react';

import { PennuengDonutChart } from './PennuengDonutChart';
import {
  MOCK_STUDENT_STATUS_SHARE,
  PennuengHorizontalBarChart,
} from './PennuengHorizontalBarChart';
import {
  MOCK_EMPLOYMENT_AFTER_GRAD,
  PennuengVerticalBarChart,
} from './PennuengVerticalBarChart';

import type { PennuengMemberTypeSlice } from '@/types/pennueng-dashboard';

type ChartCardProps = {
  title: string;
  data: PennuengMemberTypeSlice[];
  loading: boolean;
  emptyLabel: string;
  variant: 'donut' | 'bar' | 'column';
  mockBadge?: boolean;
  barColor?: string;
  barYMin?: number;
  barYMax?: number;
  denseBar?: boolean;
  mergeSmall?: boolean;
};

function ChartCard({
  title,
  data,
  loading,
  emptyLabel,
  variant,
  mockBadge = false,
  barColor,
  barYMin,
  barYMax,
  denseBar,
  mergeSmall = true,
}: ChartCardProps) {
  const Icon = variant === 'donut' ? IconChartPie : IconChartBar;

  return (
    <Card withBorder p="lg" radius="lg">
      <Group gap="xs" mb="sm" wrap="wrap">
        <Icon size={18} />
        <Text fw={700} size="md">
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
              yAxisMinWidth={barYMin}
              yAxisMaxWidth={barYMax}
            />
          ) : variant === 'column' ? (
            <PennuengVerticalBarChart data={data} yMax={100} />
          ) : (
            <PennuengDonutChart data={data} height={200} mergeSmall={mergeSmall} />
          )
        ) : (
          <Center py="xl">
            <Text c="dimmed" size="sm">
              {emptyLabel}
            </Text>
          </Center>
        )}
      </Skeleton>
    </Card>
  );
}

type DashboardStudentsCurriculumChartsProps = {
  memberTypes: PennuengMemberTypeSlice[];
  topCurricula: PennuengMemberTypeSlice[];
  todayOutcome: PennuengMemberTypeSlice[];
  loading: boolean;
  t: (key: string) => string;
};

/** กราฟส่วนนักศึกษา/หลักสูตร — แยกจาก Pennueng section หลัก ปรับ layout แล้ว */
export function DashboardStudentsCurriculumCharts({
  memberTypes,
  topCurricula,
  todayOutcome,
  loading,
  t,
}: DashboardStudentsCurriculumChartsProps) {
  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <ChartCard
          title={t('Dashboard.pennuengEmploymentAfterGrad')}
          data={MOCK_EMPLOYMENT_AFTER_GRAD}
          loading={false}
          emptyLabel={t('Common.noData')}
          variant="column"
          mockBadge
        />
        <ChartCard
          title={t('Dashboard.pennuengMemberTypes')}
          data={memberTypes}
          loading={loading}
          emptyLabel={t('Common.noData')}
          variant="donut"
        />
      </SimpleGrid>

      <ChartCard
        title={t('Dashboard.pennuengStudentStatus')}
        data={MOCK_STUDENT_STATUS_SHARE}
        loading={false}
        emptyLabel={t('Common.noData')}
        variant="bar"
        barColor="#3B82F6"
        barYMin={200}
        barYMax={300}
        denseBar
        mockBadge
      />

      <ChartCard
        title={t('Dashboard.pennuengTopCurricula')}
        data={topCurricula}
        loading={loading}
        emptyLabel={t('Common.noData')}
        variant="bar"
        barYMin={260}
        barYMax={420}
      />

      <ChartCard
        title={t('Dashboard.pennuengTodayOutcome')}
        data={todayOutcome}
        loading={loading}
        emptyLabel={t('Common.noData')}
        variant="donut"
        mergeSmall={false}
      />
    </Stack>
  );
}
