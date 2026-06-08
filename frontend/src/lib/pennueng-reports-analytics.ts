import 'server-only';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import sql from 'mssql';
import { loadGateDisplayRegistry } from '@/lib/gate-display-registry';
import { getSqlServerPool } from '@/lib/sqlserver';
import type {
  ReportGateOption,
  ReportsAnalyticsPayload,
  ReportsAnalyticsQuery,
  ReportsDailyPoint,
  ReportsFunnelStep,
  ReportsGateRow,
  ReportsNamedValue,
} from '@/types/reports-analytics';

const GATE_COLORS = ['#38BDF8', '#10B981', '#1E3A5F', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'];
const WEEKDAY_LABELS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];

function parseQueryDates(query: ReportsAnalyticsQuery) {
  const start = dayjs.utc(query.startDate).startOf('day').toDate();
  const endExclusive = dayjs.utc(query.endDate).add(1, 'day').startOf('day').toDate();
  const dayCount = Math.max(1, dayjs.utc(query.endDate).diff(dayjs.utc(query.startDate), 'day') + 1);
  return { start, endExclusive, dayCount };
}

function bindGateFilter(request: sql.Request, gateIds: string[]): string {
  if (gateIds.length === 0) return '';
  const parts = gateIds.map((id, index) => {
    request.input(`gateId${index}`, sql.VarChar(50), id.trim());
    return `RTRIM(gs.gate_id) = @gateId${index}`;
  });
  return `AND (${parts.join(' OR ')})`;
}

function pct(num: number, den: number): number {
  if (den <= 0) return 0;
  return Math.round((num / den) * 1000) / 10;
}

function buildCumulative(daily: ReportsDailyPoint[]) {
  let running = 0;
  return daily.map((row) => {
    running += row.total;
    return { date: row.date, label: row.label, cumulative: running };
  });
}

function buildDenyRateTrend(daily: ReportsDailyPoint[]) {
  return daily.map((row) => ({
    date: row.date,
    label: row.label,
    total: row.total,
    denyRate: pct(row.denied, row.total),
  }));
}

