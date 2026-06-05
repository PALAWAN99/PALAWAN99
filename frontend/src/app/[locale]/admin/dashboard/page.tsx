'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Box,
  Alert,
} from '@mantine/core';
import { IconLayoutDashboard, IconAlertCircle } from '@tabler/icons-react';

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
  } = useDashboard();

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
      ) : null}

      <DashboardGateSummary gates={gateStatus} loading={loading} t={t} />
      <DashboardActivity recentEvents={recentEvents} loading={loading} t={t} />
    </Stack>
  );
}
