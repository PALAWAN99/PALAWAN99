import { useState, useEffect, useCallback } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';
import { z } from 'zod';
import { createGateSchema } from '@/lib/schemas/gate';
import { IconCheck, IconX } from '@tabler/icons-react';
import React from 'react';

export interface Gate {
  id: string;
  gateCode: string;
  nameTh: string;
  nameEn: string;
  nameZh: string;
  branchId: string;
  direction: 'IN' | 'OUT' | 'BIDIRECTIONAL';
  status: 'ACTIVE' | 'MAINTENANCE' | 'DISABLED';
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
  const [gates, setGates] = useState<Gate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterBranch, setFilterBranch] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      gateCode: '',
      nameTh: '',
      nameEn: '',
      nameZh: '',
      branchId: '',
      direction: 'BIDIRECTIONAL' as const,
      status: 'ACTIVE' as const,
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
      const branchData = await branchRes.json();
      if (branchRes.ok && Array.isArray(branchData)) {
        setBranches(branchData);
      }

      const url = filterBranch ? `/api/admin/gates?branchId=${filterBranch}` : '/api/admin/gates';
      const gateRes = await fetch(url);
      const gateData = await gateRes.json();
      if (gateRes.ok && Array.isArray(gateData)) {
        setGates(gateData);
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

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        metadata: JSON.parse(values.metadata || '{}'),
      };

      const res = await fetch('/api/admin/gates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Error');

      notifications.show({
        title: 'Success',
        message: 'Gate created successfully',
        color: 'teal',
        icon: React.createElement(IconCheck, { size: 16 }),
      });

      setModalOpened(false);
      form.reset();
      fetchData();
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Error',
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
    submitting,
    filterBranch,
    setFilterBranch,
    form,
    handleSubmit,
    refresh: fetchData,
  };
}
