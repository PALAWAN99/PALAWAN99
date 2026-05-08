'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Loader,
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
      direction: 'BIDIRECTIONAL',
      status: 'ACTIVE',
      metadata: '{}',
    },
    validate: {
      gateCode: (value: string) => (value.length < 2 ? 'Code required' : null),
      nameTh: (value: string) => (value.length < 1 ? 'Required' : null),
      branchId: (value: string) => (!value ? 'Please select a branch' : null),
    },
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch Branches for dropdown
      const branchRes = await fetch('/api/admin/branches');
      const branchData = await branchRes.json();
      setBranches(branchData);

      // Fetch Gates
      const url = filterBranch ? `/api/admin/gates?branchId=${filterBranch}` : '/api/admin/gates';
      const gateRes = await fetch(url);
      const gateData = await gateRes.json();
      setGates(gateData);
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
    fetchData();
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
            <Title order={2} c="var(--text-primary)">จัดการประตู (Gates)</Title>
          </Group>
          <Text size="sm" c="var(--text-secondary)">
            กำหนดจุดควบคุมการเข้า-ออก และเชื่อมต่อกับอุปกรณ์สแกน
          </Text>
        </div>
        <Group>
          <Select
            placeholder="กรองตามสาขา"
            leftSection={<IconFilter size={16} />}
            data={branches.map(b => ({ value: b.id, label: b.nameTh }))}
            value={filterBranch}
            onChange={setFilterBranch}
            clearable
            w={200}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpened(true)} color="navy">
            เพิ่มประตูใหม่
          </Button>
        </Group>
      </Group>

      <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead bg="var(--bg-tertiary)">
            <Table.Tr>
              <Table.Th w={120}>รหัสประตู</Table.Th>
              <Table.Th>ชื่อประตู</Table.Th>
              <Table.Th>สาขาที่สังกัด</Table.Th>
              <Table.Th w={120}>ทิศทาง</Table.Th>
              <Table.Th w={120}>สถานะ</Table.Th>
              <Table.Th w={100} ta="right">จัดการ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr><Table.Td colSpan={6}><Center py="xl"><Loader size="sm" /></Center></Table.Td></Table.Tr>
            ) : gates.length === 0 ? (
              <Table.Tr><Table.Td colSpan={6}><Center py="xl"><Text c="dimmed">ไม่พบข้อมูลประตู</Text></Center></Table.Td></Table.Tr>
            ) : rows}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={700}>เพิ่มประตูใหม่</Text>}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <SimpleGrid cols={2}>
              <TextInput label="รหัสประตู" placeholder="เช่น GATE-01" required {...form.getInputProps('gateCode')} />
              <Select
                label="เลือกสาขา"
                placeholder="เลือกสาขาที่ประตูสังกัด"
                data={branches.map(b => ({ value: b.id, label: b.nameTh }))}
                required
                {...form.getInputProps('branchId')}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <TextInput label="ชื่อภาษาไทย" required {...form.getInputProps('nameTh')} />
              <TextInput label="ชื่อภาษาอังกฤษ" required {...form.getInputProps('nameEn')} />
            </SimpleGrid>
            <TextInput label="ชื่อภาษาจีน" required {...form.getInputProps('nameZh')} />
            
            <SimpleGrid cols={2}>
              <Select
                label="ทิศทาง"
                data={[
                  { value: 'IN', label: 'ขาเข้า (IN)' },
                  { value: 'OUT', label: 'ขาออก (OUT)' },
                  { value: 'BIDIRECTIONAL', label: 'สองทิศทาง' },
                ]}
                {...form.getInputProps('direction')}
              />
              <Select
                label="สถานะเริ่มต้น"
                data={[
                  { value: 'ACTIVE', label: 'พร้อมใช้งาน' },
                  { value: 'MAINTENANCE', label: 'ซ่อมบำรุง' },
                  { value: 'DISABLED', label: 'ปิดใช้งาน' },
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
              <Button variant="subtle" onClick={() => setModalOpened(false)}>ยกเลิก</Button>
              <Button type="submit" color="navy" loading={submitting}>บันทึกข้อมูล</Button>
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
