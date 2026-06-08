'use client';

import { useState, useEffect, useCallback } from 'react';
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
} from '@mantine/core';
import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconRefresh,
  IconX,
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
  source?: 'pennueng' | 'postgres';
  hourStr?: string;
  dateStr?: string;
}

interface DashboardDrillDownModalProps {
  filters: DrillDownFilters | null;
  onClose: () => void;
}

export function DashboardDrillDownModal({ filters, onClose }: DashboardDrillDownModalProps) {
  const t = useTranslations('History');
  const tc = useTranslations('Common');
  
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchEvents = useCallback(async () => {
    if (!filters) return;
    setLoading(true);
    setError(null);

    try {
      const endpoint = filters.source === 'pennueng' ? '/api/admin/history' : '/api/admin/events';

      const queryParams = new URLSearchParams({
        page: String(page),
      });

      if (filters.gateId) queryParams.set('gateId', filters.gateId);
      if (filters.decision) queryParams.set('decision', filters.decision);
      if (filters.direction) queryParams.set('direction', filters.direction);
      if (filters.memberType) queryParams.set('memberType', filters.memberType);
      if (filters.search) queryParams.set('search', filters.search);

      if (filters.source === 'pennueng') {
        // /api/admin/history ต้องการ YYYY-MM-DD เท่านั้น (zod regex)
        if (filters.startDate) {
          const sd = filters.startDate.includes('T')
            ? filters.startDate.slice(0, 10)
            : filters.startDate;
          queryParams.set('startDate', sd);
        }
        if (filters.endDate) {
          const ed = filters.endDate.includes('T')
            ? filters.endDate.slice(0, 10)
            : filters.endDate;
          queryParams.set('endDate', ed);
        }
        queryParams.set('pageSize', '10');
      } else {
        if (filters.startDate) queryParams.set('startDate', filters.startDate);
        if (filters.endDate) queryParams.set('endDate', filters.endDate);
        queryParams.set('limit', '10');
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
  }, [filters, page, tc]);

  useEffect(() => {
    if (filters) {
      setPage(1);
      // Wait for page reset before fetching
    }
  }, [filters]);

  useEffect(() => {
    if (filters) {
      fetchEvents();
    }
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
          <Text size="xs" c="dimmed">
            พบข้อมูลทั้งหมด {totalRecords.toLocaleString()} รายการ
          </Text>
        </Stack>
      }
      size="xl"
      radius="lg"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
    >
      <Stack gap="md" mt="sm">
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
            <Text c="dimmed" size="sm">
              {tc('noData')}
            </Text>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={600}>
              <Table verticalSpacing="sm" highlightOnHover>
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

            {totalPages > 1 && (
              <Group justify="center" mt="xs">
                <Pagination
                  value={page}
                  onChange={setPage}
                  total={totalPages}
                  color="navy"
                  size="sm"
                  radius="md"
                  withEdges
                />
              </Group>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
}
