'use client';

import { useState } from 'react';
import {
  Card,
  Text,
  Group,
  Badge,
  Skeleton,
  SimpleGrid,
  Center,
  SegmentedControl,
  Alert,
} from '@mantine/core';
import { IconChartBar, IconChartPie } from '@tabler/icons-react';

import { PennuengDonutChart } from './PennuengDonutChart';
import {
  MOCK_STUDENT_STATUS_SHARE,
  PennuengHorizontalBarChart,
} from './PennuengHorizontalBarChart';

import type { PennuengMemberTypeSlice } from '@/types/pennueng-dashboard';

type ChartCardProps = {
  title: string;
  loading: boolean;
  icon?: 'donut' | 'bar';
  children: React.ReactNode;
};

function ChartCard({ title, loading, icon = 'donut', children }: ChartCardProps) {
  const Icon = icon === 'donut' ? IconChartPie : IconChartBar;

  return (
    <Card withBorder p="lg" radius="lg">
      <Group gap="xs" mb="sm" wrap="wrap">
        <Icon size={18} />
        <Text fw={700} size="md">
          {title}
        </Text>
        <Badge variant="light" color="navy" size="sm">
          SQL Server
        </Badge>
      </Group>
      <Skeleton visible={loading} radius="md">
        {children}
      </Skeleton>
    </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Center py="xl">
      <Text c="dimmed" size="sm">
        {label}
      </Text>
    </Center>
  );
}

type DashboardStudentsCurriculumChartsProps = {
  memberTypes: PennuengMemberTypeSlice[];
  topCurricula: PennuengMemberTypeSlice[];
  todayOutcome: PennuengMemberTypeSlice[];
  loading: boolean;
  t: (key: string) => string;
};

/** กราฟส่วนนักศึกษา/หลักสูตร — 2 การ์ดพร้อม SegmentedControl */
export function DashboardStudentsCurriculumCharts({
  memberTypes,
  topCurricula,
  todayOutcome,
  loading,
  t,
}: DashboardStudentsCurriculumChartsProps) {
  const [memberTab, setMemberTab] = useState('type');
  const [curriculumTab, setCurriculumTab] = useState('top');

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
      {/* Card 1 — สัดส่วนสมาชิก */}
      <ChartCard title="สัดส่วนสมาชิก" loading={loading} icon="donut">
        <SegmentedControl
          value={memberTab}
          onChange={setMemberTab}
          data={[
            { label: 'ประเภทสมาชิก', value: 'type' },
            { label: 'ผลลัพธ์วันนี้', value: 'today' },
          ]}
          fullWidth
          mb="md"
          size="xs"
        />
        {memberTab === 'type' ? (
          memberTypes.length > 0 ? (
            <PennuengDonutChart data={memberTypes} height={200} mergeSmall />
          ) : (
            <EmptyState label={t('Common.noData')} />
          )
        ) : todayOutcome.length > 0 ? (
          <PennuengDonutChart data={todayOutcome} height={200} mergeSmall={false} />
        ) : (
          <EmptyState label={t('Common.noData')} />
        )}
      </ChartCard>

      {/* Card 2 — ข้อมูลหลักสูตร */}
      <ChartCard title="ข้อมูลหลักสูตร" loading={loading} icon="bar">
        <SegmentedControl
          value={curriculumTab}
          onChange={setCurriculumTab}
          data={[
            { label: 'หลักสูตรยอดนิยม', value: 'top' },
            { label: 'สถานะนักศึกษา', value: 'status' },
          ]}
          fullWidth
          mb="md"
          size="xs"
        />
        {curriculumTab === 'top' ? (
          topCurricula.length > 0 ? (
            <PennuengHorizontalBarChart
              data={topCurricula}
              yAxisMinWidth={130}
              yAxisMaxWidth={220}
            />
          ) : (
            <EmptyState label={t('Common.noData')} />
          )
        ) : MOCK_STUDENT_STATUS_SHARE.length > 0 ? (
          <PennuengHorizontalBarChart
            data={MOCK_STUDENT_STATUS_SHARE}
            barColor="#3B82F6"
            dense
            yAxisMinWidth={130}
            yAxisMaxWidth={220}
          />
        ) : (
          <Alert variant="light" color="blue" mt="xs">
            ข้อมูลส่วนนี้กำลังอยู่ในระหว่างพัฒนา
          </Alert>
        )}
      </ChartCard>
    </SimpleGrid>
  );
}
