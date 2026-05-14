'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Container, Grid, Paper, Text, Title, Group, Badge, Table, ScrollArea, ActionIcon, Stack, Card, RingProgress, ThemeIcon, Box, SimpleGrid, Center, Button, TextInput
} from '@mantine/core';
import {
  IconDoorEnter, IconDoorExit, IconAlertCircle, IconCheck, IconX, IconRefresh, IconActivity, IconLock, IconLockOpen, IconWalk, IconScan
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useCallback } from 'react';

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

interface ScanResult {
  isValid: boolean;
  message: string;
  member?: {
    firstNameTh: string;
    lastNameTh: string;
    memberType: string;
  };
}

export default function GateDashboard() {
  const t = useTranslations();
  
  // Dev1 states (QR Scanner)
  const [token, setToken] = useState('');
  const [direction, setDirection] = useState<'IN' | 'OUT'>('IN');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  // Dev2 states (Dashboard)
  const [events, setEvents] = useState<AccessEvent[]>([]);
  const [stats, setStats] = useState({ todayIn: 0, todayOut: 0, denied: 0 });
  const [gateInfo, setGateInfo] = useState<{ id?: string; name: string; branch: string; gateCode: string; isOpen?: boolean; isOnline?: boolean }>({ name: 'Loading...', branch: '...', gateCode: '' });

  // 1. Fetch first gate info (Dev1 logic)
  useEffect(() => {
    fetch('/api/admin/gates')
      .then(res => res.json())
      .then(data => {
        if (data?.data && data.data.length > 0) {
           setGateInfo(prev => ({ ...prev, id: data.data[0].id, gateCode: data.data[0].gateCode }));
        } else if (data && data.length > 0) {
           setGateInfo(prev => ({ ...prev, id: data[0].id, gateCode: data[0].gateCode }));
        }
      });
  }, []);

  // 2. Fetch Dashboard stats periodically (Dev2 logic)
  const fetchDashboard = useCallback(async (signal?: AbortSignal) => {
    if (!gateInfo.gateCode) return;
    try {
      const response = await fetch(`/api/gate/dashboard?gateCode=${gateInfo.gateCode}`, { signal });
      if (!response.ok) return;
      const json = await response.json();
      if (json.data) {
        setEvents(json.data.recentEvents || []);
        setStats(json.data.stats || { todayIn: 0, todayOut: 0, denied: 0 });
        setGateInfo(prev => ({ ...prev, ...json.data.gate }));
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Fetch Error:', error);
      }
    }
  }, [gateInfo.gateCode]);

  useEffect(() => {
    if (!gateInfo.gateCode) return;
    const controller = new AbortController();
    
    fetchDashboard(controller.signal);
    const interval = setInterval(() => fetchDashboard(controller.signal), 30000); // Increased interval to reduce load
    
    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [gateInfo.gateCode, fetchDashboard]);

  // Dev1 logic: QR Scan
  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token || !gateInfo.id) return;

    setScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/qr/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, gateId: gateInfo.id, direction, deviceCode: 'SCANNER-01' }),
      });

      const data = await res.json();
      const isValid = data.data?.decision === 'ALLOWED' || data.decision === 'ALLOWED';
      
      setScanResult({
         isValid,
         message: data.message || data.data?.message || 'Processed',
         member: data.data?.member
      });

      if (isValid) {
        setToken(''); // Clear token for next scan
      }
      fetchDashboard(); // Refresh instantly
    } catch {
      notifications.show({ title: 'Error', message: t('Common.error'), color: 'red' });
    } finally {
      setScanning(false);
    }
  };

  // Dev2 logic: Manual Gate Control
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
        fetchDashboard();
      }
    } catch (error) {
      console.error('Control Error:', error);
    }
  };

  // Dev2 logic: Sensor Simulate
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
        fetchDashboard();
      }
    } catch (error) {
      console.error('Sensor Error:', error);
    }
  };

  return (
    <Box style={{ background: '#f8f9fa', minHeight: '100vh', padding: '24px' }}>
      <Container size="xl">
        <Stack gap="lg">
          {/* Header */}
          <Group justify="space-between">
            <div>
              <Title order={2} c="blue.9">Gate Operational Dashboard</Title>
              <Text c="dimmed" size="sm">Gate: {gateInfo.name} · Branch: {gateInfo.branch}</Text>
            </div>
            <Group>
              <Badge size="lg" color={gateInfo.isOnline ? "green" : "gray"} variant="light" leftSection={<IconActivity size={14} />}>
                {gateInfo.isOnline ? "System Online" : "System Offline"}
              </Badge>
              <ActionIcon variant="light" size="lg" onClick={fetchDashboard}>
                <IconRefresh size={20} />
              </ActionIcon>
            </Group>
          </Group>

          {/* Stats Cards */}
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Paper p="md" withBorder radius="md">
              <Group>
                <ThemeIcon size={48} radius="md" color="teal" variant="light"><IconDoorEnter size={30} /></ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Entry Today</Text>
                  <Text fw={700} size="xl">{stats.todayIn}</Text>
                </div>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group>
                <ThemeIcon size={48} radius="md" color="blue" variant="light"><IconDoorExit size={30} /></ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={700} tt="uppercase">Exit Today</Text>
                  <Text fw={700} size="xl">{stats.todayOut}</Text>
                </div>
              </Group>
            </Paper>

            <Paper p="md" withBorder radius="md">
              <Group>
                <ThemeIcon size={48} radius="md" color="red" variant="light"><IconAlertCircle size={30} /></ThemeIcon>
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
              <Stack gap="lg">
                {/* QR Scanner (from Dev1) */}
                <Paper p="xl" radius="md" withBorder shadow="sm">
                  <form onSubmit={handleScan}>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Title order={4}>{t('Gate.scanPrompt')}</Title>
                        <Group>
                          <Button variant={direction === 'IN' ? 'filled' : 'light'} color="teal" onClick={() => setDirection('IN')} size="xs">IN</Button>
                          <Button variant={direction === 'OUT' ? 'filled' : 'light'} color="orange" onClick={() => setDirection('OUT')} size="xs">OUT</Button>
                        </Group>
                      </Group>
                      <TextInput
                        size="xl"
                        placeholder={t('Gate.scanPlaceholder')}
                        leftSection={<IconScan size={24} />}
                        value={token}
                        onChange={(e) => setToken(e.currentTarget.value)}
                        autoFocus
                        styles={{ input: { textAlign: 'center', fontSize: '24px', letterSpacing: '2px' } }}
                      />
                      <Button size="lg" fullWidth type="submit" loading={scanning} color="skyBlue">
                        {t('Gate.validate')}
                      </Button>
                    </Stack>
                  </form>
                  {scanResult && (
                    <Box mt="md" p="sm" style={{ background: scanResult.isValid ? '#dcfce7' : '#fee2e2', borderRadius: '8px' }}>
                       <Group justify="center">
                         {scanResult.isValid ? <IconCheck color="green" /> : <IconX color="red" />}
                         <Text fw={700} c={scanResult.isValid ? "green.9" : "red.9"}>{scanResult.message}</Text>
                       </Group>
                    </Box>
                  )}
                </Paper>

                {/* Recent Scans (from Dev2) */}
                <Paper p="md" withBorder radius="md">
                  <Title order={4} mb="md">Recent Scans</Title>
                  <ScrollArea h={300}>
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
                              <Text fw={500} size="sm">{event.member?.firstNameTh} {event.member?.lastNameTh}</Text>
                              <Text size="xs" c="dimmed">{event.member?.memberNo || '-'}</Text>
                            </Table.Td>
                            <Table.Td>
                              <Badge variant="dot" color={event.direction === 'IN' ? 'teal' : 'blue'}>
                                {event.direction}
                              </Badge>
                            </Table.Td>
                            <Table.Td>
                              {event.decision === 'ALLOWED' ? (
                                <Group gap={4} c="green"><IconCheck size={16} /><Text size="sm" fw={500}>PASS</Text></Group>
                              ) : (
                                <Group gap={4} c="red"><IconX size={16} /><Text size="sm" fw={500}>DENIED</Text></Group>
                              )}
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                </Paper>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack>
                {/* Status Card (from Dev2) */}
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

                {/* Manual Control (from Dev2) */}
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
