import 'server-only';
import { loadGateDisplayRegistry } from '@/lib/gate-display-registry';
import { formatPennuengBangkok, pennuengSqlDateToIso } from '@/lib/pennueng-datetime';
import { getSqlServerPool } from '@/lib/sqlserver';
import type {
  PennuengDashboardPayload,
  PennuengGateStatusRow,
  PennuengGateTraffic,
  PennuengHourlyPoint,
  PennuengMemberTypeSlice,
} from '@/types/pennueng-dashboard';

export type { PennuengDashboardPayload } from '@/types/pennueng-dashboard';

/** Pennueng gatestatement.status: 0 = ออก, 1 = เข้า (เมื่อ success = 1) */
export function pennuengStatusToDirection(status: number): 'IN' | 'OUT' {
  return status === 0 ? 'OUT' : 'IN';
}

const GATE_COLORS = ['#38BDF8', '#10B981', '#1E3A5F', '#0EA5E9', '#F59E0B', '#8B5CF6'];

function padHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}

export async function fetchPennuengDashboard(): Promise<PennuengDashboardPayload> {
  const pool = await getSqlServerPool();
  const gateLabels = await loadGateDisplayRegistry('th');

  const statsResult = await pool.request().query<{
    total_members: number;
    active_members: number;
    total_gates: number;
    active_gates: number;
    today_scans: number;
    today_success: number;
    today_denied: number;
  }>(`
    SELECT
      (SELECT COUNT(*) FROM mbmembmaster) AS total_members,
      (SELECT COUNT(*) FROM mbmembmaster WHERE member_status = 1) AS active_members,
      (SELECT COUNT(*) FROM gatemaster) AS total_gates,
      (SELECT COUNT(*) FROM gatemaster WHERE gate_status = 1) AS active_gates,
      (SELECT COUNT(*) FROM gatestatement WHERE operate_date >= CAST(GETDATE() AS DATE)) AS today_scans,
      (SELECT COUNT(*) FROM gatestatement WHERE operate_date >= CAST(GETDATE() AS DATE) AND success = 1) AS today_success,
      (SELECT COUNT(*) FROM gatestatement WHERE operate_date >= CAST(GETDATE() AS DATE) AND success = 0) AS today_denied
  `);

  const hourlyResult = await pool.request().query<{ h: number; in_cnt: number; out_cnt: number }>(`
    SELECT
      DATEPART(HOUR, operate_date) AS h,
      SUM(CASE WHEN status = 1 AND success = 1 THEN 1 ELSE 0 END) AS in_cnt,
      SUM(CASE WHEN status = 0 AND success = 1 THEN 1 ELSE 0 END) AS out_cnt
    FROM gatestatement WITH (NOLOCK)
    WHERE operate_date >= DATEADD(HOUR, -11, GETDATE())
    GROUP BY DATEPART(HOUR, operate_date)
    ORDER BY h
  `);

  const hourNowResult = await pool.request().query<{ h: number }>(
    `SELECT DATEPART(HOUR, GETDATE()) AS h`,
  );
  const sqlNowHour = hourNowResult.recordset[0]?.h ?? new Date().getHours();

  const hourlyMap = new Map(
    hourlyResult.recordset.map((row) => [row.h, { in: row.in_cnt, out: row.out_cnt }]),
  );
  const chartData: PennuengHourlyPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const h = (sqlNowHour - i + 24) % 24;
    const bucket = hourlyMap.get(h) ?? { in: 0, out: 0 };
    chartData.push({ name: padHour(h), in: bucket.in, out: bucket.out });
  }

  const topGates = await pool.request().query<{ gate_name: string; gate_id: string; cnt: number }>(`
    SELECT TOP 6
      COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(gs.gate_id)) AS gate_name,
      RTRIM(gs.gate_id) AS gate_id,
      COUNT(*) AS cnt
    FROM gatestatement gs WITH (NOLOCK)
    LEFT JOIN gatemaster g ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
    WHERE gs.operate_date >= CAST(GETDATE() AS DATE) AND gs.success = 1
    GROUP BY g.gate_name, gs.gate_id
    ORDER BY cnt DESC
  `);

  const gateTraffic: PennuengGateTraffic[] = topGates.recordset.map((row, idx) => {
    const raw = row.gate_name?.trim() || row.gate_id?.trim() || 'Unknown';
    const resolved = gateLabels.resolve(raw);
    return {
      name: resolved.displayName,
      code: resolved.code,
      value: row.cnt,
      color: GATE_COLORS[idx % GATE_COLORS.length],
    };
  });

  const gateStatusRows = await pool.request().query<{
    gate_name: string;
    gate_status: number;
    in_cnt: number;
    out_cnt: number;
    last_scan: Date | null;
  }>(`
    SELECT TOP 10
      COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(g.gate_id)) AS gate_name,
      g.gate_status,
      SUM(CASE WHEN gs.status = 1 AND gs.success = 1 THEN 1 ELSE 0 END) AS in_cnt,
      SUM(CASE WHEN gs.status = 0 AND gs.success = 1 THEN 1 ELSE 0 END) AS out_cnt,
      MAX(gs.operate_date) AS last_scan
    FROM gatemaster g
    LEFT JOIN gatestatement gs WITH (NOLOCK)
      ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
      AND gs.operate_date >= CAST(GETDATE() AS DATE)
    GROUP BY g.gate_name, g.gate_status, g.gate_id
    ORDER BY (SUM(CASE WHEN gs.success = 1 THEN 1 ELSE 0 END)) DESC
  `);

  const gateStatus: PennuengGateStatusRow[] = gateStatusRows.recordset.map((row) => {
    const raw = row.gate_name?.trim() || '—';
    const resolved = gateLabels.resolve(raw === '—' ? '' : raw);
    return {
      name: resolved.displayName,
      code: resolved.code,
      status: row.gate_status === 1 ? 'ACTIVE' : 'INACTIVE',
      in: row.in_cnt,
      out: row.out_cnt,
      lastScan: row.last_scan ? formatPennuengBangkok(row.last_scan) : '—',
    };
  });

  const memberTypesResult = await pool.request().query<{ label: string; cnt: number }>(`
    SELECT TOP 6
      COALESCE(NULLIF(RTRIM(t.description), ''), RTRIM(m.member_type)) AS label,
      COUNT(*) AS cnt
    FROM mbmembmaster m WITH (NOLOCK)
    LEFT JOIN mbmembtype t ON RTRIM(m.member_type) = RTRIM(t.member_type)
    WHERE m.member_status = 1
    GROUP BY t.description, m.member_type
    ORDER BY cnt DESC
  `);

  const memberTypes: PennuengMemberTypeSlice[] = memberTypesResult.recordset.map((row) => ({
    name: row.label?.trim() || 'อื่นๆ',
    value: row.cnt,
  }));

  const curriculaResult = await pool.request().query<{ label: string; cnt: number }>(`
    SELECT TOP 10
      COALESCE(NULLIF(RTRIM(d.department_desc), ''), RTRIM(m.department_code), N'ไม่ระบุ') AS label,
      COUNT(*) AS cnt
    FROM mbmembmaster m WITH (NOLOCK)
    LEFT JOIN mbdepartment d ON RTRIM(m.department_code) = RTRIM(d.department_code)
    WHERE m.member_status = 1
      AND NULLIF(RTRIM(m.department_code), '') IS NOT NULL
      AND RTRIM(m.department_code) NOT IN ('0', '')
    GROUP BY d.department_desc, m.department_code
    ORDER BY cnt DESC
  `);

  const topCurricula: PennuengMemberTypeSlice[] = curriculaResult.recordset.map((row) => ({
    name: row.label?.trim() || 'ไม่ระบุ',
    value: row.cnt,
  }));

  const recentRows = await pool.request().query<{
    id: number;
    operate_date: Date;
    status: number;
    success: number;
    name: string;
    surname: string;
    gate_name: string;
    member_type_label: string;
  }>(`
    SELECT TOP 8
      gs.id,
      gs.operate_date,
      gs.status,
      gs.success,
      gs.name,
      gs.surname,
      COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(gs.gate_id)) AS gate_name,
      COALESCE(NULLIF(RTRIM(mt.description), ''), NULLIF(RTRIM(gs.member_type), ''), N'—') AS member_type_label
    FROM gatestatement gs WITH (NOLOCK)
    LEFT JOIN gatemaster g ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
    LEFT JOIN mbmembtype mt ON RTRIM(gs.member_type) = RTRIM(mt.member_type)
    ORDER BY gs.operate_date DESC
  `);

  const recentEvents = recentRows.recordset.map((row) => ({
    id: String(row.id),
    scannedAt: pennuengSqlDateToIso(new Date(row.operate_date)),
    direction: pennuengStatusToDirection(row.status),
    decision: (row.success === 1 ? 'ALLOWED' : 'DENIED') as 'ALLOWED' | 'DENIED',
    member: {
      firstNameTh: row.name?.trim() || '—',
      lastNameTh: row.surname?.trim() || '',
    },
    memberType: row.member_type_label?.trim() || '—',
    gateName: row.gate_name?.trim()
      ? gateLabels.resolve(row.gate_name.trim()).displayName
      : undefined,
    gateCode: row.gate_name?.trim(),
  }));

  const s = statsResult.recordset[0];

  return {
    source: 'pennueng',
    stats: {
      members: {
        total: s?.total_members ?? 0,
        active: s?.active_members ?? 0,
      },
      gates: {
        total: s?.total_gates ?? 0,
        active: s?.active_gates ?? 0,
      },
      todayScans: s?.today_scans ?? 0,
      todaySuccess: s?.today_success ?? 0,
      todayDenied: s?.today_denied ?? 0,
    },
    chartData,
    gateTraffic,
    gateStatus,
    memberTypes,
    topCurricula,
    recentEvents,
  };
}
