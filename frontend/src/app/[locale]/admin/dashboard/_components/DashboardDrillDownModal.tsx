'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Modal,
  Table,
  Pagination,
  Loader,
  Badge,
  Group,
  Text,
  Center,
  Stack,
  Avatar,
  ActionIcon,
  Tooltip,
  TextInput,
  SegmentedControl,
  Button,
  Divider,
  Paper,
  Select,
} from '@mantine/core';
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconRefresh,
  IconSearch,
  IconX,
  IconFilter,
  IconFilterOff,
} from '@tabler/icons-react';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage } from '@/lib/parse-api-response';

export interface DrillDownFilters {
  title: string;
  gateId?: string;
  decision?: string;
  direction?: string;
  memberType?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  department?: string;
  source?: 'pennueng' | 'postgres';
  hourStr?: string;
  dateStr?: string;
}

interface DashboardDrillDownModalProps {
  filters: DrillDownFilters | null;
  onClose: () => void;
}

// Member type options ที่พบบ่อยใน Pennueng
const MEMBER_TYPE_OPTIONS = [
  { value: '', label: 'ทุกประเภท' },
  { value: 'นักศึกษาป.ตรี', label: 'นักศึกษาป.ตรี' },
  { value: 'นักศึกษาบัณฑิต', label: 'นักศึกษาบัณฑิต' },
  { value: 'บุคลากร', label: 'บุคลากร' },
  { value: 'Library Staff', label: 'Library Staff' },
  { value: 'นักเรียน', label: 'นักเรียน' },
  { value: 'บุคคลภายนอก', label: 'บุคคลภายนอก' },
];

