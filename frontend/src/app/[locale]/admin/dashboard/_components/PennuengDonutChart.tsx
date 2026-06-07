'use client';

import { Box, Group, Stack, Text } from '@mantine/core';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';

import type { PennuengMemberTypeSlice } from '@/types/pennueng-dashboard';

const PIE_COLORS = [
  '#38BDF8',
  '#10B981',
  '#1E3A5F',
  '#0EA5E9',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#64748B',
  '#F97316',
  '#14B8A6',
  '#F43F5E',
  '#6366F1',
];

const OTHER_LABEL = 'อื่นๆ';

/** รวมส่วนเล็ก (< minShare) เป็น "อื่นๆ" เพื่อลดจำนวนรายการใน legend */
export function mergeSmallPieSlices(
  slices: PennuengMemberTypeSlice[],
  minShare = 0.02,
): PennuengMemberTypeSlice[] {
  if (slices.length === 0) return [];
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return slices;

  const main: PennuengMemberTypeSlice[] = [];
  let otherValue = 0;

  for (const slice of slices) {
    const share = slice.value / total;
    if (share < minShare) {
      otherValue += slice.value;
    } else {
      main.push(slice);
    }
  }

  if (otherValue > 0) {
    main.push({ name: OTHER_LABEL, value: otherValue });
  }

  return main.length > 0 ? main : slices;
}

function truncateLabel(name: string, maxLen = 32): string {
  const trimmed = name.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen - 1)}…`;
}

type PennuengDonutChartProps = {
  data: PennuengMemberTypeSlice[];
  height?: number;
  mergeSmall?: boolean;
  otherLabel?: string;
};

export function PennuengDonutChart({
  data,
  height = 200,
  mergeSmall = true,
  otherLabel = OTHER_LABEL,
}: PennuengDonutChartProps) {
  const chartData = mergeSmall ? mergeSmallPieSlices(data) : data;
  const total = chartData.reduce((sum, s) => sum + s.value, 0);

  if (total <= 0) {
    return null;
  }

  const legendRows = chartData.map((slice, i) => {
    const pct = ((slice.value / total) * 100).toFixed(0);
    const displayName =
      slice.name === OTHER_LABEL && otherLabel !== OTHER_LABEL ? otherLabel : slice.name;
    return {
      key: `${displayName}-${i}`,
      color: PIE_COLORS[i % PIE_COLORS.length],
      label: truncateLabel(displayName),
      pct,
      value: slice.value,
    };
  });

  return (
    <Group justify="center" align="center" gap="xl" wrap="wrap" py="sm">
      <Box style={{ height, width: height, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={1}
              stroke="none"
              isAnimationActive={false}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip
              formatter={(value, _name, item) => {
                const n = Number(value ?? 0);
                const pct = total > 0 ? ((n / total) * 100).toFixed(1) : '0';
                const label = (item?.payload as PennuengMemberTypeSlice | undefined)?.name ?? '';
                return [`${n.toLocaleString()} (${pct}%)`, truncateLabel(label)];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Stack gap={8} style={{ flex: '1 1 180px', minWidth: 150 }} justify="center">
        {legendRows.map((row) => (
          <Group key={row.key} gap="xs" wrap="nowrap" align="center">
            <Box
              w={12}
              h={12}
              style={{
                borderRadius: 3,
                background: row.color,
                flexShrink: 0,
              }}
            />
            <Text size="sm" lh={1.35} style={{ flex: 1, minWidth: 0 }}>
              <Text span fw={600}>
                {row.label}
              </Text>
              <Text span c="dimmed">
                {' '}
                · {row.pct}% ({row.value.toLocaleString()})
              </Text>
            </Text>
          </Group>
        ))}
      </Stack>
    </Group>
  );
}
