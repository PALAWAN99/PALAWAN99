'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Group,
  Button,
  Card,
  Table,
  Badge,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Select,
  Loader,
  Center,
  Tooltip,
} from '@mantine/core';
import {
  IconDevices,
  IconPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconCircleFilled,
  IconKey,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { unwrapApiList } from '@/lib/parse-api-response';

export function DevicesPanel() {
  const t = useTranslations();
  const [devices, setDevices] = useState<any[]>([]);
  const [gates, setGates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any>(null);

  const form = useForm({
    initialValues: {
      deviceCode: '',
      name: '',
      gateId: '',
      deviceType: 'SCANNER',
      secret: '',
    },
    validate: {
      deviceCode: (value) => (value.length < 1 ? 'Required' : null),
      name: (value) => (value.length < 1 ? 'Required' : null),
      gateId: (value) => (value.length < 1 ? 'Required' : null),
      secret: (value, values) => (!editingDevice && value.length < 6 ? 'Min 6 characters' : null),
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [devicesRes, gatesRes] = await Promise.all([
        fetch('/api/admin/devices'),
        fetch('/api/admin/gates'),
      ]);

      const devicesPayload = await devicesRes.json();
      const gatesPayload = await gatesRes.json();

      if (!devicesRes.ok) throw new Error('Failed to load devices');
      if (!gatesRes.ok) throw new Error('Failed to load gates');

      const devicesList = unwrapApiList<any>(devicesPayload);
      const gatesList = unwrapApiList<{ id: string; nameTh: string; gateCode: string }>(gatesPayload);

      setDevices(devicesList);
      setGates(
        gatesList.map((g) => ({
          value: g.id,
          label: `${g.nameTh} (${g.gateCode})`,
        })),
      );
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
    const url = editingDevice ? `/api/admin/devices/${editingDevice.id}` : '/api/admin/devices';
    const method = editingDevice ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Operation failed');

      notifications.show({
        title: t('Common.success'),
        message: editingDevice ? 'Device updated' : 'Device registered',
        color: 'green',
      });

      setModalOpen(false);
      fetchData();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Something went wrong', color: 'red' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this device?')) return;

    try {
      const res = await fetch(`/api/admin/devices/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      notifications.show({ title: t('Common.success'), message: 'Device deleted', color: 'green' });
      fetchData();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Delete failed', color: 'red' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'green';
      case 'OFFLINE':
        return 'gray';
      case 'MAINTENANCE':
        return 'orange';
      default:
        return 'gray';
    }
  };

  if (loading && devices.length === 0) {
    return (
      <Center h="70vh">
        <Loader size="xl" variant="bars" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2} c="var(--text-primary)">
            {t('Device.title')}
          </Title>
        </div>
        <Group>
          <Button variant="light" leftSection={<IconRefresh size={18} />} onClick={fetchData}>
            {t('Common.refresh')}
          </Button>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => {
              setEditingDevice(null);
              form.reset();
              setModalOpen(true);
            }}
          >
            {t('Device.addDevice')}
          </Button>
        </Group>
      </Group>

      <Card withBorder p="0" radius="md">
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('Device.deviceCode')}</Table.Th>
              <Table.Th>{t('Device.deviceName')}</Table.Th>
              <Table.Th>{t('Common.gates')}</Table.Th>
              <Table.Th>{t('Device.deviceType')}</Table.Th>
              <Table.Th>{t('Device.status')}</Table.Th>
              <Table.Th>{t('Device.lastSeen')}</Table.Th>
              <Table.Th ta="right">{t('Common.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {devices.map((device) => (
              <Table.Tr key={device.id}>
                <Table.Td>
                  <Text fw={700} size="sm">
                    {device.deviceCode}
                  </Text>
                </Table.Td>
                <Table.Td>{device.name}</Table.Td>
                <Table.Td>
                  <Badge variant="light" color="blue">
                    {device.gate?.nameTh || 'N/A'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge variant="outline" size="xs">
                    {device.deviceType}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap={6}>
                    <IconCircleFilled
                      size={10}
                      color={`var(--mantine-color-${getStatusColor(device.status)}-filled)`}
                    />
                    <Text size="sm">{device.status}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">
                    {device.lastSeenAt ? new Date(device.lastSeenAt).toLocaleString() : 'Never'}
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
                            form.setValues({
                              deviceCode: device.deviceCode,
                              name: device.name,
                              gateId: device.gateId,
                              deviceType: device.deviceType,
                              secret: '',
                            });
                            setModalOpen(true);
                          }}
                        >
                          {t('Common.edit')}
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconTrash size={16} />}
                          color="red"
                          onClick={() => handleDelete(device.id)}
                        >
                          {t('Common.delete')}
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {devices.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Center py="xl">
                    <Stack align="center" gap="xs">
                      <IconDevices size={48} color="var(--mantine-color-gray-4)" />
                      <Text c="dimmed">No devices found</Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDevice ? t('Common.edit') : t('Device.addDevice')}
        size="md"
        radius="md"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label={t('Device.deviceCode')}
              placeholder="e.g. SCAN-01"
              required
              disabled={!!editingDevice}
              {...form.getInputProps('deviceCode')}
            />
            <TextInput
              label={t('Device.deviceName')}
              placeholder="Main Gate Scanner"
              required
              {...form.getInputProps('name')}
            />
            <Select
              label={t('Common.gates')}
              placeholder="Select gate"
              data={gates}
              required
              searchable
              {...form.getInputProps('gateId')}
            />
            <Select
              label={t('Device.deviceType')}
              data={['SCANNER', 'KIOSK', 'FACE_READER']}
              {...form.getInputProps('deviceType')}
            />
            {!editingDevice && (
              <TextInput
                label={t('Device.secretKey')}
                placeholder="Enter connection secret"
                type="password"
                leftSection={<IconKey size={16} />}
                required
                {...form.getInputProps('secret')}
              />
            )}

            <Group justify="flex-end" mt="xl">
              <Button variant="subtle" onClick={() => setModalOpen(false)}>
                {t('Common.cancel')}
              </Button>
              <Button type="submit">{editingDevice ? t('Common.save') : t('Common.confirm')}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
