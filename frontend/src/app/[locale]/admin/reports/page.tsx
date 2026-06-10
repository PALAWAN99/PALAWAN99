'use client';

import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslations, useLocale } from 'next-intl';
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
  Card,
  Divider,
  Grid,
  Paper,
} from '@mantine/core';
import {
  IconFileExport,
  IconChartBar,
  IconFileText,
  IconFileTypePdf,
  IconDatabase,
  IconCalendar,
} from '@tabler/icons-react';
import { DatePicker } from '@mantine/dates';
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
import { DashboardDrillDownModal } from '../dashboard/_components/DashboardDrillDownModal';
import type { DrillDownFilters } from '../dashboard/_components/DashboardDrillDownModal';

export default function ReportsPage() {
  const t = useTranslations('Report');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const isTh = locale === 'th';

  const defaults = defaultReportRange();
  const [startDate, setStartDate] = useState<string | null>(defaults.startDate);
  const [endDate, setEndDate] = useState<string | null>(defaults.endDate);
  const [selectedGateIds, setSelectedGateIds] = useState<string[]>([]);
  const [gates, setGates] = useState<ReportGateOption[]>([]);
  const [data, setData] = useState<ReportsAnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [gatesLoading, setGatesLoading] = useState(true);

  const [drillDown, setDrillDown] = useState<DrillDownFilters | null>(null);
  const [calendarDate, setCalendarDate] = useState<string | null>(dayjs().format('YYYY-MM-DD'));
  const [calendarMonth, setCalendarMonth] = useState<string>(dayjs().format('YYYY-MM-DD'));

  // Keep calendarDate in sync with filter date selection
  useEffect(() => {
    if (startDate && endDate && startDate === endDate) {
      setCalendarDate(startDate);
    } else {
      setCalendarDate(null);
    }
  }, [startDate, endDate]);

  // Keep calendar viewport month in sync with startDate
  useEffect(() => {
    if (startDate) {
      setCalendarMonth(startDate);
    }
  }, [startDate]);

  const handleDrillDown = useCallback((filter: DrillDownFilters & { dateStr?: string; hourStr?: string }) => {
    let start: string | undefined = filter.startDate;
    let end: string | undefined = filter.endDate;

    // ถ้า filter ไม่ได้ส่ง startDate/endDate มา ให้ derive จาก dateStr/hourStr หรือ state
    if (!start && !end) {
      if (filter.dateStr) {
        start = dayjs(filter.dateStr).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        end = dayjs(filter.dateStr).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      } else if (filter.hourStr) {
        const baseDate = startDate ? dayjs(startDate) : dayjs();
        const hour = parseInt(filter.hourStr.split(':')[0]);
        start = baseDate.hour(hour).minute(0).second(0).millisecond(0).format('YYYY-MM-DDTHH:mm:ss');
        end = baseDate.hour(hour).minute(59).second(59).millisecond(999).format('YYYY-MM-DDTHH:mm:ss');
      } else {
        if (startDate) start = dayjs(startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
        if (endDate) end = dayjs(endDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      }
    }

    setDrillDown({
      title: filter.title,
      gateId: filter.gateId,
      decision: filter.decision,
      direction: filter.direction,
      memberType: filter.memberType,
      startDate: start,
      endDate: end,
      search: filter.search,
      source: filter.source ?? (data?.source === 'pennueng' ? 'pennueng' : 'postgres'),
    });
  }, [startDate, endDate, data?.source]);

  const loadReportWithParams = useCallback(async (startStr: string, endStr: string) => {
    setLoading(true);
    try {
      const payload = await fetchReportsAnalyticsApi({
        startDate: dayjs(startStr).format('YYYY-MM-DD'),
        endDate: dayjs(endStr).format('YYYY-MM-DD'),
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
  }, [selectedGateIds, tc]);

  const loadReport = useCallback(async () => {
    if (!startDate || !endDate) return;
    await loadReportWithParams(startDate, endDate);
  }, [endDate, startDate, loadReportWithParams]);

  const handleCalendarDateChange = (value: string | null) => {
    if (!value) return;
    const formatted = dayjs(value).format('YYYY-MM-DD');
    setCalendarDate(formatted);

    const startOfDayStr = dayjs(formatted).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
    const endOfDayStr = dayjs(formatted).endOf('day').format('YYYY-MM-DDTHH:mm:ss');

    setDrillDown({
      title: isTh 
        ? `รายชื่อผู้ใช้วันที่ ${dayjs(formatted).format('DD MMM')}` 
        : `User list on ${dayjs(formatted).format('DD MMM')}`,
      startDate: startOfDayStr,
      endDate: endOfDayStr,
      source: data?.source === 'pennueng' ? 'pennueng' : 'postgres',
    });
  };

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
           {/* 6 Summary Cards */}
          <ReportsSummaryCards data={data} />

          {data.summary.totalScans === 0 ? (
            <Alert color="gray" variant="light">
              {t('noDataInRange')}
            </Alert>
          ) : (
            <ReportsChartsGrid
              data={data}
              onDrillDown={handleDrillDown}
              calendarNode={
                <Paper withBorder p="lg" radius="md" h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
                  <Group gap="xs" mb="md" justify="center">
                    <IconCalendar size={20} color="var(--color-navy)" />
                    <Text fw={700} size="md">
                      {isTh ? 'เลือกดูข้อมูลรายวัน' : 'Daily Quick View'}
                    </Text>
                  </Group>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DatePicker
                      value={calendarDate}
                      onChange={handleCalendarDateChange}
                      maxDate={new Date()}
                      date={calendarMonth}
                      onDateChange={setCalendarMonth}
                      size="md"
                    />
                  </div>
                </Paper>
              }
            />
          )}
          <ReportsDetailTable
            data={data}
            onDrillDown={handleDrillDown}
            startDate={startDate ?? undefined}
            endDate={endDate ?? undefined}
          />
        </Stack>
      ) : null}

      <DashboardDrillDownModal filters={drillDown} onClose={() => setDrillDown(null)} />
    </Stack>
  );
}
