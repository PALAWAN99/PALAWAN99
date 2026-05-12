import { Table, Group, Avatar, Text, Stack, Badge, Menu, ActionIcon } from '@mantine/core';
import { IconMail, IconPhone, IconCalendar, IconDotsVertical, IconEdit, IconClockHour4, IconRefresh, IconTrash } from '@tabler/icons-react';
import { Member } from '../types';

interface MemberTableRowProps {
  member: Member;
  onEdit: (member: Member) => void;
  onRenew: (member: Member) => void;
  onOpenHistory: (member: Member) => void;
  onDelete: (id: string, name: string) => void;
  t: (key: string) => string;
}

const MEMBER_TYPE_LABELS: Record<string, string> = {
  STUDENT: 'Member.type.student',
  STAFF: 'Member.type.staff',
  FACULTY: 'Member.type.faculty',
  EXTERNAL: 'Member.type.external',
  GUEST: 'Member.type.guest',
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'green',
  EXPIRED: 'orange',
  SUSPENDED: 'red',
  REVOKED: 'gray',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Member.status.active',
  EXPIRED: 'Member.status.expired',
  SUSPENDED: 'Member.status.suspended',
  REVOKED: 'Member.status.revoked',
};

const AVATAR_COLORS = ['blue', 'cyan', 'teal', 'green', 'violet', 'grape', 'pink', 'orange'];

function getInitials(firstTh: string, lastTh: string) {
  return `${firstTh.charAt(0)}${lastTh.charAt(0)}`.toUpperCase();
}

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function MemberTableRow({ member, onEdit, onRenew, onOpenHistory, onDelete, t }: MemberTableRowProps) {
  const fullName = `${member.firstNameTh} ${member.lastNameTh}`;
  
  return (
    <Table.Tr>
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <Avatar color={getAvatarColor(member.id)} radius="xl" size="sm">
            {getInitials(member.firstNameTh, member.lastNameTh)}
          </Avatar>
          <div>
            <Text fw={500} size="sm" lineClamp={1}>{fullName}</Text>
            {member.firstNameEn && (
              <Text size="xs" c="dimmed" lineClamp={1}>{member.firstNameEn} {member.lastNameEn}</Text>
            )}
          </div>
        </Group>
      </Table.Td>
      <Table.Td><Text fw={500} size="sm" ff="monospace">{member.memberNo}</Text></Table.Td>
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
        </Stack>
      </Table.Td>
      <Table.Td>
        <Badge variant="light" color="blue" size="sm">
          {t(MEMBER_TYPE_LABELS[member.memberType] ?? member.memberType)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge variant="filled" color={STATUS_COLORS[member.status] ?? 'gray'} size="sm">
          {t(STATUS_LABELS[member.status] ?? member.status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        {member.expireDate ? (
          <Group gap={4} wrap="nowrap">
            <IconCalendar size={12} color="gray" />
            <Text size="xs" c={new Date(member.expireDate) < new Date() ? 'red' : 'dimmed'}>
              {new Date(member.expireDate).toLocaleDateString('th-TH')}
            </Text>
          </Group>
        ) : <Text size="xs" c="dimmed">—</Text>}
      </Table.Td>
      <Table.Td>
        <Text size="xs" c="dimmed">{new Date(member.createdAt).toLocaleDateString('th-TH')}</Text>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={180} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={16} /></ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onEdit(member)}>แก้ไขข้อมูล</Menu.Item>
            <Menu.Item leftSection={<IconClockHour4 size={14} />} color="teal" onClick={() => onRenew(member)}>ต่ออายุสมาชิก</Menu.Item>
            <Menu.Item leftSection={<IconClockHour4 size={14} />} onClick={() => onOpenHistory(member)}>ประวัติการเข้า-ออก</Menu.Item>
            <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => {}}>สร้าง QR Code ใหม่</Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => onDelete(member.id, fullName)}>ลบสมาชิก</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  );
}
