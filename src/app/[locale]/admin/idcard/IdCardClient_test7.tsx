'use client';

import { useState, useEffect } from 'react';
import {
  Title,
  Text,
  Stack,
  Card,
  Button,
  Group,
  Badge,
  Tabs,
  Table,
  ActionIcon,
  Alert,
  Paper,
  Grid,
  Divider,
  Avatar,
  Box,
  Center,
  Loader,
  Tooltip,
  TextInput,
  SegmentedControl,
  Modal,
  Select,
} from '@mantine/core';
import { QRCodeSVG } from 'qrcode.react';
import {
  IconDeviceUsb,
  IconRefresh,
  IconId,
  IconHistory,
  IconSettings,
  IconAlertCircle,
  IconCheck,
  IconUserPlus,
  IconTrash,
} from '@tabler/icons-react';
import { ThaiIdCardReader, ThaiIdData } from '@/lib/idcard/reader';

const PREFIX_MAP: Record<string, string> = {
  'เธเธฒเธข': 'Mr.',
  'เธเธฒเธ': 'Mrs.',
  'เธเธฒเธเธชเธฒเธง': 'Ms.',
  'เน€เธ”เนเธเธเธฒเธข': 'Master',
  'เน€เธ”เนเธเธซเธเธดเธ': 'Miss',
};

