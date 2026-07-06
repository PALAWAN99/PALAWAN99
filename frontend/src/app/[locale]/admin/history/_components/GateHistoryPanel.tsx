'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useSession } from 'next-auth/react';
import type { UserRole } from '@prisma/client';
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
  IconDownload,
  IconCamera,
  IconTrash,
} from '@tabler/icons-react';
import { captureTableElementAsPng } from '@/lib/capture-table-image';
import { hasPermission } from '@/lib/rbac';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type { PennuengGateHistoryRow, PennuengGateHistoryResult } from '@/types/pennueng-gate-history';
import type { ReportGateOption } from '@/types/reports-analytics';
import type { GateHistoryRecordInput } from '@/validators/gateHistoryRecordValidator';
import {
  createGateHistoryRecordApi,
  fetchGateHistoryApi,
  updateGateHistoryRecordApi,
  deleteGateHistoryRecordApi,
} from '../lib/gate-history-api';
import { GateHistoryRecordFormModal } from './GateHistoryRecordFormModal';
import { HistoryDataSourceReference } from './HistoryDataSourceReference';

const PAGE_SIZE_CHOICES = [100, 200, 300, 400, 500, 1000] as const;
const DEFAULT_PAGE_SIZE = 100;

type FormMode = 'create' | 'edit' | 'copy';

function defaultRange() {
  return {
    startDate: dayjs().subtract(6, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  };
}

function escapeCsvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

type Props = {
  initialMemberNo?: string | null;
};

export function GateHistoryPanel({ initialMemberNo = null }: Props) {
  const t = useTranslations('History');
  const tc = useTranslations('Common');
  const { data: session } = useSession();
  const canDelete = hasPermission(session?.user?.role as UserRole, 'ACCESS_EVENT', 'DELETE');

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
  const [exporting, setExporting] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const tableExportRef = useRef<HTMLDivElement>(null);

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

  const handleExportCsv = useCallback(async () => {
    if (!startDate || !endDate) return;
    setExporting(true);
    try {
      const data = await fetchGateHistoryApi({
        startDate,
        endDate,
        gateId,
        search: debouncedSearch || undefined,
        memberNo: debouncedMemberNo || undefined,
        pageSize: 'all',
      });

      const header = [
        t('member'),
        t('memberNo'),
        t('personId'),
        t('memberKey'),
        t('memberType'),
        t('gate'),
        t('scannedAt'),
        t('direction'),
        t('decision'),
        t('remark'),
      ];
      const lines = [
        header,
        ...data.rows.map((row) => [
          row.fullName,
          row.memberNo ?? '',
          row.personId ?? '',
          row.memberKey ?? '',
          row.memberTypeLabel ?? row.memberType ?? '',
          row.gateLabel,
          row.scannedAtLabel,
          row.direction === 'IN' ? t('directionIn') : t('directionOut'),
          row.decision === 'ALLOWED' ? t('allowed') : t('denied'),
          row.remark ?? '',
        ]),
      ];
      const csv = lines.map((line) => line.map((cell) => escapeCsvCell(String(cell))).join(',')).join('\r\n');
      // BOM ให้ Excel เปิดไฟล์แล้วอ่านตัวอักษรไทยถูกต้อง
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `access-history_${startDate}_${endDate}.csv`);

      const truncated = data.total > data.rows.length;
      notifications.show({
        title: tc('success'),
        message: truncated
          ? t('exportPartial', { count: data.rows.length, total: data.total })
          : t('exportSuccess', { count: data.rows.length }),
        color: truncated ? 'yellow' : 'teal',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        color: 'red',
      });
    } finally {
      setExporting(false);
    }
  }, [startDate, endDate, gateId, debouncedSearch, debouncedMemberNo, t, tc]);

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

  const confirmDelete = (row: PennuengGateHistoryRow) => {
    modals.openConfirmModal({
      title: t('deleteConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          {t('deleteConfirmMessage', {
            name: row.fullName,
            time: row.scannedAtLabel,
            id: row.id,
          })}
        </Text>
      ),
      labels: { confirm: t('deleteRecord'), cancel: tc('cancel') },
      confirmProps: { color: 'red' },
      onConfirm: () => void handleDelete(row),
    });
  };

  const handleDelete = async (row: PennuengGateHistoryRow) => {
    setDeletingId(row.id);
    try {
      await deleteGateHistoryRecordApi(row.id);
      if (selectedRow?.id === row.id) setSelectedRow(null);
      notifications.show({
        title: tc('success'),
        message: t('deleteSuccess'),
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      await fetchHistory();
    } catch (error) {
      notifications.show({
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        color: 'red',
      });
    } finally {
      setDeletingId(null);
    }
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

  const handleSaveTableImage = useCallback(async () => {
    const el = tableExportRef.current;
    if (!el || rows.length === 0) {
      notifications.show({
        title: tc('error'),
        message: t('saveTableImageEmpty'),
        color: 'orange',
      });
      return;
    }

    setSavingImage(true);
    try {
      const stamp = dayjs().format('YYYYMMDD-HHmm');
      await captureTableElementAsPng(el, `history-table-${stamp}.png`);
      notifications.show({
        title: tc('success'),
        message: t('saveTableImageSuccess'),
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        color: 'red',
      });
    } finally {
      setSavingImage(false);
    }
  }, [rows.length, t, tc]);

  return (
    <Stack gap="lg">
      <HistoryDataSourceReference />

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
                color="green"
                leftSection={<IconDownload size={16} />}
                onClick={() => void handleExportCsv()}
                loading={exporting}
              >
                {t('exportCsv')}
              </Button>
              <Button
                variant="light"
                color="grape"
                leftSection={<IconCamera size={16} />}
                onClick={() => void handleSaveTableImage()}
                loading={savingImage}
                disabled={loading || rows.length === 0}
              >
                {t('saveTableImage')}
              </Button>
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
        {rows.length > 0 ? (
          <div
            ref={tableExportRef}
            aria-hidden
            style={{
              position: 'fixed',
              left: '-9999px',
              top: 0,
              width: 920,
              background: '#ffffff',
              pointerEvents: 'none',
            }}
          >
            <Table verticalSpacing="sm">
              <Table.Thead bg="var(--bg-tertiary)">
                <Table.Tr>
                  <Table.Th>{t('member')}</Table.Th>
                  <Table.Th>{t('gate')}</Table.Th>
                  <Table.Th>{t('scannedAt')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((item) => (
                  <Table.Tr key={`export-${item.id}`}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {item.fullName}
                      </Text>
                      <Text size="xs" c="dimmed" ff="monospace">
                        {item.memberKey || '—'}
                      </Text>
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
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : null}
        <Table.ScrollContainer minWidth={1020}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg="var(--bg-tertiary)">
              <Table.Tr>
                <Table.Th>{t('member')}</Table.Th>
                <Table.Th>{t('gate')}</Table.Th>
                <Table.Th>{t('scannedAt')}</Table.Th>
                <Table.Th>{t('direction')}</Table.Th>
                <Table.Th>{t('decision')}</Table.Th>
                <Table.Th w={160} />
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
                          {item.memberKey || '—'}
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
                      {canDelete ? (
                        <Tooltip label={t('deleteRecord')}>
                          <ActionIcon
                            variant="light"
                            color="red"
                            size="sm"
                            loading={deletingId === item.id}
                            onClick={() => confirmDelete(item)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      ) : null}
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
              {canDelete ? (
                <Button
                  variant="light"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  loading={deletingId === selectedRow.id}
                  onClick={() => confirmDelete(selectedRow)}
                >
                  {t('deleteRecord')}
                </Button>
              ) : null}
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
