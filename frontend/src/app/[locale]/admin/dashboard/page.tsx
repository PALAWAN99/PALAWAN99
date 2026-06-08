'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Box,
  Alert,
  Button,
} from '@mantine/core';
import { DatePickerInput, type DatesRangeValue } from '@mantine/dates';
import { IconLayoutDashboard, IconAlertCircle, IconPlugOff, IconRefresh, IconSearch } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { useDashboard } from '../dashboard/hooks/useDashboard';
import { DashboardStats } from '../dashboard/_components/DashboardStats';
import { DashboardCharts } from '../dashboard/_components/DashboardCharts';
import { DashboardActivity } from '../dashboard/_components/DashboardActivity';
import { DashboardGateSummary } from '../dashboard/_components/DashboardGateSummary';
import { DashboardPennuengSection } from '../dashboard/_components/DashboardPennuengSection';
import { DashboardStudentsCurriculumHeader } from '../dashboard/_components/DashboardStudentsCurriculumHeader';
import { DashboardDrillDownModal, type DrillDownFilters } from '../dashboard/_components/DashboardDrillDownModal';

/** แดชบอร์ดภาพรวมระบบ — ย้ายจาก /admin */
export default function AdminDashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [dateRange, setDateRange] = useState<DatesRangeValue>([null, null]);
  const [searchRange, setSearchRange] = useState<DatesRangeValue>([null, null]);
  const [drillDown, setDrillDown] = useState<DrillDownFilters | null>(null);

  const handleDrillDown = (filter: Omit<DrillDownFilters, 'startDate' | 'endDate'> & { dateStr?: string; hourStr?: string }) => {
    console.log('handleDrillDown invoked with filter:', filter);
    let start: string | undefined;
    let end: string | undefined;

    if (filter.dateStr) {
      start = dayjs(filter.dateStr).startOf('day').toISOString();
      end = dayjs(filter.dateStr).endOf('day').toISOString();
    } else if (filter.hourStr) {
      // If hour is e.g. "08:00", get search range start date or today
      const baseDate = searchRange[0] ? dayjs(searchRange[0]) : dayjs();
      const hour = parseInt(filter.hourStr.split(':')[0]);
      start = baseDate.hour(hour).minute(0).second(0).millisecond(0).toISOString();
      end = baseDate.hour(hour).minute(59).second(59).millisecond(999).toISOString();
    } else {
      // Use general search range
      if (searchRange[0]) start = dayjs(searchRange[0]).startOf('day').toISOString();
      if (searchRange[1]) end = dayjs(searchRange[1]).endOf('day').toISOString();
    }

    const nextDrillDown = {
      title: filter.title,
      gateId: filter.gateId,
      decision: filter.decision,
      direction: filter.direction,
      memberType: filter.memberType,
      startDate: start,
      endDate: end,
      search: filter.search,
    };
    console.log('Setting drillDown state to:', nextDrillDown);
    setDrillDown(nextDrillDown);
  };

  const {
    stats,
    recentEvents,
    chartData,
    gateTraffic,
    gateStatus,
    pennueng,
    pennuengLoading,
    pennuengError,
    pennuengUnavailable,
    dataSource,
    loading,
    error,
    refetchPennueng,
  } = useDashboard(searchRange);

  const formattedDate = new Date().toLocaleDateString(
    locale === 'th' ? 'th-TH' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  );

  return (
    <Stack gap="xl" pos="relative">
      {error ? (
        <Alert icon={<IconAlertCircle size={16} />} title="เกิดข้อผิดพลาด" color="red" radius="md">
          {error}
        </Alert>
      ) : null}

      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs" mb={4}>
            <IconLayoutDashboard size={28} color="var(--mantine-color-blue-filled)" />
            <Title order={2} fw={800} style={{ letterSpacing: '-0.02em' }}>
              {t('Common.dashboard')}
            </Title>
          </Group>
          <Text size="sm" c="dimmed" fw={500}>
            {t('Dashboard.welcome')} · {formattedDate}
            {dataSource === 'pennueng' ? ` · ${t('Dashboard.pennuengDataSource')}` : ''}
          </Text>
        </div>
        <Group gap="xs">
          <DatePickerInput
            type="range"
            placeholder="เลือกช่วงเวลา"
            value={dateRange}
            onChange={(val: DatesRangeValue) => {
              setDateRange(val);
              if (val[0] === null && val[1] === null) {
                setSearchRange([null, null]);
              }
            }}
            clearable
            size="sm"
            maxDate={new Date()}
            w={220}
          />
          <Button
            size="sm"
            variant="filled"
            leftSection={<IconSearch size={16} />}
            onClick={() => setSearchRange(dateRange)}
          >
            ค้นหา
          </Button>
          {dataSource === 'pennueng' ? (
            <Badge color="navy" variant="light" size="lg">
              Pennueng DB
            </Badge>
          ) : null}
          <Badge
            color="emerald"
            variant="light"
            size="lg"
            p="md"
            leftSection={<Box className="pulse-dot" style={{ background: '#10B981' }} />}
          >
            SYSTEM ONLINE
          </Badge>
        </Group>
      </Group>

      <DashboardStats stats={stats} loading={loading} t={t} />
      <DashboardCharts chartData={chartData} gateTraffic={gateTraffic} loading={loading} onDrillDown={handleDrillDown} t={t} />

      {!pennuengUnavailable ? (
        <Stack gap="md">
          <DashboardStudentsCurriculumHeader title={t('Dashboard.studentsCurriculumSection')} />
          <DashboardPennuengSection
            stats={pennueng?.stats ?? null}
            chartData={[]}
            gateTraffic={[]}
            gateStatus={[]}
            memberTypes={pennueng?.memberTypes ?? []}
            topCurricula={pennueng?.topCurricula ?? []}
            loading={pennuengLoading}
            error={pennuengError}
            unavailable={pennuengUnavailable}
            compact
            onDrillDown={handleDrillDown}
            t={t}
          />
        </Stack>
      ) : (
        <Alert
          icon={<IconPlugOff size={18} />}
          title="ไม่สามารถเชื่อมต่อ Pennueng DB ได้"
          color="gray"
          variant="light"
          radius="md"
        >
          <Group justify="space-between" align="center" wrap="wrap">
            <Text size="sm">ข้อมูลนักศึกษาและหลักสูตรไม่พร้อมใช้งานในขณะนี้</Text>
            <Button
              size="xs"
              variant="light"
              color="gray"
              leftSection={<IconRefresh size={14} />}
              onClick={refetchPennueng}
            >
              ลองใหม่
            </Button>
          </Group>
        </Alert>
      )}

      <DashboardGateSummary gates={gateStatus} loading={loading} t={t} />
      <DashboardActivity recentEvents={recentEvents} loading={loading} t={t} />

      <DashboardDrillDownModal filters={drillDown} onClose={() => setDrillDown(null)} />
    </Stack>
  );
}
