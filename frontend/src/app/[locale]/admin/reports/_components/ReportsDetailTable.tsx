'use client';

import { Paper, Table, Text, Badge, ActionIcon, Tooltip, Group } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { IconExternalLink } from '@tabler/icons-react';
import type { ReportsAnalyticsPayload } from '@/types/reports-analytics';
import type { DrillDownFilters } from '../../dashboard/_components/DashboardDrillDownModal';

interface ReportsDetailTableProps {
  data: ReportsAnalyticsPayload;
  onDrillDown?: (filter: DrillDownFilters) => void;
  startDate?: string;
  endDate?: string;
}

export function ReportsDetailTable({ data, onDrillDown, startDate, endDate }: ReportsDetailTableProps) {
  const t = useTranslations('Report');
  const source = data.source;

  // row.gateId = SQL Server gate_id จริง (เช่น "cel-b0-1") ใช้กรอง gatestatement.gate_id
  function handleRowClick(row: (typeof data.detailTable)[0]) {
    if (!onDrillDown) return;
    onDrillDown({
      title: `ประวัติการเข้า-ออก: ${row.gateName}`,
      gateId: row.gateId,
      startDate,
      endDate,
      source: source === 'pennueng' ? 'pennueng' : 'postgres',
    });
  }

  function handleDecisionClick(
    e: React.MouseEvent,
    row: (typeof data.detailTable)[0],
    decision: 'ALLOWED' | 'DENIED',
  ) {
    e.stopPropagation();
    if (!onDrillDown) return;
    onDrillDown({
      title: `${decision === 'ALLOWED' ? 'อนุญาต' : 'ปฏิเสธ'}: ${row.gateName}`,
      gateId: row.gateId,
      decision,
      startDate,
      endDate,
      source: source === 'pennueng' ? 'pennueng' : 'postgres',
    });
  }

  function handleDirectionClick(
    e: React.MouseEvent,
    row: (typeof data.detailTable)[0],
    direction: 'IN' | 'OUT',
  ) {
    e.stopPropagation();
    if (!onDrillDown) return;
    onDrillDown({
      title: `${direction === 'IN' ? 'เข้า' : 'ออก'}: ${row.gateName}`,
      gateId: row.gateId,
      direction,
      startDate,
      endDate,
      source: source === 'pennueng' ? 'pennueng' : 'postgres',
    });
  }

  const isClickable = !!onDrillDown;

  return (
    <Paper withBorder p="lg" radius="md">
      <Group justify="space-between" mb="md">
        <Text fw={700} size="lg">
          {t('detailTableTitle')}
        </Text>
        {isClickable && (
          <Text size="xs" c="dimmed">
            คลิกแถวเพื่อดูรายชื่อ • คลิกตัวเลขเพื่อกรองตามสถานะ/ทิศทาง
          </Text>
        )}
      </Group>
      <Table.ScrollContainer minWidth={960}>
        <Table
          striped
          highlightOnHover={isClickable}
          verticalSpacing="sm"
          style={isClickable ? { '--table-row-hover-bg': 'var(--mantine-color-blue-0)' } as React.CSSProperties : {}}
        >
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
              {isClickable && <Table.Th ta="center" w={48} />}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.detailTable.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={isClickable ? 9 : 8}>
                  <Text c="dimmed" ta="center" py="md">
                    {t('noRows')}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              data.detailTable.map((row) => (
                <Table.Tr
                  key={row.gateId}
                  onClick={isClickable ? () => handleRowClick(row) : undefined}
                  style={isClickable ? { cursor: 'pointer' } : {}}
                >
                  <Table.Td>
                    <Text fw={600} size="sm">
                      {row.gateName}
                    </Text>
                    <Text size="xs" c="dimmed" ff="monospace">
                      {row.code}
                    </Text>
                  </Table.Td>

                  {/* ทั้งหมด */}
                  <Table.Td ta="right">
                    <Text size="sm" fw={500}>
                      {row.total.toLocaleString()}
                    </Text>
                  </Table.Td>

                  {/* อนุญาต — คลิกกรอง ALLOWED */}
                  <Table.Td ta="right">
                    <Text
                      size="sm"
                      c="teal"
                      fw={500}
                      style={isClickable ? { cursor: 'pointer', textDecoration: 'underline dotted' } : {}}
                      onClick={(e) => handleDecisionClick(e, row, 'ALLOWED')}
                    >
                      {row.allowed.toLocaleString()}
                    </Text>
                  </Table.Td>

                  {/* ปฏิเสธ — คลิกกรอง DENIED */}
                  <Table.Td ta="right">
                    <Text
                      size="sm"
                      c={row.denied > 0 ? 'red' : 'dimmed'}
                      fw={500}
                      style={isClickable ? { cursor: 'pointer', textDecoration: 'underline dotted' } : {}}
                      onClick={(e) => handleDecisionClick(e, row, 'DENIED')}
                    >
                      {row.denied.toLocaleString()}
                    </Text>
                  </Table.Td>

                  {/* เข้า — คลิกกรอง IN */}
                  <Table.Td ta="right">
                    <Text
                      size="sm"
                      c="blue"
                      fw={500}
                      style={isClickable ? { cursor: 'pointer', textDecoration: 'underline dotted' } : {}}
                      onClick={(e) => handleDirectionClick(e, row, 'IN')}
                    >
                      {row.in.toLocaleString()}
                    </Text>
                  </Table.Td>

                  {/* ออก — คลิกกรอง OUT */}
                  <Table.Td ta="right">
                    <Text
                      size="sm"
                      c="orange"
                      fw={500}
                      style={isClickable ? { cursor: 'pointer', textDecoration: 'underline dotted' } : {}}
                      onClick={(e) => handleDirectionClick(e, row, 'OUT')}
                    >
                      {row.out.toLocaleString()}
                    </Text>
                  </Table.Td>

                  {/* อัตราปฏิเสธ */}
                  <Table.Td ta="right">
                    <Badge color={row.denyRate > 10 ? 'red' : 'teal'} variant="light">
                      {row.denyRate}%
                    </Badge>
                  </Table.Td>

                  {/* เฉลี่ยต่อวัน */}
                  <Table.Td ta="right">{row.avgDaily.toLocaleString()}</Table.Td>

                  {/* ปุ่มเปิดรายชื่อ */}
                  {isClickable && (
                    <Table.Td ta="center">
                      <Tooltip label="ดูรายชื่อ" position="left" withArrow>
                        <ActionIcon
                          variant="subtle"
                          color="navy"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(row);
                          }}
                        >
                          <IconExternalLink size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
