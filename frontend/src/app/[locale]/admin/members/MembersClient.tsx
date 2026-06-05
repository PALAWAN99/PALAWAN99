'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  Card,
  LoadingOverlay,
  Menu,
  Tabs,
  Divider,
} from '@mantine/core';
import {
  IconPlus,
  IconUserPlus,
  IconDownload,
  IconFileText,
  IconFileTypePdf,
  IconUsers,
} from '@tabler/icons-react';

import { useMemberManagement } from './hooks/useMemberManagement';
import { MemberStats } from './_components/MemberStats';
import { MemberFilters } from './_components/MemberFilters';
import { MemberTable } from './_components/MemberTable';
import { MemberFormModal } from './_components/MemberFormModal';
import { MemberRenewModal } from './_components/MemberRenewModal';
import { MemberHistoryModal } from './_components/MemberHistoryModal';
import {
  MemberManualRegisterForm,
  EMPTY_MANUAL_MEMBER,
  EMPTY_MANUAL_ADDITIONAL,
} from './_components/MemberManualRegisterForm';
import { IdCardSuccessModal } from '../idcard/_components/IdCardSuccessModal';

export default function MembersClient() {
  const t = useTranslations();
  const tm = useTranslations('Member');
  const [activeTab, setActiveTab] = useState<string | null>('list');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ticketUrl, setTicketUrl] = useState('');
  const [manualData, setManualData] = useState(EMPTY_MANUAL_MEMBER);
  const [additionalData, setAdditionalData] = useState(EMPTY_MANUAL_ADDITIONAL);

  const {
    filtered,
    stats,
    loading,
    search,
    setSearch,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    total,
    totalPages,
    initialFormData,
    isEdit,
    opened,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    close,
    renewOpened,
    renewMember,
    renewDate,
    setRenewDate,
    renewLoading,
    handleOpenRenew,
    handleRenew,
    closeRenew,
    searching,
    requestDelete,
    clearFilters,
    historyOpened,
    closeHistory,
    historyLoading,
    accessHistory,
    selectedMember,
    handleOpenHistory,
  } = useMemberManagement();

  const hasFilter = !!(search || filterType || filterStatus);

  useEffect(() => {
    if (showSuccessModal && typeof window !== 'undefined') {
      const dataToEncode = { ...manualData, ...additionalData };
      try {
        const encoded = btoa(encodeURIComponent(JSON.stringify(dataToEncode)));
        setTicketUrl(`${window.location.origin}/ticket?data=${encoded}`);
      } catch (e) {
        console.error('Failed to encode ticket data', e);
      }
    }
  }, [showSuccessModal, manualData, additionalData]);

  const handleManualRegister = () => {
    setShowSuccessModal(true);
  };

  const fullName = `${manualData.prefixTh}${manualData.firstNameTh} ${manualData.lastNameTh}`.trim();

  const handleExport = async (format: 'excel' | 'pdf') => {
    const { exportToExcel, exportToPDF } = await import('@/lib/export-utils');
    const exportData = filtered.map((m) => ({
      รหัสสมาชิก: m.memberNo,
      เลขบัตรประชาชน: m.citizenId || '-',
      'ชื่อ (ไทย)': `${m.firstNameTh} ${m.lastNameTh}`,
      'ชื่อ (อังกฤษ)': m.firstNameEn ? `${m.firstNameEn} ${m.lastNameEn}` : '-',
      อีเมล: m.email || '-',
      เบอร์โทรศัพท์: m.phone || '-',
      ประเภทสมาชิก: m.memberType,
      สถานะ: m.status,
      วันหมดอายุ: m.expireDate ? new Date(m.expireDate).toLocaleDateString('th-TH') : '-',
      วันที่สมัคร: new Date(m.createdAt).toLocaleDateString('th-TH'),
    }));

    if (format === 'excel') {
      exportToExcel(exportData, 'MemberList');
    } else {
      const headers = ['รหัส', 'ชื่อ-นามสกุล', 'ประเภท', 'สถานะ', 'หมดอายุ'];
      const body = filtered.map((m) => [
        m.memberNo,
        `${m.firstNameTh} ${m.lastNameTh}`,
        m.memberType,
        m.status,
        m.expireDate ? new Date(m.expireDate).toLocaleDateString('th-TH') : '-',
      ]);
      exportToPDF(headers, body, 'MemberList', 'รายงานรายชื่อสมาชิกทั้งหมด');
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={2}>{t('Common.members')}</Title>
        </div>
        {activeTab === 'list' && (
          <Group gap="sm">
            <Menu shadow="md" width={180} position="bottom-end">
              <Menu.Target>
                <Button variant="light" color="gray" leftSection={<IconDownload size={18} />}>
                  ส่งออก
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconFileText size={16} />}
                  onClick={() => handleExport('excel')}
                >
                  Excel (.xlsx)
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconFileTypePdf size={16} />}
                  onClick={() => handleExport('pdf')}
                >
                  PDF (.pdf)
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Button variant="light" color="gray" leftSection={<IconUserPlus size={18} />} onClick={() => {}}>
              นำเข้า
            </Button>
            <Button leftSection={<IconPlus size={18} />} color="skyBlue" onClick={handleOpenAdd}>
              {t('Member.add')}
            </Button>
          </Group>
        )}
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="md">
        <Tabs.List grow>
          <Tabs.Tab value="list" leftSection={<IconUsers size={18} />}>
            {tm('tabList')}
          </Tabs.Tab>
          <Tabs.Tab value="manual" leftSection={<IconUserPlus size={18} />}>
            {tm('tabManual')}
          </Tabs.Tab>
        </Tabs.List>

        <Divider my="md" />

        <Tabs.Panel value="list">
          <Stack gap="lg">
            <MemberStats stats={stats} filterStatus={filterStatus} onFilterStatus={setFilterStatus} />

            <Card withBorder p="md" radius="md" style={{ position: 'relative' }}>
              <LoadingOverlay
                visible={loading || searching}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
              />
              <Stack gap="md">
                <MemberFilters
                  search={search}
                  onSearchChange={setSearch}
                  searching={searching}
                  filterType={filterType}
                  onFilterTypeChange={setFilterType}
                  filterStatus={filterStatus}
                  onFilterStatusChange={setFilterStatus}
                  onClear={clearFilters}
                  hasFilter={hasFilter}
                  filteredCount={filtered.length}
                  totalCount={total}
                />
                <MemberTable
                  members={filtered}
                  onEdit={handleOpenEdit}
                  onRenew={handleOpenRenew}
                  onOpenHistory={handleOpenHistory}
                  onDelete={requestDelete}
                  onClearFilters={clearFilters}
                  hasFilter={hasFilter}
                  t={t}
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </Stack>
            </Card>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="manual">
          <MemberManualRegisterForm
            manualData={manualData}
            setManualData={setManualData}
            additionalData={additionalData}
            setAdditionalData={setAdditionalData}
            onRegister={handleManualRegister}
          />
        </Tabs.Panel>
      </Tabs>

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

      <MemberHistoryModal
        opened={historyOpened}
        onClose={closeHistory}
        loading={historyLoading}
        history={accessHistory}
        member={selectedMember}
      />

      <IdCardSuccessModal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        ticketUrl={ticketUrl}
        fullName={fullName}
        citizenId={manualData.citizenId}
      />
    </Stack>
  );
}
