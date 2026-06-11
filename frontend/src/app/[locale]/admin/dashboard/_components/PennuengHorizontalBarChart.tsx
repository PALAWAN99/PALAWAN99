'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';

import type { PennuengMemberTypeSlice } from '@/types/pennueng-dashboard';

const DEFAULT_BAR_COLOR = '#EF4444';
const LINE_HEIGHT = 14;
const TICK_FONT_SIZE = 11;

/** แบ่งป้ายแกน Y เป็นหลายบรรทัด — ลดการซ้อนทับเมื่อมีหลายหมวด */
export function labelToYAxisLines(name: string, maxCharsPerLine = 16): string[] {
  const t = name.trim();
  if (!t) return ['—'];

  const presets: Record<string, string[]> = {
    'สถานะปกติ สำเร็จการศึกษา': ['สถานะปกติ', 'สำเร็จการศึกษา'],
    'พ้นสภาพเนื่องจากลาออก': ['พ้นสภาพเนื่องจาก', 'ลาออก'],
    'พ้นสภาพเนื่องจากไม่ลงทะเบียนตามเวลากำหนด': [
      'พ้นสภาพเนื่องจาก',
      'ไม่ลงทะเบียนตามเวลากำหนด',
    ],
    'พ้นสภาพเนื่องจากพ้นสภาพ': ['พ้นสภาพเนื่องจาก', 'พ้นสภาพ'],
    'พ้นสภาพเนื่องจากจบการศึกษา': ['พ้นสภาพเนื่องจาก', 'จบการศึกษา'],
    'พ้นสภาพเนื่องจากถูกคัดออก': ['พ้นสภาพเนื่องจาก', 'ถูกคัดออก'],
    'พ้นสภาพเนื่องจากถูกให้ออก': ['พ้นสภาพเนื่องจาก', 'ถูกให้ออก'],
    'พ้นสภาพเนื่องจากเสียชีวิต': ['พ้นสภาพเนื่องจาก', 'เสียชีวิต'],
    'พ้นสภาพเนื่องจากอื่นๆ': ['พ้นสภาพเนื่องจาก', 'อื่นๆ'],
  };
  if (presets[t]) return presets[t];

  if (t.startsWith('พ้นสภาพเนื่องจาก') && t.length > maxCharsPerLine) {
    const rest = t.slice('พ้นสภาพเนื่องจาก'.length).trim();
    return rest ? ['พ้นสภาพเนื่องจาก', rest] : [t];
  }

  if (t.length <= maxCharsPerLine) return [t];

  const words = t.split(/\s+/);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxCharsPerLine) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word.length > maxCharsPerLine ? word.slice(0, maxCharsPerLine) : word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines.slice(0, 3) : [t];
}

export function yAxisWidthForLabels(
  labels: string[],
  { min = 200, max = 320, charPx = 6.8 }: { min?: number; max?: number; charPx?: number } = {},
): number {
  if (labels.length === 0) return min;
  const longestLine = labels.reduce((m, label) => {
    const lines = labelToYAxisLines(label);
    const longest = lines.reduce((lm, line) => Math.max(lm, line.length), 0);
    return Math.max(m, longest);
  }, 0);
  return Math.min(max, Math.max(min, Math.ceil(longestLine * charPx) + 20));
}

export function chartHeightForHorizontalBars(
  data: PennuengMemberTypeSlice[],
  { minHeight = 280, rowBase = 36, lineExtra = 16 }: {
    minHeight?: number;
    rowBase?: number;
    lineExtra?: number;
  } = {},
): number {
  if (data.length === 0) return minHeight;
  const rows = data.reduce((sum, d) => {
    const lines = labelToYAxisLines(d.name).length;
    return sum + rowBase + Math.max(0, lines - 1) * lineExtra;
  }, 40);
  return Math.max(minHeight, rows);
}

type TickProps = {
  x?: number;
  y?: number;
  payload?: { value?: string };
  maxCharsPerLine?: number;
};

