import { Table, Badge, Stack, Text, Group, ActionIcon, Center } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Gate } from '../hooks/useGateManagement';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface GateTableProps {
  gates: Gate[];
  loading: boolean;
  t: (key: string) => string;
}

export function GateTable({ gates, loading, t }: GateTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'teal';
      case 'MAINTENANCE': return 'orange';
      case 'DISABLED': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Table verticalSpacing="sm" highlightOnHover>
      <Table.Thead bg="var(--bg-tertiary)">
        <Table.Tr>
          <Table.Th w={120}>{t('Gate.code')}</Table.Th>
          <Table.Th>{t('Gate.name')}</Table.Th>
          <Table.Th>{t('Gate.branch')}</Table.Th>
          <Table.Th w={120}>{t('Gate.direction')}</Table.Th>
          <Table.Th w={120}>{t('Common.status')}</Table.Th>
          <Table.Th w={100} ta="right">{t('Common.manage')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {loading ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <LoadingScreen message={t('Common.loading')} minHeight="30vh" />
            </Table.Td>
          </Table.Tr>
        ) : gates.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <Center py="xl">
                <Text c="dimmed">{t('Common.noData')}</Text>
              </Center>
            </Table.Td>
          </Table.Tr>
        ) : (
          gates.map((gate) => (
            <Table.Tr key={gate.id}>
              <Table.Td>
                <Badge variant="light" color="skyBlue" size="sm">
                  {gate.gateCode}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Stack gap={0}>
                  <Text size="sm" fw={500}>{gate.nameTh}</Text>
                  <Text size="xs" c="dimmed">{gate.nameEn}</Text>
                </Stack>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={500}>{gate.branch.nameTh}</Text>
                <Text size="xs" c="dimmed">{gate.branch.code}</Text>
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
                <Group gap="xs" justify="flex-end">
                  <ActionIcon variant="light" color="skyBlue"><IconEdit size={16} /></ActionIcon>
                  <ActionIcon variant="light" color="red"><IconTrash size={16} /></ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
}
