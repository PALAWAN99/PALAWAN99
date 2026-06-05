'use client';

import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Loader,
  Center,
  Menu,
  Badge,
  Alert,
} from '@mantine/core';
import {
  IconFileExport,
  IconChartBar,
  IconFileText,
  IconFileTypePdf,
  IconDatabase,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { ReportGateOption, ReportsAnalyticsPayload } from '@/types/reports-analytics';
import { ReportsFilters } from './_components/ReportsFilters';
import { ReportsChartsGrid, ReportsSummaryCards } from './_components/ReportsChartsGrid';
import { ReportsDetailTable } from './_components/ReportsDetailTable';
import {
  defaultReportRange,
  fetchReportGatesApi,
  fetchReportsAnalyticsApi,
} from './lib/reports-api';

export default function ReportsPage() {
  const t = useTranslations('Report');
  const tc = useTranslations('Common');

  const defaults = defaultReportRange();
  const [startDate, setStartDate] = useState<string | null>(defaults.startDate);
  const [endDate, setEndDate] = useState<string | null>(defaults.endDate);
  const [selectedGateIds, setSelectedGateIds] = useState<string[]>([]);
  const [gates, setGates] = useState<ReportGateOption[]>([]);
  const [data, setData] = useState<ReportsAnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [gatesLoading, setGatesLoading] = useState(true);

  const loadReport = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    try {
      const payload = await fetchReportsAnalyticsApi({
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        gateIds: selectedGateIds,
      });
      setData(payload);
    } catch (error) {
      notifications.show({
        color: 'red',
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
      });
    } finally {
      setLoading(false);
    }
  }, [endDate, selectedGateIds, startDate, tc]);

  useEffect(() => {
    void (async () => {
      setGatesLoading(true);
      try {
        const gateOptions = await fetchReportGatesApi();
        setGates(gateOptions);
      } catch {
        setGates([]);
      } finally {
        setGatesLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    void loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (!data) return;
    const { exportToExcel, exportToPDF } = await import('@/lib/export-utils');
    const rows = data.detailTable.map((row) => ({
      [t('tableGate')]: row.gateName,
      [t('totalAccess')]: row.total,
      [t('allowedAccess')]: row.allowed,
      [t('deniedAccess')]: row.denied,
      [t('directionIn')]: row.in,
      [t('directionOut')]: row.out,
      [t('denyRate')]: row.denyRate,
      [t('avgDailyScans')]: row.avgDaily,
    }));

    const rangeLabel = `${dayjs(startDate).format('DD/MM/YYYY')} - ${dayjs(endDate).format('DD/MM/YYYY')}`;

    if (format === 'excel') {
      exportToExcel(rows, `Gate_Report_${dayjs(startDate).format('YYYYMMDD')}_${dayjs(endDate).format('YYYYMMDD')}`);
      return;
    }

    const headers = Object.keys(rows[0] ?? {});
    const body = rows.map((row) => headers.map((key) => row[key as keyof typeof row]));
    exportToPDF(headers, body, 'Gate_Report', `${t('title')} (${rangeLabel})`);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Group gap="xs" mb={4}>
            <IconChartBar size={28} color="var(--color-navy)" />
            <Title order={2} c="var(--text-primary)">
              {t('title')}
            </Title>
          </Group>
          <Text size="sm" c="var(--text-secondary)">
            {t('subtitle')}
          </Text>
          {data ? (
            <Badge
              mt="xs"
              variant="light"
              color={data.source === 'pennueng' ? 'teal' : 'blue'}
              leftSection={<IconDatabase size={12} />}
            >
              {data.source === 'pennueng' ? t('sourcePennueng') : t('sourcePostgres')}
            </Badge>
          ) : null}
        </div>

        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <Button leftSection={<IconFileExport size={18} />} variant="filled" color="navy" size="sm" disabled={!data}>
              {t('export')}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>{t('exportFormat')}</Menu.Label>
            <Menu.Item leftSection={<IconFileText size={16} />} onClick={() => void handleExport('excel')}>
              Excel (.xlsx)
            </Menu.Item>
            <Menu.Item leftSection={<IconFileTypePdf size={16} />} onClick={() => void handleExport('pdf')}>
              PDF Report (.pdf)
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <ReportsFilters
        startDate={startDate}
        endDate={endDate}
        selectedGateIds={selectedGateIds}
        gates={gates}
        loading={loading || gatesLoading}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onGateIdsChange={setSelectedGateIds}
        onGenerate={() => void loadReport()}
      />

      {loading && !data ? (
        <Center py={80}>
          <Stack align="center">
            <Loader size="lg" color="navy" />
            <Text c="dimmed">{t('generate')}...</Text>
          </Stack>
        </Center>
      ) : data ? (
        <Stack gap="lg">
          <ReportsSummaryCards data={data} />
          {data.summary.totalScans === 0 ? (
            <Alert color="gray" variant="light">
              {t('noDataInRange')}
            </Alert>
          ) : (
            <ReportsChartsGrid data={data} />
          )}
          <ReportsDetailTable data={data} />
        </Stack>
      ) : null}
    </Stack>
  );
}
