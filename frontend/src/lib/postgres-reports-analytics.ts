import 'server-only';

import dayjs from 'dayjs';
import { prisma } from '@/lib/prisma';
import type {
  ReportGateOption,
  ReportsAnalyticsPayload,
  ReportsAnalyticsQuery,
  ReportsDailyPoint,
  ReportsGateRow,
  ReportsNamedValue,
} from '@/types/reports-analytics';

const GATE_COLORS = ['#38BDF8', '#10B981', '#1E3A5F', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
const WEEKDAY_LABELS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

function parseQueryDates(query: ReportsAnalyticsQuery) {
  const start = dayjs(query.startDate).startOf('day').toDate();
  const endExclusive = dayjs(query.endDate).add(1, 'day').startOf('day').toDate();
  const dayCount = Math.max(1, dayjs(query.endDate).diff(dayjs(query.startDate), 'day') + 1);
  return { start, endExclusive, dayCount };
}

function pct(num: number, den: number): number {
  if (den <= 0) return 0;
  return Math.round((num / den) * 1000) / 10;
}

function fillDailyGaps(
  rows: ReportsDailyPoint[],
  startDate: string,
  endDate: string,
): ReportsDailyPoint[] {
  const map = new Map(rows.map((r) => [r.date, r]));
  const result: ReportsDailyPoint[] = [];
  let cursor = dayjs(startDate);
  const end = dayjs(endDate);
  while (cursor.isBefore(end) || cursor.isSame(end, 'day')) {
    const key = cursor.format('YYYY-MM-DD');
    result.push(
      map.get(key) ?? {
        date: key,
        label: cursor.format('DD MMM'),
        total: 0,
        allowed: 0,
        denied: 0,
        in: 0,
        out: 0,
      },
    );
    cursor = cursor.add(1, 'day');
  }
  return result;
}

function buildWeekdayDistribution(daily: ReportsDailyPoint[]): ReportsNamedValue[] {
  const buckets = new Array(7).fill(0) as number[];
  for (const row of daily) {
    buckets[dayjs(row.date).day()] += row.total;
  }
  return WEEKDAY_LABELS.map((name, index) => ({ name, value: buckets[index] }));
}

export async function fetchPostgresReportGateOptions(): Promise<ReportGateOption[]> {
  const gates = await prisma.gate.findMany({
    select: { id: true, gateCode: true, nameTh: true },
    orderBy: { nameTh: 'asc' },
  });
  return gates.map((gate) => ({
    id: gate.id,
    code: gate.gateCode,
    label: gate.nameTh,
  }));
}

export async function fetchPostgresReportsAnalytics(
  query: ReportsAnalyticsQuery,
): Promise<ReportsAnalyticsPayload> {
  const { start, endExclusive, dayCount } = parseQueryDates(query);
  const gateFilter =
    query.gateIds.length > 0 ? { gateId: { in: query.gateIds } } : {};

  const events = await prisma.accessEvent.findMany({
    where: {
      scannedAt: { gte: start, lt: endExclusive },
      ...gateFilter,
    },
    select: {
      scannedAt: true,
      direction: true,
      decision: true,
      gateId: true,
      memberId: true,
      member: { select: { memberType: true } },
      gate: { select: { nameTh: true, gateCode: true } },
    },
  });

  const dailyMap = new Map<string, ReportsDailyPoint>();
  const gateMap = new Map<string, ReportsGateRow>();
  const hourlyMap = new Map<number, number>();
  const memberTypeMap = new Map<string, number>();
  const uniqueMembers = new Set<string>();

  for (const event of events) {
    const dateKey = dayjs(event.scannedAt).format('YYYY-MM-DD');
    const daily =
      dailyMap.get(dateKey) ??
      ({
        date: dateKey,
        label: dayjs(event.scannedAt).format('DD MMM'),
        total: 0,
        allowed: 0,
        denied: 0,
        in: 0,
        out: 0,
      } satisfies ReportsDailyPoint);
    daily.total += 1;
    if (event.decision === 'ALLOWED') daily.allowed += 1;
    else daily.denied += 1;
    if (event.direction === 'IN' && event.decision === 'ALLOWED') daily.in += 1;
    if (event.direction === 'OUT' && event.decision === 'ALLOWED') daily.out += 1;
    dailyMap.set(dateKey, daily);

    const hour = dayjs(event.scannedAt).hour();
    hourlyMap.set(hour, (hourlyMap.get(hour) ?? 0) + 1);

    uniqueMembers.add(event.memberId);

    const gateRow =
      gateMap.get(event.gateId) ??
      ({
        gateId: event.gateId,
        gateName: event.gate.nameTh,
        code: event.gate.gateCode,
        total: 0,
        allowed: 0,
        denied: 0,
        in: 0,
        out: 0,
        denyRate: 0,
        avgDaily: 0,
      } satisfies ReportsGateRow);
    gateRow.total += 1;
    if (event.decision === 'ALLOWED') gateRow.allowed += 1;
    else gateRow.denied += 1;
    if (event.direction === 'IN' && event.decision === 'ALLOWED') gateRow.in += 1;
    if (event.direction === 'OUT' && event.decision === 'ALLOWED') gateRow.out += 1;
    gateMap.set(event.gateId, gateRow);

    const memberType = event.member ? String(event.member.memberType) : 'อื่นๆ';
    memberTypeMap.set(memberType, (memberTypeMap.get(memberType) ?? 0) + 1);
  }

  const dailyTrend = fillDailyGaps(
    Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
    query.startDate,
    query.endDate,
  );

  const detailTable = Array.from(gateMap.values())
    .map((row) => ({
      ...row,
      denyRate: pct(row.denied, row.total),
      avgDaily: Math.round((row.total / dayCount) * 10) / 10,
    }))
    .sort((a, b) => b.total - a.total);

  const totalScans = events.length;
  const allowed = events.filter((e) => e.decision === 'ALLOWED').length;
  const denied = totalScans - allowed;

  const summary = {
    totalScans,
    allowed,
    denied,
    uniqueMembers: uniqueMembers.size,
    activeGatesInRange: gateMap.size,
    avgDailyScans: Math.round((totalScans / dayCount) * 10) / 10,
    denyRate: pct(denied, totalScans),
  };

  let cumulative = 0;
  const cumulativeTrend = dailyTrend.map((row) => {
    cumulative += row.total;
    return { date: row.date, label: row.label, cumulative };
  });

  const gateShare: ReportsNamedValue[] = detailTable.slice(0, 8).map((row, index) => ({
    name: row.gateName,
    value: row.total,
    color: GATE_COLORS[index % GATE_COLORS.length],
  }));

  const gateInOut = detailTable.slice(0, 10).map((row) => ({
    name: row.gateName,
    in: row.in,
    out: row.out,
    denied: row.denied,
    total: row.total,
  }));

  const hourlyDistribution = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, '0')}:00`,
    count: hourlyMap.get(h) ?? 0,
  }));

  const memberTypeAccess: ReportsNamedValue[] = Array.from(memberTypeMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, value], index) => ({
      name,
      value,
      color: GATE_COLORS[index % GATE_COLORS.length],
    }));

  const gateRadar = detailTable.slice(0, 6).map((row) => ({
    gate: row.gateName,
    total: row.total,
    allowed: row.allowed,
    denied: row.denied,
    in: row.in,
    out: row.out,
  }));

  const denyRateTrend = dailyTrend.map((row) => ({
    date: row.date,
    label: row.label,
    total: row.total,
    denyRate: pct(row.denied, row.total),
  }));

  return {
    source: 'postgres',
    summary,
    dailyTrend,
    cumulativeTrend,
    gateShare,
    gateInOut,
    hourlyDistribution,
    weekdayDistribution: buildWeekdayDistribution(dailyTrend),
    memberTypeAccess,
    gateRadar,
    denyRateTrend,
    funnel: [
      { name: 'totalScans', value: summary.totalScans, fill: '#38BDF8' },
      { name: 'allowed', value: summary.allowed, fill: '#10B981' },
      { name: 'denied', value: summary.denied, fill: '#EF4444' },
    ],
    detailTable,
  };
}
