'use client';

import { useTranslations, useLocale } from 'next-intl';
import {
  Title,
  Text,
  Group,
  Stack,
  Badge,
  Box,
  LoadingOverlay,
  Skeleton,
  Alert,
} from '@mantine/core';
import { IconLayoutDashboard, IconAlertCircle } from '@tabler/icons-react';

import { useDashboard } from './dashboard/hooks/useDashboard';
import { DashboardStats } from './dashboard/_components/DashboardStats';
import { DashboardCharts } from './dashboard/_components/DashboardCharts';
import { DashboardActivity } from './dashboard/_components/DashboardActivity';

/**
 * Admin Dashboard Page
 * แสดงภาพรวมข้อมูลระบบ สถิติการใช้งาน และสถานะอุปกรณ์
 */
export default function AdminDashboard() {
  const t = useTranslations();
  const locale = useLocale();
  const {
    stats,
    recentEvents,
    chartData,
    gateTraffic,
    gateStatus,
    loading,
    error
  } = useDashboard();

  const formattedDate = new Date().toLocaleDateString(
    locale === 'th' ? 'th-TH' : 'en-US', 
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <Stack gap="xl" pos="relative">
      {/* Error Alert */}
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="เกิดข้อผิดพลาด" color="red" radius="md">
          {error}
        </Alert>
      )}

      {/* Page Header */}
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
          </Text>
        </div>
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

      {/* Summary Statistics */}
      <DashboardStats stats={stats} loading={loading} t={t} />

      {/* Data Visualization */}
      <DashboardCharts chartData={chartData} gateTraffic={gateTraffic} loading={loading} t={t} />

      {/* Activity & Device Status */}
      <DashboardActivity recentEvents={recentEvents} gateStatus={gateStatus} loading={loading} t={t} />
    </Stack>
  );
}
