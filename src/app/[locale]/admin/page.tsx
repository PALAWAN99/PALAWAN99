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
} from '@mantine/core';
import { IconLayoutDashboard } from '@tabler/icons-react';

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
    loading
  } = useDashboard();

  const formattedDate = new Date().toLocaleDateString(
    locale === 'th' ? 'th-TH' : 'en-US', 
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <Stack gap="xl" pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

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
      <DashboardStats stats={stats} t={t} />

      {/* Data Visualization */}
      <DashboardCharts chartData={chartData} gateTraffic={gateTraffic} t={t} />

      {/* Activity & Device Status */}
      <DashboardActivity recentEvents={recentEvents} gateStatus={gateStatus} t={t} />
    </Stack>
  );
}
