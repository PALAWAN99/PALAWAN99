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
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconBuilding,
  IconPlus,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconCheck,
  IconX,
} from '@tabler/icons-react';

interface Branch {
  id: string;
  code: string;
  nameTh: string;
  nameEn: string;
  nameZh: string;
  address?: string;
  isActive: boolean;
  _count?: {
    gates: number;
  };
}

export default function BranchManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      code: '',
      nameTh: '',
      nameEn: '',
      nameZh: '',
      address: '',
      isActive: true,
    },
    validate: {
      code: (value: string) => (value.length < 2 ? 'Code must be at least 2 characters' : null),
      nameTh: (value: string) => (value.length < 1 ? 'Required' : null),
      nameEn: (value: string) => (value.length < 1 ? 'Required' : null),
      nameZh: (value: string) => (value.length < 1 ? 'Required' : null),
    },
  });

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/branches');
      if (!res.ok) throw new Error('Failed to fetch branches');
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error('Fetch error:', error);
      notifications.show({
        title: 'Error',
        message: 'Could not load branches',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      notifications.show({
        title: 'Success',
        message: 'Branch created successfully',
        color: 'teal',
        icon: <IconCheck size={16} />,
      });

      setModalOpened(false);
      form.reset();
      fetchBranches();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
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

  const rows = branches.map((branch) => (
    <Table.Tr key={branch.id}>
      <Table.Td>
        <Badge variant="light" color="navy" size="sm">
          {branch.code}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Stack gap={0}>
          <Text size="sm" fw={500}>{branch.nameTh}</Text>
          <Text size="xs" c="dimmed">{branch.nameEn}</Text>
        </Stack>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{branch.nameZh}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="dot" color={branch.isActive ? 'teal' : 'red'}>
          {branch.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text size="sm" ta="center" fw={600}>
          {branch._count?.gates || 0}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Tooltip label="แก้ไข">
            <ActionIcon variant="light" color="skyBlue">
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="ลบ">
            <ActionIcon variant="light" color="red">
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs" mb={4}>
            <IconBuilding size={24} color="var(--color-navy)" />
            <Title order={2} c="var(--text-primary)">จัดการสาขา</Title>
          </Group>
          <Text size="sm" c="var(--text-secondary)">
            จัดการข้อมูลสาขา อาคาร และจุดบริการต่างๆ ในระบบ
          </Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchBranches}
            loading={loading}
          >
            รีเฟรช
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setModalOpened(true)}
            color="navy"
          >
            เพิ่มสาขาใหม่
          </Button>
        </Group>
      </Group>

      {/* Main Content */}
      <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead bg="var(--bg-tertiary)">
            <Table.Tr>
              <Table.Th w={120}>รหัสสาขา</Table.Th>
              <Table.Th>ชื่อ (ไทย/อังกฤษ)</Table.Th>
              <Table.Th>ชื่อ (จีน)</Table.Th>
              <Table.Th w={120}>สถานะ</Table.Th>
              <Table.Th w={100} ta="center">จำนวนประตู</Table.Th>
              <Table.Th w={100} ta="right">จัดการ</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="xl">
                    <Stack align="center" gap="xs">
                      <Loader size="sm" />
                      <Text size="xs" c="dimmed">กำลังโหลดข้อมูล...</Text>
                    </Stack>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : branches.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="xl">
                    <Text c="dimmed">ไม่พบข้อมูลสาขา</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Add Branch Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={700}>เพิ่มสาขาใหม่</Text>}
        centered
        radius="md"
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="รหัสสาขา (Branch Code)"
              placeholder="เช่น MAIN, LIB, BLD-A"
              required
              {...form.getInputProps('code')}
            />
            <SimpleGrid cols={2}>
              <TextInput
                label="ชื่อภาษาไทย"
                placeholder="เช่น อาคารหลัก"
                required
                {...form.getInputProps('nameTh')}
              />
              <TextInput
                label="ชื่อภาษาอังกฤษ"
                placeholder="เช่น Main Building"
                required
                {...form.getInputProps('nameEn')}
              />
            </SimpleGrid>
            <TextInput
              label="ชื่อภาษาจีน"
              placeholder="เช่น 主楼"
              required
              {...form.getInputProps('nameZh')}
            />
            <TextInput
              label="ที่อยู่ / หมายเหตุ"
              placeholder="ระบุที่อยู่ของอาคารหรือสาขา"
              {...form.getInputProps('address')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={() => setModalOpened(false)}>
                ยกเลิก
              </Button>
              <Button type="submit" color="navy" loading={submitting}>
                บันทึกข้อมูล
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}

// Helper for SimpleGrid in modal
function SimpleGrid({ children, cols = 2 }: { children: React.ReactNode, cols?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gap: '12px'
    }}>
      {children}
    </div>
  );
}
