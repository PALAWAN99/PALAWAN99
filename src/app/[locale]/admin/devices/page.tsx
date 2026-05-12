'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Container, Title, Text, Button, Group, Stack, Card, Table, Badge, ActionIcon, TextInput, Modal, Select, Center, Loader, Box, Alert, Code, CopyButton, Menu
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconPlus, IconSearch, IconDotsVertical, IconCheck, IconCopy, IconAlertCircle, IconDevices, IconEdit, IconTrash, IconRefresh, IconCircleFilled
} from '@tabler/icons-react';

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
  
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [newDeviceSecret, setNewDeviceSecret] = useState<string | null>(null);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [devicesRes, gatesRes] = await Promise.all([
        fetch('/api/admin/devices'),
        fetch('/api/admin/gates'),
      ]);
      
      const devicesData = await devicesRes.json();
      const gatesData = await gatesRes.json();
      
      // Handle array or Dev1 ApiSuccess wrapper { data: [...] }
      const deviceList = Array.isArray(devicesData) ? devicesData : (devicesData.data || []);
      const gateList = Array.isArray(gatesData) ? gatesData : (gatesData.data || []);

      setDevices(deviceList);
      setGates(gateList.map((g: any) => ({ value: g.id, label: `${g.nameTh} (${g.gateCode})` })));
    } catch (error) {
      console.error('Fetch error:', error);
      notifications.show({ title: 'Error', message: 'Failed to fetch data', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    const url = editingDevice ? `/api/admin/devices/${editingDevice.id}` : '/api/admin/devices';
    const method = editingDevice ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (res.ok) {
        if (!editingDevice && (data.plainSecret || data.data?.plainSecret)) {
          setNewDeviceSecret(data.plainSecret || data.data.plainSecret);
        } else {
          setModalOpen(false);
        }
        notifications.show({
          title: t('Common.success') || 'Success',
          message: editingDevice ? 'Device updated' : 'Device registered',
          color: 'green',
        });
        fetchData();
      } else {
        throw new Error(data.error?.message || data.error || 'Operation failed');
      }
    } catch (error: any) {
      notifications.show({ title: 'Error', message: error.message || 'Something went wrong', color: 'red' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      const res = await fetch(`/api/admin/devices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      
      notifications.show({ title: t('Common.success') || 'Success', message: 'Device deleted', color: 'green' });
      fetchData();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Delete failed', color: 'red' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'green';
      case 'OFFLINE': return 'gray';
      case 'MAINTENANCE': return 'orange';
      default: return 'gray';
    }
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.deviceCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} c="var(--text-primary)">{t('Device.management')}</Title>
          <Text size="sm" c="var(--text-secondary)">{t('Device.desc')}</Text>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconRefresh size={18} />} onClick={fetchData}>
            {t('Common.refresh') || 'Refresh'}
          </Button>
          <Button 
            color="skyBlue"
            leftSection={<IconPlus size={18} />} 
            onClick={() => {
              setEditingDevice(null);
              setNewDeviceSecret(null);
              form.reset();
              setModalOpen(true);
            }}
          >
            {t('Device.register')}
          </Button>
        </Group>
      </Group>

      <Card withBorder p="md" radius="lg">
        <TextInput
          placeholder={t('Device.searchPlaceholder') || "Search devices..."}
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </Card>

      <Card withBorder p="0" radius="lg" style={{ position: 'relative', overflow: 'hidden' }}>
        {loading && devices.length === 0 ? (
          <Center h={200}><Loader /></Center>
        ) : (
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('Device.code') || 'Device Code'}</Table.Th>
                <Table.Th>{t('Device.name') || 'Name'}</Table.Th>
                <Table.Th>{t('Device.installedGate') || 'Gate'}</Table.Th>
                <Table.Th>{t('Common.type') || 'Type'}</Table.Th>
                <Table.Th>{t('Common.status') || 'Status'}</Table.Th>
                <Table.Th>{t('Common.lastSeen') || 'Last Seen'}</Table.Th>
                <Table.Th ta="right" />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredDevices.map((device) => (
                <Table.Tr key={device.id}>
                  <Table.Td>
                    <Text fw={700} size="sm">{device.deviceCode}</Text>
                  </Table.Td>
                  <Table.Td>{device.name}</Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue">
                      {device.gate?.nameTh || '-'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="outline" size="xs">{device.deviceType}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={6}>
                      <IconCircleFilled size={10} color={`var(--mantine-color-${getStatusColor(device.status)}-filled)`} />
                      <Text size="sm">{device.status}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="xs" c="dimmed">
                      {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : (t('Common.neverConnected') || 'Never')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="flex-end">
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <IconDotsVertical size={18} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item 
                            leftSection={<IconEdit size={16} />}
                            onClick={() => {
                              setEditingDevice(device);
                              setNewDeviceSecret(null);
                              form.setValues({
                                deviceCode: device.deviceCode,
                                name: device.name,
                                gateId: device.gateId,
                                deviceType: device.deviceType,
                              });
                              setModalOpen(true);
                            }}
                          >
                            {t('Common.edit') || 'Edit'}
                          </Menu.Item>
                          <Menu.Item 
                            leftSection={<IconTrash size={16} />} 
                            color="red"
                            onClick={() => handleDelete(device.id)}
                          >
                            {t('Common.delete') || 'Delete'}
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
              {filteredDevices.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Center py="xl">
                      <Stack align="center" gap="xs">
                        <IconDevices size={48} color="var(--mantine-color-gray-4)" />
                        <Text c="dimmed">{t('Common.noData') || 'No devices found'}</Text>
                      </Stack>
                    </Center>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        )}
      </Card>

      {/* Modal ลงทะเบียน / แก้ไข */}
      <Modal 
        opened={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingDevice ? (t('Common.edit') || 'Edit Device') : t('Device.registerNew')}
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
            <Button fullWidth onClick={() => setModalOpen(false)}>{t('Common.finish')}</Button>
          </Stack>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput 
                label={t('Device.code') || 'Device Code'} 
                placeholder="e.g. SCAN-01" 
                required
                disabled={!!editingDevice}
                {...form.getInputProps('deviceCode')}
              />
              <TextInput 
                label={t('Device.name') || 'Device Name'} 
                placeholder="Main Gate Scanner" 
                required
                {...form.getInputProps('name')}
              />
              <Select 
                label={t('Device.installedGate') || 'Gate'}
                placeholder={t('Common.select') || 'Select gate'}
                data={gates}
                required
                searchable
                {...form.getInputProps('gateId')}
              />
              <Select 
                label={t('Common.type') || 'Device Type'}
                data={[
                  { value: 'QR_SCANNER', label: 'QR Code Scanner' },
                  { value: 'ID_CARD_READER', label: 'ID Card Reader' },
                  { value: 'KIOSK', label: 'Kiosk Terminal' },
                ]}
                {...form.getInputProps('deviceType')}
              />
              
              <Group justify="flex-end" mt="xl">
                <Button variant="subtle" onClick={() => setModalOpen(false)}>
                  {t('Common.cancel') || 'Cancel'}
                </Button>
                <Button type="submit" loading={submitting}>
                  {editingDevice ? (t('Common.save') || 'Save') : (t('Device.registerSubmit') || 'Confirm')}
                </Button>
              </Group>
            </Stack>
          </form>
        )}
      </Modal>
    </Stack>
  );
}
