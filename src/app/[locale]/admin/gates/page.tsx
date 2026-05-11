'use client';

import { useTranslations } from 'next-intl';
import {
  Title,
  Text,
  Group,
  Button,
  Card,
  Stack,
  Select,
} from '@mantine/core';
import {
  IconDoor,
  IconPlus,
  IconFilter,
} from '@tabler/icons-react';

import { useGateManagement } from './hooks/useGateManagement';
import { GateTable } from './_components/GateTable';
import { GateFormModal } from './_components/GateFormModal';

/**
 * Gate Management Page
 * จัดการข้อมูลประตู/ทางเข้า-ออก
 */
export default function GateManagement() {
  const t = useTranslations();
  const {
    gates,
    branches,
    loading,
    modalOpened,
    setModalOpened,
    submitting,
    filterBranch,
    setFilterBranch,
    form,
    handleSubmit
  } = useGateManagement();

  return (
    <Stack gap="lg">
      {/* Header Section */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Group gap="xs" mb={4}>
            <IconDoor size={24} color="var(--color-navy)" />
            <Title order={2} c="var(--text-primary)">{t('Gate.management')}</Title>
          </Group>
          <Text size="sm" c="var(--text-secondary)">
            {t('Gate.desc')}
          </Text>
        </div>
        <Group>
          <Select
            placeholder={t('Gate.filterBranch')}
            leftSection={<IconFilter size={16} />}
            data={branches.map(b => ({ value: b.id, label: b.nameTh }))}
            value={filterBranch}
            onChange={setFilterBranch}
            clearable
            w={200}
          />
          <Button 
            leftSection={<IconPlus size={16} />} 
            onClick={() => setModalOpened(true)} 
            color="navy"
          >
            {t('Gate.addNew')}
          </Button>
        </Group>
      </Group>

      {/* Main Content Card */}
      <Card withBorder p={0} radius="md" style={{ overflow: 'hidden' }}>
        <GateTable 
          gates={gates} 
          loading={loading} 
          t={t} 
        />
      </Card>

      {/* Modals */}
      <GateFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        submitting={submitting}
        form={form}
        onSubmit={handleSubmit}
        branches={branches}
        t={t}
      />
    </Stack>
  );
}
