'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Card,
  Table,
  Badge,
  Group,
  TextInput,
  ActionIcon,
  Select,
  Button,
  Pagination,
  LoadingOverlay,
  Alert,
  Tooltip,
  Modal,
  Avatar,
  Grid,
  Paper,
  SimpleGrid,
  Loader,
  SegmentedControl,
  ThemeIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconSearch,
  IconX,
  IconCalendar,
  IconRefresh,
  IconActivity,
  IconHistory,
  IconDoorEnter,
  IconDoorExit,
  IconAlertTriangle,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconEye,
  IconListCheck,
} from '@tabler/icons-react';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import { AccessEventCard } from '../access-log/_components/AccessEventCard';
import type { AccessEventCardEvent } from '../access-log/_components/AccessEventCard';
import type { PennuengGateHistoryRow, PennuengGateHistoryResult } from '@/types/pennueng-gate-history';
import type { ReportGateOption } from '@/types/reports-analytics';
import { PageHeader } from '@/components/layout/PageHeader';

// ─── Constants ───────────────────────────────────────────────────────────────

const HISTORY_PAGE_SIZE = 100;
const LIVE_MAX = 50;
const LIVE_INTERVAL_MS = 10_000;

function defaultRange() {
  return {
    startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };
}

// ─── Live Mode ───────────────────────────────────────────────────────────────

