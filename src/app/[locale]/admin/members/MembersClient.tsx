'use client';

import { useTranslations } from 'next-intl';
import { Stack, Group, Title, Text, Button, Card, LoadingOverlay, Menu } from '@mantine/core';
import { IconPlus, IconId, IconUserPlus, IconDownload, IconFileText, IconFileTypePdf } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { Member } from './types';
import { useMemberManagement } from './hooks/useMemberManagement';
import { MemberStats } from './_components/MemberStats';
import { MemberFilters } from './_components/MemberFilters';
import { MemberTable } from './_components/MemberTable';
import { MemberFormModal } from './_components/MemberFormModal';
import { MemberRenewModal } from './_components/MemberRenewModal';

export default function MembersClient({ initialMembers }: { initialMembers: Member[] }) {
  const t = useTranslations();
  const {
    filtered, stats, loading, readingId, search, setSearch, filterType, setFilterType, filterStatus, setFilterStatus,
    page, setPage, total, totalPages,
    initialFormData, isEdit, opened, handleOpenAdd, handleOpenEdit, handleSubmit, close,
    renewOpened, renewMember, renewDate, setRenewDate, renewLoading, handleOpenRenew, handleRenew, closeRenew,
    handleDelete, clearFilters
  } = useMemberManagement(initialMembers);

  const hasFilter = !!(search || filterType || filterStatus);

  const handleExport = async (format: 'excel' | 'pdf') => {
    const { exportToExcel, exportToPDF } = await import('@/lib/export-utils');
    const exportData = filtered.map(m => ({
      'รหัสสมาชิก': m.memberNo,
      'เลขบัตรประชาชน': m.citizenId || '-',
      'ชื่อ (ไทย)': `${m.firstNameTh} ${m.lastNameTh}`,
      'ชื่อ (อังกฤษ)': m.firstNameEn ? `${m.firstNameEn} ${m.lastNameEn}` : '-',
      'อีเมล': m.email || '-',
      'เบอร์โทรศัพท์': m.phone || '-',
      'ประเภทสมาชิก': m.memberType,
      'สถานะ': m.status,
      'วันหมดอายุ': m.expireDate ? new Date(m.expireDate).toLocaleDateString('th-TH') : '-',
      'วันที่สมัคร': new Date(m.createdAt).toLocaleDateString('th-TH')
    }));

    if (format === 'excel') {
      exportToExcel(exportData, 'MemberList');
    } else {
      const headers = ['รหัส', 'ชื่อ-นามสกุล', 'ประเภท', 'สถานะ', 'หมดอายุ'];
      const body = filtered.map(m => [
        m.memberNo,
        `${m.firstNameTh} ${m.lastNameTh}`,
        m.memberType,
        m.status,
        m.expireDate ? new Date(m.expireDate).toLocaleDateString('th-TH') : '-'
      ]);
      exportToPDF(headers, body, 'MemberList', 'รายงานรายชื่อสมาชิกทั้งหมด');
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{t('Common.members')}</Title>
          <Text size="sm" c="dimmed" mt={4}>{t('Member.manageDesc')}</Text>
        </div>
        <Group gap="sm">
          <Menu shadow="md" width={180} position="bottom-end">
            <Menu.Target>
              <Button variant="light" color="gray" leftSection={<IconDownload size={18} />}>ส่งออก</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconFileText size={16} />} onClick={() => handleExport('excel')}>Excel (.xlsx)</Menu.Item>
              <Menu.Item leftSection={<IconFileTypePdf size={16} />} onClick={() => handleExport('pdf')}>PDF (.pdf)</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button variant="light" color="gray" leftSection={<IconUserPlus size={18} />} onClick={() => {}}>นำเข้า</Button>
          <Button leftSection={<IconPlus size={18} />} color="skyBlue" onClick={handleOpenAdd}>{t('Member.add')}</Button>
        </Group>
      </Group>

      <MemberStats stats={stats} filterStatus={filterStatus} onFilterStatus={setFilterStatus} />

      <Card withBorder p="md" radius="md" style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        <Stack gap="md">
          <MemberFilters 
            search={search} onSearchChange={setSearch}
            filterType={filterType} onFilterTypeChange={setFilterType}
            filterStatus={filterStatus} onFilterStatusChange={setFilterStatus}
            onClear={clearFilters} hasFilter={hasFilter}
            filteredCount={filtered.length} totalCount={total}
          />
          <MemberTable 
            members={filtered} onEdit={handleOpenEdit} onRenew={handleOpenRenew} 
            onDelete={handleDelete} onClearFilters={clearFilters} hasFilter={hasFilter} t={t} 
            page={page} totalPages={totalPages} onPageChange={setPage}
          />
        </Stack>
      </Card>

      <MemberFormModal
        opened={opened}
        onClose={close}
        isEdit={isEdit}
        initialData={initialFormData}
        loading={loading}
        onSubmit={handleSubmit}
      />

      <MemberRenewModal
        opened={renewOpened}
        onClose={closeRenew}
        member={renewMember}
        renewDate={renewDate}
        onDateChange={setRenewDate}
        loading={renewLoading}
        onConfirm={handleRenew}
      />
    </Stack>
  );
}
