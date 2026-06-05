import { useState, useEffect, useCallback } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { modals } from '@mantine/modals';
import { useTranslations } from 'next-intl';
import { createGateSchema } from '@/lib/schemas/gate';
import { IconCheck, IconX } from '@tabler/icons-react';
import React from 'react';
import { unwrapApiList } from '@/lib/parse-api-response';

export interface Gate {
  id: string;
  gateCode: string;
  nameTh: string;
  nameEn: string;
  nameZh: string;
  branchId: string;
  direction: 'IN' | 'OUT' | 'BIDIRECTIONAL';
  status: 'ACTIVE' | 'MAINTENANCE' | 'DISABLED';
  deleteLocked: boolean;
  metadata?: unknown;
  branch: {
    nameTh: string;
    code: string;
  };
}

export interface Branch {
  id: string;
  nameTh: string;
  code: string;
}

export function useGateManagement() {
  const t = useTranslations();
  const [gates, setGates] = useState<Gate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingGateId, setEditingGateId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);
  const [lockingGateId, setLockingGateId] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      gateCode: '',
      nameTh: '',
      nameEn: '',
      nameZh: '',
      branchId: '',
      direction: 'BIDIRECTIONAL' as Gate['direction'],
      status: 'ACTIVE' as Gate['status'],
      metadata: '{}',
    },
    validate: zodResolver(createGateSchema.extend({
      metadata: z.string().refine((val) => {
        try { JSON.parse(val || '{}'); return true; } catch { return false; }
      }, 'Invalid JSON'),
    })),
  });

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const branchRes = await fetch('/api/admin/branches');
      const branchPayload = await branchRes.json();
      if (branchRes.ok) {
        setBranches(unwrapApiList<Branch>(branchPayload));
      }

      const url = filterBranch ? `/api/admin/gates?branchId=${filterBranch}` : '/api/admin/gates';
      const gateRes = await fetch(url);
      const gatePayload = await gateRes.json();
      if (gateRes.ok) {
        const list = unwrapApiList<Gate>(gatePayload);
        setGates(
          list.map((g) => ({
            ...g,
            deleteLocked: Boolean((g as Gate).deleteLocked),
          })),
        );
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Could not load data',
        color: 'red',
        icon: React.createElement(IconX, { size: 16 }),
      });
    } finally {
      setLoading(false);
    }
  }, [filterBranch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = useCallback(() => {
    setEditingGateId(null);
    form.reset();
    setModalOpened(true);
  }, [form]);

  const openFromPennuengCatalog = useCallback(
    (row: { pennuengCode: string; suggestedNameTh: string; suggestedNameEn: string }) => {
      const defaultBranch = branches.find((b) => b.code === 'LIB') ?? branches[0];
      setEditingGateId(null);
      form.setValues({
        gateCode: row.pennuengCode,
        nameTh: row.suggestedNameTh,
        nameEn: row.suggestedNameEn,
        nameZh: row.suggestedNameTh,
        branchId: defaultBranch?.id ?? '',
        direction: 'BIDIRECTIONAL',
        status: 'ACTIVE',
        metadata: JSON.stringify({ source: 'pennueng-catalog' }, null, 2),
      });
      setModalOpened(true);
    },
    [branches, form],
  );

  const openEditModal = useCallback(
    (gate: Gate) => {
      setEditingGateId(gate.id);
      const meta =
        gate.metadata == null
          ? '{}'
          : typeof gate.metadata === 'string'
            ? gate.metadata
            : JSON.stringify(gate.metadata, null, 2);
      form.setValues({
        gateCode: gate.gateCode,
        nameTh: gate.nameTh,
        nameEn: gate.nameEn,
        nameZh: gate.nameZh,
        branchId: gate.branchId,
        direction: gate.direction,
        status: gate.status,
        metadata: meta,
      });
      setModalOpened(true);
    },
    [form],
  );

  const requestDeleteGate = useCallback(
    (gate: Gate) => {
      if (gate.deleteLocked) {
        notifications.show({
          title: t('Common.error'),
          message: t('Gate.deleteBlockedByLock'),
          color: 'orange',
          icon: React.createElement(IconX, { size: 16 }),
        });
        return;
      }
      modals.openConfirmModal({
        title: t('Gate.deleteConfirmTitle'),
        children: t('Gate.deleteConfirmMessage', { code: gate.gateCode, name: gate.nameTh }),
        labels: { confirm: t('Common.delete'), cancel: t('Common.cancel') },
        confirmProps: { color: 'red' },
        centered: true,
        onConfirm: async () => {
          try {
            const res = await fetch(`/api/admin/gates/${gate.id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok) {
              const msg =
                (result as { error?: { message?: string }; message?: string }).error?.message ??
                (result as { message?: string }).message ??
                t('Common.error');
              throw new Error(msg);
            }
            notifications.show({
              title: t('Common.success'),
              message: (result as { message?: string }).message ?? t('Gate.deleteSuccess'),
              color: 'teal',
              icon: React.createElement(IconCheck, { size: 16 }),
            });
            await fetchData(false);
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : t('Common.error');
            notifications.show({
              title: t('Common.error'),
              message,
              color: 'red',
              icon: React.createElement(IconX, { size: 16 }),
            });
          }
        },
      });
    },
    [t, fetchData],
  );

  const toggleDeleteLock = useCallback(
    async (gate: Gate) => {
      setLockingGateId(gate.id);
      try {
        const res = await fetch(`/api/admin/gates/${gate.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deleteLocked: !gate.deleteLocked }),
        });
        const result = await res.json();
        if (!res.ok) {
          const msg =
            (result as { error?: { message?: string }; message?: string }).error?.message ??
            (result as { message?: string }).message ??
            t('Common.error');
          throw new Error(msg);
        }
        notifications.show({
          title: t('Common.success'),
          message: gate.deleteLocked ? t('Gate.unlockDeleteSuccess') : t('Gate.lockDeleteSuccess'),
          color: 'teal',
          icon: React.createElement(IconCheck, { size: 16 }),
        });
        await fetchData(false);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : t('Common.error');
        notifications.show({
          title: t('Common.error'),
          message,
          color: 'red',
          icon: React.createElement(IconX, { size: 16 }),
        });
      } finally {
        setLockingGateId(null);
      }
    },
    [t, fetchData],
  );

  const handleCloseModal = useCallback(() => {
    setModalOpened(false);
    setEditingGateId(null);
    form.reset();
  }, [form]);

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const metadataObj = JSON.parse(values.metadata || '{}');
      const payload = {
        ...values,
        metadata: metadataObj,
      };

      const isEdit = editingGateId != null;
      const url = isEdit ? `/api/admin/gates/${editingGateId}` : '/api/admin/gates';
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message || result.message || 'Error');

      notifications.show({
        title: 'Success',
        message: isEdit ? 'Gate updated successfully' : 'Gate created successfully',
        color: 'teal',
        icon: React.createElement(IconCheck, { size: 16 }),
      });

      handleCloseModal();
      fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
        icon: React.createElement(IconX, { size: 16 }),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    gates,
    branches,
    loading,
    modalOpened,
    setModalOpened,
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
    refresh: fetchData,
  };
}
