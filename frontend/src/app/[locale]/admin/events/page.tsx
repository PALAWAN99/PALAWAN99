'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { 
  Title, Text, Stack, Card, Table, Badge, Group, 
  TextInput, ActionIcon, Menu, Button, Pagination, 
  Box, LoadingOverlay, Center
} from '@mantine/core';
import { 
  IconSearch, IconDotsVertical, 
  IconDownload, IconChevronRight, IconX, IconCalendar
} from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

interface AccessEventGate {
  nameTh: string;
  gateCode: string;
}

interface AccessEventMember {
  firstNameTh: string;
  lastNameTh: string;
  memberNo: string;
  memberType: string;
}

interface AccessEvent {
  id: string;
  scannedAt: string;
  direction: 'IN' | 'OUT';
  decision: 'ALLOWED' | 'DENIED';
  reasonCode: string | null;
  member: AccessEventMember | null;
  gate: AccessEventGate;
}

export default function EventsPage() {
  const t = useTranslations('Events');
  const searchParams = useSearchParams();
  const initialGateId = searchParams.get('gateId') || '';
  
  const [events, setEvents] = useState<AccessEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        gateId: initialGateId,
        startDate,
        endDate
      });
      const res = await fetch(`/api/admin/events?${params.toString()}`);
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Fetch events error:', error);
    } finally {
      setLoading(false);
    }
  }, [search, page, initialGateId, startDate, endDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEvents();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchEvents]);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        search,
        gateId: initialGateId,
        startDate,
        endDate,
        limit: '1000' // ดึงเยอะหน่อยเพื่อส่งออก
      });
      const res = await fetch(`/api/admin/events?${params.toString()}`);
      const data = await res.json();
      
      if (data.events) {
        const { exportToExcel } = await import('@/lib/export-utils');
        const exportData = data.events.map((e: AccessEvent) => ({
          'เวลา': new Date(e.scannedAt).toLocaleString('th-TH'),
          'ชื่อ-นามสกุล': e.member ? `${e.member.firstNameTh} ${e.member.lastNameTh}` : 'ไม่ทราบชื่อ',
          'รหัสสมาชิก': e.member?.memberNo || '-',
          'ประเภท': e.member?.memberType || '-',
          'ประตู': e.gate.nameTh,
          'รหัสประตู': e.gate.gateCode,
          'ทิศทาง': e.direction === 'IN' ? 'เข้า' : 'ออก',
          'ผลการตรวจสอบ': e.decision === 'ALLOWED' ? 'ผ่าน' : 'ปฏิเสธ',
          'เหตุผล': e.reasonCode || '-'
        }));
        exportToExcel(exportData, 'AccessLogs');
      }
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Title order={2} fw={800}>{t('title')}</Title>
          <Text c="dimmed" size="sm">{t('subtitle')}</Text>
        </Stack>
        <Button variant="light" leftSection={<IconDownload size={16} />} onClick={handleExport}>{t('exportExcel')}</Button>
      </Group>

      <Card withBorder p="md" radius="lg">
        <Stack gap="md">
          <Group grow wrap="wrap">
            <TextInput 
              placeholder={t('searchPlaceholder')} 
              leftSection={<IconSearch size={16} />} 
              variant="filled"
              value={search}
              onChange={(e) => { setSearch(e.currentTarget.value); setPage(1); }}
              style={{ minWidth: '300px' }}
            />
            <Group gap="xs">
              <TextInput 
                type="date"
                placeholder={t('startDate')}
                leftSection={<IconCalendar size={16} />}
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                w={160}
              />
              <TextInput 
                type="date"
                placeholder={t('endDate')}
                leftSection={<IconCalendar size={16} />}
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                w={160}
              />
              {(search || startDate || endDate) && (
                <ActionIcon variant="light" color="gray" size="lg" onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); }}>
                  <IconX size={18} />
                </ActionIcon>
              )}
            </Group>
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="lg" p={0} style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading} />
        <Table.ScrollContainer minWidth={900}>
          <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
            <Table.Thead bg="var(--bg-secondary)">
              <Table.Tr>
                <Table.Th>{t('time')}</Table.Th>
                <Table.Th>{t('member')}</Table.Th>
                <Table.Th>{t('gate')}</Table.Th>
                <Table.Th ta="center">{t('direction')}</Table.Th>
                <Table.Th ta="center">{t('result')}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <Table.Tr key={event.id}>
                    <Table.Td>
                      <Text size="sm" fw={600}>{new Date(event.scannedAt).toLocaleTimeString('th-TH')}</Text>
                      <Text size="xs" c="dimmed">{new Date(event.scannedAt).toLocaleDateString('th-TH')}</Text>
                    </Table.Td>
                    <Table.Td>
                      {event.member ? (
                        <>
                          <Text size="sm" fw={700}>{event.member.firstNameTh} {event.member.lastNameTh}</Text>
                          <Text size="xs" c="dimmed">{event.member.memberNo}</Text>
                        </>
                      ) : <Text c="dimmed italic">{t('unknownMember')}</Text>}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600}>{event.gate.nameTh}</Text>
                      <Text size="xs" c="dimmed">{event.gate.gateCode}</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge color={event.direction === 'IN' ? 'teal' : 'blue'} variant="light">
                        {event.direction === 'IN' ? t('in') : t('out')}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge color={event.decision === 'ALLOWED' ? 'green' : 'red'} variant="filled">
                        {event.decision === 'ALLOWED' ? t('allowed') : t('denied')}
                      </Badge>
                      {event.reasonCode && <Text size="xs" c="red" mt={2}>{event.reasonCode}</Text>}
                    </Table.Td>
                    <Table.Td>
                       <Group justify="flex-end">
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={18} /></ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item leftSection={<IconChevronRight size={14} />}>{t('details')}</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                       </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={6} py={50}>
                    <Center><Text c="dimmed">{t('noData')}</Text></Center>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Box p="md" style={{ borderTop: '1px solid var(--border-color)' }}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">{t('totalItems', { total })}</Text>
            <Pagination total={totalPages} value={page} onChange={setPage} color="skyBlue" radius="md" />
          </Group>
        </Box>
      </Card>
    </Stack>
  );
}
