'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Stack,
  Group,
  Card,
  Table,
  Badge,
  TextInput,
  LoadingOverlay,
  Modal,
  Button,
  Tooltip,
  ActionIcon,
  Alert,
  SimpleGrid,
  Switch,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconSettings,
  IconSearch,
  IconEdit,
  IconCheck,
  IconX,
  IconNetwork,
  IconRefresh,
} from '@tabler/icons-react';
import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage, unwrapApiData } from '@/lib/parse-api-response';
import type { PennuengGateSettingsRow } from '@/types/pennueng-gate-settings';

type FormValues = {
  gateIp: string;
  gateSubnet: string;
  gateGateway: string;
  gatePort: string;
  serverIp: string;
  rfidIp: string;
  inputIp: string;
  gateStatus: boolean;
};

function rowToForm(row: PennuengGateSettingsRow): FormValues {
  return {
    gateIp: row.gateIp ?? '',
    gateSubnet: row.gateSubnet ?? '',
    gateGateway: row.gateGateway ?? '',
    gatePort: row.gatePort ?? '',
    serverIp: row.serverIp ?? '',
    rfidIp: row.rfidIp ?? '',
    inputIp: row.inputIp ?? '',
    gateStatus: row.gateStatus === 1,
  };
}

export function GateDeviceSettingsClient() {
  const t = useTranslations('Settings');
  const tc = useTranslations('Common');

  const [gates, setGates] = useState<PennuengGateSettingsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editingGate, setEditingGate] = useState<PennuengGateSettingsRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      gateIp: '',
      gateSubnet: '',
      gateGateway: '',
      gatePort: '',
      serverIp: '',
      rfidIp: '',
      inputIp: '',
      gateStatus: true,
    },
  });

  const fetchGates = useCallback(async () => {
    setLoading(true);
    setUnavailable(null);
    try {
      const res = await fetch(apiPath('/api/admin/settings/gates'));
      const json = await res.json();
      if (res.status === 503) {
        setUnavailable(getApiErrorMessage(json) || t('sqlUnavailable'));
        setGates([]);
        return;
      }
      if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
      const data = unwrapApiData<{ gates: PennuengGateSettingsRow[] }>(json);
      setGates(data.gates ?? []);
    } catch (error) {
      notifications.show({
        color: 'red',
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, [t, tc]);

  useEffect(() => {
    void fetchGates();
  }, [fetchGates]);

  const filteredGates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return gates;
    return gates.filter((g) =>
      [
        g.gateId,
        g.gateName,
        g.displayLabel,
        g.branchDesc,
        g.gateIp,
        g.serverIp,
        g.rfidIp,
        g.inputIp,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [gates, search]);

  const requestOpenEdit = (gate: PennuengGateSettingsRow) => {
    modals.openConfirmModal({
      title: t('editConfirmTitle'),
      centered: true,
      children: <Text size="sm">{t('editConfirmMessage', { name: gate.displayLabel })}</Text>,
      labels: { confirm: t('edit'), cancel: tc('cancel') },
      confirmProps: { color: 'skyBlue' },
      onConfirm: () => {
        setEditingGate(gate);
        form.setValues(rowToForm(gate));
      },
    });
  };

  const closeModal = () => {
    setEditingGate(null);
    form.reset();
  };

  const submitUpdate = async (values: FormValues) => {
    if (!editingGate) return;
    setSubmitting(true);
    try {
      const res = await fetch(apiPath(`/api/admin/settings/gates/${encodeURIComponent(editingGate.gateId)}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateIp: values.gateIp.trim() || null,
          gateSubnet: values.gateSubnet.trim() || null,
          gateGateway: values.gateGateway.trim() || null,
          gatePort: values.gatePort.trim() || null,
          serverIp: values.serverIp.trim() || null,
          rfidIp: values.rfidIp.trim() || null,
          inputIp: values.inputIp.trim() || null,
          gateStatus: values.gateStatus ? 1 : 0,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(getApiErrorMessage(json) || tc('error'));
      notifications.show({
        color: 'teal',
        title: tc('success'),
        message: json.message ?? t('saveSuccess'),
        icon: <IconCheck size={16} />,
      });
      closeModal();
      await fetchGates();
    } catch (error) {
      notifications.show({
        color: 'red',
        title: tc('error'),
        message: error instanceof Error ? error.message : tc('error'),
        icon: <IconX size={16} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveRequest = (values: FormValues) => {
    if (!editingGate) return;
    modals.openConfirmModal({
      title: t('saveConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          {t('saveConfirmMessage', {
            name: editingGate.displayLabel,
            gateIp: values.gateIp || '—',
          })}
        </Text>
      ),
      labels: { confirm: tc('save'), cancel: tc('cancel') },
      confirmProps: { color: 'teal' },
      onConfirm: () => void submitUpdate(values),
    });
  };

  const requestRefresh = () => {
    modals.openConfirmModal({
      title: t('refreshConfirmTitle'),
      centered: true,
      children: <Text size="sm">{t('refreshConfirmMessage')}</Text>,
      labels: { confirm: t('refresh'), cancel: tc('cancel') },
      onConfirm: () => void fetchGates(),
    });
  };

  const handleStatusToggle = (checked: boolean) => {
    modals.openConfirmModal({
      title: checked ? t('activateConfirmTitle') : t('deactivateConfirmTitle'),
      centered: true,
      children: (
        <Text size="sm">
          {checked ? t('activateConfirmMessage') : t('deactivateConfirmMessage')}
        </Text>
      ),
      labels: { confirm: tc('confirm'), cancel: tc('cancel') },
      confirmProps: { color: checked ? 'teal' : 'orange' },
      onConfirm: () => form.setFieldValue('gateStatus', checked),
    });
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <div>
          <Group gap="xs" mb={4}>
            <IconSettings size={28} color="var(--color-navy)" />
            <Title order={2}>{t('title')}</Title>
          </Group>
          <Text size="sm" c="dimmed">
            {t('subtitle')}
          </Text>
        </div>
        <Button
          variant="light"
          color="navy"
          leftSection={<IconRefresh size={16} />}
          onClick={requestRefresh}
        >
          {t('refresh')}
        </Button>
      </Group>

      {unavailable ? (
        <Alert color="orange" title={t('sqlUnavailableTitle')}>
          {unavailable}
        </Alert>
      ) : null}

      <Card withBorder p="md" radius="md">
        <Group justify="space-between" wrap="wrap" gap="sm">
          <TextInput
            placeholder={t('searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 260 }}
          />
          <Badge size="lg" variant="light" color="navy">
            {t('resultCount', { count: filteredGates.length, total: gates.length })}
          </Badge>
        </Group>
      </Card>

      <Card withBorder p={0} radius="md" style={{ position: 'relative', overflow: 'hidden' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ blur: 2 }} />
        <Table.ScrollContainer minWidth={1100}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead bg="var(--bg-tertiary)">
              <Table.Tr>
                <Table.Th>{t('gate')}</Table.Th>
                <Table.Th>{t('branch')}</Table.Th>
                <Table.Th>{t('gateIp')}</Table.Th>
                <Table.Th>{t('serverIp')}</Table.Th>
                <Table.Th>{t('rfidIp')}</Table.Th>
                <Table.Th>{t('inputIp')}</Table.Th>
                <Table.Th>{t('gatePort')}</Table.Th>
                <Table.Th>{t('deviceStatus')}</Table.Th>
                <Table.Th w={72} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredGates.map((gate) => (
                <Table.Tr key={gate.gateId}>
                  <Table.Td>
                    <Stack gap={0}>
                      <Text fw={600} size="sm">
                        {gate.displayLabel}
                      </Text>
                      <Text size="xs" c="dimmed" ff="monospace">
                        {gate.gateName} · {gate.gateId}
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{gate.branchDesc ?? gate.branchId ?? '—'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {gate.gateIp ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {gate.serverIp ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {gate.rfidIp ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {gate.inputIp ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">
                      {gate.gatePort ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={gate.gateStatus === 1 ? 'teal' : 'gray'} variant="light">
                      {gate.gateStatus === 1 ? t('deviceActive') : t('deviceInactive')}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Tooltip label={t('edit')}>
                      <ActionIcon
                        variant="light"
                        color="skyBlue"
                        aria-label={t('edit')}
                        onClick={() => requestOpenEdit(gate)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
        {filteredGates.length === 0 && !loading ? (
          <Text ta="center" py="xl" c="dimmed">
            {search.trim() ? t('noSearchResults') : tc('noData')}
          </Text>
        ) : null}
      </Card>

      <Modal
        opened={editingGate !== null}
        onClose={() => {
          modals.openConfirmModal({
            title: t('closeConfirmTitle'),
            centered: true,
            children: <Text size="sm">{t('closeConfirmMessage')}</Text>,
            labels: { confirm: tc('cancel'), cancel: t('keepEditing') },
            confirmProps: { color: 'gray' },
            onConfirm: closeModal,
          });
        }}
        title={
          <Group gap="xs">
            <IconNetwork size={20} />
            <Text fw={700}>{t('editModalTitle', { name: editingGate?.displayLabel ?? '' })}</Text>
          </Group>
        }
        size="lg"
        radius="md"
        overlayProps={{ blur: 3, opacity: 0.55 }}
      >
        <form onSubmit={form.onSubmit(handleSaveRequest)}>
          <Stack gap="md">
            <Alert color="blue" variant="light">
              {t('editModalHint')}
            </Alert>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label={t('gateIp')} placeholder="192.168.1.10" {...form.getInputProps('gateIp')} />
              <TextInput label={t('gatePort')} placeholder="80" {...form.getInputProps('gatePort')} />
              <TextInput label={t('gateSubnet')} placeholder="255.255.255.0" {...form.getInputProps('gateSubnet')} />
              <TextInput label={t('gateGateway')} placeholder="192.168.1.1" {...form.getInputProps('gateGateway')} />
              <TextInput label={t('serverIp')} placeholder="192.168.1.2" {...form.getInputProps('serverIp')} />
              <TextInput label={t('rfidIp')} placeholder="192.168.1.3" {...form.getInputProps('rfidIp')} />
              <TextInput label={t('inputIp')} placeholder="192.168.1.4" {...form.getInputProps('inputIp')} />
            </SimpleGrid>
            <Switch
              label={t('deviceStatus')}
              description={t('deviceStatusHint')}
              checked={form.values.gateStatus}
              onChange={(e) => handleStatusToggle(e.currentTarget.checked)}
            />
            <Group justify="flex-end" mt="md">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  modals.openConfirmModal({
                    title: t('closeConfirmTitle'),
                    centered: true,
                    children: <Text size="sm">{t('closeConfirmMessage')}</Text>,
                    labels: { confirm: tc('cancel'), cancel: t('keepEditing') },
                    confirmProps: { color: 'gray' },
                    onConfirm: closeModal,
                  });
                }}
              >
                {tc('cancel')}
              </Button>
              <Button color="skyBlue" type="submit" loading={submitting} leftSection={<IconCheck size={16} />}>
                {tc('save')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
