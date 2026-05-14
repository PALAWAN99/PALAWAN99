'use client';

import { useState } from 'react';
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
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import isBetween from 'dayjs/plugin/isBetween';
import {
  IconId,
  IconRefresh,
  IconTrash,
  IconSearch,
  IconX,
  IconArrowDownLeft,
  IconArrowUpRight,
  IconFilter,
  IconDownload,
  IconCalendarEvent,
  IconChevronDown,
  IconSelector,
} from '@tabler/icons-react';

const DIRECTION_LABELS: Record<string, string> = {
  IN: 'เข้า',
  OUT: 'ออก',
};

const DECISION_LABELS: Record<string, string> = {
  ALLOWED: 'อนุญาต',
  DENIED: 'หมดอายุ',
};

const SOURCE_LABELS: Record<string, string> = {
  QR_CODE: 'QR Code',
  ID_CARD: 'บัตรประชาชน',
  MANUAL: 'กรอกเอง',
};

export default function HistoryClient() {
  dayjs.extend(isBetween);
  dayjs.locale('th');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const [logs, setLogs] = useState<any[]>([
    { 
      id: '1', 
      name: 'สมชาย รักชาติ', 
      cid: '1-1001-00xxx-xx-x', 
      scannedAt: '2026-04-30 11:20:15', 
      decision: 'ALLOWED', 
      direction: 'IN', 
      gate: 'ประตูหน้า (MAIN)',
      source: 'QR_CODE',
      fullData: { citizenId: '1-1001-00xxx-xx-x', fullNameTh: 'สมชาย รักชาติ', fullNameEn: 'Somchai Rakchart', birthDate: '01/01/1990', gender: 'ชาย', address: '123 ถ.สุขุมวิท กรุงเทพมหานคร', expireDate: '01/01/2030' } 
    },
    { 
      id: '2', 
      name: 'สมหญิง จริงใจ', 
      cid: '3-4501-00xxx-xx-x', 
      scannedAt: '2026-04-30 10:45:22', 
      decision: 'ALLOWED', 
      direction: 'IN', 
      gate: 'ทางเชื่อม BTS',
      source: 'ID_CARD',
      fullData: { citizenId: '3-4501-00xxx-xx-x', fullNameTh: 'สมหญิง จริงใจ', fullNameEn: 'Somying Jingjai', birthDate: '02/02/1992', gender: 'หญิง', address: '456 ถ.นิมมานเหมินท์ เชียงใหม่', expireDate: '02/02/2032' } 
    },
    { 
      id: '3', 
      name: 'Unknown User', 
      cid: '5-2201-00xxx-xx-x', 
      scannedAt: '2026-04-30 09:15:05', 
      decision: 'DENIED', 
      direction: 'IN', 
      gate: 'ประตูหน้า (MAIN)',
      source: 'QR_CODE',
      reason: 'QR Code Expired'
    },
    { 
      id: '4', 
      name: 'นาย ประหยัด เดินทาง', 
      cid: '1-1234-56789-00-1', 
      scannedAt: '2026-04-30 08:30:40', 
      decision: 'ALLOWED', 
      direction: 'OUT', 
      gate: 'ประตูหลัง (PARK)',
      source: 'MANUAL',
      fullData: { citizenId: '1-1234-56789-00-1', fullNameTh: 'นาย ประหยัด เดินทาง', fullNameEn: 'Mr. Prayad Derntang', birthDate: '10/10/1985', gender: 'ชาย', address: '789 หมู่ 4 ต.ในเมือง อ.เมือง จ.ขอนแก่น', expireDate: '10/10/2035' }
    },
  ]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !search || 
      log.name.toLowerCase().includes(search.toLowerCase()) || 
      log.cid.includes(search);
    
    let matchesDate = true;
    if (dateRange[0] && dateRange[1]) {
      const logDate = dayjs(log.scannedAt);
      matchesDate = logDate.isBetween(
        dayjs(dateRange[0]).startOf('day'), 
        dayjs(dateRange[1]).endOf('day'), 
        null, 
        '[]'
      );
    } else if (dateRange[0]) {
      const logDate = dayjs(log.scannedAt);
      matchesDate = logDate.isSame(dayjs(dateRange[0]), 'day');
    }

    return matchesSearch && matchesDate;
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>ประวัติการเข้า-ออก</Title>
          <Text size="sm" c="dimmed">
            ตรวจสอบประวัติการสแกนและเข้า-ออกของสมาชิกทั้งหมด
          </Text>
        </div>
      </Group>

      <Card withBorder radius="md">
        <Stack gap="md">
          <Group justify="space-between" align="flex-end">
            <Group align="flex-end" gap="xs" style={{ flex: 1 }}>
              <TextInput
                label="ค้นหา"
                placeholder="ชื่อสมาชิก, เลขบัตร..."
                leftSection={<IconSearch size={16} />}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                rightSection={
                  search ? (
                    <ActionIcon variant="transparent" color="gray" onClick={() => setSearch('')}>
                      <IconX size={14} />
                    </ActionIcon>
                  ) : null
                }
                style={{ flex: 1, maxWidth: 350 }}
              />
              <DatePickerInput
                label="ช่วงวันที่สแกน"
                placeholder="เลือกช่วงวันที่"
                type="range"
                locale="th"
                valueFormat="D MMM YYYY"
                leftSection={<IconCalendarEvent size={16} />}
                rightSection={<IconSelector size={16} color="gray" />}
                value={dateRange}
                onChange={setDateRange}
                clearable
                w={280}
              />
            </Group>
            
            <Group gap="xs">
              <Button variant="subtle" size="sm" color="gray" leftSection={<IconRefresh size={14} />}>
                รีเฟรช
              </Button>
              <Button variant="filled" color="skyBlue" leftSection={<IconDownload size={14} />}>
                ส่งออกรายงาน
              </Button>
            </Group>
          </Group>
          
          <Table.ScrollContainer minWidth={500}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>สมาชิก</Table.Th>
                  <Table.Th>จุดควบคุม (Gate)</Table.Th>
                  <Table.Th>เวลาสแกน</Table.Th>
                  <Table.Th>ทิศทาง</Table.Th>
                  <Table.Th>สถานะ</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredLogs.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar size="sm" color="blue" radius="xl">
                          {item.name.charAt(0)}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={500}>{item.name}</Text>
                          <Text size="xs" c="dimmed" ff="monospace">{item.cid}</Text>
                        </div>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{item.gate}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" fw={500}>{item.scannedAt}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={item.direction === 'IN' ? 'blue' : 'orange'} 
                        variant="light" 
                        leftSection={item.direction === 'IN' ? <IconArrowDownLeft size={10} /> : <IconArrowUpRight size={10} />}
                        size="sm"
                      >
                        {DIRECTION_LABELS[item.direction] || item.direction}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={item.decision === 'ALLOWED' ? 'green' : 'red'} 
                        variant="filled" 
                        size="sm"
                      >
                        {DECISION_LABELS[item.decision] || item.decision}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} justify="flex-end">
                        <Tooltip label="ดูรายละเอียด">
                          <ActionIcon variant="subtle" size="sm" onClick={() => setSelectedLog(item)}>
                            <IconId size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <ActionIcon variant="subtle" color="red" size="sm">
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
      </Card>

      <Modal
        opened={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={<Text fw={700}>รายละเอียดข้อมูล</Text>}
        centered
        size="lg"
        radius="md"
      >
        {selectedLog && (
          <Stack gap="md">
            <Group gap="xl">
              <Avatar size={100} radius="md" color="blue">
                <IconId size={60} />
              </Avatar>
              <Stack gap={2}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Citizen ID</Text>
                <Text fw={800} size="xl" c="skyBlue">
                  {selectedLog.fullData?.citizenId || selectedLog.cid}
                </Text>
                <Badge color={selectedLog.status === 'SUCCESS' ? 'green' : selectedLog.status === 'MANUAL' ? 'blue' : 'red'} variant="dot">
                  {selectedLog.status === 'SUCCESS' ? 'Thai National' : selectedLog.status === 'MANUAL' ? 'Manual Entry' : 'Failed / Unknown'}
                </Badge>
              </Stack>
            </Group>

            <Grid gutter="xs">
              <Grid.Col span={6}>
                <Paper p="xs" withBorder bg="var(--bg-secondary)">
                  <Text size="xs" c="dimmed">ชื่อ-นามสกุล (TH)</Text>
                  <Text fw={600}>
                    {selectedLog.fullData?.fullNameTh || selectedLog.name || '-'}
                  </Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={6}>
                <Paper p="xs" withBorder bg="var(--bg-secondary)">
                  <Text size="xs" c="dimmed">Full Name (EN)</Text>
                  <Text fw={600}>{selectedLog.fullData?.fullNameEn || '-'}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={4}>
                <Paper p="xs" withBorder bg="var(--bg-secondary)">
                  <Text size="xs" c="dimmed">วันเกิด</Text>
                  <Text fw={600}>{selectedLog.fullData?.birthDate || '-'}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={4}>
                <Paper p="xs" withBorder bg="var(--bg-secondary)">
                  <Text size="xs" c="dimmed">เพศ</Text>
                  <Text fw={600}>{selectedLog.fullData?.gender || '-'}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={4}>
                <Paper p="xs" withBorder bg="var(--bg-secondary)">
                  <Text size="xs" c="dimmed">วันหมดอายุ</Text>
                  <Text fw={600} color="red">{selectedLog.fullData?.expireDate || '-'}</Text>
                </Paper>
              </Grid.Col>
              <Grid.Col span={12}>
                <Paper p="xs" withBorder bg="var(--bg-secondary)">
                  <Text size="xs" c="dimmed">ที่อยู่</Text>
                  <Text size="sm">{selectedLog.fullData?.address || '-'}</Text>
                </Paper>
              </Grid.Col>
            </Grid>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}