function buildFunnel(summary: ReportsAnalyticsPayload['summary']): ReportsFunnelStep[] {
  return [
    { name: 'totalScans', value: summary.totalScans, fill: '#38BDF8' },
    { name: 'allowed', value: summary.allowed, fill: '#10B981' },
    { name: 'denied', value: summary.denied, fill: '#EF4444' },
  ];
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
    const label = cursor.format('DD MMM');
    result.push(
      map.get(key) ?? {
        date: key,
        label,
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
    const wd = dayjs(row.date).day();
    buckets[wd] += row.total;
  }
  return WEEKDAY_LABELS.map((name, index) => ({ name, value: buckets[index] }));
}

export async function fetchPennuengReportGateOptions(): Promise<ReportGateOption[]> {
  const pool = await getSqlServerPool();
  const labels = await loadGateDisplayRegistry('th');
  const result = await pool.request().query<{ gate_id: string; gate_name: string }>(`
    SELECT RTRIM(g.gate_id) AS gate_id, COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(g.gate_id)) AS gate_name
    FROM gatemaster g WITH (NOLOCK)
    WHERE RTRIM(g.gate_id) <> '' AND LOWER(RTRIM(g.gate_name)) <> 'test'
    ORDER BY g.gate_name
  `);
  return result.recordset.map((row) => {
    const code = row.gate_name?.trim() || row.gate_id?.trim() || '—';
    const resolved = labels.resolve(code);
    return {
      id: row.gate_id.trim(),
      code: resolved.code,
      label: resolved.displayName,
    };
  });
}

export async function fetchPennuengReportsAnalytics(
  query: ReportsAnalyticsQuery,
): Promise<ReportsAnalyticsPayload> {
  const pool = await getSqlServerPool();
  const labels = await loadGateDisplayRegistry('th');
  const { start, endExclusive, dayCount } = parseQueryDates(query);

  const summaryReq = pool.request();
  summaryReq.input('startDate', sql.DateTime, start);
  summaryReq.input('endDate', sql.DateTime, endExclusive);
  const gateFilter = bindGateFilter(summaryReq, query.gateIds);

  const summarySql = `
    SELECT
      COUNT(*) AS total_scans,
      SUM(CASE WHEN gs.success = 1 THEN 1 ELSE 0 END) AS allowed_cnt,
      SUM(CASE WHEN gs.success = 0 THEN 1 ELSE 0 END) AS denied_cnt,
      COUNT(DISTINCT CONCAT(RTRIM(ISNULL(gs.name, '')), '|', RTRIM(ISNULL(gs.surname, '')))) AS unique_members,
      COUNT(DISTINCT RTRIM(gs.gate_id)) AS active_gates
    FROM gatestatement gs WITH (NOLOCK)
    WHERE gs.operate_date >= @startDate AND gs.operate_date < @endDate
    ${gateFilter}
  `;

  const dailyReq = pool.request();
  dailyReq.input('startDate', sql.DateTime, start);
  dailyReq.input('endDate', sql.DateTime, endExclusive);
  const dailyGateFilter = bindGateFilter(dailyReq, query.gateIds);

  const dailySql = `
    SELECT
      CAST(gs.operate_date AS DATE) AS day,
      COUNT(*) AS total_cnt,
      SUM(CASE WHEN gs.success = 1 THEN 1 ELSE 0 END) AS allowed_cnt,
      SUM(CASE WHEN gs.success = 0 THEN 1 ELSE 0 END) AS denied_cnt,
      SUM(CASE WHEN gs.status = 1 AND gs.success = 1 THEN 1 ELSE 0 END) AS in_cnt,
      SUM(CASE WHEN gs.status = 0 AND gs.success = 1 THEN 1 ELSE 0 END) AS out_cnt
    FROM gatestatement gs WITH (NOLOCK)
    WHERE gs.operate_date >= @startDate AND gs.operate_date < @endDate
    ${dailyGateFilter}
    GROUP BY CAST(gs.operate_date AS DATE)
    ORDER BY day
  `;

  const gateReq = pool.request();
  gateReq.input('startDate', sql.DateTime, start);
  gateReq.input('endDate', sql.DateTime, endExclusive);
  const gateBreakdownFilter = bindGateFilter(gateReq, query.gateIds);

  const gateSql = `
    SELECT
      RTRIM(gs.gate_id) AS gate_id,
      COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(gs.gate_id)) AS gate_name,
      COUNT(*) AS total_cnt,
      SUM(CASE WHEN gs.success = 1 THEN 1 ELSE 0 END) AS allowed_cnt,
      SUM(CASE WHEN gs.success = 0 THEN 1 ELSE 0 END) AS denied_cnt,
      SUM(CASE WHEN gs.status = 1 AND gs.success = 1 THEN 1 ELSE 0 END) AS in_cnt,
      SUM(CASE WHEN gs.status = 0 AND gs.success = 1 THEN 1 ELSE 0 END) AS out_cnt
    FROM gatestatement gs WITH (NOLOCK)
    LEFT JOIN gatemaster g ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
    WHERE gs.operate_date >= @startDate AND gs.operate_date < @endDate
    ${gateBreakdownFilter}
    GROUP BY gs.gate_id, g.gate_name
    ORDER BY total_cnt DESC
  `;

  const hourlyReq = pool.request();
  hourlyReq.input('startDate', sql.DateTime, start);
  hourlyReq.input('endDate', sql.DateTime, endExclusive);
  const hourlyGateFilter = bindGateFilter(hourlyReq, query.gateIds);

  const hourlySql = `
    SELECT DATEPART(HOUR, gs.operate_date) AS h, COUNT(*) AS cnt
    FROM gatestatement gs WITH (NOLOCK)
    WHERE gs.operate_date >= @startDate AND gs.operate_date < @endDate
    ${hourlyGateFilter}
    GROUP BY DATEPART(HOUR, gs.operate_date)
    ORDER BY h
  `;

  const memberTypeReq = pool.request();
  memberTypeReq.input('startDate', sql.DateTime, start);
  memberTypeReq.input('endDate', sql.DateTime, endExclusive);
  const memberTypeGateFilter = bindGateFilter(memberTypeReq, query.gateIds);

  const memberTypeSql = `
    SELECT TOP 12
      COALESCE(NULLIF(RTRIM(mt.description), ''), NULLIF(RTRIM(gs.member_type), ''), N'อื่นๆ') AS label,
      COUNT(*) AS cnt
    FROM gatestatement gs WITH (NOLOCK)
    LEFT JOIN mbmembtype mt ON RTRIM(gs.member_type) = RTRIM(mt.member_type)
    WHERE gs.operate_date >= @startDate AND gs.operate_date < @endDate
    ${memberTypeGateFilter}
    GROUP BY mt.description, gs.member_type
    ORDER BY cnt DESC
  `;

  const [summaryRes, dailyRes, gateRes, hourlyRes, memberTypeRes] = await Promise.all([
    summaryReq.query(summarySql),
    dailyReq.query(dailySql),
    gateReq.query(gateSql),
    hourlyReq.query(hourlySql),
    memberTypeReq.query(memberTypeSql),
  ]);

  const s = summaryRes.recordset[0];
  const totalScans = s?.total_scans ?? 0;
  const allowed = s?.allowed_cnt ?? 0;
  const denied = s?.denied_cnt ?? 0;

  const dailyTrend = fillDailyGaps(
    dailyRes.recordset.map((row) => ({
      date: dayjs(row.day).format('YYYY-MM-DD'),
      label: dayjs(row.day).format('DD MMM'),
      total: row.total_cnt,
      allowed: row.allowed_cnt,
      denied: row.denied_cnt,
      in: row.in_cnt,
      out: row.out_cnt,
    })),
    query.startDate,
    query.endDate,
  );

  const detailTable: ReportsGateRow[] = gateRes.recordset.map((row) => {
    const code = row.gate_name?.trim() || row.gate_id?.trim() || '—';
    const resolved = labels.resolve(code);
    const total = row.total_cnt;
    return {
      gateId: row.gate_id.trim(),
      gateName: resolved.displayName,
      code: resolved.code,
      total,
      allowed: row.allowed_cnt,
      denied: row.denied_cnt,
      in: row.in_cnt,
      out: row.out_cnt,
      denyRate: pct(row.denied_cnt, total),
      avgDaily: Math.round((total / dayCount) * 10) / 10,
    };
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

  const hourlyMap = new Map(hourlyRes.recordset.map((row) => [row.h, row.cnt]));
  const hourlyDistribution = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, '0')}:00`,
    count: hourlyMap.get(h) ?? 0,
  }));

  const memberTypeAccess: ReportsNamedValue[] = memberTypeRes.recordset.map((row, index) => ({
    name: row.label?.trim() || 'อื่นๆ',
    value: row.cnt,
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

  const summary = {
    totalScans,
    allowed,
    denied,
    uniqueMembers: s?.unique_members ?? 0,
    activeGatesInRange: s?.active_gates ?? 0,
    avgDailyScans: Math.round((totalScans / dayCount) * 10) / 10,
    denyRate: pct(denied, totalScans),
  };

  return {
    source: 'pennueng',
    summary,
    dailyTrend,
    cumulativeTrend: buildCumulative(dailyTrend),
    gateShare,
    gateInOut,
    hourlyDistribution,
    weekdayDistribution: buildWeekdayDistribution(dailyTrend),
    memberTypeAccess,
    gateRadar,
    denyRateTrend: buildDenyRateTrend(dailyTrend),
    funnel: buildFunnel(summary),
    detailTable,
  };
}
