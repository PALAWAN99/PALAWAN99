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
  ActionIcon,
  Alert,
  Paper,
  Grid,
  Divider,
  Avatar,
  Box,
  Center,
  Loader,
  TextInput,
} from '@mantine/core';
import {
  IconDeviceUsb,
  IconRefresh,
  IconId,
  IconCheck,
  IconAlertCircle,
  IconUserPlus,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { useIdCardReader } from './hooks/useIdCardReader';
import { IdCardManualForm } from './_components/IdCardManualForm';
import { ReaderSettings } from './_components/ReaderSettings';
import { IdCardSuccessModal } from './_components/IdCardSuccessModal';

const PREFIX_MAP: Record<string, string> = {
  'นาย': 'Mr.',
  'นาง': 'Mrs.',
  'นางสาว': 'Ms.',
  'เด็กชาย': 'Master',
  'เด็กหญิง': 'Miss',
};

export default function IdCardClient() {
  const t = useTranslations('IdCard');
  const [activeTab, setActiveTab] = useState<string | null>('register');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('');
  
  const {
    isConnected,
    isReading,
    cardData,
    setCardData,
    error,
    setError,
    handleConnect,
    handleRead,
  } = useIdCardReader();

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        handleRead();
      } else if (e.key === 'F3') {
        e.preventDefault();
        handleConnect();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRead, handleConnect]);

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

  const handleRegister = () => {
    // In a real app, this would call /api/idcard/register
    setShowSuccessModal(true);
  };

  const fullName = activeTab === 'manual' 
    ? `${manualData.prefixTh}${manualData.firstNameTh} ${manualData.lastNameTh}`
    : cardData?.fullNameTh || '';
  
  const citizenId = activeTab === 'manual' ? manualData.citizenId : cardData?.citizenId || '';

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>{t('title')}</Title>
          <Text size="sm" c="dimmed">{t('subtitle')}</Text>
        </div>
        <Group gap="xs">
          {isConnected ? (
            <Group gap={8}>
              <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--mantine-color-green-filled)', boxShadow: '0 0 8px var(--mantine-color-green-filled)'}} />
              <Badge color="green" variant="light" size="lg">{t('connected')}</Badge>
            </Group>
          ) : (
            <Group gap={8}>
              <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--mantine-color-red-filled)'}} />
              <Badge color="red" variant="light" size="lg">{t('disconnected')}</Badge>
            </Group>
          )}
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List grow>
          <Tabs.Tab value="register" leftSection={<IconId size={18} />}>
            {t('tabRead')}
          </Tabs.Tab>
          <Tabs.Tab value="manual" leftSection={<IconUserPlus size={18} />}>
            {t('tabManual')}
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={18} />}>
            {t('tabSettings')}
          </Tabs.Tab>
        </Tabs.List>

        <Divider my="md" />

        <Tabs.Panel value="register">
          <Stack gap="md">
            <Grid gap="md">
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
                          <Text fw={700} size="lg">{t('ready')}</Text>
                          <Text size="sm" c="dimmed" ta="center">
                            {t('btnConnect')}
                          </Text>
                        </Stack>
                        <Button 
                          size="md" 
                          fullWidth 
                          onClick={handleConnect}
                          leftSection={<IconDeviceUsb size={18} />}
                          color="skyBlue"
                        >
                          {t('btnConnect')}
                        </Button>
                        {process.env.NODE_ENV === 'development' && (
                          <Button
                            size="xs"
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                              setCardData({
                                citizenId: '1-2345-67890-12-3',
                                fullNameTh: 'นาย สมมติ ทดสอบ',
                                fullNameEn: 'Mr. Sommot Todsob',
                                birthDate: '15/04/1995',
                                gender: 'ชาย',
                                address: '123/45 ถนนสมมติ แขวงทดสอบ เขตจำลอง กรุงเทพมหานคร 10000',
                                expireDate: '14/04/2030'
                              } as any);
                            }}
                          >
                            {t('mockData')}
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
                              <IconId size={80} color="var(--color-emerald)" />
                            )}
                          </Stack>
                        </Box>

                        <Badge variant="light" color="green" size="sm" leftSection={<IconCheck size={10} />}>
                          {t('ready')}
                        </Badge>
                        <Stack align="center" gap={4}>
                          <Text fw={700} size="lg">
                            {isReading ? t('reading') : t('readStart')}
                          </Text>
                        </Stack>
                        <Button 
                          size="lg" 
                          onClick={handleRead} 
                          loading={isReading}
                          leftSection={<IconRefresh size={20} />}
                          variant="filled"
                          color="green"
                          fullWidth
                          style={{ height: 54 }}
                        >
                          {t('btnRead')}
                        </Button>
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
                      <Text fw={700}>{t('readResult')}</Text>
                      {cardData && (
                        <Button 
                          size="md" 
                          variant="filled" 
                          color="green"
                          leftSection={<IconUserPlus size={18} />}
                          onClick={handleRegister}
                        >
                          {t('btnRegister')}
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
                              {cardData?.citizenId}
                            </Text>
                            <Badge color="blue" variant="dot">Thai National</Badge>
                          </Stack>
                        </Group>

                        <Grid gap="xs">
                          <Grid.Col span={6}>
                            <Paper p="xs" withBorder bg="var(--bg-secondary)">
                              <Text size="xs" c="dimmed">{t('firstNameTh')}</Text>
                              <Text fw={600}>{cardData?.fullNameTh}</Text>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={6}>
                            <Paper p="xs" withBorder bg="var(--bg-secondary)">
                              <Text size="xs" c="dimmed">Full Name (EN)</Text>
                              <Text fw={600}>{cardData?.fullNameEn}</Text>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Paper p="xs" withBorder bg="var(--bg-secondary)">
                              <Text size="xs" c="dimmed">{t('birthDate')}</Text>
                              <Text fw={600}>{cardData?.birthDate}</Text>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Paper p="xs" withBorder bg="var(--bg-secondary)">
                              <Text size="xs" c="dimmed">{t('gender')}</Text>
                              <Text fw={600}>{cardData?.gender}</Text>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={4}>
                            <Paper p="xs" withBorder bg="var(--bg-secondary)">
                              <Text size="xs" c="dimmed">{t('expireDate')}</Text>
                              <Text fw={600} c="red">{cardData?.expireDate}</Text>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={12}>
                            <Paper p="xs" withBorder bg="var(--bg-secondary)">
                              <Text size="xs" c="dimmed">{t('address')}</Text>
                              <Text size="sm">{cardData?.address}</Text>
                            </Paper>
                          </Grid.Col>
                        </Grid>

                        <Divider my="sm" />
                        <Text fw={600} size="sm">{t('additionalInfo')}</Text>
                        <Grid gap="xs">
                          <Grid.Col span={6}>
                            <TextInput 
                              label={t('phone')} 
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
                              label={t('email')} 
                              placeholder="example@mail.com" 
                              value={additionalData.email}
                              onChange={(e) => setAdditionalData({...additionalData, email: e.target.value})}
                            />
                          </Grid.Col>
                          <Grid.Col span={12}>
                            <TextInput 
                              label={t('school')} 
                              placeholder="Enter school name..." 
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
                          <Text c="dimmed" size="sm">{t('noData')}</Text>
                        </Stack>
                      </Center>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="manual">
          <IdCardManualForm 
            manualData={manualData} 
            setManualData={setManualData}
            additionalData={additionalData}
            setAdditionalData={setAdditionalData}
            onRegister={handleRegister}
            loading={false}
            prefixMap={PREFIX_MAP}
          />
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          <ReaderSettings />
        </Tabs.Panel>
      </Tabs>

      <IdCardSuccessModal 
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        ticketUrl={ticketUrl}
        fullName={fullName}
        citizenId={citizenId}
      />

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
    </Stack>
  );
}
