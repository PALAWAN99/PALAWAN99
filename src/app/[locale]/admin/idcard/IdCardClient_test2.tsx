ï»¿'use client';

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
  'à¹à¸Âà¹à¸à¸à¹à¸à¸': 'Mr.',
  'à¹à¸Âà¹à¸à¸à¹à¸Â': 'Mrs.',
  'à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸': 'Ms.',
  'à¹à¸â¬à¹à¸âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸': 'Master',
  'à¹à¸â¬à¹à¸âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â': 'Miss',
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
      setError('à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Â à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸âà¹à¸â¢à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸ USB');
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
              setError('à¹ÂÂ à¹à¸Â à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸â¢à¹à¸à¸à¹à¸à¸à¹à¸Â: à¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸');
            }
          }
        }
      } else {
        setError('à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Â à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸âà¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Â');
      }
    } catch (err) {
      setError('à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸');
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
          <Title order={2}>à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Â (Thai ID Card)</Title>
          <Text size="sm" c="dimmed">
            à¹à¸Âà¹à¸à¸à¹à¸âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â Smart Card
          </Text>
        </div>
        <Group gap="xs">
          {isConnected ? (
            <Group gap={8}>
              <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--mantine-color-green-filled)', boxShadow: '0 0 8px var(--mantine-color-green-filled)'}} />
              <Badge color="green" variant="light" size="lg">à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸ (à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â)</Badge>
            </Group>
          ) : (
            <Group gap={8}>
              <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--mantine-color-red-filled)'}} />
              <Badge color="red" variant="light" size="lg">à¹à¸â¢à¹à¸à¸à¹à¸âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸</Badge>
            </Group>
          )}
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List grow>
          <Tabs.Tab value="register" leftSection={<IconId size={18} />}>
            à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸
          </Tabs.Tab>
          <Tabs.Tab value="manual" leftSection={<IconUserPlus size={18} />}>
            à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸à¸à¹à¸Â
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={18} />}>
            à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â
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
                        <Text fw={700} size="lg">à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â</Text>
                        <Text size="sm" c="dimmed" ta="center">
                          à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸âà¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸ Smart Card à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸
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
                        à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸ USB
                      </Button>
                      {process.env.NODE_ENV === 'development' && (
                        <Button
                          size="xs"
                          variant="subtle"
                          color="gray"
                          onClick={() => {
                            setCardData({
                              citizenId: '1-2345-67890-12-3',
                              fullNameTh: 'à¹à¸Âà¹à¸à¸à¹à¸à¸ à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸à¸ à¹à¸âà¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸Â',
                              fullNameEn: 'Mr. Sommot Todsob',
                              birthDate: '15/04/1995',
                              gender: 'à¹à¸Âà¹à¸à¸à¹à¸à¸',
                              address: '123/45 à¹à¸âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸à¸ à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸âà¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸Â à¹à¸â¬à¹à¸Âà¹à¸â¢à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸ 10000',
                              expireDate: '14/04/2030'
                            } as any);
                            setIsConnected(true);
                          }}
                        >
                          [Dev] à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸ (Mock)
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
                        {isConnected ? "à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â" : "à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸âà¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸"}
                      </Badge>
                      <Stack align="center" gap={4}>
                        <Text fw={700} size="lg">
                          {isReading ? 'à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸...' : 'à¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸Â'}
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                          à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â
                        </Text>
                      </Stack>
                      <Group grow w="100%">
                      <Stack gap={4} w="100%">
                        {isReading && (
                          <Text size="xs" c="green" fw={500} ta="center">à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â...</Text>
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
                          à¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸
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
                    <Text fw={700}>à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸âà¹à¸Â</Text>
                    {cardData && (
                      <Button 
                        size="md" 
                        variant="filled" 
                        color="green"
                        leftSection={<IconUserPlus size={18} />}
                        onClick={handleRegister}
                        loading={isReading}
                      >
                        à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â
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
                            <Text size="xs" c="dimmed">à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸-à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸ (TH)</Text>
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
                            <Text size="xs" c="dimmed">à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸â</Text>
                            <Text fw={600}>{cardData?.birthDate || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">à¹à¸â¬à¹à¸Âà¹à¸à¸</Text>
                            <Text fw={600}>{cardData?.gender || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={4}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸</Text>
                            <Text fw={600} color="red">{cardData?.expireDate || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                        <Grid.Col span={12}>
                          <Paper p="xs" withBorder bg="var(--bg-secondary)">
                            <Text size="xs" c="dimmed">à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â</Text>
                            <Text size="sm">{cardData?.address || '-'}</Text>
                          </Paper>
                        </Grid.Col>
                      </Grid>

                      <Divider my="sm" />
                          <Text fw={600} size="sm">à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸â¢à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸âà¹à¸â¢à¹à¸Âà¹à¸à¸</Text>
                          <Grid gutter="xs">
                            <Grid.Col span={6}>
                              <TextInput 
                                label="à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Â" 
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
                                label="à¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸à¸à¹à¸à¸" 
                                placeholder="example@mail.com" 
                                value={additionalData.email}
                                onChange={(e) => setAdditionalData({...additionalData, email: e.target.value})}
                              />
                            </Grid.Col>
                            <Grid.Col span={12}>
                              <TextInput 
                                label="à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸ / à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â" 
                                placeholder="à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸..." 
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
                        <Text c="dimmed" size="sm">à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸ à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸âà¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸</Text>
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
                <Text fw={700}>à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸â¬à¹à¸à¸à¹à¸Â</Text>
                <Button 
                  size="md" 
                  variant="filled" 
                  color="green"
                  leftSection={<IconUserPlus size={18} />}
                  onClick={handleRegister}
                  loading={isReading}
                >
                  à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â
                </Button>
              </Group>
              <Divider />

              <TextInput 
                label="à¹à¸â¬à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Â" 
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
                  label="à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸ (TH)"
                  placeholder="à¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â"
                  data={['à¹à¸Âà¹à¸à¸à¹à¸à¸', 'à¹à¸Âà¹à¸à¸à¹à¸Â', 'à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸', 'à¹à¸â¬à¹à¸âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸', 'à¹à¸â¬à¹à¸âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â']}
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
                  label="à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸ (à¹à¸Â à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸)" 
                  placeholder="à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸" 
                  value={manualData.firstNameTh}
                  onChange={(e) => setManualData({...manualData, firstNameTh: e.target.value})}
                />
                <TextInput 
                  label="à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸ (à¹à¸Â à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸)" 
                  placeholder="à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸" 
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
                  label="à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸ (English)" 
                  placeholder="First Name" 
                  value={manualData.firstNameEn}
                  onChange={(e) => setManualData({...manualData, firstNameEn: e.target.value})}
                />
                <TextInput 
                  label="à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸ (English)" 
                  placeholder="Last Name" 
                  value={manualData.lastNameEn}
                  onChange={(e) => setManualData({...manualData, lastNameEn: e.target.value})}
                />
              </Group>

              <Group grow>
                <TextInput 
                  label="à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸â (à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸Âà¹à¸Â à¹à¸Â.à¹à¸à¸.)" 
                  placeholder="à¹à¸â¬à¹à¸Âà¹à¸Âà¹à¸Â 15/04/2538" 
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
                  label="à¹à¸â¬à¹à¸Âà¹à¸à¸"
                  placeholder="à¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â"
                  data={['à¹à¸Âà¹à¸à¸à¹à¸à¸', 'à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â']}
                  value={manualData.gender}
                  onChange={(val) => setManualData({...manualData, gender: val || ''})}
                />
              </Group>

              <TextInput 
                label="à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â" 
                placeholder="à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸Â à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â à¹à¸Âà¹à¸à¸à¹à¸à¸ à¹à¸âà¹à¸Âà¹à¸Â à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Â à¹à¸â¬à¹à¸Âà¹à¸â¢ à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸â à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸Â" 
                value={manualData.address}
                onChange={(e) => setManualData({...manualData, address: e.target.value})}
              />

              <Divider my="sm" />
              <Text fw={600} size="sm">à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸â¢à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸âà¹à¸â¢à¹à¸Âà¹à¸à¸</Text>
              
              <Group grow>
                <TextInput 
                  label="à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Â" 
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
                  label="à¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸à¸à¹à¸à¸" 
                  placeholder="example@mail.com" 
                  value={additionalData.email}
                  onChange={(e) => setAdditionalData({...additionalData, email: e.target.value})}
                />
              </Group>

              <TextInput 
                label="à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸ / à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â" 
                placeholder="à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸..." 
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
                <Text fw={700}>à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸ (Web USB)</Text>
              </Group>
              <Divider />
              
              <Text size="sm">
                à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Â Web USB API à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Â 
                à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸â¢à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸â¢à¹à¸à¸à¹à¸âà¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸Â Driver à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸â¢à¹à¸à¸à¹à¸à¸ (à¹à¸â¬à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â CCID)
              </Text>

              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Stack gap="xs">
                      <Text fw={600} size="sm">Vendor IDs à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Â</Text>
                      <Group gap="xs">
                        <Badge variant="outline">0x072F (ACS)</Badge>
                        <Badge variant="outline">0x04E6 (SCM)</Badge>
                        <Badge variant="outline">0x076B (HID)</Badge>
                        <Badge variant="outline">0x08E6 (Gemalto)</Badge>
                      </Group>
                      <Text size="xs" c="dimmed" mt="xs">
                        à¹à¸Âà¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸ Vendor ID à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸â¬à¹à¸â¢à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Â `src/lib/idcard/reader.ts`
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper withBorder p="md" radius="md">
                    <Stack gap="xs">
                      <Text fw={600} size="sm">à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Â</Text>
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
        title={<Text fw={700}>à¹à¸à¸à¹à¸à¸à¹à¸Â E-Ticket à¹à¸â¬à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸à¸</Text>}
        centered
        size="md"
        radius="lg"
      >
        <Stack align="center" py="xl" gap="xl">
          <Stack align="center" gap={4}>
            <Text fw={800} size="xl" c="skyBlue">à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸</Text>
            <Text size="sm" c="dimmed" ta="center">
              à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸âà¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Â QR Code à¹à¸âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Â<br/>à¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸à¸à¹à¸Â E-Ticket à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â
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
              à¹à¸â¬à¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸à¸: {activeTab === 'manual' ? manualData.citizenId : cardData?.citizenId}
            </Text>
          </Stack>

          <Group grow w="100%">
            <Button size="md" variant="light" color="gray" onClick={() => setShowSuccessModal(false)}>
              à¹à¸Âà¹à¸à¸à¹à¸âà¹à¸à¸à¹à¸Âà¹à¸Âà¹à¸à¸à¹à¸â¢à¹à¸Âà¹à¸à¸à¹à¸Â
            </Button>
            {ticketUrl && (
              <Button 
                size="md" 
                color="skyBlue" 
                component="a" 
                href={ticketUrl} 
                target="_blank"
              >
                à¹à¸âà¹à¸âà¹à¸à¸à¹à¸à¸à¹à¸Âà¹à¸â¬à¹à¸Âà¹à¸à¸à¹à¸âà¹à¸â¢à¹à¸à¸à¹à¸Âà¹à¸à¸
              </Button>
            )}
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
