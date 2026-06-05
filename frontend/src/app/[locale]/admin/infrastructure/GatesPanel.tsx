'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Title, Text, Group, Button, Card, Stack, Select, Divider, Alert, Badge } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDoor, IconPlus, IconFilter, IconCheck, IconX, IconArrowsExchange } from '@tabler/icons-react';

import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage } from '@/lib/parse-api-response';

import { useGateManagement } from '../gates/hooks/useGateManagement';
import { GateTable } from '../gates/_components/GateTable';
import { GateFormModal } from '../gates/_components/GateFormModal';
import { PennuengGatesCatalog, type PennuengCatalogRow } from './PennuengGatesCatalog';

export function GatesPanel() {
  const t = useTranslations();
  const [catalogRefreshKey, setCatalogRefreshKey] = useState(0);
  const [selectedGateIds, setSelectedGateIds] = useState<Set<string>>(new Set());
  const [bulkBranchId, setBulkBranchId] = useState<string | null>(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  const {
    gates,
    branches,
    loading,
    modalOpened,
    editingGateId,
    openCreateModal,
    openFromPennuengCatalog,
    openEditModal,
    requestDeleteGate,
    toggleDeleteLock,
    lockingGateId,
    handleCloseModal,
    submitting,
    filterBranch,
    setFilterBranch,
    form,
    handleSubmit,
    refresh,
  } = useGateManagement();

  const modalTitle = editingGateId ? t('Gate.editGate') : t('Gate.addNew');

  const bumpCatalog = useCallback(() => {
    setCatalogRefreshKey((k) => k + 1);
  }, []);

  const handleCatalogAction = useCallback(
    (row: PennuengCatalogRow) => {
      const existing = gates.find(
        (g) => g.gateCode.trim().toLowerCase() === row.pennuengCode.trim().toLowerCase(),
      );
      if (existing) {
        openEditModal(existing);
      } else {
        openFromPennuengCatalog(row);
      }
    },
    [gates, openEditModal, openFromPennuengCatalog],
  );

  const handleImported = useCallback(async () => {
    await refresh(false);
    bumpCatalog();
  }, [refresh, bumpCatalog]);

  const onSubmitWithRefresh = useCallback(
    async (values: Parameters<typeof handleSubmit>[0]) => {
      await handleSubmit(values);
      bumpCatalog();
    },
    [handleSubmit, bumpCatalog],
  );

  useEffect(() => {
    const visible = new Set(gates.map((g) => g.id));
    setSelectedGateIds((prev) => {
      const next = new Set([...prev].filter((id) => visible.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [gates]);

  const toggleGateSelect = useCallback((id: string, checked: boolean) => {
    setSelectedGateIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const toggleSelectAllGates = useCallback(
    (checked: boolean) => {
      if (!checked) {
        setSelectedGateIds(new Set());
        return;
      }
      setSelectedGateIds(new Set(gates.map((g) => g.id)));
    },
    [gates],
  );

  const clearSelection = useCallback(() => {
    setSelectedGateIds(new Set());
    setBulkBranchId(null);
  }, []);

  const applyBulkBranch = useCallback(async () => {
    if (!bulkBranchId || selectedGateIds.size === 0) return;
    const branchLabel = branches.find((b) => b.id === bulkBranchId)?.nameTh ?? '';
    setBulkUpdating(true);
    try {
      const res = await fetch(apiPath('/api/admin/gates/bulk-branch'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateIds: [...selectedGateIds],
          branchId: bulkBranchId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(getApiErrorMessage(json));
      notifications.show({
        title: t('Common.success'),
        message: json.message ?? `ย้าย ${selectedGateIds.size} ประตูไป ${branchLabel}`,
        color: 'teal',
        icon: <IconCheck size={16} />,
      });
      clearSelection();
      await refresh(false);
      bumpCatalog();
    } catch (err) {
      notifications.show({
        title: t('Common.error'),
        message: err instanceof Error ? err.message : t('Gate.bulkBranchFailed'),
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setBulkUpdating(false);
    }
  }, [bulkBranchId, selectedGateIds, branches, t, clearSelection, refresh, bumpCatalog]);

  return (
    <Stack gap="lg">
      <PennuengGatesCatalog
        branches={branches}
        t={t}
        onRegisterClick={handleCatalogAction}
        onImported={handleImported}
        refreshKey={catalogRefreshKey}
      />

      <Divider label={t('Gate.systemGatesSection')} labelPosition="center" />

      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs">
            <IconDoor size={24} color="var(--color-navy)" />
            <Title order={3} c="var(--text-primary)">
              {t('Gate.systemGatesTitle')}
            </Title>
          </Group>
        </div>
        <Group>
          <Select
            placeholder={t('Gate.filterBranch')}
            leftSection={<IconFilter size={16} />}
            data={branches.map((b) => ({ value: b.id, label: b.nameTh }))}
            value={filterBranch}
            onChange={setFilterBranch}
            clearable
            w={200}
          />
          <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal} color="navy">
            {t('Gate.addNew')}
          </Button>
        </Group>
      </Group>

      {selectedGateIds.size > 0 ? (
        <Alert color="blue" variant="light" radius="md">
          <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
            <Group gap="sm">
              <Badge size="lg" variant="filled" color="navy">
                {t('Gate.selectedCount', { count: selectedGateIds.size })}
              </Badge>
              <Button variant="subtle" color="gray" size="xs" onClick={clearSelection}>
                {t('Gate.clearSelection')}
              </Button>
            </Group>
            <Group gap="sm" wrap="wrap" style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Select
                label={t('Gate.bulkBranchLabel')}
                placeholder={t('Gate.selectBranch')}
                data={branches.map((b) => ({ value: b.id, label: `${b.nameTh} (${b.code})` }))}
                value={bulkBranchId}
                onChange={setBulkBranchId}
                w={{ base: '100%', sm: 280 }}
                leftSection={<IconArrowsExchange size={16} />}
              />
              <Button
                color="teal"
                mt={{ base: 0, sm: 24 }}
                loading={bulkUpdating}
                disabled={!bulkBranchId}
                onClick={applyBulkBranch}
              >
                {t('Gate.applyBulkBranch')}
              </Button>
            </Group>
          </Group>
        </Alert>
      ) : null}

      <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
        <GateTable
          gates={gates}
          loading={loading}
          lockingGateId={lockingGateId}
          selectedIds={selectedGateIds}
          onToggleSelect={toggleGateSelect}
          onToggleSelectAll={toggleSelectAllGates}
          t={t}
          onEdit={openEditModal}
          onDelete={requestDeleteGate}
          onToggleDeleteLock={toggleDeleteLock}
        />
      </Card>

      <GateFormModal
        opened={modalOpened}
        title={modalTitle}
        gateCodeReadOnly={!!editingGateId}
        onClose={handleCloseModal}
        submitting={submitting}
        form={form}
        onSubmit={onSubmitWithRefresh}
        branches={branches}
        t={t}
      />
    </Stack>
  );
}
