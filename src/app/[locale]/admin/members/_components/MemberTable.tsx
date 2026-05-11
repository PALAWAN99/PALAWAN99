import { Table, Stack, Pagination, Center, Text } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import { Member } from '../types';
import { MemberTableRow } from './MemberTableRow';

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

export function MemberTable({ 
  members, onEdit, onRenew, onDelete, t,
  page, totalPages, onPageChange, hasFilter
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
                <MemberTableRow 
                  key={member.id} 
                  member={member} 
                  onEdit={onEdit} 
                  onRenew={onRenew} 
                  onDelete={onDelete} 
                  t={t} 
                />
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Stack align="center" py="xl" gap="xs">
                    <IconUsers size={40} color="var(--mantine-color-dimmed)" />
                    <Text c="dimmed">
                      {hasFilter ? 'ไม่พบสมาชิกที่ตรงกับการค้นหา' : 'ยังไม่มีข้อมูลสมาชิก'}
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {totalPages > 1 && (
        <Center mt="md">
          <Pagination 
            value={page} 
            onChange={onPageChange} 
            total={totalPages} 
            color="skyBlue" 
            radius="md" 
          />
        </Center>
      )}
    </Stack>
  );
}
