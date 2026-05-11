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
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
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
  IconClockHour4,
  IconSelector,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { addMember, updateMember, deleteMember, getMemberAccessHistory } from './memberActions';
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
  metadata?: any;
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

const PREFIX_MAP: Record<string, string> = {
  'นาย': 'Mr.',
  'นาง': 'Mrs.',
  'นางสาว': 'Ms.',
  'เด็กชาย': 'Master',
  'เด็กหญิง': 'Miss',
};

const emptyForm = {
  id: '',
  memberNo: '',
  citizenId: '',
  prefixTh: '',
  prefixEn: '',
  firstNameTh: '',
  lastNameTh: '',
  firstNameEn: '',
  lastNameEn: '',
  email: '',
  phone: '',
  memberType: 'STUDENT',
  status: 'ACTIVE',
  expireDate: '',
  birthDate: '',
  gender: '',
  address: '',
  school: '',
};

export default function MembersClient({ initialMembers }: { initialMembers: Member[] }) {
  dayjs.locale('th');
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

  // ─── History State ──────────────────────────────────────────────────────────
  const [historyOpened, { open: openHistory, close: closeHistory }] = useDisclosure(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [accessHistory, setAccessHistory] = useState<any[]>([]);

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
      const matchStatus =
        !filterStatus ||
        (filterStatus === 'INACTIVE' ? m.status !== 'ACTIVE' : m.status === filterStatus);
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
      ...(() => {
        let meta: any = {};
        if (member.metadata) {
          try {
            meta = typeof member.metadata === 'string' ? JSON.parse(member.metadata) : member.metadata;
          } catch (e) {}
        }
        return {
          prefixTh: meta.prefixTh || '',
          prefixEn: meta.prefixEn || '',
          birthDate: meta?.birthDate || '',
          gender: meta?.gender || '',
          address: meta?.address || '',
          school: meta?.school || '',
        };
      })(),
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

    if (result.success) {
      if (isEdit) {
        // Merge form fields back so metadata isn't lost from local state
        setMembers((prev) =>
          prev.map((m) =>
            m.id === formData.id
              ? {
                  ...m,
                  memberNo: formData.memberNo,
                  citizenId: formData.citizenId || null,
                  firstNameTh: formData.firstNameTh,
                  lastNameTh: formData.lastNameTh,
                  firstNameEn: formData.firstNameEn || null,
                  lastNameEn: formData.lastNameEn || null,
                  email: formData.email || null,
                  phone: formData.phone || null,
                  memberType: formData.memberType,
                  status: formData.status,
                  expireDate: formData.expireDate ? new Date(formData.expireDate) : null,
                  metadata: {
                    birthDate: formData.birthDate,
                    gender: formData.gender,
                    address: formData.address,
                    school: formData.school,
                  },
                }
              : m
          )
        );
      } else if (result.member) {
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
        prefixTh: namesTh[0] ?? '',
        firstNameTh: namesTh[1] ?? '',
        lastNameTh: namesTh.slice(2).join(' ') || '',
        firstNameEn: namesEn[1] ?? '',
        lastNameEn: namesEn.slice(2).join(' ') || '',
        gender: data.gender,
        birthDate: data.birthDate,
        address: data.address,
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

  const handleOpenHistory = async (member: Member) => {
    setSelectedMember(member);
    setHistoryLoading(true);
    openHistory();
    
    const result = await getMemberAccessHistory(member.id);
    setHistoryLoading(false);
    
    if (result.success) {
      setAccessHistory(result.history || []);
    } else {
      notifications.show({
        title: 'ไม่สามารถดึงข้อมูลประวัติได้',
        message: result.error,
        color: 'red',
      });
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
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card 
          withBorder 
          p="md" 
          radius="md" 
          onClick={() => setFilterStatus(null)}
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            borderBottom: !filterStatus ? '3px solid var(--mantine-color-blue-filled)' : undefined
          }}
          className="hover-card"
        >
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
        <Card 
          withBorder 
          p="md" 
          radius="md" 
          onClick={() => setFilterStatus('ACTIVE')}
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            borderBottom: filterStatus === 'ACTIVE' ? '3px solid var(--mantine-color-green-filled)' : undefined
          }}
          className="hover-card"
        >
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
        <Card 
          withBorder 
          p="md" 
          radius="md" 
          onClick={() => setFilterStatus('INACTIVE')}
          style={{ 
            cursor: 'pointer', 
            transition: 'all 0.2s ease',
            borderBottom: filterStatus === 'INACTIVE' ? '3px solid var(--mantine-color-red-filled)' : undefined
          }}
          className="hover-card"
        >
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

      <style jsx global>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--mantine-shadow-md);
          background-color: var(--mantine-color-gray-0);
        }
      `}</style>

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
                            <Menu.Item
                              leftSection={<IconClockHour4 size={14} />}
                              onClick={() => handleOpenHistory(member)}
                            >
                              ประวัติการเข้า-ออก
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconRefresh size={14} />}
                              onClick={() => notifications.show({ title: 'สร้าง QR Code สำเร็จ', message: `รหัส QR Code ของคุณถูกสร้างใหม่แล้ว`, color: 'teal' })}
                            >
                              สร้าง QR Code ใหม่
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
              placeholder="x-xxxx-xxxxx-xx-x"
              value={formData.citizenId}
              onChange={(e) => {
                const raw = e.target.value.replace(/-/g, '');
                const d = raw.slice(0,13);
                let fmt = d;
                if (d.length > 1) fmt = d[0] + '-' + d.slice(1);
                if (d.length > 5) fmt = d[0] + '-' + d.slice(1,5) + '-' + d.slice(5);
                if (d.length > 10) fmt = d[0] + '-' + d.slice(1,5) + '-' + d.slice(5,10) + '-' + d.slice(10);
                if (d.length > 12) fmt = d[0] + '-' + d.slice(1,5) + '-' + d.slice(5,10) + '-' + d.slice(10,12) + '-' + d.slice(12);
                setFormData({ ...formData, citizenId: fmt });
              }}
              maxLength={17}
            />
          </Group>

          {/* Row 2: prefix + firstNameTh + lastNameTh */}
          <Group grow>
            <Select
              label="คำนำหน้า"
              placeholder="เลือก"
              data={['นาย', 'นาง', 'นางสาว', 'เด็กชาย', 'เด็กหญิง']}
              style={{ flex: '0 0 100px' }}
              value={formData.prefixTh}
              onChange={(val) => {
                const en = val ? PREFIX_MAP[val] : '';
                setFormData({ 
                  ...formData, 
                  prefixTh: val || '',
                  prefixEn: en || formData.prefixEn
                });
              }}
            />
            <TextInput
              label="ชื่อ (ภาษาไทย)"
              placeholder="ชื่อ"
              required
              value={formData.firstNameTh}
              onChange={(e) => setFormData({ ...formData, firstNameTh: e.target.value })}
            />
            <TextInput
              label="นามสกุล (ภาษาไทย)"
              placeholder="นามสกุล"
              required
              value={formData.lastNameTh}
              onChange={(e) => setFormData({ ...formData, lastNameTh: e.target.value })}
            />
          </Group>

          {/* Row 3: prefixEn + firstNameEn + lastNameEn */}
          <Group grow>
            <Select
              label="Prefix (EN)"
              placeholder="Select"
              data={['Mr.', 'Mrs.', 'Ms.', 'Master', 'Miss']}
              style={{ flex: '0 0 100px' }}
              value={formData.prefixEn}
              onChange={(val) => setFormData({ ...formData, prefixEn: val || '' })}
            />
            <TextInput
              label="ชื่อ (English)"
              placeholder="First Name"
              value={formData.firstNameEn}
              onChange={(e) => setFormData({ ...formData, firstNameEn: e.target.value })}
            />
            <TextInput
              label="นามสกุล (English)"
              placeholder="Last Name"
              value={formData.lastNameEn}
              onChange={(e) => setFormData({ ...formData, lastNameEn: e.target.value })}
            />
          </Group>

          {/* Row: birthDate + gender */}
          <Group grow>
            <TextInput
              label="วันเกิด (ระบุเป็น พ.ศ.)"
              placeholder="เช่น 15/04/2538"
              value={formData.birthDate}
              onChange={(e) => {
                const raw = e.target.value.replace(/\//g, '');
                const d = raw.slice(0,8);
                let fmt = d;
                if (d.length > 2) fmt = d.slice(0,2) + '/' + d.slice(2);
                if (d.length > 4) fmt = d.slice(0,2) + '/' + d.slice(2,4) + '/' + d.slice(4);
                setFormData({ ...formData, birthDate: fmt });
              }}
              maxLength={10}
            />
            <Select
              label="เพศ"
              placeholder="เลือก"
              data={[
                { value: 'ชาย', label: 'ชาย' },
                { value: 'หญิง', label: 'หญิง' },
              ]}
              value={formData.gender}
              onChange={(val) => setFormData({ ...formData, gender: val ?? '' })}
            />
          </Group>

          {/* Row: address */}
          <TextInput
            label="ที่อยู่"
            placeholder="บ้านเลขที่ หมู่ ซอย ถนน แขวง เขต จังหวัด รหัสไปรษณีย์"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          {/* Row: phone + email */}
          <Group grow>
            <TextInput
              label="เบอร์โทรศัพท์"
              placeholder="08X-XXX-XXXX"
              leftSection={<IconPhone size={15} />}
              value={formData.phone}
              onChange={(e) => {
                const raw = e.target.value.replace(/-/g, '');
                const d = raw.slice(0,10);
                let fmt = d;
                if (d.length > 3) fmt = d.slice(0,3) + '-' + d.slice(3);
                if (d.length > 6) fmt = d.slice(0,3) + '-' + d.slice(3,6) + '-' + d.slice(6);
                setFormData({ ...formData, phone: fmt });
              }}
              maxLength={12}
            />
            <TextInput
              label="อีเมล"
              placeholder="example@email.com"
              leftSection={<IconMail size={15} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Group>

          {/* Row: school */}
          <TextInput
            label="ชื่อสถาบันการศึกษา / โรงเรียน"
            placeholder="กรอกชื่อสถาบันการศึกษา..."
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
          />

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
            <DatePickerInput
              label="วันหมดอายุสมาชิก"
              placeholder="เลือกวันที่"
              locale="th"
              valueFormat="D MMM YYYY"
              leftSection={<IconCalendar size={15} />}
              rightSection={<IconSelector size={15} color="gray" />}
              value={formData.expireDate ? new Date(formData.expireDate) : null}
              onChange={(date) => setFormData({ 
                ...formData, 
                expireDate: date ? dayjs(date).format('YYYY-MM-DD') : '' 
              })}
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

      {/* History Modal */}
      <Modal
        opened={historyOpened}
        onClose={closeHistory}
        title={
          <Group gap="xs">
            <IconClockHour4 size={20} />
            <Text fw={600} size="lg">
              ประวัติการเข้า-ออก: {selectedMember?.firstNameTh} {selectedMember?.lastNameTh}
            </Text>
          </Group>
        }
        size="xl"
      >
        <Stack gap="md" style={{ minHeight: 400, position: 'relative' }}>
          <LoadingOverlay visible={historyLoading} overlayProps={{ blur: 2 }} />
          
          {accessHistory.length > 0 ? (
            <Table.ScrollContainer minWidth={600}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>วัน/เวลา</Table.Th>
                    <Table.Th>ประตู/จุดควบคุม</Table.Th>
                    <Table.Th>ทิศทาง</Table.Th>
                    <Table.Th>สถานะ</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {accessHistory.map((event) => (
                    <Table.Tr key={event.id}>
                      <Table.Td>
                        <Stack gap={0}>
                          <Text size="sm" fw={500}>
                            {dayjs(event.scannedAt).format('D MMM YYYY')}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {dayjs(event.scannedAt).format('HH:mm:ss')} น.
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{event.gate?.nameTh || 'ไม่ระบุ'}</Text>
                        <Text size="xs" c="dimmed">{event.gate?.gateCode}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          variant="light" 
                          color={event.direction === 'IN' ? 'blue' : 'orange'}
                        >
                          {event.direction === 'IN' ? 'เข้า' : 'ออก'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge 
                          variant="filled" 
                          color={event.decision === 'ALLOWED' ? 'green' : 'red'}
                          size="sm"
                        >
                          {event.decision === 'ALLOWED' ? 'ผ่าน' : 'ปฏิเสธ'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : !historyLoading && (
            <Stack align="center" py={60} gap="xs">
              <IconClockHour4 size={40} color="var(--mantine-color-dimmed)" />
              <Text c="dimmed">ไม่พบประวัติการเข้า-ออก</Text>
            </Stack>
          )}
          
          <Group justify="flex-end">
            <Button variant="light" color="gray" onClick={closeHistory}>
              ปิดหน้าต่าง
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
