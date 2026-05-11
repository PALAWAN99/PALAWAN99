'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Group,
  Button,
  Table,
  Card,
  ActionIcon,
  Modal,
  TextInput,
  Stack,
  Badge,
  Center,
  Select,
  JsonInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconDoor,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconFilter,
} from '@tabler/icons-react';

import { z } from 'zod';
import { zodResolver } from 'mantine-form-zod-resolver';
import { createGateSchema } from '@/lib/schemas/gate';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface Gate {
  id: string;
  gateCode: string;
  nameTh: string;
  nameEn: string;
  nameZh: string;
  branchId: string;
  direction: 'IN' | 'OUT' | 'BIDIRECTIONAL';
  status: 'ACTIVE' | 'MAINTENANCE' | 'DISABLED';
  branch: {
    nameTh: string;
    code: string;
  };
}

interface Branch {
  id: string;
  nameTh: string;
  code: string;
}

export default function GateManagement() {
  const t = useTranslations();
  const [gates, setGates] = useState<Gate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      gateCode: '',
      nameTh: '',
      nameEn: '',
      nameZh: '',
      branchId: '',
      direction: 'BIDIRECTIONAL' as const,
      status: 'ACTIVE' as const,
      metadata: '{}',
    },
    validate: zodResolver(createGateSchema.extend({
      // Override metadata validation for the form string
      metadata: z.string().refine((val) => {
        try { JSON.parse(val || '{}'); return true; } catch { return false; }
      }, 'Invalid JSON'),
    })),
  });

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // Fetch Branches for dropdown
      const branchRes = await fetch('/api/admin/branches');
      const branchData = await branchRes.json();
      
      if (branchRes.ok && Array.isArray(branchData)) {
        setBranches(branchData);
      } else {
        setBranches([]);
        if (!branchRes.ok) throw new Error(branchData.message || 'Failed to fetch branches');
      }

      // Fetch Gates
      const url = filterBranch ? `/api/admin/gates?branchId=${filterBranch}` : '/api/admin/gates';
      const gateRes = await fetch(url);
      const gateData = await gateRes.json();
      
      if (gateRes.ok && Array.isArray(gateData)) {
        setGates(gateData);
      } else {
        setGates([]);
        if (!gateRes.ok) throw new Error(gateData.message || 'Failed to fetch gates');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      notifications.show({
        title: 'Error',
        message: 'Could not load data',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, [filterBranch]);

  useEffect(() => {
    Promise.resolve().then(() => fetchData(false));
  }, [fetchData]);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        metadata: JSON.parse(values.metadata || '{}'),
      };

      const res = await fetch('/api/admin/gates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Error');

      notifications.show({
        title: 'Success',
        message: 'Gate created successfully',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });

      setModalOpened(false);
      form.reset();
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'teal';
      case 'MAINTENANCE': return 'orange';
      case 'DISABLED': return 'red';
      default: return 'gray';
    }
  };

  const rows = gates.map((gate) => (
    <Table.Tr key={gate.id}>
      <Table.Td>
        <Badge variant="light" color="skyBlue" size="sm">
          {gate.gateCode}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Stack gap={0}>
          <Text size="sm" fw={500}>{gate.nameTh}</Text>
          <Text size="xs" c="dimmed">{gate.nameEn}</Text>
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500}>{gate.branch.nameTh}</Text>
        <Text size="xs" c="dimmed">{gate.branch.code}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color={gate.direction === 'BIDIRECTIONAL' ? 'violet' : 'blue'}>
          {gate.direction}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color={getStatusColor(gate.status)} variant="filled" size="sm">
          {gate.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon variant="light" color="skyBlue"><IconEdit size={16} /></ActionIcon>
          <ActionIcon variant="light" color="red"><IconTrash size={16} /></ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs" mb={4}>
            <IconDoor size={24} color="var(--color-navy)" />
            <Title order={2} c="var(--text-primary)">{t('Gate.management')}</Title>
          </Group>
          <Text size="sm" c="var(--text-secondary)">
            {t('Gate.desc')}
          </Text>
        </div>
        <Group>
          <Select
            placeholder={t('Gate.filterBranch')}
            leftSection={<IconFilter size={16} />}
            data={branches.map(b => ({ value: b.id, label: b.nameTh }))}
            value={filterBranch}
            onChange={setFilterBranch}
            clearable
            w={200}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpened(true)} color="navy">
            {t('Gate.addNew')}
          </Button>
        </Group>
      </Group>

      <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead bg="var(--bg-tertiary)">
            <Table.Tr>
              <Table.Th w={120}>{t('Gate.code')}</Table.Th>
              <Table.Th>{t('Gate.name')}</Table.Th>
              <Table.Th>{t('Gate.branch')}</Table.Th>
              <Table.Th w={120}>{t('Gate.direction')}</Table.Th>
              <Table.Th w={120}>{t('Common.status')}</Table.Th>
              <Table.Th w={100} ta="right">{t('Common.manage')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <LoadingScreen message={t('Common.loading')} minHeight="30vh" />
                </Table.Td>
              </Table.Tr>
            ) : gates.length === 0 ? (
              <Table.Tr><Table.Td colSpan={6}><Center py="xl"><Text c="dimmed">{t('Common.noData')}</Text></Center></Table.Td></Table.Tr>
            ) : rows}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={700}>{t('Gate.addNew')}</Text>}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput label={t('Gate.code')} placeholder="เช่น GATE-01" required {...form.getInputProps('gateCode')} />
              <Select
                label={t('Gate.selectBranch')}
                placeholder={t('Gate.selectBranchPlaceholder')}
                data={branches.map(b => ({ value: b.id, label: b.nameTh }))}
                required
                {...form.getInputProps('branchId')}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput label={t('Common.nameTh')} required {...form.getInputProps('nameTh')} />
              <TextInput label={t('Common.nameEn')} required {...form.getInputProps('nameEn')} />
            </SimpleGrid>
            <TextInput label={t('Common.nameZh')} required {...form.getInputProps('nameZh')} />
            
            <SimpleGrid cols={2}>
              <Select
                label={t('Gate.direction')}
                data={[
                  { value: 'IN', label: 'IN' },
                  { value: 'OUT', label: 'OUT' },
                  { value: 'BIDIRECTIONAL', label: 'BIDIRECTIONAL' },
                ]}
                {...form.getInputProps('direction')}
              />
              <Select
                label={t('Common.status')}
                data={[
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'MAINTENANCE', label: 'MAINTENANCE' },
                  { value: 'DISABLED', label: 'DISABLED' },
                ]}
                {...form.getInputProps('status')}
              />
            </SimpleGrid>

            <JsonInput
              label="Metadata (JSON)"
              placeholder='{"floor": 1, "zone": "A"}'
              validationError="Invalid JSON"
              formatOnBlur
              autosize
              minRows={2}
              {...form.getInputProps('metadata')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setModalOpened(false)}>{t('Common.cancel')}</Button>
              <Button type="submit" color="navy" loading={submitting}>{t('Common.save')}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

function SimpleGrid({ children, cols = 2 }: { children: React.ReactNode, cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '12px' }}>
      {children}
    </div>
  );
}