export default function IdCardClient() {
  const [activeTab, setActiveTab] = useState<string | null>('register');
  const [isConnected, setIsConnected] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [cardData, setCardData] = useState<ThaiIdData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reader, setReader] = useState<ThaiIdCardReader | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('');
  const [additionalData, setAdditionalData] = useState({
    phone: '',
    email: '',
    school: '',
  });

  const [manualData, setManualData] = useState({
    citizenId: '',
    prefixTh: '',
    prefixEn: '',
    firstNameTh: '',
    lastNameTh: '',
    firstNameEn: '',
    lastNameEn: '',
    birthDate: '',
    gender: '',
    address: '',
  });

  useEffect(() => {
    setReader(new ThaiIdCardReader());
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        const readBtn = document.getElementById('btn-read-card');
        if (readBtn && !readBtn.hasAttribute('disabled')) readBtn.click();
      } else if (e.key === 'F3') {
        e.preventDefault();
        const connectBtn = document.getElementById('btn-connect-card');
        if (connectBtn && !connectBtn.hasAttribute('disabled')) connectBtn.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showSuccessModal && typeof window !== 'undefined') {
      const baseData = activeTab === 'manual' ? manualData : cardData;
      const dataToEncode = {
        ...baseData,
        ...additionalData
      };
      try {
        const encoded = btoa(encodeURIComponent(JSON.stringify(dataToEncode)));
        setTicketUrl(`${window.location.origin}/ticket?data=${encoded}`);
      } catch (e) {
        console.error('Failed to encode ticket data', e);
      }
    }
  }, [showSuccessModal, cardData, manualData, additionalData, activeTab]);

  const handleConnect = async () => {
    if (!reader) return;
    setError(null);
    const success = await reader.connect();
    if (success) {
      setIsConnected(true);
    } else {
      setError('เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เน€เธเธทเนเธญเธกเธ•เนเธญเธเธฑเธเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธเธเธฑเธ•เธฃเนเธ”เน เนเธเธฃเธ”เธ•เธฃเธงเธเธชเธญเธเธเธฒเธฃเน€เธเธทเนเธญเธกเธ•เนเธญ USB');
    }
  };

  const handleRead = async () => {
    if (!reader || !isConnected) return;
    setIsReading(true);
    setError(null);
    setCardData(null);
    setAdditionalData({ phone: '', email: '', school: '' });

    try {
      const data = await reader.readAllData();
      if (data) {
        setCardData(data);
        if (data.expireDate) {
          const parts = data.expireDate.split('/');
          if (parts.length === 3) {
            const year = parseInt(parts[2]);
            const currentYear = new Date().getFullYear();
            const yearCe = year > 2500 ? year - 543 : year;
            if (yearCe < currentYear) {
              setError('โ ๏ธ เธเธณเน€เธ•เธทเธญเธ: เธเธฑเธ•เธฃเธเธฃเธฐเธเธฒเธเธเนเธเธเธตเนเธซเธกเธ”เธญเธฒเธขเธธเนเธฅเนเธง');
            }
          }
        }
      } else {
        setError('เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธญเนเธฒเธเธเนเธญเธกเธนเธฅเธเธฒเธเธเธฑเธ•เธฃเนเธ”เน เนเธเธฃเธ”เน€เธชเธตเธขเธเธเธฑเธ•เธฃเนเธซเนเนเธเนเธ');
      }
    } catch (err) {
      setError('เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”เธฃเธฐเธซเธงเนเธฒเธเธเธฒเธฃเธญเนเธฒเธเธเธฑเธ•เธฃ');
    } finally {
      setIsReading(false);
    }
  };

  const handleDisconnect = async () => {
    if (reader) {
      await reader.disconnect();
      setIsConnected(false);
      setCardData(null);
      setAdditionalData({ phone: '', email: '', school: '' });
    }
  };

  const handleRegister = () => {
    // Simulate registration
    setIsReading(true);
    setTimeout(() => {
      setIsReading(false);
      setShowSuccessModal(true);
      // In real app, this would call /api/idcard/register
    }, 1000);
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>เธฃเธฐเธเธเธเธฑเธ•เธฃเธเธฃเธฐเธเธฒเธเธ (Thai ID Card)</Title>
          <Text size="sm" c="dimmed">
            เธเธฑเธ”เธเธฒเธฃเนเธฅเธฐเธฅเธเธ—เธฐเน€เธเธตเธขเธเธชเธกเธฒเธเธดเธเธเนเธฒเธเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธ Smart Card
          </Text>
        </div>
        <Group gap="xs">
          {isConnected ? (
            <Group gap={8}>
              <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--mantine-color-green-filled)', boxShadow: '0 0 8px var(--mantine-color-green-filled)'}} />
              <Badge color="green" variant="light" size="lg">เน€เธเธทเนเธญเธกเธ•เนเธญเนเธฅเนเธง (เธเธฃเนเธญเธกเธญเนเธฒเธ)</Badge>
            </Group>
          ) : (
            <Group gap={8}>
              <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--mantine-color-red-filled)'}} />
              <Badge color="red" variant="light" size="lg">เธ•เธฑเธ”เธเธฒเธฃเน€เธเธทเนเธญเธกเธ•เนเธญเนเธฅเนเธง</Badge>
            </Group>
          )}
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List grow>
          <Tabs.Tab value="register" leftSection={<IconId size={18} />}>
            เธญเนเธฒเธเธเนเธญเธกเธนเธฅเธเธฒเธเธเธฑเธ•เธฃ
          </Tabs.Tab>
          <Tabs.Tab value="manual" leftSection={<IconUserPlus size={18} />}>
            เธเธฃเธญเธเธเนเธญเธกเธนเธฅเน€เธญเธ
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={18} />}>
            เธ•เธฑเนเธเธเนเธฒเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธ
          </Tabs.Tab>
        </Tabs.List>

        <Divider my="md" />

        {/* --- Register Tab --- */}
        <Tabs.Panel value="register">
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Card withBorder radius="md" p="xl" h="100%">
                  <Stack align="center" gap="lg" h="100%" justify="center">
                    {!isConnected ? (
                    <>
                      <Box
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: 'rgba(56, 189, 248, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <IconDeviceUsb size={60} color="var(--color-sky)" />
                      </Box>
                      <Stack align="center" gap={4}>
                        <Text fw={700} size="lg">เธเธฃเนเธญเธกเน€เธเธทเนเธญเธกเธ•เนเธญเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธ</Text>
                        <Text size="sm" c="dimmed" ta="center">
                          เนเธเธฃเธ”เน€เธชเธตเธขเธเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธเธเธฑเธ•เธฃ Smart Card เนเธฅเธฐเธเธ”เธเธธเนเธกเน€เธเธทเนเธญเธกเธ•เนเธญ
                        </Text>
                      </Stack>
                      <Button 
                        size="md" 
                        fullWidth 
                        onClick={handleConnect}
                        id="btn-connect-card"
                        leftSection={<IconDeviceUsb size={18} />}
                        color="skyBlue"
                      >
                        เน€เธเธทเนเธญเธกเธ•เนเธญ USB
                      </Button>
                      {process.env.NODE_ENV === 'development' && (
                        <Button
                          size="xs"
                          variant="subtle"
                          color="gray"
                          onClick={() => {
                            setCardData({
                              citizenId: '1-2345-67890-12-3',
                              fullNameTh: 'เธเธฒเธข สมมติ เธ—เธ”เธชเธญเธ',
                              fullNameEn: 'Mr. Sommot Todsob',
                              birthDate: '15/04/1995',
                              gender: 'เธเธฒเธข',
                              address: '123/45 เธ–เธเธเธชเธกเธกเธ•เธด เนเธเธงเธเธ—เธ”เธชเธญเธ เน€เธเธ•เธเธณเธฅเธญเธ เธเธฃเธธเธเน€เธ—เธเธกเธซเธฒเธเธเธฃ 10000',
                              expireDate: '14/04/2030'
                            } as any);
                            setIsConnected(true);
                          }}
                        >
                          [Dev] เธเธณเธฅเธญเธเธเนเธญเธกเธนเธฅเธเธฑเธ•เธฃ (Mock)
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Box
                        className={isReading ? 'pulse-animation' : ''}
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: '16px',
                          background: 'rgba(16, 185, 129, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid rgba(16, 185, 129, 0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: isReading ? '0 0 20px rgba(16, 185, 129, 0.2)' : 'none'
                        }}
                      >
                        {isReading && <div className="scanner-line" />}
                        
                        <Stack align="center" gap={0}>
                          {isReading ? (
                            <Loader color="green" size="lg" variant="dots" />
                          ) : (
                            <IconId size={80} color={isConnected ? "var(--color-emerald)" : "gray"} />
                          )}
                        </Stack>
                      </Box>

                      <Badge 
                        variant="light" 
                        color={isConnected ? "green" : "gray"} 
                        size="sm"
                        leftSection={isConnected ? <IconCheck size={10} /> : null}
                      >
                        {isConnected ? "เน€เธเธฃเธทเนเธญเธเธญเนเธฒเธเธเธฃเนเธญเธกเธ—เธณเธเธฒเธ" : "เธขเธฑเธเนเธกเนเนเธ”เนเน€เธเธทเนเธญเธกเธ•เนเธญ"}
                      </Badge>
                      <Stack align="center" gap={4}>
                        <Text fw={700} size="lg">
                          {isReading ? 'เธเธณเธฅเธฑเธเธญเนเธฒเธเธเนเธญเธกเธนเธฅ...' : 'เน€เธชเธตเธขเธเธเธฑเธ•เธฃเน€เธเธทเนเธญเน€เธฃเธดเนเธกเธ•เนเธ'}
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          เธงเธฒเธเธเธฑเธ•เธฃเธเธฃเธฐเธเธฒเธเธเธฅเธเนเธเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธเนเธฅเธฐเธเธ”เธเธธเนเธกเธ”เนเธฒเธเธฅเนเธฒเธ
                        </Text>
                      </Stack>
                      <Group grow w="100%">
                      <Stack gap={4} w="100%">
                        {isReading && (
                          <Text size="xs" c="green" fw={500} ta="center">เธเธณเธฅเธฑเธเธชเธทเนเธญเธชเธฒเธฃเธเธฑเธเธชเธกเธฒเธฃเนเธ—เธเธฒเธฃเนเธ”...</Text>
                        )}
                        <Button 
                          size="lg" 
                          onClick={handleRead} 
                          id="btn-read-card"
                          loading={isReading}
                          leftSection={<IconRefresh size={20} />}
                          variant="filled"
                          color="green"
                          fullWidth
                          style={{ height: 54 }}
                        >
                          เน€เธฃเธดเนเธกเธญเนเธฒเธเธเนเธญเธกเธนเธฅเธเธฑเธ•เธฃ
                        </Button>
                      </Stack>
                      </Group>
                    </>
                    )}
                  {error && (
                    <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" variant="light" w="100%">
                      {error}
                    </Alert>
                  )}
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 7 }}>
              <Card withBorder radius="md" p="xl" h="100%">
                <Stack gap="md">
                  <Group justify="space-between">
                    <Text fw={700}>เธเนเธญเธกเธนเธฅเธ—เธตเนเธญเนเธฒเธเนเธ”เน</Text>
                    {cardData && (
                      <Button 
                        size="md" 
                        variant="filled" 
                        color="green"
                        leftSection={<IconUserPlus size={18} />}
                        onClick={handleRegister}
                        loading={isReading}
                      >
                        เธฅเธเธ—เธฐเน€เธเธตเธขเธเธชเธกเธฒเธเธดเธ
                      </Button>
                    )}
                  </Group>
                  <Divider />

                  {cardData ? (
                    <Stack gap="md">
                      <Group gap="xl">
                        <Avatar size={100} radius="md" color="blue">
                          <IconId size={60} />
                        </Avatar>
                        <Stack gap={2}>
                          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Citizen ID</Text>
                          <Text fw={800} size="xl" c="skyBlue">
                            {cardData?.citizenId || 'x-xxxx-xxxxx-xx-x'}
                          </Text>
                          <Badge color="blue" variant="dot">
                            Thai National
                          </Badge>
                        </Stack>
                      </Group>

                      <Grid gutter="xs">
                        <Grid.Col span={6}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">เธเธทเนเธญ-เธเธฒเธกเธชเธเธธเธฅ (TH)</Text>
                            <Text fw={600}>
                              {cardData?.fullNameTh || '-'}
                            </Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">Full Name (EN)</Text>
                            <Text fw={600}>{cardData?.fullNameEn || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">เธงเธฑเธเน€เธเธดเธ”</Text>
                            <Text fw={600}>{cardData?.birthDate || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">เน€เธเธจ</Text>
                            <Text fw={600}>{cardData?.gender || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">เธงเธฑเธเธซเธกเธ”เธญเธฒเธขเธธ</Text>
                            <Text fw={600} color="red">{cardData?.expireDate || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">เธ—เธตเนเธญเธขเธนเน</Text>
                            <Text size="sm">{cardData?.address || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                      </Grid>

                      <Divider my="sm" />
                          <Text fw={600} size="sm">เธเนเธญเธกเธนเธฅเน€เธเธดเนเธกเน€เธ•เธดเธกเธชเธณเธซเธฃเธฑเธเธเธฒเธฃเธ•เธดเธ”เธ•เนเธญ</Text>
                          <Grid gutter="xs">
                            <Grid.Col span={6}>
                              <TextInput 
                                label="เน€เธเธญเธฃเนเนเธ—เธฃเธจเธฑเธเธ—เน" 
                                placeholder="08X-XXX-XXXX" 
                                value={additionalData.phone}
                                onChange={(e) => {
                                  const raw = e.target.value.replace(/-/g, '');
                                  const d = raw.slice(0,10);
                                  let fmt = d;
                                  if (d.length > 3) fmt = d.slice(0,3) + '-' + d.slice(3);
                                  if (d.length > 6) fmt = d.slice(0,3) + '-' + d.slice(3,6) + '-' + d.slice(6);
                                  setAdditionalData({...additionalData, phone: fmt});
                                }}
                                maxLength={12}
                              />
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <TextInput 
                                label="อีเมล" 
                                placeholder="example@mail.com" 
                                value={additionalData.email}
                                onChange={(e) => setAdditionalData({...additionalData, email: e.target.value})}
                              />
                            </Grid.Col>
                            <Grid.Col span={12}>
                              <TextInput 
                                label="เธเธทเนเธญเธชเธ–เธฒเธเธฑเธเธเธฒเธฃเธจเธถเธเธฉเธฒ / เนเธฃเธเน€เธฃเธตเธขเธ" 
                                placeholder="เธเธฃเธญเธเธเธทเนเธญเธชเธ–เธฒเธเธฑเธเธเธฒเธฃเธจเธถเธเธฉเธฒ..." 
                                value={additionalData.school}
                                onChange={(e) => setAdditionalData({...additionalData, school: e.target.value})}
                              />
                            </Grid.Col>
                          </Grid>
                    </Stack>
                  ) : (
                    <Center h={300}>
                      <Stack align="center" gap="xs">
                        <IconId size={48} color="rgba(255,255,255,0.1)" />
                        <Text c="dimmed" size="sm">เธขเธฑเธเนเธกเนเธกเธตเธเนเธญเธกเธนเธฅ เนเธเธฃเธ”เธ—เธณเธเธฒเธฃเธญเนเธฒเธเธเธฑเธ•เธฃ</Text>
                      </Stack>
                    </Center>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </Tabs.Panel>



        {/* --- Manual Entry Tab --- */}
        <Tabs.Panel value="manual">
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={700}>เธเธฃเธญเธเธเนเธญเธกเธนเธฅเธฅเธเธ—เธฐเน€เธเธตเธขเธเธ”เนเธงเธขเธ•เธเน€เธญเธ</Text>
                <Button 
                  size="md" 
                  variant="filled" 
                  color="green"
                  leftSection={<IconUserPlus size={18} />}
                  onClick={handleRegister}
                  loading={isReading}
                >
                  เธฅเธเธ—เธฐเน€เธเธตเธขเธเธชเธกเธฒเธเธดเธ
                </Button>
              </Group>
              <Divider />

              <TextInput 
                label="เน€เธฅเธเธเธฑเธ•เธฃเธเธฃเธฐเธเธฒเธเธ" 
                placeholder="x-xxxx-xxxxx-xx-x" 
                value={manualData.citizenId}
                onChange={(e) => {
                  const raw = e.target.value.replace(/-/g, '');
                  const d = raw.slice(0,13);
                  let fmt = d;
                  if (d.length > 1) fmt = d[0] + '-' + d.slice(1);
                  if (d.length > 5) fmt = d[0] + '-' + d.slice(1,5) + '-' + d.slice(5);
                  if (d.length > 10) fmt = d[0] + '-' + d.slice(1,5) + '-' + d.slice(5,10) + '-' + d.slice(10);
                  if (d.length > 12) fmt = d[0] + '-' + d.slice(1,5) + '-' + d.slice(5,10) + '-' + d.slice(10,12) + '-' + d.slice(12);
                  setManualData({...manualData, citizenId: fmt});
                }}
                maxLength={17}
              />

              <Group grow>
                <Select
                  label="เธเธณเธเธณเธซเธเนเธฒ (TH)"
                  placeholder="เน€เธฅเธทเธญเธ"
                  data={['เธเธฒเธข', 'เธเธฒเธ', 'เธเธฒเธเธชเธฒเธง', 'เน€เธ”เนเธเธเธฒเธข', 'เน€เธ”เนเธเธซเธเธดเธ']}
                  style={{ flex: '0 0 120px' }}
                  value={manualData.prefixTh}
                  onChange={(val) => {
                    const en = val ? PREFIX_MAP[val] : '';
                    setManualData({ 
                      ...manualData, 
                      prefixTh: val || '',
                      prefixEn: en || manualData.prefixEn
                    });
                  }}
                />
                <TextInput 
                  label="เธเธทเนเธญ (เธ เธฒเธฉเธฒเนเธ—เธข)" 
                  placeholder="เธเธทเนเธญ" 
                  value={manualData.firstNameTh}
                  onChange={(e) => setManualData({...manualData, firstNameTh: e.target.value})}
                />
                <TextInput 
                  label="เธเธฒเธกเธชเธเธธเธฅ (เธ เธฒเธฉเธฒเนเธ—เธข)" 
                  placeholder="เธเธฒเธกเธชเธเธธเธฅ" 
                  value={manualData.lastNameTh}
                  onChange={(e) => setManualData({...manualData, lastNameTh: e.target.value})}
                />
              </Group>

              <Group grow>
                <Select
                  label="Prefix (EN)"
                  placeholder="Select"
                  data={['Mr.', 'Mrs.', 'Ms.', 'Master', 'Miss']}
                  style={{ flex: '0 0 120px' }}
                  value={manualData.prefixEn}
                  onChange={(val) => setManualData({ ...manualData, prefixEn: val || '' })}
                />
                <TextInput 
                  label="เธเธทเนเธญ (English)" 
                  placeholder="First Name" 
                  value={manualData.firstNameEn}
                  onChange={(e) => setManualData({...manualData, firstNameEn: e.target.value})}
                />
                <TextInput 
                  label="เธเธฒเธกเธชเธเธธเธฅ (English)" 
                  placeholder="Last Name" 
                  value={manualData.lastNameEn}
                  onChange={(e) => setManualData({...manualData, lastNameEn: e.target.value})}
                />
              </Group>

              <Group grow>
                <TextInput 
                  label="เธงเธฑเธเน€เธเธดเธ” (เธฃเธฐเธเธธเน€เธเนเธ เธ.ศ.)" 
                  placeholder="เน€เธเนเธ 15/04/2538" 
                  value={manualData.birthDate}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\//g, '');
                    const d = raw.slice(0,8);
                    let fmt = d;
                    if (d.length > 2) fmt = d.slice(0,2) + '/' + d.slice(2);
                    if (d.length > 4) fmt = d.slice(0,2) + '/' + d.slice(2,4) + '/' + d.slice(4);
                    setManualData({...manualData, birthDate: fmt});
                  }}
                  maxLength={10}
                />
                <Select
                  label="เน€เธเธจ"
                  placeholder="เน€เธฅเธทเธญเธ"
                  data={['เธเธฒเธข', 'เธซเธเธดเธ']}
                  value={manualData.gender}
                  onChange={(val) => setManualData({...manualData, gender: val || ''})}
                />
              </Group>

              <TextInput 
                label="เธ—เธตเนเธญเธขเธนเน" 
                placeholder="เธเนเธฒเธเน€เธฅเธเธ—เธตเน เธซเธกเธนเน เธเธญเธข เธ–เธเธ เนเธเธงเธ เน€เธเธ• เธเธฑเธเธซเธงเธฑเธ” เธฃเธซเธฑเธชเนเธเธฃเธฉเธ“เธตเธขเน" 
                value={manualData.address}
                onChange={(e) => setManualData({...manualData, address: e.target.value})}
              />

              <Divider my="sm" />
              <Text fw={600} size="sm">เธเนเธญเธกเธนเธฅเน€เธเธดเนเธกเน€เธ•เธดเธกเธชเธณเธซเธฃเธฑเธเธเธฒเธฃเธ•เธดเธ”เธ•เนเธญ</Text>
              
              <Group grow>
                <TextInput 
                  label="เน€เธเธญเธฃเนเนเธ—เธฃเธจเธฑเธเธ—เน" 
                  placeholder="08X-XXX-XXXX" 
                  value={additionalData.phone}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/-/g, '');
                    const d = raw.slice(0,10);
                    let fmt = d;
                    if (d.length > 3) fmt = d.slice(0,3) + '-' + d.slice(3);
                    if (d.length > 6) fmt = d.slice(0,3) + '-' + d.slice(3,6) + '-' + d.slice(6);
                    setAdditionalData({...additionalData, phone: fmt});
                  }}
                  maxLength={12}
                />
                <TextInput 
                  label="อีเมล" 
                  placeholder="example@mail.com" 
                  value={additionalData.email}
                  onChange={(e) => setAdditionalData({...additionalData, email: e.target.value})}
                />
              </Group>

              <TextInput 
                label="เธเธทเนเธญเธชเธ–เธฒเธเธฑเธเธเธฒเธฃเธจเธถเธเธฉเธฒ / เนเธฃเธเน€เธฃเธตเธขเธ" 
                placeholder="เธเธฃเธญเธเธเธทเนเธญเธชเธ–เธฒเธเธฑเธเธเธฒเธฃเธจเธถเธเธฉเธฒ..." 
                value={additionalData.school}
                onChange={(e) => setAdditionalData({...additionalData, school: e.target.value})}
              />
            </Stack>
          </Card>
        </Tabs.Panel>



        {/* --- Settings Tab --- */}
        <Tabs.Panel value="settings">
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Group>
                <IconSettings size={20} color="var(--color-sky)" />
                <Text fw={700}>เธเธฒเธฃเธ•เธฑเนเธเธเนเธฒเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธเธเธฑเธ•เธฃ (Web USB)</Text>
              </Group>
              <Divider />
              
              <Text size="sm">
                เธฃเธฐเธเธเนเธเน Web USB API เน€เธเธทเนเธญเธชเธทเนเธญเธชเธฒเธฃเธเธฑเธเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธเธเธฑเธ•เธฃเนเธ”เธขเธ•เธฃเธเธเนเธฒเธเน€เธเธฃเธฒเธงเนเน€เธเธญเธฃเน 
                เนเธ”เธขเนเธกเนเธเธณเน€เธเนเธเธ•เนเธญเธเธ•เธดเธ”เธ•เธฑเนเธ Driver เน€เธเธดเนเธกเน€เธ•เธดเธก (เน€เธเธเธฒเธฐเน€เธเธฃเธทเนเธญเธเธญเนเธฒเธเธ—เธตเนเธฃเธญเธเธฃเธฑเธเธกเธฒเธ•เธฃเธเธฒเธ CCID)
              </Text>

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Stack gap="xs">
                      <Text fw={600} size="sm">Vendor IDs เธ—เธตเนเธฃเธญเธเธฃเธฑเธ</Text>
                      <Group gap="xs">
                        <Badge variant="outline">0x072F (ACS)</Badge>
                        <Badge variant="outline">0x04E6 (SCM)</Badge>
                        <Badge variant="outline">0x076B (HID)</Badge>
                        <Badge variant="outline">0x08E6 (Gemalto)</Badge>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs">
                        เธเธธเธ“เธชเธฒเธกเธฒเธฃเธ–เน€เธเธดเนเธก Vendor ID เน€เธเธดเนเธกเน€เธ•เธดเธกเนเธ”เนเนเธเนเธเธฅเน `src/lib/idcard/reader.ts`
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Stack gap="xs">
                      <Text fw={600} size="sm">เธชเธ–เธฒเธเธฐเธฃเธฐเธเธ</Text>
                      <Group justify="space-between">
                        <Text size="xs">Web USB Support</Text>
                        <Badge color="green">Supported</Badge>
                      </Group>
                      <Group justify="space-between">
                        <Text size="xs">HTTPS / Localhost</Text>
                        <Badge color="green">Secure</Badge>
                      </Group>
                    </Stack>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .pulse-animation {
          animation: pulse 2s infinite ease-in-out;
        }
        .scanner-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--color-emerald);
          box-shadow: 0 0 8px var(--color-emerald);
          z-index: 10;
          animation: scan 2s infinite linear;
        }
      `}</style>



      {/* --- Success Registration Modal --- */}
      <Modal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={<Text fw={700}>เธฃเธฑเธ E-Ticket เน€เธเนเธฒเธกเธทเธญเธ–เธทเธญ</Text>}
        centered
        size="md"
        radius="lg"
      >
        <Stack align="center" py="xl" gap="xl">
          <Stack align="center" gap={4}>
            <Text fw={800} size="xl" c="skyBlue">เธชเนเธเธเน€เธเธทเนเธญเธฃเธฑเธเธ•เธฑเนเธง</Text>
            <Text size="sm" c="dimmed" ta="center">
              เนเธเนเธเธฅเนเธญเธเนเธ—เธฃเธจเธฑเธเธ—เนเธกเธทเธญเธ–เธทเธญเธชเนเธเธ QR Code เธ”เนเธฒเธเธฅเนเธฒเธ<br/>เน€เธเธทเนเธญเธฃเธฑเธ E-Ticket เธฅเธเนเธเน€เธเธฃเธทเนเธญเธเธเธญเธเธเธธเธ“
            </Text>
          </Stack>

          <Box
            style={{
              padding: 20,
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
            }}
          >
            {ticketUrl ? (
              <QRCodeSVG 
                value={ticketUrl} 
                size={220}
                level="M"
                includeMargin
              />
            ) : (
              <Loader color="skyBlue" />
            )}
          </Box>
          
          <Stack align="center" gap={4}>
            <Text fw={700}>
              {activeTab === 'manual' 
                ? `${manualData.prefixTh}${manualData.firstNameTh} ${manualData.lastNameTh}` 
                : cardData?.fullNameTh}
            </Text>
            <Text size="sm" c="dimmed">
              เน€เธฅเธเธเธฑเธ•เธฃ: {activeTab === 'manual' ? manualData.citizenId : cardData?.citizenId}
            </Text>
          </Stack>

          <Group grow w="100%">
            <Button size="md" variant="light" color="gray" onClick={() => setShowSuccessModal(false)}>
              เธเธดเธ”เธซเธเนเธฒเธ•เนเธฒเธ
            </Button>
            {ticketUrl && (
              <Button 
                size="md" 
                color="skyBlue" 
                component="a" 
                href={ticketUrl} 
                target="_blank"
              >
                เธ—เธ”เธชเธญเธเน€เธเธดเธ”เธ•เธฑเนเธง
              </Button>
            )}
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
