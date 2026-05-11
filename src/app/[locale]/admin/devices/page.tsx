'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Table,
  Badge,
  ActionIcon,
  TextInput,
  Modal,
  Select,
  LoadingOverlay,
  Box,
  Alert,
  Code,
  CopyButton,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconDeviceCamera,
  IconPlus,
  IconSearch,
  IconDotsVertical,
  IconRefresh,
  IconTrash,
  IconCheck,
  IconX,
  IconCopy,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface Device {
  id: string;
  name: string;
  deviceCode: string;
  deviceType: string;
  status: string;
  lastSeenAt: string | null;
  gateId: string;
  gate?: {
    nameTh: string;
    gateCode: string;
  };
}

export default function DevicesPage() {
  const t = useTranslations();
  const [devices, setDevices] = useState<Device[]>([]);
  const [gates, setGates] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newDeviceSecret, setNewDeviceSecret] = useState<string | null>(null);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/devices');
      const data = await res.json();
      if (Array.isArray(data)) setDevices(data);
    } catch (error) {
      console.error('Fetch devices failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGates = async () => {
    try {
      const res = await fetch('/api/admin/gates');
      const data = await res.json();
      if (Array.isArray(data)) {
        setGates(data.map((g: any) => ({ value: g.id, label: `${g.nameTh} (${g.gateCode})` })));
      }
    } catch (error) {
      console.error('Fetch gates failed:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchGates();
  }, []);

  const form = useForm({
    initialValues: {
      name: '',
      deviceCode: '',
      gateId: '',
      deviceType: 'QR_SCANNER',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name too short' : null),
      deviceCode: (value) => (value.length < 3 ? 'Code too short' : null),
      gateId: (value) => (!value ? 'Select a gate' : null),
    },
  });

  const handleCreate = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        setNewDeviceSecret(data.plainSecret);
        notifications.show({
          title: 'สำเร็จ',
          message: 'ลงทะเบียนอุปกรณ์ใหม่แล้ว',
          color: 'green',
        });
        fetchDevices();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      notifications.show({
        title: 'เกิดข้อผิดพลาด',
        message: error.message,
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.deviceCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Stack gap={0}>
            <Title order={2} style={{ color: '#F8FAFC' }}>{t('Device.management')}</Title>
            <Text size="sm" c="dimmed">{t('Device.desc')}</Text>
          </Stack>
          <Button 
            leftSection={<IconPlus size={18} />} 
            color="skyBlue"
            onClick={() => {
              setNewDeviceSecret(null);
              setModalOpened(true);
            }}
          >
            {t('Device.register')}
          </Button>
        </Group>

        <Card withBorder p="md" radius="lg" style={{ background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <TextInput
            placeholder={t('Device.searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </Card>

        <Card withBorder radius="lg" p={0} style={{ position: 'relative', overflow: 'hidden', background: 'rgba(30, 41, 59, 0.5)', borderColor: '#334155' }}>
          <LoadingOverlay visible={loading} />
          <Table verticalSpacing="md">
            <Table.Thead style={{ background: '#1E293B' }}>
              <Table.Tr>
                <Table.Th style={{ color: '#94A3B8' }}>{t('Common.device')}</Table.Th>
                <Table.Th style={{ color: '#94A3B8' }}>{t('Common.type')}</Table.Th>
                <Table.Th style={{ color: '#94A3B8' }}>{t('Device.installedGate')}</Table.Th>
                <Table.Th style={{ color: '#94A3B8' }}>{t('Common.status')}</Table.Th>
                <Table.Th style={{ color: '#94A3B8' }}>{t('Common.lastSeen')}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredDevices.map((device) => (
                <Table.Tr key={device.id}>
                  <Table.Td>
                    <Stack gap={0}>
                      <Text fw={600} size="sm" style={{ color: '#F8FAFC' }}>{device.name}</Text>
                      <Text size="xs" c="dimmed">{device.deviceCode}</Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline" color="gray">{device.deviceType}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" style={{ color: '#F8FAFC' }}>{device.gate?.nameTh || '-'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={device.status === 'ONLINE' ? 'green' : 'red'} variant="dot">
                      {device.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : t('Common.neverConnected')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="subtle" color="gray">
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          {filteredDevices.length === 0 && !loading && (
            <Box py={50} ta="center"><Text c="dimmed">{t('Common.noData')}</Text></Box>
          )}
        </Card>

        {/* Modal ลงทะเบียน */}
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={t('Device.registerNew')}
          size="md"
          radius="md"
        >
          {newDeviceSecret ? (
            <Stack gap="md">
              <Alert icon={<IconAlertCircle size={16} />} title={t('Device.saveSecret')} color="yellow">
                {t('Device.saveSecretDesc')}
              </Alert>
              <Group grow>
                <Code block style={{ fontSize: '14px', padding: '12px' }}>{newDeviceSecret}</Code>
                <CopyButton value={newDeviceSecret}>
                  {({ copied, copy }) => (
                    <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                    </Button>
                  )}
                </CopyButton>
              </Group>
              <Button fullWidth onClick={() => setModalOpened(false)}>{t('Common.finish')}</Button>
            </Stack>
          ) : (
            <form onSubmit={form.onSubmit(handleCreate)}>
              <Stack gap="md">
                <TextInput label={t('Device.name')} placeholder={t('Device.namePlaceholder')} required {...form.getInputProps('name')} />
                <TextInput label={t('Device.code')} placeholder={t('Device.codePlaceholder')} required {...form.getInputProps('deviceCode')} />
                <Select label={t('Device.installedGate')} placeholder={t('Common.select')} data={gates} required {...form.getInputProps('gateId')} />
                <Select
                  label={t('Common.type')}
                  data={[
                    { value: 'QR_SCANNER', label: 'QR Code Scanner' },
                    { value: 'ID_CARD_READER', label: 'ID Card Reader' },
                    { value: 'KIOSK', label: 'Kiosk Terminal' },
                  ]}
                  {...form.getInputProps('deviceType')}
                />
                <Button fullWidth type="submit" loading={submitting} mt="md">{t('Device.registerSubmit')}</Button>
              </Stack>
            </form>
          )}
        </Modal>
      </Stack>
    </Container>
  );
}
