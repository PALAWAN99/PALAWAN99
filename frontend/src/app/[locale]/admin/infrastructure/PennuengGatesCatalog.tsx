'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Table,
  Text,
  Tooltip,
  Center,
  Loader,
  SimpleGrid,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDatabase, IconDownload, IconInfoCircle, IconPlus } from '@tabler/icons-react';

import { apiPath } from '@/lib/base-path';
import { getApiErrorMessage } from '@/lib/parse-api-response';
import { KKU_GATE_PREFIX_LABELS } from '@/lib/gate-display-label';
import type { Branch } from '../gates/hooks/useGateManagement';

export type PennuengCatalogRow = {
  pennuengCode: string;
  suggestedNameTh: string;
  suggestedNameEn: string;
  pennuengBranchId: string | null;
  pennuengBranchDesc: string | null;
  gateStatus: 'ACTIVE' | 'INACTIVE';
  registered: boolean;
  adminNameTh: string | null;
  dashboardLabel: string;
};

interface PennuengGatesCatalogProps {
  branches: Branch[];
  t: (key: string) => string;
  onRegisterClick: (row: PennuengCatalogRow) => void;
  onImported?: () => void | Promise<void>;
  refreshKey?: number;
}

const PREFIX_SAMPLES = ['cel', 'en', 'nkc', 'ams', 'vm'] as const;

