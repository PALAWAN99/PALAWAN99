'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Group,
  Stack,
  Card,
  Badge,
  Avatar,
  Box,
  Box,
  SimpleGrid,
  Center,
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconScan,
  IconCheck,
  IconX,
  IconDoorEnter,
  IconDoorExit,
} from '@tabler/icons-react';

interface GateInfo {
  id: string;
  nameTh: string;
  gateCode: string;
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
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [gateInfo, setGateInfo] = useState<GateInfo | null>(null);
  const [direction, setDirection] = useState<'IN' | 'OUT'>('IN');

  // จำลองว่าเราเลือกประตูไว้แล้ว (ในระบบจริงอาจจะดึงจาก Config หรือ Session)
  useEffect(() => {
    // ดึงประตูแรกในระบบมาทดสอบก่อน
    fetch('/api/admin/gates')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setGateInfo(data[0]);
      });
  }, []);

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!token || !gateInfo) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gate/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          gateId: gateInfo.id,
          direction
        }),
      });

      const data = await res.json();
      setResult(data);

      if (data.isValid) {
        // เล่นเสียงแจ้งเตือนสำเร็จ (ถ้าต้องการ)
        setToken(''); // Clear token for next scan
      }
    } catch {
      notifications.show({
        title: 'Error',
        message: t('Common.error'),
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!gateInfo) {
    return <Center h="100vh"><Loader /></Center>;
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Header ประตู */}
        <Paper p="md" radius="md" withBorder shadow="sm" style={{ backgroundColor: '#1E293B' }}>
          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={3} c="white">{gateInfo.nameTh}</Title>
              <Text size="sm" c="dimmed">Gate Code: {gateInfo.gateCode}</Text>
            </Stack>
            <Group>
              <Button 
                variant={direction === 'IN' ? 'filled' : 'light'} 
                color="teal" 
                onClick={() => setDirection('IN')}
                leftSection={<IconDoorEnter size={18} />}
              >
                {t('Gate.in')}
              </Button>
              <Button 
                variant={direction === 'OUT' ? 'filled' : 'light'} 
                color="orange" 
                onClick={() => setDirection('OUT')}
                leftSection={<IconDoorExit size={18} />}
              >
                {t('Gate.out')}
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* ช่องสแกน */}
        <Paper p="xl" radius="lg" withBorder shadow="md">
          <form onSubmit={handleScan}>
            <Stack gap="md">
              <Title order={4} ta="center" mb="xs">{t('Gate.scanPrompt')}</Title>
              <TextInput
                size="xl"
                placeholder={t('Gate.scanPlaceholder')}
                leftSection={<IconScan size={24} />}
                value={token}
                onChange={(e) => setToken(e.currentTarget.value)}
                autoFocus
                styles={{ input: { textAlign: 'center', fontSize: '24px', letterSpacing: '2px' } }}
              />
              <Button size="lg" fullWidth type="submit" loading={loading} color="skyBlue">
                {t('Gate.validate')}
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* ผลลัพธ์ */}
        {result && (
          <Card 
            withBorder 
            radius="lg" 
            p="xl" 
            style={{ 
              borderColor: result.isValid ? '#22C55E' : '#EF4444',
              backgroundColor: result.isValid ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
            }}
          >
            <Group justify="center" mb="md">
              <Avatar 
                size={120} 
                radius={100} 
                color={result.isValid ? 'green' : 'red'}
              >
                {result.isValid ? <IconCheck size={64} /> : <IconX size={64} />}
              </Avatar>
            </Group>

            <Stack align="center" gap="xs">
              <Title order={1} c={result.isValid ? 'green.7' : 'red.7'}>
                {result.isValid ? t('Gate.allowed') : t('Gate.denied')}
              </Title>
              <Text size="lg" fw={600}>{result.message}</Text>
            </Stack>

            {result.member && (
              <Box mt="xl" p="md" style={{ borderTop: '1px solid #E2E8F0' }}>
                <SimpleGrid cols={2}>
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">{t('Member.name')}</Text>
                    <Text fw={700}>{result.member.firstNameTh} {result.member.lastNameTh}</Text>
                  </Stack>
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">{t('Member.type')}</Text>
                    <Badge>{result.member.memberType}</Badge>
                  </Stack>
                </SimpleGrid>
              </Box>
            )}
          </Card>
        )}
      </Stack>
    </Container>
  );
}