function LiveMode() {
  const [events, setEvents] = useState<AccessEventCardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState(false);

  const fetchLive = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const res = await fetch(apiPath('/api/admin/access-events'));
      if (!res.ok) throw new Error('Failed to fetch access events');
      const json = await res.json();
      const data = unwrapApiData<AccessEventCardEvent[]>(json);
      setEvents((data ?? []).slice(0, LIVE_MAX));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let firstConnect = true;
    void fetchLive();

    const eventSource = new EventSource(apiPath('/api/admin/access-events/stream'));

    eventSource.onopen = () => {
      setIsLiveConnected(true);
      if (!firstConnect) {
        void fetchLive(true);
      }
      firstConnect = false;
    };

    eventSource.onmessage = (event) => {
      try {
        const newEvent = JSON.parse(event.data) as AccessEventCardEvent;
        setEvents((prev) => {
          if (prev.some((e) => e.id === newEvent.id)) return prev;
          return [newEvent, ...prev].slice(0, LIVE_MAX);
        });
      } catch (err) {
        console.error('Error parsing SSE event data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      setIsLiveConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [fetchLive]);

  const inCount = events.filter((e) => e.direction === 'IN').length;
  const outCount = events.filter((e) => e.direction === 'OUT').length;
  const expiredCount = events.filter(
    (e) =>
      e.decision === 'DENIED' &&
      ['MEMBER_EXPIRED', 'QR_EXPIRED', 'MEMBER_INACTIVE'].includes(e.reasonCode ?? ''),
  ).length;

  return (
    <Stack gap="md">
      {/* Summary strip — uses shared summary-card CSS classes */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <Card withBorder radius="md" p="md" className="summary-card summary-card--blue">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">ทั้งหมด</Text>
              <Text size="xl" fw={800}>{events.length}</Text>
            </Stack>
            <ThemeIcon color="blue" variant="light" size="lg" radius="md">
              <IconListCheck size={18} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md" className="summary-card summary-card--green">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">เข้า</Text>
              <Text size="xl" fw={800} c="green.6">{inCount}</Text>
            </Stack>
            <ThemeIcon color="green" variant="light" size="lg" radius="md">
              <IconDoorEnter size={18} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md" className="summary-card summary-card--orange">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">ออก</Text>
              <Text size="xl" fw={800} c="orange.6">{outCount}</Text>
            </Stack>
            <ThemeIcon color="orange" variant="light" size="lg" radius="md">
              <IconDoorExit size={18} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md" className="summary-card summary-card--red">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={700} tt="uppercase">บัตรหมดอายุ</Text>
              <Text size="xl" fw={800} c="red.6">{expiredCount}</Text>
            </Stack>
            <ThemeIcon color="red" variant="light" size="lg" radius="md">
              <IconAlertTriangle size={18} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Toolbar */}
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <Badge 
            color={isLiveConnected ? 'red' : 'gray'} 
            variant="filled" 
            size="sm"
            style={{ transition: 'background-color 0.3s ease' }}
          >
            ● {isLiveConnected ? 'LIVE' : 'OFFLINE'}
          </Badge>
          <Text size="xs" c="dimmed">
            {isLiveConnected 
              ? `อัปเดตแบบเรียลไทม์ · แสดงสูงสุด ${LIVE_MAX} รายการ`
              : 'ขาดการเชื่อมต่อเรียลไทม์ (กำลังเชื่อมต่อใหม่...) · รีเฟรชเพื่อดึงข้อมูลล่าสุด'}
          </Text>
        </Group>
        <Tooltip label="รีเฟรชข้อมูล">
          <ActionIcon variant="light" color="navy" size="lg" onClick={() => void fetchLive()} loading={refreshing}>
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Content */}
      {loading ? (
        <Group justify="center" py="xl">
          <Loader size="md" />
          <Text c="dimmed">กำลังโหลดข้อมูลรายการเข้า-ออก...</Text>
        </Group>
      ) : error ? (
        <Alert color="red">{error}</Alert>
      ) : events.length === 0 ? (
        <Card withBorder p="xl" radius="md">
          <Text ta="center" c="dimmed">ไม่พบรายการสแกนผ่านประตูทางเข้า-ออก</Text>
        </Card>
      ) : (
        <Stack gap="sm">
          {events.map((event, index) => (
            <AccessEventCard key={event.id} event={event} isLatest={index === 0} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

// ─── History Mode ─────────────────────────────────────────────────────────────

function HistoryMode() {
  const t = useTranslations('History');
  const tc = useTranslations('Common');

  const defaults = defaultRange();
  const [startDate, setStartDate] = useState<string | null>(defaults.startDate);
  const [endDate, setEndDate] = useState<string | null>(defaults.endDate);
  const [gateId, setGateId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [gates, setGates] = useState<ReportGateOption[]>([]);
  const [result, setResult] = useState<PennuengGateHistoryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<PennuengGateHistoryRow | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [startDate, endDate, gateId, debouncedSearch]);

  // Load gates
  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch(apiPath('/api/admin/reports/gates'));
        const json = await res.json();
        if (res.ok) {
          const data = unwrapApiData<{ gates: ReportGateOption[] }>(json);
          setGates(data.gates ?? []);
        }
      } catch {
        setGates([]);
      }
    })();
  }, []);

  const gateOptions = useMemo(
    () => [{ value: '', label: t('allGates') }, ...gates.map((g) => ({ value: g.id, label: g.label }))],
    [gates, t],
  );

  const fetchHistory = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setUnavailable(null);
    try {
      const qs = new URLSearchParams({ startDate, endDate, page: String(page) });
      if (gateId) qs.set('gateId', gateId);
      if (debouncedSearch) qs.set('search', debouncedSearch);

      const res = await fetch(apiPath(`/api/admin/history?${qs.toString()}`));
      const json = await res.json();
      if (res.status === 503) {
        setUnavailable(getApiErrorMessage(json) || t('sqlUnavailable'));
        setResult(null);
        return;
      }
      if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
      setResult(unwrapApiData<PennuengGateHistoryResult>(json));
    } catch (err) {
      setResult(null);
      setUnavailable(err instanceof Error ? err.message : tc('error'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, endDate, gateId, page, startDate, t, tc]);

  useEffect(() => { void fetchHistory(); }, [fetchHistory]);

  const rows = result?.rows ?? [];

  return (
    <Stack gap="lg">
      {unavailable && (
        <Alert color="orange" title={t('sqlUnavailableTitle')}>{unavailable}</Alert>
      )}

      {/* Filters */}
      <Card withBorder radius="md" p="md" className="filter-bar">
        <Stack gap="md">
          <Group align="flex-end" wrap="wrap" gap="md">
            <DatePickerInput
              label={t('startDate')}
              value={startDate}
              onChange={setStartDate}
              maxDate={endDate ?? undefined}
              leftSection={<IconCalendar size={16} />}
              w={170}
              valueFormat="DD/MM/YYYY"
            />
            <DatePickerInput
              label={t('endDate')}
              value={endDate}
              onChange={setEndDate}
              minDate={startDate ?? undefined}
              maxDate={dayjs().format('YYYY-MM-DD')}
              leftSection={<IconCalendar size={16} />}
              w={170}
              valueFormat="DD/MM/YYYY"
            />
            <Select
              label={t('gateFilter')}
              data={gateOptions}
              value={gateId ?? ''}
              onChange={(value) => setGateId(value || null)}
              searchable
              clearable
              w={260}
            />
            <TextInput
              label={t('search')}
              placeholder={t('searchPlaceholder')}
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              rightSection={
                search ? (
                  <ActionIcon variant="transparent" color="gray" onClick={() => setSearch('')}>
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
              style={{ flex: 1, minWidth: 240 }}
            />
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {t('resultSummary', {
                from: (page - 1) * HISTORY_PAGE_SIZE + (rows.length > 0 ? 1 : 0),
                to: (page - 1) * HISTORY_PAGE_SIZE + rows.length,
                total: result?.total ?? 0,
              })}
            </Text>
            <Group gap="xs">
              <Badge variant="light" color="navy">{t('pageSizeLabel', { size: HISTORY_PAGE_SIZE })}</Badge>
              <Button variant="light" color="navy" size="xs" leftSection={<IconRefresh size={14} />} onClick={() => void fetchHistory()}>
                {t('refresh')}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0} style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
        <Table.ScrollContainer minWidth={960}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead className="table-head">
              <Table.Tr>
                <Table.Th>{t('member')}</Table.Th>
                <Table.Th>{t('gate')}</Table.Th>
                <Table.Th>{t('scannedAt')}</Table.Th>
                <Table.Th>{t('direction')}</Table.Th>
                <Table.Th>{t('decision')}</Table.Th>
                <Table.Th w={56} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar size="sm" color="blue" radius="xl">{item.fullName.charAt(0)}</Avatar>
                      <div>
                        <Text size="sm" fw={500}>{item.fullName}</Text>
                        <Text size="xs" c="dimmed" ff="monospace">
                          {item.memberNo || item.personId || item.memberKey || '—'}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{item.gateLabel}</Text>
                    <Text size="xs" c="dimmed" ff="monospace">{item.gateName}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" fw={500}>{item.scannedAtLabel}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={item.direction === 'IN' ? 'blue' : 'orange'}
                      variant="light"
                      leftSection={item.direction === 'IN' ? <IconArrowDownLeft size={10} /> : <IconArrowUpRight size={10} />}
                      size="sm"
                    >
                      {item.direction === 'IN' ? t('directionIn') : t('directionOut')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={item.decision === 'ALLOWED' ? 'green' : 'red'} variant="filled" size="sm">
                      {item.decision === 'ALLOWED' ? t('allowed') : t('denied')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={t('viewDetail')}>
                      <ActionIcon variant="subtle" size="sm" onClick={() => setSelectedRow(item)}>
                        <IconEye size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {rows.length === 0 && !loading && (
          <Text ta="center" py="xl" c="dimmed">
            {debouncedSearch ? t('noSearchResults') : tc('noData')}
          </Text>
        )}

        {result && result.totalPages > 1 && (
          <Group justify="center" p="md">
            <Pagination total={result.totalPages} value={page} onChange={setPage} />
          </Group>
        )}
      </Card>

      {/* Detail Modal */}
      <Modal
        opened={selectedRow !== null}
        onClose={() => setSelectedRow(null)}
        title={<Text fw={700}>{t('detailTitle')}</Text>}
        centered
        size="lg"
        radius="md"
      >
        {selectedRow && (
          <Stack gap="md">
            <Grid gap="xs">
              {[
                { label: t('member'), value: selectedRow.fullName },
                { label: t('memberNo'), value: selectedRow.memberNo ?? '—', mono: true },
                { label: t('personId'), value: selectedRow.personId ?? '—', mono: true },
                { label: t('memberKey'), value: selectedRow.memberKey ?? '—', mono: true },
                { label: t('memberType'), value: selectedRow.memberTypeLabel ?? selectedRow.memberType ?? '—' },
                { label: t('gate'), value: selectedRow.gateLabel },
                { label: t('scannedAt'), value: selectedRow.scannedAtLabel },
                {
                  label: t('direction'),
                  value: `${selectedRow.direction === 'IN' ? t('directionIn') : t('directionOut')} (${t('statusCode', { code: selectedRow.direction === 'IN' ? 1 : 0 })})`,
                },
              ].map(({ label, value, mono }) => (
                <Grid.Col key={label} span={6}>
                  <Paper p="sm" withBorder>
                    <Text size="xs" c="dimmed">{label}</Text>
                    <Text fw={600} ff={mono ? 'monospace' : undefined}>{value}</Text>
                  </Paper>
                </Grid.Col>
              ))}
              <Grid.Col span={12}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">{t('remark')}</Text>
                  <Text size="sm">{selectedRow.remark ?? '—'}</Text>
                </Paper>
              </Grid.Col>
            </Grid>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [mode, setMode] = useState<'live' | 'history'>('live');

  return (
    <Stack gap="xl">
      {/* Page header — uses shared PageHeader for consistent styling */}
      <PageHeader
        icon={mode === 'live' ? IconActivity : IconHistory}
        title={mode === 'live' ? 'Access Log (รายการเข้า-ออก)' : 'ประวัติการเข้าใช้งาน'}
        subtitle={
          mode === 'live'
            ? 'แสดงข้อมูลการสแกนผ่านประตูแบบเรียลไทม์'
            : 'ค้นหาและกรองประวัติการเข้าใช้งานจากฐานข้อมูล SQL Server'
        }
        actions={
          <SegmentedControl
            value={mode}
            onChange={(v) => setMode(v as 'live' | 'history')}
            data={[
              { label: 'Live', value: 'live' },
              { label: 'ประวัติ', value: 'history' },
            ]}
            radius="md"
          />
        }
      />

      {/* Mode content */}
      {mode === 'live' ? <LiveMode /> : <HistoryMode />}
    </Stack>
  );
}
