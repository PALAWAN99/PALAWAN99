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
import {
  IconId,
  IconRefresh,
  IconTrash,
  IconSearch,
  IconX,
} from '@tabler/icons-react';

export default function HistoryClient() {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [search, setSearch] = useState('');

  const [logs, setLogs] = useState<any[]>([
    { id: '1', name: 'สมชาย รักชาติ', cid: '1-1001-00xxx-xx-x', time: '2026-04-30 11:20', status: 'SUCCESS', type: 'ENTRY', fullData: { citizenId: '1-1001-00xxx-xx-x', fullNameTh: 'สมชาย รักชาติ', fullNameEn: 'Somchai Rakchart', birthDate: '01/01/1990', gender: 'ชาย', address: '123 ถ.สุขุมวิท กรุงเทพมหานคร', expireDate: '01/01/2030' } },
    { id: '2', name: 'สมหญิง จริงใจ', cid: '3-4501-00xxx-xx-x', time: '2026-04-30 10:45', status: 'SUCCESS', type: 'ENTRY', fullData: { citizenId: '3-4501-00xxx-xx-x', fullNameTh: 'สมหญิง จริงใจ', fullNameEn: 'Somying Jingjai', birthDate: '02/02/1992', gender: 'หญิง', address: '456 ถ.นิมมานเหมินท์ เชียงใหม่', expireDate: '02/02/2032' } },
    { id: '3', name: 'Unknown', cid: '5-2201-00xxx-xx-x', time: '2026-04-30 09:15', status: 'FAILED', type: 'EXIT' },
  ]);

  const filteredLogs = logs.filter(log => 
    !search || 
    log.name.toLowerCase().includes(search.toLowerCase()) || 
    log.cid.includes(search)
  );

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
          <Group justify="space-between">
            <TextInput
              placeholder="ค้นหาชื่อ, เลขบัตร..."
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
              w={300}
            />
            <Button variant="subtle" size="sm" leftSection={<IconRefresh size={14} />}>
              ล้างประวัติ
            </Button>
          </Group>
          
          <Table.ScrollContainer minWidth={500}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>ชื่อ-นามสกุล</Table.Th>
                  <Table.Th>เลขบัตร</Table.Th>
                  <Table.Th>เวลา</Table.Th>
                  <Table.Th>ประเภท</Table.Th>
                  <Table.Th>สถานะ</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredLogs.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>{item.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" ff="monospace">{item.cid}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="xs" c="dimmed">{item.time}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={item.type === 'ENTRY' ? 'blue' : 'orange'} variant="outline" size="sm">
                        {item.type}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={item.status === 'SUCCESS' ? 'green' : 'red'} 
                        variant="light" 
                        size="sm"
                      >
                        {item.status}
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
