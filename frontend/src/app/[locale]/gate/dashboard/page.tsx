'use client';

import { useState, useEffect } from 'react';
import {
  Alert,
  Container,
  Grid,
  Paper,
  Text,
  Title,
  Group,
  Badge,
  Table,
  ScrollArea,
  ActionIcon,
  Stack,
  Card,
  RingProgress,
  ThemeIcon,
  Box,
  SimpleGrid,
  Center,
  Button,
} from '@mantine/core';
import {
  IconDoorEnter,
  IconDoorExit,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconRefresh,
  IconActivity,
  IconLock,
  IconLockOpen,
  IconWalk,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { unwrapApiData } from '@/lib/parse-api-response';

interface AccessEvent {
  id: string;
  member: {
    firstNameTh: string;
    lastNameTh: string;
    memberNo: string;
  };
  direction: 'IN' | 'OUT';
  decision: 'ALLOWED' | 'DENIED';
  scannedAt: string;
}

const GATE_CODE = 'G-MAIN-01';

const EMPTY_GATE_STATE = {
  id: undefined as string | undefined,
  name: 'ยังไม่ได้กำหนดประตู',
  branch: '—',
  isOpen: false,
  isOnline: false,
};

type GateDashboardData = {
  gate: {
    id: string;
    name: string;
    branch: string;
    isOpen?: boolean;
    isOnline?: boolean;
  };
  stats: { todayIn: number; todayOut: number; todayDenied: number };
  recentEvents: AccessEvent[];
};

async function seedDevGateData(): Promise<boolean> {
  const res = await fetch('/api/test-setup');
  return res.ok;
}

export default function GateDashboard() {
  const [events, setEvents] = useState<AccessEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [gateNotFound, setGateNotFound] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [stats, setStats] = useState({
    todayIn: 0,
    todayOut: 0,
    denied: 0,
  });
  const [gateInfo, setGateInfo] = useState<{
    id?: string;
    name: string;
    branch: string;
    isOpen?: boolean;
    isOnline?: boolean;
  }>({ name: 'Loading...', branch: '...' });

  const fetchEvents = async (options?: { retryAfterSeed?: boolean }) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/gate/dashboard?gateCode=${GATE_CODE}`);
      const payload = await response.json();

      if (!response.ok) {
        const isMissingGate = response.status === 404;

        if (isMissingGate) {
          // ประตูยังไม่ถูกสร้าง — ลอง seed ข้อมูลใน dev mode
          if (!options?.retryAfterSeed && process.env.NODE_ENV === 'development') {
            const seeded = await seedDevGateData();
            if (seeded) {
              await fetchEvents({ retryAfterSeed: true });
              return;
            }
          }
          // แสดง empty state แทน error
          setGateNotFound(true);
          setGateInfo(EMPTY_GATE_STATE);
          setFetchError(null);
          return;
        }

        const message =
          (payload as { error?: { message?: string } })?.error?.message ??
          'ไม่สามารถโหลดข้อมูลประตูได้';
        throw new Error(message);
      }

      const data = unwrapApiData<GateDashboardData>(payload);
      setGateNotFound(false);
      setEvents(data.recentEvents ?? []);
      setStats({
        todayIn: data.stats?.todayIn ?? 0,
        todayOut: data.stats?.todayOut ?? 0,
        denied: data.stats?.todayDenied ?? 0,
      });
      setGateInfo(data.gate);
      setFetchError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลได้';
      setFetchError(message);
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      const ok = await seedDevGateData();
      if (!ok) throw new Error('สร้างข้อมูลทดสอบไม่สำเร็จ');
      notifications.show({
        title: 'สำเร็จ',
        message: `สร้างประตู ${GATE_CODE} และข้อมูลตัวอย่างแล้ว`,
        color: 'green',
      });
      await fetchEvents({ retryAfterSeed: true });
    } catch (error) {
      notifications.show({
        title: 'ผิดพลาด',
        message: error instanceof Error ? error.message : 'สร้างข้อมูลทดสอบไม่สำเร็จ',
        color: 'red',
      });
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleControl = async (action: 'OPEN' | 'CLOSE') => {
    if (!gateInfo.id) return;
    try {
      const response = await fetch('/api/gate/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateId: gateInfo.id, action }),
      });
      if (response.ok) {
        notifications.show({
          title: 'Success',
          message: `Gate ${action === 'OPEN' ? 'opened' : 'closed'} manually`,
          color: action === 'OPEN' ? 'blue' : 'red',
        });
        fetchEvents();
      }
    } catch (error) {
      console.error('Control Error:', error);
    }
  };

  const handleSimulatePass = async () => {
    if (!gateInfo.id) return;
    try {
      const response = await fetch('/api/gate/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gateId: gateInfo.id }),
      });
      if (response.ok) {
        notifications.show({
          title: 'Sensor Triggered',
          message: 'Person passed through, gate closing...',
          color: 'gray',
          icon: <IconWalk size={16} />,
        });
        fetchEvents();
      }
    } catch (error) {
      console.error('Sensor Error:', error);
    }
  };

  return (
    <Box style={{ background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <Container size="xl">
        <Stack gap="lg">
          {gateNotFound && (
            <Alert color="yellow" title={`ไม่พบประตู: ${GATE_CODE}`} variant="light" icon={<IconAlertCircle size={18} />}>
              <Stack gap="sm">
                <Text size="sm">
                  ยังไม่มีประตูนี้ในฐานข้อมูล กรุณาสร้างประตูในหน้า
                  {' '}<strong>การจัดการระบบ → ประตู</strong>{' '}
                  แล้วใช้ Gate Code: <strong>{GATE_CODE}</strong>
                </Text>
                {process.env.NODE_ENV === 'development' && (
                  <Button size="xs" variant="light" loading={seeding} onClick={handleSeedData} w="fit-content">
                    สร้างข้อมูลทดสอบ ({GATE_CODE})
                  </Button>
                )}
              </Stack>
            </Alert>
          )}

          {fetchError && (
            <Alert color="red" title="โหลดข้อมูลไม่สำเร็จ" variant="light">
              <Text size="sm">{fetchError}</Text>
            </Alert>
          )}

          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2} c="blue.9">Gate Operational Dashboard</Title>
              <Text c="dimmed" size="sm">Gate: {gateInfo.name} · Branch: {gateInfo.branch}</Text>
            </div>
            <Group>
              <Badge size="lg" color="green" variant="light" leftSection={<IconActivity size={14} />}>
                System Online
              </Badge>
              <ActionIcon variant="light" size="lg" onClick={() => void fetchEvents()}>
                <IconRefresh size={20} />
              </ActionIcon>
            </Group>
          </Group>

          {/* Stats Cards */}
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Paper p="md" withBorder radius="md">
              <Group>
                <ThemeIcon size={48} radius="md" color="teal" variant="light">
                  <IconDoorEnter size={30} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Entry Today</Text>
                  <Text fw={700} size="xl">{stats.todayIn}</Text>
                </div>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group>
                <ThemeIcon size={48} radius="md" color="blue" variant="light">
                  <IconDoorExit size={30} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Exit Today</Text>
                  <Text fw={700} size="xl">{stats.todayOut}</Text>
                </div>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group>
                <ThemeIcon size={48} radius="md" color="red" variant="light">
                  <IconAlertCircle size={30} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Access Denied</Text>
                  <Text fw={700} size="xl">{stats.denied}</Text>
                </div>
              </Group>
            </Paper>
          </SimpleGrid>

          {/* Main Content */}
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper p="md" withBorder radius="md">
                <Title order={4} mb="md">Recent Scans</Title>
                <ScrollArea h={400}>
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Time</Table.Th>
                        <Table.Th>Member</Table.Th>
                        <Table.Th>Direction</Table.Th>
                        <Table.Th>Status</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {events.map((event) => (
                        <Table.Tr key={event.id}>
                          <Table.Td>
                            <Text size="sm">{new Date(event.scannedAt).toLocaleTimeString()}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={500} size="sm">{event.member.firstNameTh} {event.member.lastNameTh}</Text>
                            <Text size="xs" c="dimmed">{event.member.memberNo}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge variant="dot" color={event.direction === 'IN' ? 'teal' : 'blue'}>
                              {event.direction}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            {event.decision === 'ALLOWED' ? (
                              <Group gap={4} c="green">
                                <IconCheck size={16} />
                                <Text size="sm" fw={500}>PASS</Text>
                              </Group>
                            ) : (
                              <Group gap={4} c="red">
                                <IconX size={16} />
                                <Text size="sm" fw={500}>DENIED</Text>
                              </Group>
                            )}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack>
                <Card withBorder radius="md" p="xl">
                  <Text fw={700} size="lg" mb="md">Current Status</Text>
                  <Center>
                    <RingProgress
                      size={180}
                      thickness={16}
                      roundCaps
                      sections={[{ value: 100, color: gateInfo.isOpen ? 'blue' : 'green' }]}
                      label={
                        <Center>
                          {gateInfo.isOpen ? (
                            <IconLockOpen size={40} color="var(--mantine-color-blue-filled)" />
                          ) : (
                            <IconCheck size={40} color="var(--mantine-color-green-filled)" />
                          )}
                        </Center>
                      }
                    />
                  </Center>
                  <Text ta="center" fw={700} size="xl" mt="md" c={gateInfo.isOpen ? 'blue' : 'green'}>
                    {gateInfo.isOpen ? 'GATE OPEN' : 'GATE SECURE'}
                  </Text>
                  <Text ta="center" size="sm" c="dimmed">
                    {gateInfo.isOpen ? 'Gate is currently open for passage' : 'All scanners working normally'}
                  </Text>
                </Card>

                <Paper withBorder p="md" radius="md">
                  <Title order={5} mb="sm">Manual Control</Title>
                  <Stack gap="xs">
                    {gateInfo.isOpen ? (
                      <Button fullWidth variant="filled" color="red" leftSection={<IconLock size={16} />} onClick={() => handleControl('CLOSE')}>
                        Close Gate
                      </Button>
                    ) : (
                      <Button fullWidth variant="filled" color="blue" leftSection={<IconLockOpen size={16} />} onClick={() => handleControl('OPEN')}>
                        Open Gate (Manual)
                      </Button>
                    )}
                    
                    <Button 
                      fullWidth 
                      variant="light" 
                      color="gray" 
                      leftSection={<IconWalk size={16} />} 
                      disabled={!gateInfo.isOpen}
                      onClick={handleSimulatePass}
                    >
                      Simulate Person Passing
                    </Button>
                    
                    <Button fullWidth variant="subtle" color="red" size="xs" mt="sm">Emergency Lockdown</Button>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
