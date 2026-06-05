'use client';

import { useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
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
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
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

import { unwrapApiList, getApiErrorMessage } from '@/lib/parse-api-response';
import { useThaiRealtimeTranslate } from '@/lib/use-thai-realtime-translate';
import {
  isBranchCodeTaken,
  normalizeBranchCode,
  suggestNextBranchCode,
} from '@/lib/branch-code';
import { FacultyBranchesOverview } from './FacultyBranchesOverview';

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

export function BranchesPanel() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [facultyRefreshKey, setFacultyRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const userEditedCode = useRef(false);

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
      code: (value: string) => {
        const code = normalizeBranchCode(value);
        if (code.length < 2) return 'รหัสสาขาต้องมีอย่างน้อย 2 ตัวอักษร';
        const otherCodes = branches
          .filter((b) => b.id !== editingBranchId)
          .map((b) => b.code);
        if (isBranchCodeTaken(code, otherCodes)) {
          return 'รหัสสาขานี้มีในระบบแล้ว';
        }
        return null;
      },
      nameTh: (value: string) => (value.length < 1 ? 'Required' : null),
      nameEn: (value: string) => (value.length < 1 ? 'Required' : null),
      nameZh: (value: string) => (value.length < 1 ? 'Required' : null),
    },
  });

  const applyTranslation = useCallback(
    (data: { nameEn: string; nameZh: string }) => {
      form.setFieldValue('nameEn', data.nameEn);
      form.setFieldValue('nameZh', data.nameZh);
    },
    [form],
  );

  const { translating, scheduleFromThai, markUserEditedI18n, reset: resetTranslate } =
    useThaiRealtimeTranslate(applyTranslation);

  const closeBranchModal = useCallback(() => {
    resetTranslate();
    setEditingBranchId(null);
    setModalOpened(false);
  }, [resetTranslate]);

  const openNewBranchModal = useCallback(() => {
    resetTranslate();
    userEditedCode.current = false;
    setEditingBranchId(null);
    const codes = branches.map((b) => b.code);
    form.setValues({
      code: suggestNextBranchCode(codes),
      nameTh: '',
      nameEn: '',
      nameZh: '',
      address: '',
      isActive: true,
    });
    setModalOpened(true);
  }, [branches, form, resetTranslate]);

  const openEditBranchModal = useCallback(
    (branch: Branch) => {
      resetTranslate();
      userEditedCode.current = true;
      setEditingBranchId(branch.id);
      form.setValues({
        code: branch.code,
        nameTh: branch.nameTh,
        nameEn: branch.nameEn,
        nameZh: branch.nameZh,
        address: branch.address ?? '',
        isActive: branch.isActive,
      });
      setModalOpened(true);
    },
    [form, resetTranslate],
  );

  const loadBranchesFromApi = useCallback(async (): Promise<Branch[]> => {
    const res = await fetch('/api/admin/branches');
    const payload = await res.json();
    if (!res.ok) {
      throw new Error(getApiErrorMessage(payload) || 'Failed to fetch branches');
    }
    return unwrapApiList<Branch>(payload);
  }, []);

  const showLoadError = useCallback((error: unknown) => {
    console.error('Fetch error:', error);
    notifications.show({
      title: 'Error',
      message: error instanceof Error ? error.message : 'Could not load branches',
      color: 'red',
      icon: <IconX size={16} />,
    });
  }, []);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      setBranches(await loadBranchesFromApi());
    } catch (error) {
      setBranches([]);
      showLoadError(error);
    } finally {
      setLoading(false);
    }
  }, [loadBranchesFromApi, showLoadError]);

  const requestDeleteBranch = useCallback(
    (branch: Branch) => {
      const gateCount = branch._count?.gates ?? 0;
      if (gateCount > 0) {
        notifications.show({
          title: 'ลบไม่ได้',
          message: `สาขานี้มีประตูผูกอยู่ ${gateCount} รายการ — ย้ายหรือลบประตูก่อน`,
          color: 'orange',
          icon: <IconX size={16} />,
        });
        return;
      }
      modals.openConfirmModal({
        title: 'ยืนยันลบสาขา',
        children: (
          <Text size="sm">
            ต้องการลบ <strong>{branch.nameTh}</strong> ({branch.code}) ใช่หรือไม่?
          </Text>
        ),
        labels: { confirm: 'ลบ', cancel: 'ยกเลิก' },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
          try {
            const res = await fetch(`/api/admin/branches/${branch.id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok) {
              throw new Error(getApiErrorMessage(result) || 'ลบไม่สำเร็จ');
            }
            notifications.show({
              title: 'สำเร็จ',
              message:
                (result as { message?: string }).message ?? 'ลบข้อมูลสาขาเรียบร้อยแล้ว',
              color: 'teal',
              icon: <IconCheck size={16} />,
            });
            await fetchBranches();
            setFacultyRefreshKey((k) => k + 1);
          } catch (error: unknown) {
            notifications.show({
              title: 'เกิดข้อผิดพลาด',
              message: error instanceof Error ? error.message : 'ลบไม่สำเร็จ',
              color: 'red',
              icon: <IconX size={16} />,
            });
          }
        },
      });
    },
    [fetchBranches],
  );

  useEffect(() => {
    let cancelled = false;
    void loadBranchesFromApi()
      .then((list) => {
        if (!cancelled) setBranches(list);
      })
      .catch((error) => {
        if (cancelled) return;
        setBranches([]);
        showLoadError(error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadBranchesFromApi, showLoadError]);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        code: normalizeBranchCode(values.code),
      };
      const isEdit = editingBranchId !== null;
      const res = await fetch(
        isEdit ? `/api/admin/branches/${editingBranchId}` : '/api/admin/branches',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(getApiErrorMessage(result) || 'Something went wrong');
      }

      notifications.show({
        title: 'สำเร็จ',
        message:
          (result as { message?: string }).message ??
          (isEdit ? 'แก้ไขข้อมูลสาขาเรียบร้อยแล้ว' : 'สร้างสาขาใหม่เรียบร้อยแล้ว'),
        color: 'teal',
        icon: <IconCheck size={16} />,
      });

      closeBranchModal();
      form.reset();
      fetchBranches();
      setFacultyRefreshKey((k) => k + 1);
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
          <Text size="sm" fw={500}>
            {branch.nameTh}
          </Text>
          <Text size="xs" c="dimmed">
            {branch.nameEn}
          </Text>
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
            <ActionIcon
              variant="light"
              color="skyBlue"
              aria-label="แก้ไขสาขา"
              onClick={() => openEditBranchModal(branch)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip
            label={
              (branch._count?.gates ?? 0) > 0
                ? `มีประตู ${branch._count?.gates} รายการ — ลบไม่ได้`
                : 'ลบสาขา'
            }
          >
            <ActionIcon
              variant="light"
              color="red"
              aria-label="ลบสาขา"
              disabled={(branch._count?.gates ?? 0) > 0}
              onClick={() => requestDeleteBranch(branch)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <FacultyBranchesOverview
        refreshKey={facultyRefreshKey}
        onBranchCreated={() => {
          fetchBranches();
          setFacultyRefreshKey((k) => k + 1);
        }}
      />

      <Divider label="สาขาในระบบ (PostgreSQL)" labelPosition="center" />

      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs">
            <IconBuilding size={24} color="var(--color-navy)" />
            <Title order={2} c="var(--text-primary)">
              จัดการสาขา
            </Title>
          </Group>
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
            onClick={openNewBranchModal}
            color="navy"
          >
            เพิ่มสาขาใหม่
          </Button>
        </Group>
      </Group>

      <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead bg="var(--bg-tertiary)">
            <Table.Tr>
              <Table.Th w={120}>รหัสสาขา</Table.Th>
              <Table.Th>ชื่อ (ไทย/อังกฤษ)</Table.Th>
              <Table.Th>ชื่อ (จีน)</Table.Th>
              <Table.Th w={120}>สถานะ</Table.Th>
              <Table.Th w={100} ta="center">
                จำนวนประตู
              </Table.Th>
              <Table.Th w={100} ta="right">
                จัดการ
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {loading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center py="xl">
                    <Stack align="center" gap="xs">
                      <Loader size="sm" />
                      <Text size="xs" c="dimmed">
                        กำลังโหลดข้อมูล...
                      </Text>
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

      <Modal
        opened={modalOpened}
        onClose={closeBranchModal}
        title={
          <Text fw={700}>{editingBranchId ? 'แก้ไขสาขา' : 'เพิ่มสาขาใหม่'}</Text>
        }
        centered
        radius="md"
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group align="flex-end" wrap="nowrap" gap="xs">
              <TextInput
                label="รหัสสาขา (Branch Code)"
                placeholder="เช่น BR001"
                description={
                  editingBranchId
                    ? 'รหัสสาขา — แก้ไขได้ถ้าไม่ซ้ำกับสาขาอื่น'
                    : 'สร้างอัตโนมัติ (BR001, BR002, …) — แก้ไขได้'
                }
                required
                style={{ flex: 1 }}
                value={form.values.code}
                onChange={(e) => {
                  userEditedCode.current = true;
                  form.setFieldValue('code', normalizeBranchCode(e.currentTarget.value));
                }}
                error={form.errors.code}
              />
              {!editingBranchId ? (
                <Button
                  type="button"
                  variant="light"
                  color="gray"
                  size="sm"
                  mb={form.errors.code ? 22 : 4}
                  onClick={() => {
                    const codes = branches.map((b) => b.code);
                    form.setFieldValue('code', suggestNextBranchCode(codes));
                    userEditedCode.current = false;
                  }}
                >
                  สร้างรหัสใหม่
                </Button>
              ) : null}
            </Group>
            <Text size="xs" c="dimmed">
              พิมพ์ชื่อภาษาไทย — ระบบแปลเติมอังกฤษและจีนให้ทันทีขณะพิมพ์ (แก้ช่อง EN/ZH เองได้ จะไม่แปลทับจนกว่าจะเปิดฟอร์มใหม่)
            </Text>
            <SimpleGrid cols={2}>
              <TextInput
                label="ชื่อภาษาไทย"
                placeholder="เช่น อาคารหลัก"
                required
                value={form.values.nameTh}
                onChange={(e) => {
                  const v = e.currentTarget.value;
                  form.setFieldValue('nameTh', v);
                  scheduleFromThai(v);
                }}
                error={form.errors.nameTh}
                rightSection={translating ? <Loader size="xs" /> : undefined}
              />
              <TextInput
                label="ชื่อภาษาอังกฤษ"
                placeholder="เช่น Main Building"
                required
                value={form.values.nameEn}
                onChange={(e) => {
                  markUserEditedI18n();
                  form.setFieldValue('nameEn', e.currentTarget.value);
                }}
                error={form.errors.nameEn}
                rightSection={translating ? <Loader size="xs" /> : undefined}
              />
            </SimpleGrid>
            <TextInput
              label="ชื่อภาษาจีน"
              placeholder="เช่น 主楼"
              required
              value={form.values.nameZh}
              onChange={(e) => {
                markUserEditedI18n();
                form.setFieldValue('nameZh', e.currentTarget.value);
              }}
              error={form.errors.nameZh}
              rightSection={translating ? <Loader size="xs" /> : undefined}
            />
            <TextInput
              label="ที่อยู่ / หมายเหตุ"
              placeholder="ระบุที่อยู่ของอาคารหรือสาขา"
              {...form.getInputProps('address')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeBranchModal}>
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

function SimpleGrid({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: '12px',
      }}
    >
      {children}
    </div>
  );
}
