'use client';

import { useTranslations } from 'next-intl';
import { Stack, Group, Title, Text, Button, Card, LoadingOverlay } from '@mantine/core';
import { IconPlus, IconId, IconUserPlus } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

import { Member } from './types';
import { useMemberManagement } from './hooks/useMemberManagement';
import { MemberStats } from './_components/MemberStats';
import { MemberFilters } from './_components/MemberFilters';
import { MemberTable } from './_components/MemberTable';
import { MemberModals } from './_components/MemberModals';

export default function MembersClient({ initialMembers }: { initialMembers: Member[] }) {
  const t = useTranslations();
  const {
    filtered, stats, loading, readingId, search, setSearch, filterType, setFilterType, filterStatus, setFilterStatus,
    formData, setFormData, isEdit, opened, handleOpenAdd, handleOpenEdit, handleSubmit, close,
    renewOpened, renewMember, renewDate, setRenewDate, renewLoading, handleOpenRenew, handleRenew, closeRenew,
    handleDelete, handleReadIdCard, clearFilters
  } = useMemberManagement(initialMembers);

  const hasFilter = !!(search || filterType || filterStatus);

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{t('Common.members')}</Title>
          <Text size="sm" c="dimmed" mt={4}>{t('Member.manageDesc')}</Text>
        </div>
        <Group gap="sm">
          <Button variant="light" color="gray" leftSection={<IconId size={18} />} onClick={() => {}}>ส่งออก (Export)</Button>
          <Button variant="light" color="gray" leftSection={<IconUserPlus size={18} />} onClick={() => {}}>นำเข้า (Import)</Button>
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
            filteredCount={filtered.length} totalCount={initialMembers.length}
          />
          <MemberTable 
            members={filtered} onEdit={handleOpenEdit} onRenew={handleOpenRenew} 
            onDelete={handleDelete} onClearFilters={clearFilters} hasFilter={hasFilter} t={t} 
          />
        </Stack>
      </Card>

      <MemberModals 
        opened={opened} onClose={close} isEdit={isEdit} formData={formData} setFormData={setFormData}
        loading={loading} readingId={readingId} handleReadIdCard={handleReadIdCard} handleSubmit={handleSubmit}
        renewOpened={renewOpened} onCloseRenew={closeRenew} renewMember={renewMember}
        renewDate={renewDate} setRenewDate={setRenewDate} renewLoading={renewLoading} handleRenew={handleRenew} t={t}
      />
    </Stack>
  );
}
