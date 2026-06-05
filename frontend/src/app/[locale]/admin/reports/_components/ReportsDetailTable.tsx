'use client';

import { Paper, Table, Text, Badge } from '@mantine/core';
import { useTranslations } from 'next-intl';
import type { ReportsAnalyticsPayload } from '@/types/reports-analytics';

export function ReportsDetailTable({ data }: { data: ReportsAnalyticsPayload }) {
  const t = useTranslations('Report');

  return (
    <Paper withBorder p="lg" radius="md">
      <Text fw={700} mb="md" size="lg">
        {t('detailTableTitle')}
      </Text>
      <Table.ScrollContainer minWidth={960}>
        <Table striped highlightOnHover verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('tableGate')}</Table.Th>
              <Table.Th ta="right">{t('totalAccess')}</Table.Th>
              <Table.Th ta="right">{t('allowedAccess')}</Table.Th>
              <Table.Th ta="right">{t('deniedAccess')}</Table.Th>
              <Table.Th ta="right">{t('directionIn')}</Table.Th>
              <Table.Th ta="right">{t('directionOut')}</Table.Th>
              <Table.Th ta="right">{t('denyRate')}</Table.Th>
              <Table.Th ta="right">{t('avgDailyScans')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.detailTable.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <Text c="dimmed" ta="center" py="md">
                    {t('noRows')}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              data.detailTable.map((row) => (
                <Table.Tr key={row.gateId}>
                  <Table.Td>
                    <Text fw={600} size="sm">
                      {row.gateName}
                    </Text>
                    <Text size="xs" c="dimmed" ff="monospace">
                      {row.code}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="right">{row.total.toLocaleString()}</Table.Td>
                  <Table.Td ta="right">{row.allowed.toLocaleString()}</Table.Td>
                  <Table.Td ta="right">{row.denied.toLocaleString()}</Table.Td>
                  <Table.Td ta="right">{row.in.toLocaleString()}</Table.Td>
                  <Table.Td ta="right">{row.out.toLocaleString()}</Table.Td>
                  <Table.Td ta="right">
                    <Badge color={row.denyRate > 10 ? 'red' : 'teal'} variant="light">
                      {row.denyRate}%
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right">{row.avgDaily.toLocaleString()}</Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
