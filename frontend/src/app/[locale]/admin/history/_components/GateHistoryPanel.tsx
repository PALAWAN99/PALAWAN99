'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import {
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
import { notifications } from '@mantine/notifications';
import {
  IconRefresh,
  IconSearch,
  IconX,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconCalendar,
  IconEye,
  IconPlus,
  IconCopy,
  IconEdit,
  IconCheck,
} from '@tabler/icons-react';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type { PennuengGateHistoryRow, PennuengGateHistoryResult } from '@/types/pennueng-gate-history';
import type { ReportGateOption } from '@/types/reports-analytics';
import type { GateHistoryRecordInput } from '@/validators/gateHistoryRecordValidator';
import {
  createGateHistoryRecordApi,
  fetchGateHistoryApi,
  updateGateHistoryRecordApi,
} from '../lib/gate-history-api';
import { GateHistoryRecordFormModal } from './GateHistoryRecordFormModal';

const PAGE_SIZE_CHOICES = [100, 200, 300, 400, 500, 1000] as const;
const DEFAULT_PAGE_SIZE = 100;

type FormMode = 'create' | 'edit' | 'copy';

function defaultRange() {
  return {
    startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };
}

type Props = {
  initialMemberNo?: string | null;
};

export function GateHistoryPanel({ initialMemberNo = null }: Props) {
  const t = useTranslations('History');
  const tc = useTranslations('Common');

  const defaults = defaultRange();
  const [startDate, setStartDate] = useState<string | null>(defaults.startDate);
  const [endDate, setEndDate] = useState<string | null>(defaults.endDate);
  const [gateId, setGateId] = useState<string | null>(null);
  const [memberNo, setMemberNo] = useState(initialMemberNo ?? '');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedMemberNo, setDebouncedMemberNo] = useState(initialMemberNo ?? '');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(DEFAULT_PAGE_SIZE);
  const [gates, setGates] = useState<ReportGateOption[]>([]);
  const [result, setResult] = useState<PennuengGateHistoryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState<PennuengGateHistoryRow | null>(null);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [formRow, setFormRow] = useState<PennuengGateHistoryRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialMemberNo) setMemberNo(initialMemberNo);
  }, [initialMemberNo]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setDebouncedMemberNo(memberNo.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [search, memberNo]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, gateId, debouncedSearch, debouncedMemberNo, pageSize]);

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

  const pageSizeOptions = useMemo(
    () => [
      ...PAGE_SIZE_CHOICES.map((size) => ({ value: String(size), label: String(size) })),
      { value: 'all', label: t('pageSizeAll') },
    ],
    [t],
  );

  const fetchHistory = useCallback(async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setUnavailable(null);
    try {
      const data = await fetchGateHistoryApi({
        startDate,
        endDate,
        page,
        gateId,
        search: debouncedSearch || undefined,
        memberNo: debouncedMemberNo || undefined,
        pageSize,
      });
      setResult(data);
    } catch (error) {
      setResult(null);
      setUnavailable(error instanceof Error ? error.message : tc('error'));
    } finally {
      setLoading(false);
    }
  }, [debouncedMemberNo, debouncedSearch, endDate, gateId, page, pageSize, startDate, tc]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const openCreate = () => {
    setFormMode('create');
    setFormRow(null);
  };

  const openEdit = (row: PennuengGateHistoryRow) => {
    setFormMode('edit');
    setFormRow(row);
    setSelectedRow(null);
  };

  const openCopy = (row: PennuengGateHistoryRow) => {
    setFormMode('copy');
    setFormRow(row);
    setSelectedRow(null);
  };

  const handleFormSubmit = async (values: GateHistoryRecordInput) => {
    setSubmitting(true);
    try {
      if (formMode === 'edit' && formRow) {
        await updateGateHistoryRecordApi(formRow.id, values);
        notifications.show({
          title: tc('success'),
          message: t('updateSuccess'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      } else {
        await createGateHistoryRecordApi(values);
        notifications.show({
          title: tc('success'),
          message: t('createSuccess'),
          color: 'teal',
          icon: <IconCheck size={16} />,
        });
      }
      setFormMode(null);
      setFormRow(null);
      await fetchHistory();
    } catch (error) {
      notifications.show({
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const rows = result?.rows ?? [];
  // ใช้ pageSize ที่ server คืนมาจริง เพราะโหมด "ทั้งหมด" อาจถูกจำกัดด้วยเพดานความปลอดภัยฝั่ง server
  const effectivePageSize = result?.pageSize ?? (typeof pageSize === 'number' ? pageSize : DEFAULT_PAGE_SIZE);

  return (
    <Stack gap="lg">
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
              label={t('memberNoFilter')}
              placeholder={t('memberNoFilterPlaceholder')}
              value={memberNo}
              onChange={(e) => setMemberNo(e.currentTarget.value)}
              w={180}
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
              style={{ flex: 1, minWidth: 220 }}
            />
          </Group>

          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {t('resultSummary', {
                from: (page - 1) * effectivePageSize + (rows.length > 0 ? 1 : 0),
                to: (page - 1) * effectivePageSize + rows.length,
                total: result?.total ?? 0,
              })}
            </Text>
            <Group gap="xs">
              <Select
                data={pageSizeOptions}
                value={pageSize === 'all' ? 'all' : String(pageSize)}
                onChange={(value) => setPageSize(value === 'all' ? 'all' : Number(value) || DEFAULT_PAGE_SIZE)}
                aria-label={t('pageSizeFilter')}
                w={110}
                allowDeselect={false}
              />
              <Button
                variant="light"
                color="skyBlue"
                leftSection={<IconPlus size={16} />}
                onClick={openCreate}
              >
                {t('addRecord')}
              </Button>
              <Button
                variant="light"
                color="navy"
                leftSection={<IconRefresh size={16} />}
                onClick={() => void fetchHistory()}
              >
                {t('refresh')}
              </Button>
            </Group>
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md" p={0} style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
        <Table.ScrollContainer minWidth={1020}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg="var(--bg-tertiary)">
              <Table.Tr>
                <Table.Th>{t('member')}</Table.Th>
                <Table.Th>{t('gate')}</Table.Th>
                <Table.Th>{t('scannedAt')}</Table.Th>
                <Table.Th>{t('direction')}</Table.Th>
                <Table.Th>{t('decision')}</Table.Th>
                <Table.Th w={120} />
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
                    <Group gap={4} justify="flex-end" wrap="nowrap">
                      <Tooltip label={t('viewDetail')}>
                        <ActionIcon variant="subtle" size="sm" onClick={() => setSelectedRow(item)}>
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={t('copyRecord')}>
                        <ActionIcon variant="light" color="violet" size="sm" onClick={() => openCopy(item)}>
                          <IconCopy size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={tc('edit')}>
                        <ActionIcon variant="light" color="skyBlue" size="sm" onClick={() => openEdit(item)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {rows.length === 0 && !loading ? (
          <Text ta="center" py="xl" c="dimmed">
            {debouncedSearch || debouncedMemberNo ? t('noSearchResults') : tc('noData')}
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
                    <Text size="xs" c="dimmed">
                      {label}
                    </Text>
                    <Text fw={600} ff={mono ? 'monospace' : undefined}>
                      {value}
                    </Text>
                  </Paper>
                </Grid.Col>
              ))}
              <Grid.Col span={12}>
                <Paper p="sm" withBorder>
                  <Text size="xs" c="dimmed">
                    {t('remark')}
                  </Text>
                  <Text size="sm">{selectedRow.remark ?? '—'}</Text>
                </Paper>
              </Grid.Col>
            </Grid>
            <Group justify="flex-end">
              <Button variant="light" color="violet" leftSection={<IconCopy size={16} />} onClick={() => openCopy(selectedRow)}>
                {t('copyRecord')}
              </Button>
              <Button variant="light" color="skyBlue" leftSection={<IconEdit size={16} />} onClick={() => openEdit(selectedRow)}>
                {tc('edit')}
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Modal>

      <GateHistoryRecordFormModal
        opened={formMode !== null}
        mode={formMode ?? 'create'}
        recordId={formRow?.id ?? null}
        initialRow={formRow}
        gates={gates}
        loading={submitting}
        onClose={() => {
          setFormMode(null);
          setFormRow(null);
        }}
        onSubmit={handleFormSubmit}
      />
    </Stack>
  );
}
