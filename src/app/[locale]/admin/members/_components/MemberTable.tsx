import { Table, Group, Avatar, Text, Stack, Badge, Menu, ActionIcon, Pagination, Center } from '@mantine/core';
import { IconMail, IconPhone, IconCalendar, IconDotsVertical, IconEdit, IconClockHour4, IconRefresh, IconTrash, IconUsers, IconX } from '@tabler/icons-react';
import { Member } from '../types';

interface MemberTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onRenew: (member: Member) => void;
  onDelete: (id: string, name: string) => void;
  onClearFilters: () => void;
  hasFilter: boolean;
  t: (key: string) => string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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

export function MemberTable({ 
  members, onEdit, onRenew, onDelete, onClearFilters, hasFilter, t,
  page, totalPages, onPageChange
}: MemberTableProps) {
  return (
    <Stack gap="md">
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
            {members.length > 0 ? (
              members.map((member) => (
                <Table.Tr key={member.id}>
                  <Table.Td>
                    <Group gap="sm" wrap="nowrap">
                      <Avatar color={getAvatarColor(member.id)} radius="xl" size="sm">
                        {getInitials(member.firstNameTh, member.lastNameTh)}
                      </Avatar>
                      <div>
                        <Text fw={500} size="sm" lineClamp={1}>{member.firstNameTh} {member.lastNameTh}</Text>
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
                        <Menu.Item leftSection={<IconRefresh size={14} />} onClick={() => {}}>สร้าง QR Code ใหม่</Menu.Item>
                        <Menu.Divider />
                        <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => onDelete(member.id, `${member.firstNameTh} ${member.lastNameTh}`)}>ลบสมาชิก</Menu.Item>
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
                    <Text c="dimmed">{hasFilter ? 'ไม่พบสมาชิกที่ตรงกับการค้นหา' : 'ยังไม่มีข้อมูลสมาชิก'}</Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {totalPages > 1 && (
        <Center mt="md">
          <Pagination value={page} onChange={onPageChange} total={totalPages} color="skyBlue" radius="md" />
        </Center>
      )}
    </Stack>
  );
}