export function DashboardDrillDownModal({ filters, onClose }: DashboardDrillDownModalProps) {
  const t = useTranslations('History');
  const tc = useTranslations('Common');

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Local filter state — refinements on top of base filters from props
  const [localSearch, setLocalSearch] = useState('');
  const [localDirection, setLocalDirection] = useState('');    // '' | 'IN' | 'OUT'
  const [localDecision, setLocalDecision] = useState('');     // '' | 'ALLOWED' | 'DENIED'
  const [localMemberType, setLocalMemberType] = useState(''); // '' | specific type

  // Debounce search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(localSearch);
      setPage(1);
    }, 400);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [localSearch]);

  const hasLocalFilters = !!(localDirection || localDecision || localMemberType || debouncedSearch);

  function clearLocalFilters() {
    setLocalSearch('');
    setDebouncedSearch('');
    setLocalDirection('');
    setLocalDecision('');
    setLocalMemberType('');
    setPage(1);
  }

  const fetchEvents = useCallback(async () => {
    if (!filters) return;
    setLoading(true);
    setError(null);

    try {
      const endpoint = filters.source === 'pennueng' ? '/api/admin/history' : '/api/admin/events';

      const queryParams = new URLSearchParams({ page: String(page) });

      // Base filters from props (gateId etc.)
      if (filters.gateId) queryParams.set('gateId', filters.gateId);

      // Local filters override base filters when set
      const effectiveSearch = debouncedSearch || filters.search || '';
      const effectiveDirection = localDirection || filters.direction || '';
      const effectiveDecision = localDecision || filters.decision || '';
      const effectiveMemberType = localMemberType || filters.memberType || '';

      if (effectiveSearch) queryParams.set('search', effectiveSearch);
      if (effectiveDirection) queryParams.set('direction', effectiveDirection);
      if (effectiveDecision) queryParams.set('decision', effectiveDecision);
      if (effectiveMemberType) queryParams.set('memberType', effectiveMemberType);
      if (filters.department) queryParams.set('department', filters.department);

      if (filters.source === 'pennueng') {
        if (filters.startDate) {
          queryParams.set(
            'startDate',
            filters.startDate.includes('T') ? filters.startDate.slice(0, 10) : filters.startDate,
          );
        }
        if (filters.endDate) {
          queryParams.set(
            'endDate',
            filters.endDate.includes('T') ? filters.endDate.slice(0, 10) : filters.endDate,
          );
        }
        queryParams.set('pageSize', '15');
      } else {
        if (filters.startDate) queryParams.set('startDate', filters.startDate);
        if (filters.endDate) queryParams.set('endDate', filters.endDate);
        queryParams.set('limit', '15');
      }

      console.log('[DrillDown] endpoint:', endpoint, 'params:', queryParams.toString());

      const res = await fetch(apiPath(`${endpoint}?${queryParams.toString()}`));
      const json = await res.json();

      if (!res.ok) {
        throw new Error(getApiErrorMessage(json) || tc('error'));
      }

      if (json.success && json.data) {
        const list = json.data.events || json.data.rows || [];
        const pages = json.data.pages || json.data.totalPages || 1;
        const total = json.data.total !== undefined ? json.data.total : 0;
        setEvents(list);
        setTotalPages(pages);
        setTotalRecords(total);
      }
    } catch (err: any) {
      console.error('Failed to fetch drilldown events:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [filters, page, debouncedSearch, localDirection, localDecision, localMemberType, tc]);

  // Reset local filters when base filters change (new drill-down target)
  useEffect(() => {
    setLocalSearch('');
    setDebouncedSearch('');
    setLocalDirection('');
    setLocalDecision('');
    setLocalMemberType('');
    setPage(1);
  }, [filters?.title, filters?.gateId]);

  useEffect(() => {
    if (filters) fetchEvents();
  }, [filters, page, fetchEvents]);

  if (!filters) return null;

  return (
    <Modal
      opened={!!filters}
      onClose={onClose}
      title={
        <Stack gap={2}>
          <Text fw={800} size="lg" style={{ color: 'var(--mantine-color-navy-filled)' }}>
            {filters.title}
          </Text>
          <Group gap="xs">
            <Text size="xs" c="dimmed">
              พบข้อมูลทั้งหมด {totalRecords.toLocaleString()} รายการ
            </Text>
            {hasLocalFilters && (
              <Badge size="xs" color="blue" variant="light">
                กรองอยู่
              </Badge>
            )}
          </Group>
        </Stack>
      }
      size="90%"
      radius="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      <Stack gap="sm" mt="xs">
        {/* ─── Filter bar ─── */}
        <Paper withBorder p="sm" radius="md" bg="var(--mantine-color-gray-0)">
          <Stack gap="xs">
            <Group gap="xs" align="flex-end" wrap="wrap">
              {/* ค้นหาชื่อ / เลขบัตร */}
              <TextInput
                placeholder="ค้นหาชื่อ, เลขบัตรประชาชน, รหัสสมาชิก..."
                leftSection={<IconSearch size={14} />}
                rightSection={
                  localSearch ? (
                    <ActionIcon
                      size="xs"
                      variant="subtle"
                      color="gray"
                      onClick={() => setLocalSearch('')}
                    >
                      <IconX size={12} />
                    </ActionIcon>
                  ) : null
                }
                value={localSearch}
                onChange={(e) => setLocalSearch(e.currentTarget.value)}
                size="sm"
                style={{ flex: '1 1 220px', minWidth: 180 }}
              />

              {/* ประเภทสมาชิก */}
              <Select
                placeholder="ทุกประเภท"
                data={MEMBER_TYPE_OPTIONS}
                value={localMemberType || null}
                onChange={(v) => { setLocalMemberType(v ?? ''); setPage(1); }}
                size="sm"
                clearable
                style={{ flex: '1 1 160px', minWidth: 140 }}
              />
            </Group>

            <Group gap="xs" wrap="wrap">
              {/* ทิศทาง */}
              <Group gap={4} align="center">
                <Text size="xs" c="dimmed" fw={500}>ทิศทาง:</Text>
                <SegmentedControl
                  size="xs"
                  value={localDirection}
                  onChange={(v) => { setLocalDirection(v); setPage(1); }}
                  data={[
                    { value: '', label: 'ทั้งหมด' },
                    { value: 'IN', label: '↙ เข้า' },
                    { value: 'OUT', label: '↗ ออก' },
                  ]}
                />
              </Group>

              {/* สถานะ */}
              <Group gap={4} align="center">
                <Text size="xs" c="dimmed" fw={500}>สถานะ:</Text>
                <SegmentedControl
                  size="xs"
                  value={localDecision}
                  onChange={(v) => { setLocalDecision(v); setPage(1); }}
                  data={[
                    { value: '', label: 'ทั้งหมด' },
                    { value: 'ALLOWED', label: '✓ อนุญาต' },
                    { value: 'DENIED', label: '✗ ปฏิเสธ' },
                  ]}
                />
              </Group>

              {/* ล้างตัวกรอง */}
              {hasLocalFilters && (
                <Tooltip label="ล้างตัวกรองทั้งหมด">
                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    leftSection={<IconFilterOff size={13} />}
                    onClick={clearLocalFilters}
                  >
                    ล้างตัวกรอง
                  </Button>
                </Tooltip>
              )}
            </Group>
          </Stack>
        </Paper>

        <Divider />

        {/* ─── Table ─── */}
        {loading && events.length === 0 ? (
          <Center h={200}>
            <Loader size="md" color="navy" />
          </Center>
        ) : error ? (
          <Center h={200}>
            <Stack align="center" gap="xs">
              <Text c="red" size="sm">
                {error}
              </Text>
              <ActionIcon variant="light" color="navy" onClick={fetchEvents}>
                <IconRefresh size={16} />
              </ActionIcon>
            </Stack>
          </Center>
        ) : events.length === 0 ? (
          <Center h={200}>
            <Stack align="center" gap="xs">
              <IconFilter size={32} opacity={0.2} />
              <Text c="dimmed" size="sm">
                {hasLocalFilters ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข' : tc('noData')}
              </Text>
              {hasLocalFilters && (
                <Button size="xs" variant="subtle" onClick={clearLocalFilters}>
                  ล้างตัวกรอง
                </Button>
              )}
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={650}>
              <Table
                verticalSpacing="sm"
                highlightOnHover
                style={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.15s' }}
              >
                <Table.Thead bg="var(--mantine-color-gray-1)">
                  <Table.Tr>
                    <Table.Th>ผู้ใช้งาน</Table.Th>
                    <Table.Th>ประตู</Table.Th>
                    <Table.Th>ประเภท</Table.Th>
                    <Table.Th>เวลาสแกน</Table.Th>
                    <Table.Th>ทิศทาง</Table.Th>
                    <Table.Th>สถานะ</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {events.map((item: any) => {
                    const memberName = item.fullName
                      ? item.fullName
                      : item.member
                      ? `${item.member.firstNameTh} ${item.member.lastNameTh}`.trim()
                      : 'ไม่ทราบชื่อ';
                    const memberNo = item.memberNo || item.member?.memberNo || '—';
                    const memberType = item.memberTypeLabel || item.member?.memberType || '—';
                    const gateName = item.gateLabel || item.gate?.nameTh || '—';
                    const gateCode = item.gateName || item.gate?.gateCode || '—';
                    const timeLabel = new Date(item.scannedAt).toLocaleString('th-TH');

                    return (
                      <Table.Tr key={item.id}>
                        <Table.Td>
                          <Group gap="sm" wrap="nowrap">
                            <Avatar size="sm" color="blue" radius="xl">
                              {memberName.charAt(0)}
                            </Avatar>
                            <div>
                              <Text size="sm" fw={600} style={{ whiteSpace: 'nowrap' }}>
                                {memberName}
                              </Text>
                              <Text size="xs" c="dimmed" ff="monospace">
                                {memberNo}
                              </Text>
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>
                            {gateName}
                          </Text>
                          <Text size="xs" c="dimmed" ff="monospace">
                            {gateCode}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color="gray" variant="light" size="sm">
                            {memberType}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="xs" style={{ whiteSpace: 'nowrap' }}>
                            {timeLabel}
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
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            <Group justify="space-between" align="center" mt="xs">
              <Text size="xs" c="dimmed">
                แสดง {events.length} จาก {totalRecords.toLocaleString()} รายการ
              </Text>
              {totalPages > 1 && (
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={totalPages}
                  color="navy"
                  size="sm"
                  radius="md"
                  withEdges
                />
              )}
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
