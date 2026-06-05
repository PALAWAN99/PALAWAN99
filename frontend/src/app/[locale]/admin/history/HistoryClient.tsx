'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Card,
  Table,
  Badge,
  Group,
  Stack,
  ActionIcon,
  Tooltip,
  Modal,
  Avatar,
  Grid,
  Paper,
  Button,
  TextInput,
  Select,
  Pagination,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconHistory,
  IconRefresh,
  IconSearch,
  IconX,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconCalendar,
  IconEye,
} from '@tabler/icons-react';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type { PennuengGateHistoryRow, PennuengGateHistoryResult } from '@/types/pennueng-gate-history';
import type { ReportGateOption } from '@/types/reports-analytics';

const PAGE_SIZE = 100;

function defaultRange() {
  return {
    startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };
}

export default function HistoryClient() {
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

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, gateId, debouncedSearch]);

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
    () => [
      { value: '', label: t('allGates') },
      ...gates.map((gate) => ({ value: gate.id, label: gate.label })),
    ],
    [gates, t],
  );

  const fetchHistory = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setUnavailable(null);
    try {
      const qs = new URLSearchParams({
        startDate,
        endDate,
        page: String(page),
      });
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
    } catch (error) {
      setResult(null);
      setUnavailable(error instanceof Error ? error.message : tc('error'));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, endDate, gateId, page, startDate, t, tc]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const rows = result?.rows ?? [];

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <div>
          <Group gap="xs" mb={4}>
            <IconHistory size={28} color="var(--color-navy)" />
            <Title order={2}>{t('title')}</Title>
          </Group>
          <Text size="sm" c="dimmed">
            {t('subtitle')}
          </Text>
        </div>
        <Button
          variant="light"
          color="navy"
          leftSection={<IconRefresh size={16} />}
          onClick={() => void fetchHistory()}
        >
          {t('refresh')}
        </Button>
      </Group>

      {unavailable ? (
        <Alert color="orange" title={t('sqlUnavailableTitle')}>
          {unavailable}
        </Alert>
      ) : null}

      <Card withBorder radius="md" p="md">
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
                from: (page - 1) * PAGE_SIZE + (rows.length > 0 ? 1 : 0),
                to: (page - 1) * PAGE_SIZE + rows.length,
                total: result?.total ?? 0,
              })}
            </Text>
            <Badge variant="light" color="navy">
              {t('pageSizeLabel', { size: PAGE_SIZE })}
            </Badge>
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md" p={0} style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
        <Table.ScrollContainer minWidth={960}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg="var(--bg-tertiary)">
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
                      <Avatar size="sm" color="blue" radius="xl">
                        {item.fullName.charAt(0)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>
                          {item.fullName}
                        </Text>
                        <Text size="xs" c="dimmed" ff="monospace">
                          {item.memberNo || item.personId || item.memberKey || '—'}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{item.gateLabel}</Text>
                    <Text size="xs" c="dimmed" ff="monospace">
                      {item.gateName}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" fw={500}>
                      {item.scannedAtLabel}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={item.direction === 'IN' ? 'blue' : 'orange'}
                      variant="light"
                      leftSection={
                        item.direction === 'IN' ? (
                          <IconArrowDownLeft size={10} />
                        ) : (
                          <IconArrowUpRight size={10} />
                        )
                      }
                      size="sm"
                    >
                      {item.direction === 'IN' ? t('directionIn') : t('directionOut')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={item.decision === 'ALLOWED' ? 'green' : 'red'}
                      variant="filled"
                      size="sm"
                    >
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

        {rows.length === 0 && !loading ? (
          <Text ta="center" py="xl" c="dimmed">
            {debouncedSearch ? t('noSearchResults') : tc('noData')}
          </Text>
        ) : null}

        {result && result.totalPages > 1 ? (
          <Group justify="center" p="md">
            <Pagination total={result.totalPages} value={page} onChange={setPage} />
          </Group>
        ) : null}
      </Card>

      <Modal
        opened={selectedRow !== null}
        onClose={() => setSelectedRow(null)}
        title={<Text fw={700}>{t('detailTitle')}</Text>}
        centered
        size="lg"
        radius="md"
      >
        {selectedRow ? (
          <Stack gap="md">
            <Grid gap="xs">
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('member')}
                  </Text>
                  <Text fw={600}>{selectedRow.fullName}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('memberNo')}
                  </Text>
                  <Text fw={600} ff="monospace">
                    {selectedRow.memberNo ?? '—'}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('personId')}
                  </Text>
                  <Text fw={600} ff="monospace">
                    {selectedRow.personId ?? '—'}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('memberKey')}
                  </Text>
                  <Text fw={600} ff="monospace">
                    {selectedRow.memberKey ?? '—'}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('memberType')}
                  </Text>
                  <Text fw={600}>{selectedRow.memberTypeLabel ?? selectedRow.memberType ?? '—'}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('gate')}
                  </Text>
                  <Text fw={600}>{selectedRow.gateLabel}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('scannedAt')}
                  </Text>
                  <Text fw={600}>{selectedRow.scannedAtLabel}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('direction')}
                  </Text>
                  <Text fw={600}>
                    {selectedRow.direction === 'IN' ? t('directionIn') : t('directionOut')}
                    {' '}
                    ({t('statusCode', { code: selectedRow.direction === 'IN' ? 1 : 0 })})
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={12}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('remark')}
                  </Text>
                  <Text size="sm">{selectedRow.remark ?? '—'}</Text>
                </Paper>
              </Grid.Col>
            </Grid>
          </Stack>
        ) : null}
      </Modal>
    </Stack>
  );
}
