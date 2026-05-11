'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
  LoadingOverlay,
  SimpleGrid,
  ThemeIcon,
  Divider,
  Avatar,
} from '@mantine/core';
import {
  IconSearch,
  IconUserPlus,
  IconPlus,
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
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { addMember, updateMember, deleteMember } from './memberActions';
import { ThaiIdCardReader } from '@/lib/idcard/reader';

interface MemberMetadata {
  prefixTh?: string;
  prefixEn?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  school?: string;
}

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
  metadata?: MemberMetadata;
}

const MEMBER_TYPE_LABELS: Record<string, string> = {
  STUDENT: 'Member.typeStudent',
  STAFF: 'Member.typeStaff',
  FACULTY: 'Member.typeFaculty',
  EXTERNAL: 'Member.typeExternal',
  GUEST: 'Member.typeGuest',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  EXPIRED: 'orange',
  SUSPENDED: 'red',
  REVOKED: 'gray',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Member.statusActive',
  EXPIRED: 'Member.statusExpired',
  SUSPENDED: 'Member.statusSuspended',
  REVOKED: 'Member.statusRevoked',
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
  const t = useTranslations();
  const locale = useLocale();
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [readingId, setReadingId] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isEdit, setIsEdit] = useState(false);

  // ─── Renew State ─────────────────────────────────────────────────────────────
  const [renewOpened, { open: openRenew, close: closeRenew }] = useDisclosure(false);
  const [renewMember, setRenewMember] = useState<Member | null>(null);
  const [renewDate, setRenewDate] = useState<Date | null>(null);
  const [renewLoading, setRenewLoading] = useState(false);

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
        let meta: MemberMetadata = {};
        if (member.metadata) {
          try {
            meta = typeof member.metadata === 'string' ? JSON.parse(member.metadata) : member.metadata;
          } catch (error) {
            console.error('Metadata parse error', error);
          }
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
        message: (result as { error?: string }).error ?? 'ไม่ทราบสาเหตุ',
        color: 'red',
      });
    }
  };

  const handleRenew = async () => {
    if (!renewMember || !renewDate) return;
    setRenewLoading(true);
    
    const result = await updateMember(renewMember.id, {
      ...renewMember,
      expireDate: renewDate.toISOString().split('T')[0],
      status: 'ACTIVE',
    });

    setRenewLoading(false);
    if (result.success) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === renewMember.id
            ? { ...m, expireDate: renewDate, status: 'ACTIVE' }
            : m
        )
      );
      notifications.show({
        title: t('Member.renewSuccess'),
        message: `${renewMember.firstNameTh} ${renewMember.lastNameTh} — ${t('Member.renewUntil')} ${renewDate.toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US')}`,
        color: 'teal',
      });
      closeRenew();
    } else {
      notifications.show({
        title: t('Common.error'),
        message: result.error,
        color: 'red',
      });
    }
  };

  const handleOpenRenew = (member: Member) => {
    setRenewMember(member);
    const base =
      member.expireDate && new Date(member.expireDate) > new Date()
        ? new Date(member.expireDate)
        : new Date();
    const next = new Date(base);
    next.setFullYear(next.getFullYear() + 1);
    setRenewDate(next);
    openRenew();
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
    } catch (error: unknown) {
      notifications.show({ title: 'อ่านบัตรไม่ได้', message: error instanceof Error ? error.message : 'Unknown error', color: 'red' });
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
          <Title order={2}>{t('Common.members')}</Title>
          <Text size="sm" c="dimmed" mt={4}>
            {t('Member.manageDesc')}
          </Text>
        </div>
        <Group gap="sm">
          <Button 
            variant="light" 
            color="gray" 
            leftSection={<IconId size={18} />}
            onClick={() => notifications.show({ title: 'Export', message: 'กำลังส่งออกข้อมูลสมาชิกเป็น CSV...', color: 'blue' })}
          >
            ส่งออก (Export)
          </Button>
          <Button 
            variant="light" 
            color="gray" 
            leftSection={<IconUserPlus size={18} />}
            onClick={() => notifications.show({ title: 'Import', message: 'ระบบนำเข้าข้อมูลแบบกลุ่มกำลังเปิดใช้งาน...', color: 'blue' })}
          >
            นำเข้า (Import)
          </Button>
          <Button 
            leftSection={<IconPlus size={18} />} 
            color="skyBlue"
            onClick={handleOpenAdd}
          >
            {t('Member.add')}
          </Button>
        </Group>
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

      {/* Styles are now handled via Mantine's sx or className in global.css if needed */}

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
                  <Table.Th>{t('Member.name')}</Table.Th>
                  <Table.Th>{t('Member.no')}</Table.Th>
                  <Table.Th>{t('Member.contact')}</Table.Th>
                  <Table.Th>{t('Member.type')}</Table.Th>
                  <Table.Th>{t('Common.status')}</Table.Th>
                  <Table.Th>{t('Member.expireDate')}</Table.Th>
                  <Table.Th>{t('Member.createdAt')}</Table.Th>
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
                          {t(MEMBER_TYPE_LABELS[member.memberType] ?? member.memberType)}
                        </Badge>
                      </Table.Td>

                      {/* Status */}
                      <Table.Td>
                        <Badge
                          variant="filled"
                          color={STATUS_COLORS[member.status] ?? 'gray'}
                          size="sm"
                        >
                          {t(STATUS_LABELS[member.status] ?? member.status)}
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
                              color="teal"
                              onClick={() => handleOpenRenew(member)}
                            >
                              ต่ออายุสมาชิก
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

      {/* Renew Member Modal */}
      <Modal
        opened={renewOpened}
        onClose={closeRenew}
        title={
          <Group gap="xs">
            <IconClockHour4 size={20} color="teal" />
            <Text fw={600} size="lg">ต่ออายุสมาชิก</Text>
          </Group>
        }
        size="sm"
      >
        {renewMember && (
          <Stack gap="md">
            <Card withBorder radius="md" p="sm" bg="var(--mantine-color-teal-0)">
              <Group gap="sm">
                <Avatar color={getAvatarColor(renewMember.id)} radius="xl">
                  {getInitials(renewMember.firstNameTh, renewMember.lastNameTh)}
                </Avatar>
                <div>
                  <Text fw={600}>{renewMember.firstNameTh} {renewMember.lastNameTh}</Text>
                  <Text size="xs" c="dimmed">รหัสสมาชิก: {renewMember.memberNo}</Text>
                </div>
              </Group>
              <Divider my="xs" />
              <Group justify="space-between">
                <Text size="sm" c="dimmed">สถานะปัจจุบัน</Text>
                <Badge
                  color={STATUS_COLORS[renewMember.status] ?? 'gray'}
                  variant="filled"
                  size="sm"
                >
                  {STATUS_LABELS[renewMember.status] ?? renewMember.status}
                </Badge>
              </Group>
              <Group justify="space-between" mt={4}>
                <Text size="sm" c="dimmed">วันหมดอายุเดิม</Text>
                <Text size="sm" fw={500} c={renewMember.expireDate && new Date(renewMember.expireDate) < new Date() ? 'red' : undefined}>
                  {renewMember.expireDate
                    ? new Date(renewMember.expireDate).toLocaleDateString('th-TH')
                    : 'ไม่มีข้อมูล'}
                </Text>
              </Group>
            </Card>

            <TextInput
              label="วันหมดอายุใหม่"
              type="date"
              value={renewDate ? renewDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setRenewDate(e.target.value ? new Date(e.target.value) : null)}
              min={new Date().toISOString().split('T')[0]}
              leftSection={<IconCalendar size={16} />}
            />

            <Group gap="xs">
              {[1, 2, 3].map((yr) => {
                const d = new Date();
                d.setFullYear(d.getFullYear() + yr);
                return (
                  <Button
                    key={yr}
                    size="xs"
                    variant="light"
                    color="teal"
                    onClick={() => setRenewDate(d)}
                  >
                    +{yr} {t('Common.year')}
                  </Button>
                );
              })}
            </Group>

            <Group justify="flex-end" mt="xs">
              <Button variant="light" color="gray" onClick={closeRenew}>
                {t('Common.cancel')}
              </Button>
              <Button
                color="teal"
                leftSection={<IconClockHour4 size={16} />}
                onClick={handleRenew}
                loading={renewLoading}
                disabled={!renewDate}
              >
                {t('Member.renewConfirm')}
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Add / Edit Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text fw={600} size="lg">
            {isEdit ? t('Member.editInfo') : t('Member.addNew')}
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
                {t('Member.readIdCard')}
              </Button>
              <Divider label={t('Member.manualInput')} labelPosition="center" />
            </>
          )}

          {/* Row 1: memberNo + citizenId */}
          <Group grow>
            <TextInput
              label={t('Member.no')}
              placeholder="M-202505-0001"
              required
              value={formData.memberNo}
              onChange={(e) => setFormData({ ...formData, memberNo: e.target.value })}
            />
            <TextInput
              label={t('Member.citizenId')}
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
              label={t('Member.prefix')}
              placeholder={t('Common.select')}
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
              label={t('Member.firstNameTh')}
              placeholder={t('Member.firstNameTh')}
              required
              value={formData.firstNameTh}
              onChange={(e) => setFormData({ ...formData, firstNameTh: e.target.value })}
            />
            <TextInput
              label={t('Member.lastNameTh')}
              placeholder={t('Member.lastNameTh')}
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
              label={t('Member.firstNameEn')}
              placeholder="First Name"
              value={formData.firstNameEn}
              onChange={(e) => setFormData({ ...formData, firstNameEn: e.target.value })}
            />
            <TextInput
              label={t('Member.lastNameEn')}
              placeholder="Last Name"
              value={formData.lastNameEn}
              onChange={(e) => setFormData({ ...formData, lastNameEn: e.target.value })}
            />
          </Group>

          {/* Row: birthDate + gender */}
          <Group grow>
            <TextInput
              label={t('Member.birthDate')}
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
              label={t('Member.gender')}
              placeholder={t('Member.selectGender')}
              data={[
                { value: 'ชาย', label: t('Member.male') },
                { value: 'หญิง', label: t('Member.female') },
              ]}
              value={formData.gender}
              onChange={(val) => setFormData({ ...formData, gender: val ?? '' })}
            />
          </Group>

          {/* Row: address */}
          <TextInput
            label={t('Member.address')}
            placeholder={t('Member.addressPlaceholder')}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          {/* Row: school */}
          <TextInput
            label={t('Member.school')}
            placeholder={t('Member.schoolPlaceholder')}
            value={formData.school}
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
          />

          {/* Row: email + phone */}
          <Group grow>
            <TextInput
              label={t('Member.email')}
              placeholder="example@email.com"
              leftSection={<IconMail size={15} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextInput
              label={t('Member.phone')}
              placeholder="08x-xxx-xxxx"
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
          </Group>

          {/* Row 5: memberType + status + expireDate */}
          <Group grow>
            <Select
              label={t('Member.type')}
              data={[
                { value: 'STUDENT', label: t('Member.typeStudent') },
                { value: 'STAFF', label: t('Member.typeStaff') },
                { value: 'FACULTY', label: t('Member.typeFaculty') },
                { value: 'EXTERNAL', label: t('Member.typeExternal') },
                { value: 'GUEST', label: t('Member.typeGuest') },
              ]}
              value={formData.memberType}
              onChange={(val) => setFormData({ ...formData, memberType: val ?? 'STUDENT' })}
            />
            {isEdit && (
              <Select
                label={t('Common.status')}
                data={[
                  { value: 'ACTIVE', label: t('Member.statusActive') },
                  { value: 'EXPIRED', label: t('Member.statusExpired') },
                  { value: 'SUSPENDED', label: t('Member.statusSuspended') },
                  { value: 'REVOKED', label: t('Member.statusRevoked') },
                ]}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val ?? 'ACTIVE' })}
              />
            )}
            <TextInput
              label={t('Member.expireDate')}
              type="date"
              leftSection={<IconCalendar size={15} />}
              value={formData.expireDate}
              readOnly
            />
          </Group>

          {/* Actions */}
          <Group justify="flex-end" mt="xs">
            <Button variant="light" color="gray" onClick={close}>
              {t('Common.cancel')}
            </Button>
            <Button color="blue" onClick={handleSubmit} loading={loading}>
              {isEdit ? t('Common.saveChanges') : t('Member.add')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
