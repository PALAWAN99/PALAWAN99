import { Table, Badge, Stack, Text, Group, ActionIcon, Center, Tooltip, Checkbox } from '@mantine/core';
import { IconEdit, IconTrash, IconLock, IconLockOpen } from '@tabler/icons-react';
import { formatGateLabelFromCode } from '@/lib/gate-display-label';
import { Gate } from '../hooks/useGateManagement';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface GateTableProps {
  gates: Gate[];
  loading: boolean;
  lockingGateId: string | null;
  selectedIds: Set<string>;
  onToggleSelect: (id: string, checked: boolean) => void;
  onToggleSelectAll: (checked: boolean) => void;
  t: (key: string) => string;
  onEdit: (gate: Gate) => void;
  onDelete: (gate: Gate) => void;
  onToggleDeleteLock: (gate: Gate) => void;
}

export function GateTable({
  gates,
  loading,
  lockingGateId,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  t,
  onEdit,
  onDelete,
  onToggleDeleteLock,
}: GateTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'teal';
      case 'MAINTENANCE':
        return 'orange';
      case 'DISABLED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const allSelected = gates.length > 0 && gates.every((g) => selectedIds.has(g.id));
  const someSelected = gates.some((g) => selectedIds.has(g.id)) && !allSelected;

  return (
    <Table verticalSpacing="sm" highlightOnHover>
      <Table.Thead bg="var(--bg-tertiary)">
        <Table.Tr>
          <Table.Th w={44}>
            <Checkbox
              aria-label={t('Gate.selectAll')}
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => onToggleSelectAll(e.currentTarget.checked)}
              disabled={loading || gates.length === 0}
            />
          </Table.Th>
          <Table.Th w={120}>{t('Gate.code')}</Table.Th>
          <Table.Th>{t('Gate.name')}</Table.Th>
          <Table.Th>{t('Gate.dashboardNameCol')}</Table.Th>
          <Table.Th>{t('Gate.branch')}</Table.Th>
          <Table.Th w={120}>{t('Gate.direction')}</Table.Th>
          <Table.Th w={120}>{t('Common.status')}</Table.Th>
          <Table.Th w={150} ta="right">
            {t('Common.manage')}
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {loading ? (
          <Table.Tr>
            <Table.Td colSpan={8}>
              <LoadingScreen message={t('Common.loading')} minHeight="30vh" />
            </Table.Td>
          </Table.Tr>
        ) : gates.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={8}>
              <Center py="xl">
                <Text c="dimmed">{t('Common.noData')}</Text>
              </Center>
            </Table.Td>
          </Table.Tr>
        ) : (
          gates.map((gate) => (
            <Table.Tr key={gate.id} bg={selectedIds.has(gate.id) ? 'var(--mantine-color-blue-0)' : undefined}>
              <Table.Td>
                <Checkbox
                  aria-label={`${t('Gate.selectRow')} ${gate.gateCode}`}
                  checked={selectedIds.has(gate.id)}
                  onChange={(e) => onToggleSelect(gate.id, e.currentTarget.checked)}
                />
              </Table.Td>
              <Table.Td>
                <Badge variant="light" color="skyBlue" size="sm">
                  {gate.gateCode}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Stack gap={0}>
                  <Text size="sm" fw={500}>
                    {gate.nameTh}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {gate.nameEn}
                  </Text>
                </Stack>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={600} lineClamp={2}>
                  {gate.nameTh}
                </Text>
                {gate.nameTh !== formatGateLabelFromCode(gate.gateCode) ? (
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {t('Gate.autoLabel')}: {formatGateLabelFromCode(gate.gateCode)}
                  </Text>
                ) : null}
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={500}>
                  {gate.branch.nameTh}
                </Text>
                <Text size="xs" c="dimmed">
                  {gate.branch.code}
                </Text>
              </Table.Td>
              <Table.Td>
                <Badge variant="light" color={gate.direction === 'BIDIRECTIONAL' ? 'violet' : 'blue'}>
                  {gate.direction}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Badge color={getStatusColor(gate.status)} variant="filled" size="sm">
                  {gate.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs" justify="flex-end" wrap="nowrap">
                  <Tooltip
                    label={gate.deleteLocked ? t('Gate.deleteUnlock') : t('Gate.deleteLock')}
                    withArrow
                  >
                    <ActionIcon
                      variant="light"
                      color={gate.deleteLocked ? 'orange' : 'gray'}
                      aria-label={gate.deleteLocked ? t('Gate.deleteUnlock') : t('Gate.deleteLock')}
                      loading={lockingGateId === gate.id}
                      onClick={() => onToggleDeleteLock(gate)}
                    >
                      {gate.deleteLocked ? <IconLock size={16} /> : <IconLockOpen size={16} />}
                    </ActionIcon>
                  </Tooltip>
                  <ActionIcon
                    variant="light"
                    color="skyBlue"
                    aria-label={t('Common.edit')}
                    onClick={() => onEdit(gate)}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <Tooltip
                    label={gate.deleteLocked ? t('Gate.deleteBlockedByLock') : t('Common.delete')}
                    withArrow
                  >
                    <span style={{ display: 'inline-flex' }}>
                      <ActionIcon
                        variant="light"
                        color="red"
                        aria-label={t('Common.delete')}
                        disabled={gate.deleteLocked}
                        onClick={() => onDelete(gate)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </span>
                  </Tooltip>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
}