export function PennuengGatesCatalog({
  branches,
  t,
  onRegisterClick,
  onImported,
  refreshKey = 0,
}: PennuengGatesCatalogProps) {
  const [rows, setRows] = useState<PennuengCatalogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [stats, setStats] = useState({ total: 0, registered: 0, unregistered: 0 });
  const [importingCode, setImportingCode] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setUnavailable(false);
    try {
      const res = await fetch(apiPath('/api/admin/gates/pennueng-catalog'));
      if (res.status === 503) {
        setUnavailable(true);
        setRows([]);
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        throw new Error(getApiErrorMessage(json));
      }
      const data = json.data;
      setRows(data.rows ?? []);
      setStats({
        total: data.total ?? 0,
        registered: data.registered ?? 0,
        unregistered: data.unregistered ?? 0,
      });
    } catch (err) {
      notifications.show({
        title: t('Common.error'),
        message: err instanceof Error ? err.message : t('Gate.pennuengCatalogLoadError'),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog, refreshKey]);

  const quickImport = async (row: PennuengCatalogRow) => {
    const libBranch = branches.find((b) => b.code === 'LIB') ?? branches[0];
    if (!libBranch) {
      notifications.show({
        title: t('Common.error'),
        message: t('Gate.importNeedBranch'),
        color: 'orange',
      });
      onRegisterClick(row);
      return;
    }

    setImportingCode(row.pennuengCode);
    try {
      const res = await fetch(apiPath('/api/admin/gates/pennueng-import'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateCode: row.pennuengCode,
          branchId: libBranch.id,
          nameTh: row.suggestedNameTh,
          nameEn: row.suggestedNameEn,
          nameZh: row.suggestedNameTh,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(getApiErrorMessage(json));
      }
      notifications.show({
        title: t('Common.success'),
        message: json.message ?? `${t('Gate.import')} ${row.pennuengCode} ${t('Common.success').toLowerCase()}`,
        color: 'teal',
      });
      await loadCatalog();
      await onImported?.();
    } catch (err) {
      notifications.show({
        title: t('Common.error'),
        message: err instanceof Error ? err.message : t('Common.saveFailed'),
        color: 'red',
      });
    } finally {
      setImportingCode(null);
    }
  };

  return (
    <Stack gap="md">
      <Alert
        icon={<IconInfoCircle size={18} />}
        title={t('Gate.pennuengMappingTitle')}
        color="blue"
        variant="light"
        radius="md"
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xs">
          {PREFIX_SAMPLES.map((key) => (
            <Text key={key} size="xs">
              <Text span fw={700} c="blue">
                {key}
              </Text>
              {' → '}
              {KKU_GATE_PREFIX_LABELS[key]?.th ?? key}
            </Text>
          ))}
        </SimpleGrid>
      </Alert>

      <Card withBorder radius="md" p="lg">
        <Group justify="space-between" mb="md" align="flex-start">
          <Group gap="sm">
            <IconDatabase size={22} color="var(--color-navy)" />
            <div>
              <Text fw={700} size="lg">
                {t('Gate.pennuengCatalogTitle')}
              </Text>
            </div>
          </Group>
          {!unavailable && !loading ? (
            <Group gap="xs">
              <Badge variant="light" color="teal">
                {`${t('Gate.registered')} ${stats.registered}/${stats.total}`}
              </Badge>
              <Badge variant="light" color="orange">
                {`${t('Gate.notRegistered')} ${stats.unregistered}`}
              </Badge>
            </Group>
          ) : null}
        </Group>

        {unavailable ? (
          <Alert color="gray" variant="light">
            {t('Dashboard.pennuengUnavailable')}
          </Alert>
        ) : loading ? (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        ) : (
          <Table.ScrollContainer minWidth={720}>
            <Table striped highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={120}>{t('Gate.pennuengCodeCol')}</Table.Th>
                  <Table.Th>{t('Gate.dashboardNameCol')}</Table.Th>
                  <Table.Th>{t('Gate.pennuengBranchCol')}</Table.Th>
                  <Table.Th w={100}>{t('Common.status')}</Table.Th>
                  <Table.Th w={100}>{t('Gate.registrationCol')}</Table.Th>
                  <Table.Th w={140} ta="right">
                    {t('Common.manage')}
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((row) => (
                  <Table.Tr key={row.pennuengCode}>
                    <Table.Td>
                      <Badge variant="filled" color="navy" size="sm">
                        {row.pennuengCode}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={600} lineClamp={2}>
                        {row.dashboardLabel}
                      </Text>
                      {!row.registered ? (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {t('Gate.suggestedName')}: {row.suggestedNameTh}
                        </Text>
                      ) : row.adminNameTh && row.adminNameTh !== row.suggestedNameTh ? (
                        <Text size="xs" c="dimmed">
                          {t('Gate.suggestedName')}: {row.suggestedNameTh}
                        </Text>
                      ) : null}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{row.pennuengBranchDesc ?? '—'}</Text>
                      {row.pennuengBranchId ? (
                        <Text size="xs" c="dimmed">
                          {row.pennuengBranchId}
                        </Text>
                      ) : null}
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        size="sm"
                        color={row.gateStatus === 'ACTIVE' ? 'teal' : 'gray'}
                        variant="light"
                      >
                        {row.gateStatus === 'ACTIVE' ? t('Dashboard.online') : t('Dashboard.offline')}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      {row.registered ? (
                        <Badge size="sm" color="teal" variant="light">
                          {t('Gate.registered')}
                        </Badge>
                      ) : (
                        <Badge size="sm" color="orange" variant="light">
                          {t('Gate.notRegistered')}
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} justify="flex-end" wrap="nowrap">
                        {row.registered ? (
                          <Tooltip label={t('Gate.editRegistered')}>
                            <Button
                              size="xs"
                              variant="light"
                              color="skyBlue"
                              onClick={() => onRegisterClick(row)}
                            >
                              {t('Common.edit')}
                            </Button>
                          </Tooltip>
                        ) : (
                          <>
                            <Tooltip label={t('Gate.quickImport')}>
                              <Button
                                size="xs"
                                variant="filled"
                                color="teal"
                                leftSection={<IconDownload size={14} />}
                                loading={importingCode === row.pennuengCode}
                                onClick={() => quickImport(row)}
                              >
                                {t('Gate.import')}
                              </Button>
                            </Tooltip>
                            <Button
                              size="xs"
                              variant="light"
                              color="navy"
                              leftSection={<IconPlus size={14} />}
                              onClick={() => onRegisterClick(row)}
                            >
                              {t('Gate.customAdd')}
                            </Button>
                          </>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Card>
    </Stack>
  );
}
