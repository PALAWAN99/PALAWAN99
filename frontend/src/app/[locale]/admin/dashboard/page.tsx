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
import { DatePickerInput } from '@mantine/dates';
import { IconLayoutDashboard, IconAlertCircle, IconPlugOff, IconRefresh } from '@tabler/icons-react';

import { useDashboard } from '../dashboard/hooks/useDashboard';
import { DashboardStats } from '../dashboard/_components/DashboardStats';
import { DashboardCharts } from '../dashboard/_components/DashboardCharts';
import { DashboardActivity } from '../dashboard/_components/DashboardActivity';
import { DashboardGateSummary } from '../dashboard/_components/DashboardGateSummary';
import { DashboardPennuengSection } from '../dashboard/_components/DashboardPennuengSection';
import { DashboardStudentsCurriculumHeader } from '../dashboard/_components/DashboardStudentsCurriculumHeader';

/** แดชบอร์ดภาพรวมระบบ — ย้ายจาก /admin */
export default function AdminDashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

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
  } = useDashboard(dateRange);

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
            onChange={setDateRange}
            clearable
            size="sm"
            maxDate={new Date()}
            w={220}
          />
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
      <DashboardCharts chartData={chartData} gateTraffic={gateTraffic} loading={loading} t={t} />

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
    </Stack>
  );
}
