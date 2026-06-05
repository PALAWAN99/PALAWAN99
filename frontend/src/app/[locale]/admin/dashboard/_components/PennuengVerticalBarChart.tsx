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
const LINE_HEIGHT = 16;
const TICK_FONT_SIZE = 11;
const X_AXIS_TICK_HEIGHT = 56;
const CHART_BODY_HEIGHT = 248;

/** แบ่งป้ายเป็น 2 บรรทัด กึ่งกลางใต้แท่ง — ไม่เอียง */
export function labelToLines(name: string): [string, string] {
  const t = name.trim();
  if (!t) return ['—', ''];

  if (t.includes('/')) {
    const [a, b] = t.split('/').map((s) => s.trim());
    return [a, b];
  }

  const presets: Record<string, [string, string]> = {
    มีงานตรงสาย: ['มีงาน', 'ตรงสาย'],
    มีงานไม่ตรงสาย: ['มีงาน', 'ไม่ตรงสาย'],
    ศึกษาต่อ: ['ศึกษา', 'ต่อ'],
    'ยังไม่ระบุ/ว่างงาน': ['ยังไม่ระบุ', 'ว่างงาน'],
  };
  if (presets[t]) return presets[t];

  if (t.length <= 9) return [t, ''];

  const mid = Math.ceil(t.length / 2);
  return [t.slice(0, mid), t.slice(mid)];
}

type TickProps = {
  x?: number | string;
  y?: number | string;
  payload?: { value?: string };
};

function BalancedXAxisTick({ x, y, payload }: TickProps) {
  const tx = typeof x === 'number' ? x : Number(x) || 0;
  const ty = typeof y === 'number' ? y : Number(y) || 0;
  const [line1, line2] = labelToLines(String(payload?.value ?? ''));
  const fill = 'var(--mantine-color-dimmed)';

  return (
    <g transform={`translate(${tx},${ty})`}>
      <text textAnchor="middle" fontSize={TICK_FONT_SIZE} fill={fill}>
        <tspan x={0} dy={8}>
          {line1}
        </tspan>
        <tspan x={0} dy={LINE_HEIGHT}>
          {line2}
        </tspan>
      </text>
    </g>
  );
}


type PennuengVerticalBarChartProps = {
  data: PennuengMemberTypeSlice[];
  height?: number;
  barColor?: string;
  /** ค่าสูงสุดแกน Y (เช่น 100 สำหรับ %) */
  yMax?: number;
};

export function PennuengVerticalBarChart({
  data,
  height = CHART_BODY_HEIGHT + X_AXIS_TICK_HEIGHT,
  barColor = DEFAULT_BAR_COLOR,
  yMax,
}: PennuengVerticalBarChartProps) {
  const maxValue = useMemo(() => {
    const peak = data.reduce((m, d) => Math.max(m, d.value), 0);
    if (yMax != null) return yMax;
    return Math.max(100, Math.ceil(peak / 10) * 10);
  }, [data, yMax]);

  if (data.length === 0) return null;

  return (
    <div style={{ height, width: '100%', minWidth: 0 }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: X_AXIS_TICK_HEIGHT }}
          barCategoryGap="36%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            type="category"
            angle={0}
            textAnchor="middle"
            tickLine={false}
            axisLine={false}
            interval={0}
            tickMargin={8}
            height={X_AXIS_TICK_HEIGHT}
            tick={(props) => <BalancedXAxisTick {...props} />}
          />
          <YAxis
            domain={[0, maxValue]}
            tickLine={false}
            axisLine={false}
            fontSize={TICK_FONT_SIZE}
            width={36}
          />
          <ChartTooltip
            cursor={{ fill: 'rgba(239, 68, 68, 0.06)' }}
            formatter={(value) => [Number(value ?? 0).toLocaleString(), '']}
            labelFormatter={(label) => String(label)}
          />
          <Bar
            dataKey="value"
            fill={barColor}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
