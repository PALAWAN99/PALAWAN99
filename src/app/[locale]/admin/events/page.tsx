'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Title, Text, Stack, Card, Table, Badge, Group, TextInput, ActionIcon, Menu, Button, Pagination, Box } from '@mantine/core';
import { IconSearch, IconFilter, IconDotsVertical, IconDownload, IconChevronRight, IconX } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

const LOGS = [
  { id: 1, time: '2024-04-30 10:28:45', member: 'สมชาย รักเรียน', type: 'Employee', gate: 'Main Entrance', dir: 'IN', status: 'ALLOWED' },
  { id: 2, time: '2024-04-30 10:25:12', member: 'John Smith', type: 'Visitor', gate: 'Side Exit', dir: 'OUT', status: 'ALLOWED' },
  { id: 3, time: '2024-04-30 10:22:05', member: '王小明', type: 'VIP', gate: 'Main Entrance', dir: 'IN', status: 'ALLOWED' },
  { id: 4, time: '2024-04-30 10:18:30', member: 'สมหญิง ใจดี', type: 'Employee', gate: 'Back Yard', dir: 'IN', status: 'DENIED' },
  { id: 5, time: '2024-04-30 10:15:22', member: 'อำนาจ จิตต์ดี', type: 'Employee', gate: 'Main Entrance', dir: 'OUT', status: 'ALLOWED' },
  { id: 6, time: '2024-04-30 10:12:10', member: 'Sarah Wilson', type: 'Contractor', gate: 'Side Exit', dir: 'IN', status: 'ALLOWED' },
  { id: 7, time: '2024-04-30 10:10:05', member: 'วิชัย กล้าหาญ', type: 'Employee', gate: 'Main Entrance', dir: 'IN', status: 'ALLOWED' },
];

import { EmptyState } from '@/components/ui/EmptyState';
import { IconSearchOff } from '@tabler/icons-react';

export default function EventsPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const gateFilter = searchParams.get('gate');
  const [search, setSearch] = useState('');

  // กรองข้อมูลจำลองตาม Gate และคำค้นหา (Search)
  const filteredLogs = LOGS.filter(log => {
    const matchesGate = gateFilter ? log.gate.toLowerCase().includes(gateFilter.toLowerCase()) : true;
    const matchesSearch = search 
      ? log.member.toLowerCase().includes(search.toLowerCase()) || 
        log.gate.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesGate && matchesSearch;
  });

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Stack gap={4}>
          <Title order={2} fw={800}>{t('Common.events')}</Title>
          <Group gap="xs">
            <Text c="dimmed" size="sm">Audit trail for all gate activities across the system.</Text>
            {gateFilter && (
              <Badge 
                color="skyBlue" 
                variant="light" 
                size="sm" 
                radius="sm"
                rightSection={<Link href="/admin/events" style={{ display: 'flex', color: 'inherit' }}><IconX size={12} style={{ cursor: 'pointer' }} /></Link>}
              >
                Filtered: {gateFilter}
              </Badge>
            )}
          </Group>
        </Stack>
        <Button variant="light" leftSection={<IconDownload size={16} />}>Export All Logs</Button>
      </Group>

      <Card withBorder p={0} radius="lg" style={{ overflow: 'hidden' }}>
        <Box p="md" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <Group justify="space-between">
            <TextInput 
              placeholder={t('Common.search')} 
              leftSection={<IconSearch size={16} />} 
              w={300}
              variant="filled"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
            />
            <Button variant="subtle" color="gray" leftSection={<IconFilter size={16} />}>Filters</Button>
          </Group>
        </Box>

        {filteredLogs.length > 0 ? (
          <>
            <Table verticalSpacing="md" horizontalSpacing="md" highlightOnHover>
              <Table.Thead bg="var(--bg-secondary)">
                <Table.Tr>
                  <Table.Th style={{ color: 'var(--text-muted)' }}>TIMESTAMP</Table.Th>
                  <Table.Th style={{ color: 'var(--text-muted)' }}>MEMBER NAME</Table.Th>
                  <Table.Th style={{ color: 'var(--text-muted)' }}>GATE</Table.Th>
                  <Table.Th style={{ color: 'var(--text-muted)' }} ta="center">DIRECTION</Table.Th>
                  <Table.Th style={{ color: 'var(--text-muted)' }} ta="center">STATUS</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredLogs.map((log) => (
                  <Table.Tr key={log.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{log.time.split(' ')[1]}</Text>
                      <Text size="xs" c="dimmed">{log.time.split(' ')[0]}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={700}>{log.member}</Text>
                      <Badge size="xs" variant="light" color="gray">{log.type}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>{log.gate}</Text>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge 
                        color={log.dir === 'IN' ? 'teal' : 'blue'} 
                        variant="light" 
                        radius="sm"
                      >
                        {log.dir}
                      </Badge>
                    </Table.Td>
                    <Table.Td ta="center">
                      <Badge 
                        color={log.status === 'ALLOWED' ? 'emerald' : 'red'} 
                        variant="filled" 
                        radius="xl"
                      >
                        {log.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group justify="flex-end">
                        <ActionIcon variant="subtle" color="gray"><IconChevronRight size={18} /></ActionIcon>
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={18} /></ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item>View Member Profile</Menu.Item>
                            <Menu.Item>View Gate Details</Menu.Item>
                            <Menu.Item color="red">Flag Event</Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>

            <Box p="md" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">Showing {filteredLogs.length} of 1,543 results</Text>
                <Pagination total={10} radius="md" />
              </Group>
            </Box>
          </>
        ) : (
          <EmptyState 
            icon={<IconSearchOff size={48} stroke={1} />}
            title="No activity found"
            description={`We couldn't find any gate activity for "${gateFilter}". Try clearing the filter to see all events.`}
          />
        )}
      </Card>
    </Stack>
  );
}
