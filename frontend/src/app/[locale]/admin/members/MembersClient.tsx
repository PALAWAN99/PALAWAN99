'use client';

import { useState, useMemo } from 'react';
import {
  Title,
  Text,
  Card,
  Table,
  Badge,
  Group,
  Stack,
  ActionIcon,
  TextInput,
  Button,
  Modal,
  Select,
  Menu,
  Box,
  LoadingOverlay,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Tooltip,
  Avatar,
} from '@mantine/core';
import {
  IconSearch,
  IconUserPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconId,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconX,
  IconMail,
  IconPhone,
  IconCalendar,
  IconRefresh,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { addMember, updateMember, deleteMember } from './memberActions';
import { ThaiIdCardReader } from '@/lib/idcard/reader';
import { useRouter } from 'next/navigation';

interface Member {
  id: string;
  memberNo: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string | null;
  lastNameEn: string | null;
  citizenId: string | null;
  email: string | null;
  phone: string | null;
  memberType: string;
  status: string;
  expireDate: Date | null;
  createdAt: Date;
}

const MEMBER_TYPE_LABELS: Record<string, string> = {
  STUDENT: 'นักเรียน',
  STAFF: 'เจ้าหน้าที่',
  FACULTY: 'อาจารย์',
  EXTERNAL: 'บุคคลภายนอก',
  GUEST: 'ผู้เยี่ยมชม',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  EXPIRED: 'orange',
  SUSPENDED: 'red',
  REVOKED: 'gray',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'ใช้งาน',
  EXPIRED: 'หมดอายุ',
  SUSPENDED: 'ระงับ',
  REVOKED: 'ยกเลิก',
};

function getInitials(firstTh: string, lastTh: string) {
  return `${firstTh.charAt(0)}${lastTh.charAt(0)}`.toUpperCase();
}

const AVATAR_COLORS = ['blue', 'cyan', 'teal', 'green', 'violet', 'grape', 'pink', 'orange'];
function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const emptyForm = {
  id: '',
  memberNo: '',
  citizenId: '',
  firstNameTh: '',
  lastNameTh: '',
  firstNameEn: '',
  lastNameEn: '',
  email: '',
  phone: '',
  memberType: 'STUDENT',
  status: 'ACTIVE',
  expireDate: '',
};

export default function MembersClient({ initialMembers }: { initialMembers: Member[] }) {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [readingId, setReadingId] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  // ─── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter((m) => m.status === 'ACTIVE').length,
    inactive: members.filter((m) => m.status !== 'ACTIVE').length,
  }), [members]);

  // ─── Filtered list ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const matchQ =
        !q ||
        m.firstNameTh.toLowerCase().includes(q) ||
        m.lastNameTh.toLowerCase().includes(q) ||
        m.memberNo.toLowerCase().includes(q) ||
        (m.citizenId ?? '').includes(q) ||
        (m.email ?? '').toLowerCase().includes(q) ||
        (m.phone ?? '').includes(q);
      const matchType = !filterType || m.memberType === filterType;
      const matchStatus = !filterStatus || m.status === filterStatus;
      return matchQ && matchType && matchStatus;
    });
  }, [members, search, filterType, filterStatus]);

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setIsEdit(false);
    setFormData(emptyForm);
    open();
  };

  const handleOpenEdit = (member: Member) => {
    setIsEdit(true);
    setFormData({
      id: member.id,
      memberNo: member.memberNo,
      citizenId: member.citizenId ?? '',
      firstNameTh: member.firstNameTh,
      lastNameTh: member.lastNameTh,
      firstNameEn: member.firstNameEn ?? '',
      lastNameEn: member.lastNameEn ?? '',
      email: member.email ?? '',
      phone: member.phone ?? '',
      memberType: member.memberType,
      status: member.status,
      expireDate: member.expireDate
        ? new Date(member.expireDate).toISOString().split('T')[0]
        : '',
    });
    open();
  };

  const handleSubmit = async () => {
    if (!formData.memberNo || !formData.firstNameTh || !formData.lastNameTh) {
      notifications.show({
        title: 'กรุณากรอกข้อมูลให้ครบ',
        message: 'รหัสสมาชิก, ชื่อ, นามสกุล (ภาษาไทย) เป็นข้อมูลที่จำเป็น',
        color: 'orange',
      });
      return;
    }

    setLoading(true);
    const result = isEdit
      ? await updateMember(formData.id, formData)
      : await addMember(formData);
    setLoading(false);

    if (result.success && result.member) {
      if (isEdit) {
        setMembers((prev) =>
          prev.map((m) => (m.id === result.member!.id ? (result.member as Member) : m))
        );
      } else {
        setMembers((prev) => [result.member as Member, ...prev]);
      }
      notifications.show({
        title: isEdit ? 'แก้ไขสำเร็จ ✓' : 'เพิ่มสมาชิกสำเร็จ ✓',
        message: `${formData.firstNameTh} ${formData.lastNameTh} — ${isEdit ? 'อัปเดตแล้ว' : 'เพิ่มเข้าระบบแล้ว'}`,
        color: 'green',
      });
      close();
    } else {
      notifications.show({
        title: 'เกิดข้อผิดพลาด',
        message: (result as any).error ?? 'ไม่ทราบสาเหตุ',
        color: 'red',
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`ยืนยันลบสมาชิก "${name}" ออกจากระบบ?`)) return;
    setLoading(true);
    const result = await deleteMember(id);
    setLoading(false);
    if (result.success) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      notifications.show({ title: 'ลบสำเร็จ', message: `ลบ ${name} ออกจากระบบแล้ว`, color: 'green' });
    } else {
      notifications.show({ title: 'ลบไม่สำเร็จ', message: result.error, color: 'red' });
    }
  };

  const handleReadIdCard = async () => {
    setReadingId(true);
    const reader = new ThaiIdCardReader();
    try {
      const connected = await reader.connect();
      if (!connected) throw new Error('ไม่พบเครื่องอ่านบัตร');
      const data = await reader.readAllData();
      if (!data) throw new Error('ไม่สามารถอ่านข้อมูลจากบัตรได้');

      const namesTh = data.fullNameTh.split(' ');
      const namesEn = data.fullNameEn.split(' ');
      setFormData((prev) => ({
        ...prev,
        citizenId: data.citizenId,
        firstNameTh: namesTh[0] ?? '',
        lastNameTh: namesTh.slice(1).join(' ') || '',
        firstNameEn: namesEn[0] ?? '',
        lastNameEn: namesEn.slice(1).join(' ') || '',
      }));
      notifications.show({
        title: 'อ่านบัตรสำเร็จ ✓',
        message: `พบข้อมูลคุณ ${data.fullNameTh}`,
        color: 'blue',
      });
    } catch (error: any) {
      notifications.show({ title: 'อ่านบัตรไม่ได้', message: error.message, color: 'red' });
    } finally {
      await reader.disconnect();
      setReadingId(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType(null);
    setFilterStatus(null);
  };

  const hasFilter = search || filterType || filterStatus;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>จัดการสมาชิก</Title>
          <Text size="sm" c="dimmed" mt={4}>
            ตรวจสอบและจัดการข้อมูลสมาชิกผู้เข้าใช้หอสมุดทั้งหมด
          </Text>
        </div>
        <Group>
          <Tooltip label="รีเฟรชข้อมูล">
            <ActionIcon variant="light" color="gray" size="lg" onClick={() => router.refresh()}>
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>
          <Button leftSection={<IconUserPlus size={18} />} color="blue" onClick={handleOpenAdd}>
            เพิ่มสมาชิกใหม่
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder p="md" radius="md">
          <Group>
            <ThemeIcon size={44} radius="md" variant="light" color="blue">
              <IconUsers size={24} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>สมาชิกทั้งหมด</Text>
              <Text size="xl" fw={700}>{stats.total.toLocaleString()}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder p="md" radius="md">
          <Group>
            <ThemeIcon size={44} radius="md" variant="light" color="green">
              <IconUserCheck size={24} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>กำลังใช้งาน</Text>
              <Text size="xl" fw={700}>{stats.active.toLocaleString()}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder p="md" radius="md">
          <Group>
            <ThemeIcon size={44} radius="md" variant="light" color="red">
              <IconUserX size={24} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={600}>ไม่ใช้งาน</Text>
              <Text size="xl" fw={700}>{stats.inactive.toLocaleString()}</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Table Card */}
      <Card withBorder p="md" radius="md" style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />

        <Stack gap="md">
          {/* Search & Filter */}
          <Group>
            <TextInput
              placeholder="ค้นหาชื่อ, รหัสสมาชิก, เลขบัตร, อีเมล..."
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              rightSection={
                search ? (
                  <ActionIcon variant="transparent" color="gray" onClick={() => setSearch('')}>
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
            />
            <Select
              placeholder="ประเภทสมาชิก"
              clearable
              data={[
                { value: 'STUDENT', label: 'นักเรียน' },
                { value: 'STAFF', label: 'เจ้าหน้าที่' },
                { value: 'FACULTY', label: 'อาจารย์' },
                { value: 'EXTERNAL', label: 'บุคคลภายนอก' },
                { value: 'GUEST', label: 'ผู้เยี่ยมชม' },
              ]}
              value={filterType}
              onChange={setFilterType}
              w={160}
            />
            <Select
              placeholder="สถานะ"
              clearable
              data={[
                { value: 'ACTIVE', label: 'ใช้งาน' },
                { value: 'EXPIRED', label: 'หมดอายุ' },
                { value: 'SUSPENDED', label: 'ระงับ' },
                { value: 'REVOKED', label: 'ยกเลิก' },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              w={130}
            />
            {hasFilter && (
              <Button variant="subtle" color="gray" size="sm" onClick={clearFilters} leftSection={<IconX size={14} />}>
                ล้างตัวกรอง
              </Button>
            )}
          </Group>

          {hasFilter && (
            <Text size="sm" c="dimmed">
              แสดง {filtered.length} จาก {members.length} รายการ
            </Text>
          )}

          {/* Table */}
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>สมาชิก</Table.Th>
                  <Table.Th>รหัสสมาชิก</Table.Th>
                  <Table.Th>ติดต่อ</Table.Th>
                  <Table.Th>ประเภท</Table.Th>
                  <Table.Th>สถานะ</Table.Th>
                  <Table.Th>วันหมดอายุ</Table.Th>
                  <Table.Th>วันที่สมัคร</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.length > 0 ? (
                  filtered.map((member) => (
                    <Table.Tr key={member.id}>
                      {/* Avatar + Name */}
                      <Table.Td>
                        <Group gap="sm" wrap="nowrap">
                          <Avatar
                            color={getAvatarColor(member.id)}
                            radius="xl"
                            size="sm"
                          >
                            {getInitials(member.firstNameTh, member.lastNameTh)}
                          </Avatar>
                          <div>
                            <Text fw={500} size="sm" lineClamp={1}>
                              {member.firstNameTh} {member.lastNameTh}
                            </Text>
                            {member.firstNameEn && (
                              <Text size="xs" c="dimmed" lineClamp={1}>
                                {member.firstNameEn} {member.lastNameEn}
                              </Text>
                            )}
                          </div>
                        </Group>
                      </Table.Td>

                      {/* Member No */}
                      <Table.Td>
                        <Text fw={500} size="sm" ff="monospace">
                          {member.memberNo}
                        </Text>
                      </Table.Td>

                      {/* Contact */}
                      <Table.Td>
                        <Stack gap={2}>
                          {member.email && (
                            <Group gap={4} wrap="nowrap">
                              <IconMail size={12} color="gray" />
                              <Text size="xs" c="dimmed" lineClamp={1}>{member.email}</Text>
                            </Group>
                          )}
                          {member.phone && (
                            <Group gap={4} wrap="nowrap">
                              <IconPhone size={12} color="gray" />
                              <Text size="xs" c="dimmed">{member.phone}</Text>
                            </Group>
                          )}
                          {!member.email && !member.phone && (
                            <Text size="xs" c="dimmed">—</Text>
                          )}
                        </Stack>
                      </Table.Td>

                      {/* Type */}
                      <Table.Td>
                        <Badge variant="light" color="blue" size="sm">
                          {MEMBER_TYPE_LABELS[member.memberType] ?? member.memberType}
                        </Badge>
                      </Table.Td>

                      {/* Status */}
                      <Table.Td>
                        <Badge
                          variant="filled"
                          color={STATUS_COLORS[member.status] ?? 'gray'}
                          size="sm"
                        >
                          {STATUS_LABELS[member.status] ?? member.status}
                        </Badge>
                      </Table.Td>

                      {/* Expire */}
                      <Table.Td>
                        {member.expireDate ? (
                          <Group gap={4} wrap="nowrap">
                            <IconCalendar size={12} color="gray" />
                            <Text size="xs" c={new Date(member.expireDate) < new Date() ? 'red' : 'dimmed'}>
                              {new Date(member.expireDate).toLocaleDateString('th-TH')}
                            </Text>
                          </Group>
                        ) : (
                          <Text size="xs" c="dimmed">—</Text>
                        )}
                      </Table.Td>

                      {/* Created */}
                      <Table.Td>
                        <Text size="xs" c="dimmed">
                          {new Date(member.createdAt).toLocaleDateString('th-TH')}
                        </Text>
                      </Table.Td>

                      {/* Actions */}
                      <Table.Td>
                        <Menu shadow="md" width={180} position="bottom-end">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleOpenEdit(member)}
                            >
                              แก้ไขข้อมูล
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconTrash size={14} />}
                              color="red"
                              onClick={() =>
                                handleDelete(member.id, `${member.firstNameTh} ${member.lastNameTh}`)
                              }
                            >
                              ลบสมาชิก
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  ))
                ) : (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Stack align="center" py="xl" gap="xs">
                        <IconUsers size={40} color="var(--mantine-color-dimmed)" />
                        <Text c="dimmed">
                          {hasFilter ? 'ไม่พบสมาชิกที่ตรงกับการค้นหา' : 'ยังไม่มีข้อมูลสมาชิก'}
                        </Text>
                        {hasFilter && (
                          <Button variant="subtle" size="xs" onClick={clearFilters}>
                            ล้างตัวกรอง
                          </Button>
                        )}
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={600} size="lg">
            {isEdit ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}
          </Text>
        }
        size="lg"
      >
        <Stack gap="md">
          {/* ID Card Reader Button (Add only) */}
          {!isEdit && (
            <>
              <Button
                variant="light"
                color="blue"
                leftSection={<IconId size={18} />}
                loading={readingId}
                onClick={handleReadIdCard}
                fullWidth
              >
                อ่านข้อมูลจากบัตรประชาชน (Web USB)
              </Button>
              <Divider label="หรือกรอกข้อมูลด้วยตนเอง" labelPosition="center" />
            </>
          )}

          {/* Row 1: memberNo + citizenId */}
          <Group grow>
            <TextInput
              label="รหัสสมาชิก"
              placeholder="M-202505-0001"
              required
              value={formData.memberNo}
              onChange={(e) => setFormData({ ...formData, memberNo: e.target.value })}
            />
            <TextInput
              label="เลขบัตรประชาชน"
              placeholder="1xxxxxxxxxxxx"
              value={formData.citizenId}
              onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
            />
          </Group>

          {/* Row 2: firstNameTh + lastNameTh */}
          <Group grow>
            <TextInput
              label="ชื่อ (ภาษาไทย)"
              placeholder="กรุณาระบุ"
              required
              value={formData.firstNameTh}
              onChange={(e) => setFormData({ ...formData, firstNameTh: e.target.value })}
            />
            <TextInput
              label="นามสกุล (ภาษาไทย)"
              placeholder="กรุณาระบุ"
              required
              value={formData.lastNameTh}
              onChange={(e) => setFormData({ ...formData, lastNameTh: e.target.value })}
            />
          </Group>

          {/* Row 3: firstNameEn + lastNameEn */}
          <Group grow>
            <TextInput
              label="ชื่อ (English)"
              placeholder="Optional"
              value={formData.firstNameEn}
              onChange={(e) => setFormData({ ...formData, firstNameEn: e.target.value })}
            />
            <TextInput
              label="นามสกุล (English)"
              placeholder="Optional"
              value={formData.lastNameEn}
              onChange={(e) => setFormData({ ...formData, lastNameEn: e.target.value })}
            />
          </Group>

          {/* Row 4: email + phone */}
          <Group grow>
            <TextInput
              label="อีเมล"
              placeholder="example@email.com"
              leftSection={<IconMail size={15} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextInput
              label="เบอร์โทรศัพท์"
              placeholder="08x-xxx-xxxx"
              leftSection={<IconPhone size={15} />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </Group>

          {/* Row 5: memberType + status + expireDate */}
          <Group grow>
            <Select
              label="ประเภทสมาชิก"
              data={[
                { value: 'STUDENT', label: 'นักเรียน' },
                { value: 'STAFF', label: 'เจ้าหน้าที่' },
                { value: 'FACULTY', label: 'อาจารย์' },
                { value: 'EXTERNAL', label: 'บุคคลภายนอก' },
                { value: 'GUEST', label: 'ผู้เยี่ยมชม' },
              ]}
              value={formData.memberType}
              onChange={(val) => setFormData({ ...formData, memberType: val ?? 'STUDENT' })}
            />
            {isEdit && (
              <Select
                label="สถานะ"
                data={[
                  { value: 'ACTIVE', label: 'ใช้งาน' },
                  { value: 'EXPIRED', label: 'หมดอายุ' },
                  { value: 'SUSPENDED', label: 'ระงับ' },
                  { value: 'REVOKED', label: 'ยกเลิก' },
                ]}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val ?? 'ACTIVE' })}
              />
            )}
            <TextInput
              label="วันหมดอายุสมาชิก"
              type="date"
              leftSection={<IconCalendar size={15} />}
              value={formData.expireDate}
              onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
            />
          </Group>

          {/* Actions */}
          <Group justify="flex-end" mt="xs">
            <Button variant="light" color="gray" onClick={close}>
              ยกเลิก
            </Button>
            <Button color="blue" onClick={handleSubmit} loading={loading}>
              {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มสมาชิก'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