function BalancedYAxisTick({ x = 0, y = 0, payload, maxCharsPerLine = 16 }: TickProps) {
  const lines = labelToYAxisLines(String(payload?.value ?? ''), maxCharsPerLine);
  const fill = 'var(--mantine-color-dimmed)';
  const lineCount = Math.max(lines.length, 1);
  const offsetY = -((lineCount - 1) * LINE_HEIGHT) / 2;

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="end" fontSize={TICK_FONT_SIZE} fill={fill}>
        {lines.map((line, i) => (
          <tspan key={i} x={0} dy={i === 0 ? offsetY : LINE_HEIGHT}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/** สถานะนักศึกษา (ทะเบียน) — MOCK จนกว่ามีแหล่งข้อมูลจริง */
export const MOCK_STUDENT_STATUS_SHARE: PennuengMemberTypeSlice[] = [
  { name: 'นักศึกษาปัจจุบัน', value: 892 },
  { name: 'สถานะปกติ สำเร็จการศึกษา', value: 718 },
  { name: 'มารายงานตัวแล้ว', value: 156 },
  { name: 'รักษาภาพนักศึกษา', value: 42 },
  { name: 'พ้นสภาพเนื่องจากลาออก', axisLabel: 'ลาออก', value: 28 },
  { name: 'พ้นสภาพเนื่องจากไม่ลงทะเบียนตามเวลากำหนด', axisLabel: 'ไม่ลงทะเบียนตามกำหนด', value: 19 },
  { name: 'พ้นสภาพเนื่องจากจบการศึกษา', axisLabel: 'จบการศึกษา', value: 14 },
  { name: 'พ้นสภาพเนื่องจากถูกคัดออก', axisLabel: 'ถูกคัดออก', value: 11 },
  { name: 'พ้นสภาพเนื่องจากถูกให้ออก', axisLabel: 'ถูกให้ออก', value: 8 },
  { name: 'พ้นสภาพเนื่องจากเสียชีวิต', axisLabel: 'เสียชีวิต', value: 3 },
  { name: 'พ้นสภาพเนื่องจากอื่นๆ', axisLabel: 'อื่นๆ', value: 2 },
];

export function sliceAxisLabel(slice: PennuengMemberTypeSlice): string {
  return slice.axisLabel?.trim() || slice.name;
}

type PennuengHorizontalBarChartProps = {
  data: PennuengMemberTypeSlice[];
  height?: number;
  barColor?: string;
  yAxisMinWidth?: number;
  yAxisMaxWidth?: number;
  /** จำนวนหมวดมาก — ลดระยะห่างแถบเล็กน้อย */
  dense?: boolean;
  onClickBar?: (name: string) => void;
};

export function PennuengHorizontalBarChart({
  data,
  height,
  barColor = DEFAULT_BAR_COLOR,
  yAxisMinWidth = 200,
  yAxisMaxWidth = 320,
  dense,
  onClickBar,
}: PennuengHorizontalBarChartProps) {
  const chartRows = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        displayLabel: sliceAxisLabel(d),
      })),
    [data],
  );
  const labels = useMemo(() => chartRows.map((d) => d.displayLabel), [chartRows]);
  const isDense = dense ?? data.length > 10;
  const maxCharsPerLine = isDense ? 15 : 18;
  const yWidth = useMemo(
    () => yAxisWidthForLabels(labels, { min: yAxisMinWidth, max: yAxisMaxWidth }),
    [labels, yAxisMinWidth, yAxisMaxWidth],
  );
  const chartHeight = height ?? chartHeightForHorizontalBars(data, {
    minHeight: isDense ? 380 : 300,
    rowBase: isDense ? 40 : 42,
    lineExtra: 16,
  });
  const tick = useMemo(
    () => <BalancedYAxisTick maxCharsPerLine={maxCharsPerLine} />,
    [maxCharsPerLine],
  );

  if (data.length === 0) return null;

  const peak = data.reduce((m, d) => Math.max(m, d.value), 0);
  const xMax = Math.max(10, Math.ceil(peak / 100) * 100);

  return (
    <div style={{ height: chartHeight, width: '100%', minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartRows}
          layout="vertical"
          margin={{ top: 12, right: 24, left: 8, bottom: 12 }}
          barCategoryGap={isDense ? '18%' : '22%'}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, xMax]}
            fontSize={TICK_FONT_SIZE}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="displayLabel"
            width={yWidth}
            tickLine={false}
            axisLine={false}
            tick={tick}
            interval={0}
          />
          <ChartTooltip
            cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
            formatter={(value) => [Number(value ?? 0).toLocaleString(), 'จำนวน']}
            labelFormatter={(_, items) => {
              const row = items?.[0]?.payload as PennuengMemberTypeSlice | undefined;
              return row?.name ?? '';
            }}
          />
          <Bar
            dataKey="value"
            fill={barColor}
            radius={[0, 4, 4, 0]}
            barSize={isDense ? 14 : 18}
            onClick={(data) => {
              console.log('HorizontalBar click data:', data);
              if (data && data.name && onClickBar) {
                onClickBar(String(data.name));
              }
            }}
            style={{ cursor: onClickBar ? 'pointer' : 'default' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
