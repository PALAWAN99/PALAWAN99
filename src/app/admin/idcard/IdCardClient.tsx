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

export default function IdCardClient() {
  const [activeTab, setActiveTab] = useState<string | null>('register');
  const [isConnected, setIsConnected] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [cardData, setCardData] = useState<ThaiIdData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reader, setReader] = useState<ThaiIdCardReader | null>(null);

  const [isManualMode, setIsManualMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [manualData, setManualData] = useState({
    citizenId: '',
    firstNameTh: '',
    lastNameTh: '',
  });
  const [additionalData, setAdditionalData] = useState({
    phone: '',
    email: '',
    school: '',
  });

  // Mock logs
  const [logs, setLogs] = useState<any[]>([
    { id: '1', name: 'สมชาย รักชาติ', cid: '1-1001-00xxx-xx-x', time: '2026-04-30 11:20', status: 'SUCCESS', fullData: { citizenId: '1-1001-00xxx-xx-x', fullNameTh: 'สมชาย รักชาติ', fullNameEn: 'Somchai Rakchart', birthDate: '01/01/1990', gender: 'ชาย', address: '123 ถ.สุขุมวิท กรุงเทพมหานคร', expireDate: '01/01/2030' } },
    { id: '2', name: 'สมหญิง จริงใจ', cid: '3-4501-00xxx-xx-x', time: '2026-04-30 10:45', status: 'SUCCESS', fullData: { citizenId: '3-4501-00xxx-xx-x', fullNameTh: 'สมหญิง จริงใจ', fullNameEn: 'Somying Jingjai', birthDate: '02/02/1992', gender: 'หญิง', address: '456 ถ.นิมมานเหมินท์ เชียงใหม่', expireDate: '02/02/2032' } },
    { id: '3', name: 'Unknown', cid: '5-2201-00xxx-xx-x', time: '2026-04-30 09:15', status: 'FAILED' },
  ]);

  useEffect(() => {
    setReader(new ThaiIdCardReader());
  }, []);

  useEffect(() => {
    if (showSuccessModal && typeof window !== 'undefined') {
      const dataToEncode = {
        ...(cardData || {
          citizenId: manualData.citizenId,
          fullNameTh: `${manualData.firstNameTh} ${manualData.lastNameTh}`.trim() || 'Manual Entry',
        }),
        ...additionalData
      };
      try {
        const encoded = btoa(encodeURIComponent(JSON.stringify(dataToEncode)));
        setTicketUrl(`${window.location.origin}/ticket?data=${encoded}`);
      } catch (e) {
        console.error('Failed to encode ticket data', e);
      }
    }
  }, [showSuccessModal, cardData, manualData]);

  const handleConnect = async () => {
    if (!reader) return;
    setError(null);
    const success = await reader.connect();
    if (success) {
      setIsConnected(true);
    } else {
      setError('ไม่สามารถเชื่อมต่อกับเครื่องอ่านบัตรได้ โปรดตรวจสอบการเชื่อมต่อ USB');
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
        // Add to logs
        setLogs(prev => [
          {
            id: Date.now().toString(),
            name: data.fullNameTh,
            cid: data.citizenId.substring(0, 1) + '-' + data.citizenId.substring(1, 5) + '-xxxxx-xx-x',
            time: new Date().toLocaleString('th-TH'),
            status: 'SUCCESS',
            fullData: data
          },
          ...prev
        ]);
      } else {
        setError('ไม่สามารถอ่านข้อมูลจากบัตรได้ โปรดเสียบบัตรให้แน่น');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดระหว่างการอ่านบัตร');
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
          <Title order={2}>ระบบบัตรประชาชน (Thai ID Card)</Title>
          <Text size="sm" c="dimmed">
            จัดการและลงทะเบียนสมาชิกผ่านเครื่องอ่าน Smart Card
          </Text>
        </div>
        <Group gap="xs">
          {isConnected ? (
            <Badge color="green" variant="light" size="lg" leftSection={<IconCheck size={14} />}>
              เชื่อมต่อแล้ว
            </Badge>
          ) : (
            <Badge color="gray" variant="light" size="lg">
              ยังไม่ได้เชื่อมต่อ
            </Badge>
          )}
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List grow>
          <Tabs.Tab value="register" leftSection={<IconId size={18} />}>
            ลงทะเบียน / อ่านบัตร
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={18} />}>
            ประวัติการอ่าน
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={18} />}>
            ตั้งค่าเครื่องอ่าน
          </Tabs.Tab>
        </Tabs.List>

        <Divider my="md" />

        {/* --- Register Tab --- */}
        <Tabs.Panel value="register">
          <Stack gap="md">
            <Paper withBorder p="xs" radius="md" bg="var(--bg-secondary)">
              <Group justify="flex-start" gap="sm">
                <Text size="sm" fw={600}>โหมดการลงทะเบียน:</Text>
                <SegmentedControl
                  value={isManualMode ? 'manual' : 'reader'}
                  onChange={(val) => setIsManualMode(val === 'manual')}
                  data={[
                    { 
                      value: 'reader', 
                      label: (
                        <Center style={{ gap: 8 }}>
                          <IconDeviceUsb size={16} />
                          <span>เครื่องอ่านบัตร (Reader)</span>
                        </Center>
                      )
                    },
                    { 
                      value: 'manual', 
                      label: (
                        <Center style={{ gap: 8 }}>
                          <IconId size={16} />
                          <span>กรอกข้อมูลเอง (Manual)</span>
                        </Center>
                      )
                    },
                  ]}
                  color="skyBlue"
                  radius="md"
                  size="sm"
                />
              </Group>
            </Paper>

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 5 }}>
                <Card withBorder radius="md" p="xl" h="100%">
                  <Stack align="center" gap="lg" h="100%" justify="center">
                    {!isManualMode ? (
                      // --- Reader Mode ---
                      !isConnected ? (
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
                        <Text fw={700} size="lg">พร้อมเชื่อมต่อเครื่องอ่าน</Text>
                        <Text size="sm" c="dimmed" ta="center">
                          โปรดเสียบเครื่องอ่านบัตร Smart Card และกดปุ่มเชื่อมต่อ
                        </Text>
                      </Stack>
                      <Button 
                        size="md" 
                        fullWidth 
                        onClick={handleConnect}
                        leftSection={<IconDeviceUsb size={18} />}
                        color="skyBlue"
                      >
                        เชื่อมต่อ USB
                      </Button>
                    </>
                  ) : (
                    <>
                      <Box
                        className={isReading ? 'pulse-animation' : ''}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: 'rgba(16, 185, 129, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isReading ? (
                          <Loader color="green" size="lg" />
                        ) : (
                          <IconId size={60} color="var(--color-emerald)" />
                        )}
                      </Box>
                      <Stack align="center" gap={4}>
                        <Text fw={700} size="lg">
                          {isReading ? 'กำลังอ่านข้อมูล...' : 'เสียบบัตรเพื่อเริ่มต้น'}
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          วางบัตรประชาชนลงในเครื่องอ่านและกดปุ่มด้านล่าง
                        </Text>
                      </Stack>
                      <Group grow w="100%">
                        <Button 
                          size="md" 
                          onClick={handleRead} 
                          loading={isReading}
                          leftSection={<IconRefresh size={18} />}
                          variant="filled"
                          color="green"
                        >
                          อ่านข้อมูลบัตร
                        </Button>
                        <Button size="md" variant="light" color="red" onClick={handleDisconnect}>
                          ตัดการเชื่อมต่อ
                        </Button>
                      </Group>
                    </>
                  )
                ) : (
                  // --- Manual Mode ---
                  <Stack w="100%" gap="md">
                    <Group gap="xs">
                      <IconId size={24} color="var(--color-sky)" />
                      <Text fw={700}>กรอกข้อมูลด้วยตนเอง</Text>
                    </Group>
                    <Text size="xs" c="dimmed">ใช้ในกรณีที่เครื่องอ่านบัตรไม่ทำงานหรือบัตรชำรุด</Text>
                    
                    <TextInput
                      label="เลขประจำตัวประชาชน"
                      placeholder="x-xxxx-xxxxx-xx-x"
                      required
                      value={manualData.citizenId}
                      onChange={(e) => setManualData({ ...manualData, citizenId: e.target.value })}
                    />
                    <Grid gutter="xs">
                      <Grid.Col span={6}>
                        <TextInput
                          label="ชื่อ (TH)"
                          placeholder="เช่น สมชาย"
                          value={manualData.firstNameTh}
                          onChange={(e) => setManualData({ ...manualData, firstNameTh: e.target.value })}
                        />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput
                          label="นามสกุล (TH)"
                          placeholder="เช่น รักชาติ"
                          value={manualData.lastNameTh}
                          onChange={(e) => setManualData({ ...manualData, lastNameTh: e.target.value })}
                        />
                      </Grid.Col>
                    </Grid>
                    
                    <Grid gutter="xs">
                      <Grid.Col span={6}>
                        <TextInput 
                          label="เบอร์โทรศัพท์" 
                          placeholder="08X-XXX-XXXX" 
                          value={additionalData.phone}
                          onChange={(e) => setAdditionalData({...additionalData, phone: e.target.value})}
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
                          label="ชื่อสถาบันการศึกษา / โรงเรียน" 
                          placeholder="กรอกชื่อสถาบันการศึกษา..." 
                          value={additionalData.school}
                          onChange={(e) => setAdditionalData({...additionalData, school: e.target.value})}
                        />
                      </Grid.Col>
                    </Grid>
                    
                    <Button 
                      mt="md"
                      color="skyBlue"
                      onClick={() => {
                        if (!manualData.citizenId) return;
                        setCardData({
                          citizenId: manualData.citizenId,
                          fullNameTh: `${manualData.firstNameTh} ${manualData.lastNameTh}`,
                          fullNameEn: '-',
                          birthDate: '-',
                          gender: '-',
                          address: 'กรอกข้อมูลด้วยตนเอง',
                          expireDate: '-'
                        } as any);
                        // Add to logs
                        setLogs(prev => [
                          {
                            id: Date.now().toString(),
                            name: `${manualData.firstNameTh} ${manualData.lastNameTh}` || 'Manual Entry',
                            cid: manualData.citizenId,
                            time: new Date().toLocaleString('th-TH'),
                            status: 'MANUAL',
                            fullData: {
                              citizenId: manualData.citizenId,
                              fullNameTh: `${manualData.firstNameTh} ${manualData.lastNameTh}`,
                              fullNameEn: '-',
                              birthDate: '-',
                              gender: '-',
                              address: 'กรอกข้อมูลด้วยตนเอง',
                              expireDate: '-'
                            }
                          },
                          ...prev
                        ]);
                      }}
                    >
                      ยืนยันข้อมูล
                    </Button>
                  </Stack>
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
                    <Text fw={700}>ข้อมูลที่อ่านได้</Text>
                    {cardData && (
                      <Button 
                        size="xs" 
                        variant="filled" 
                        color="green"
                        leftSection={<IconUserPlus size={14} />}
                        onClick={handleRegister}
                        loading={isReading}
                      >
                        ลงทะเบียนสมาชิก
                      </Button>
                    )}
                  </Group>
                  <Divider />

                  {(cardData || (isManualMode && (manualData.citizenId || manualData.firstNameTh))) ? (
                    <Stack gap="md">
                      <Group gap="xl">
                        <Avatar size={100} radius="md" color="blue">
                          <IconId size={60} />
                        </Avatar>
                        <Stack gap={2}>
                          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Citizen ID</Text>
                          <Text fw={800} size="xl" c="skyBlue">
                            {cardData?.citizenId || manualData.citizenId || 'x-xxxx-xxxxx-xx-x'}
                          </Text>
                          <Badge color="blue" variant="dot">
                            {isManualMode ? 'Manual Entry' : 'Thai National'}
                          </Badge>
                        </Stack>
                      </Group>

                      <Grid gutter="xs">
                        <Grid.Col span={6}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">ชื่อ-นามสกุล (TH)</Text>
                            <Text fw={600}>
                              {cardData?.fullNameTh || (manualData.firstNameTh || manualData.lastNameTh ? `${manualData.firstNameTh} ${manualData.lastNameTh}` : '-')}
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
                            <Text size="xs" c="dimmed">วันเกิด</Text>
                            <Text fw={600}>{cardData?.birthDate || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">เพศ</Text>
                            <Text fw={600}>{cardData?.gender || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">วันหมดอายุ</Text>
                            <Text fw={600} color="red">{cardData?.expireDate || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">ที่อยู่</Text>
                            <Text size="sm">{cardData?.address || (isManualMode ? 'กรอกข้อมูลด้วยตนเอง' : '-')}</Text>
                          </Paper>
                        </Grid.Col>
                      </Grid>

                      <Divider my="sm" />
                      {!isManualMode && (
                        <>
                          <Text fw={600} size="sm">ข้อมูลเพิ่มเติมสำหรับการติดต่อ</Text>
                          <Grid gutter="xs">
                            <Grid.Col span={6}>
                              <TextInput 
                                label="เบอร์โทรศัพท์" 
                                placeholder="08X-XXX-XXXX" 
                                value={additionalData.phone}
                                onChange={(e) => setAdditionalData({...additionalData, phone: e.target.value})}
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
                                label="ชื่อสถาบันการศึกษา / โรงเรียน" 
                                placeholder="กรอกชื่อสถาบันการศึกษา..." 
                                value={additionalData.school}
                                onChange={(e) => setAdditionalData({...additionalData, school: e.target.value})}
                              />
                            </Grid.Col>
                          </Grid>
                        </>
                      )}
                    </Stack>
                  ) : (
                    <Center h={300}>
                      <Stack align="center" gap="xs">
                        <IconId size={48} color="rgba(255,255,255,0.1)" />
                        <Text c="dimmed" size="sm">ยังไม่มีข้อมูล โปรดทำการอ่านบัตร</Text>
                      </Stack>
                    </Center>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </Stack>
      </Tabs.Panel>

        {/* --- History Tab --- */}
        <Tabs.Panel value="history">
          <Card withBorder radius="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={700}>ประวัติการสแกนล่าสุด</Text>
                <Button variant="subtle" size="xs" leftSection={<IconRefresh size={14} />}>
                  ล้างประวัติ
                </Button>
              </Group>
              
              <Table.ScrollContainer minWidth={500}>
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>ชื่อ-นามสกุล</Table.Th>
                      <Table.Th>เลขบัตร</Table.Th>
                      <Table.Th>เวลาที่สแกน</Table.Th>
                      <Table.Th>สถานะ</Table.Th>
                      <Table.Th />
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {logs.map((item) => (
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
        </Tabs.Panel>

        {/* --- Settings Tab --- */}
        <Tabs.Panel value="settings">
          <Card withBorder radius="md" p="xl">
            <Stack gap="md">
              <Group>
                <IconSettings size={20} color="var(--color-sky)" />
                <Text fw={700}>การตั้งค่าเครื่องอ่านบัตร (Web USB)</Text>
              </Group>
              <Divider />
              
              <Text size="sm">
                ระบบใช้ Web USB API เพื่อสื่อสารกับเครื่องอ่านบัตรโดยตรงผ่านเบราว์เซอร์ 
                โดยไม่จำเป็นต้องติดตั้ง Driver เพิ่มเติม (เฉพาะเครื่องอ่านที่รองรับมาตรฐาน CCID)
              </Text>

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Stack gap="xs">
                      <Text fw={600} size="sm">Vendor IDs ที่รองรับ</Text>
                      <Group gap="xs">
                        <Badge variant="outline">0x072F (ACS)</Badge>
                        <Badge variant="outline">0x04E6 (SCM)</Badge>
                        <Badge variant="outline">0x076B (HID)</Badge>
                        <Badge variant="outline">0x08E6 (Gemalto)</Badge>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs">
                        คุณสามารถเพิ่ม Vendor ID เพิ่มเติมได้ในไฟล์ `src/lib/idcard/reader.ts`
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Stack gap="xs">
                      <Text fw={600} size="sm">สถานะระบบ</Text>
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
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .pulse-animation {
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>

      {/* --- Detail Modal --- */}
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

      {/* --- Success Registration Modal --- */}
      <Modal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={<Text fw={700}>รับ E-Ticket เข้ามือถือ</Text>}
        centered
        size="md"
        radius="lg"
      >
        <Stack align="center" py="xl" gap="xl">
          <Stack align="center" gap={4}>
            <Text fw={800} size="xl" c="skyBlue">สแกนเพื่อรับตั๋ว</Text>
            <Text size="sm" c="dimmed" ta="center">
              ใช้กล้องโทรศัพท์มือถือสแกน QR Code ด้านล่าง<br/>เพื่อรับ E-Ticket ลงในเครื่องของคุณ
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
            <Text fw={700}>{cardData?.fullNameTh || `${manualData.firstNameTh} ${manualData.lastNameTh}`.trim() || 'Manual Entry'}</Text>
            <Text size="sm" c="dimmed">เลขบัตร: {cardData?.citizenId || manualData.citizenId}</Text>
          </Stack>

          <Group grow w="100%">
            <Button size="md" variant="light" color="gray" onClick={() => setShowSuccessModal(false)}>
              ปิดหน้าต่าง
            </Button>
            {ticketUrl && (
              <Button 
                size="md" 
                color="skyBlue" 
                component="a" 
                href={ticketUrl} 
                target="_blank"
              >
                ทดสอบเปิดตั๋ว
              </Button>
            )}
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
