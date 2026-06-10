import 'server-only';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import sql from 'mssql';
import { loadGateDisplayRegistry } from '@/lib/gate-display-registry';
import { formatPennuengBangkok, pennuengSqlDateToIso } from '@/lib/pennueng-datetime';
import { pennuengStatusToDirection } from '@/lib/pennueng-dashboard';
import { getSqlServerPool } from '@/lib/sqlserver';
import type {
  PennuengGateHistoryQuery,
  PennuengGateHistoryResult,
  PennuengGateHistoryRow,
} from '@/types/pennueng-gate-history';

type SqlHistoryRow = {
  id: number;
  operate_date: Date;
  status: number;
  success: number;
  member_no: string | null;
  member_key: string | null;
  member_type: string | null;
  member_type_label: string | null;
  person_id: string | null;
  name: string | null;
  surname: string | null;
  gate_id: string;
  gate_name: string;
  remark: string | null;
};

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function buildWhereClause(
  request: sql.Request,
  query: PennuengGateHistoryQuery,
): string {
  const start = dayjs.utc(query.startDate).startOf('day').toDate();
  const endExclusive = dayjs.utc(query.endDate).add(1, 'day').startOf('day').toDate();
  request.input('startDate', sql.DateTime, start);
  request.input('endDate', sql.DateTime, endExclusive);

  const parts = ['gs.operate_date >= @startDate', 'gs.operate_date < @endDate'];

  if (query.gateId?.trim()) {
    request.input('gateId', sql.VarChar(50), query.gateId.trim());
    parts.push('RTRIM(gs.gate_id) = @gateId');
  }

  if (query.memberType?.trim()) {
    const mType = query.memberType.trim();
    if (mType === 'อื่นๆ' || mType.toLowerCase() === 'other' || mType.toLowerCase() === 'others') {
      parts.push(`(
        COALESCE(RTRIM(mt.description), N'') NOT IN (N'นักศึกษาป.ตรี', N'นักศึกษาป.โท', N'นักศึกษาป.เอก')
        AND COALESCE(RTRIM(gs.member_type), '') NOT IN ('004', '005', '006', '007')
      )`);
    } else {
      request.input('memberType', sql.NVarChar(100), mType);
      parts.push('(RTRIM(gs.member_type) = @memberType OR RTRIM(mt.description) = @memberType)');
    }
  }

  if (query.decision?.trim()) {
    const successVal = query.decision.toUpperCase() === 'ALLOWED' ? 1 : 0;
    request.input('successVal', sql.Int, successVal);
    parts.push('gs.success = @successVal');
  }

  if (query.direction?.trim()) {
    const statusVal = query.direction.toUpperCase() === 'IN' ? 1 : 0;
    request.input('statusVal', sql.Int, statusVal);
    parts.push('gs.status = @statusVal');
  }

  const search = query.search?.trim();
  if (search) {
    request.input('searchPattern', sql.NVarChar(200), `%${search}%`);
    parts.push(`(
      gs.name LIKE @searchPattern OR
      gs.surname LIKE @searchPattern OR
      RTRIM(gs.member_no) LIKE @searchPattern OR
      gs.person_id LIKE @searchPattern OR
      RTRIM(gs.member_key) LIKE @searchPattern
    )`);
  }

  return parts.join(' AND ');
}

const HISTORY_FROM = `
  FROM gatestatement gs WITH (NOLOCK)
  LEFT JOIN gatemaster g ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
  LEFT JOIN mbmembtype mt ON RTRIM(gs.member_type) = RTRIM(mt.member_type)
`;

const HISTORY_SELECT = `
  SELECT
    gs.id,
    gs.operate_date,
    gs.status,
    gs.success,
    RTRIM(gs.member_no) AS member_no,
    RTRIM(gs.member_key) AS member_key,
    RTRIM(gs.member_type) AS member_type,
    COALESCE(NULLIF(RTRIM(mt.description), ''), NULLIF(RTRIM(gs.member_type), ''), NULL) AS member_type_label,
    RTRIM(gs.person_id) AS person_id,
    gs.name,
    gs.surname,
    RTRIM(gs.gate_id) AS gate_id,
    COALESCE(NULLIF(RTRIM(g.gate_name), ''), RTRIM(gs.gate_id)) AS gate_name,
    RTRIM(gs.remark) AS remark
`;

function mapRow(
  row: SqlHistoryRow,
  labels: Awaited<ReturnType<typeof loadGateDisplayRegistry>>,
): PennuengGateHistoryRow {
  const gateCode = row.gate_name?.trim() || row.gate_id?.trim() || '—';
  const resolved = labels.resolve(gateCode);
  const firstName = row.name?.trim() || '—';
  const lastName = row.surname?.trim() || '';
  const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`.trim();
  const iso = pennuengSqlDateToIso(new Date(row.operate_date));

  return {
    id: row.id,
    scannedAt: iso,
    scannedAtLabel: formatPennuengBangkok(iso, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    direction: pennuengStatusToDirection(row.status),
    decision: row.success === 1 ? 'ALLOWED' : 'DENIED',
    memberNo: trimOrNull(row.member_no),
    memberKey: trimOrNull(row.member_key),
    memberType: trimOrNull(row.member_type),
    memberTypeLabel: trimOrNull(row.member_type_label),
    personId: trimOrNull(row.person_id),
    firstName,
    lastName,
    fullName,
    gateId: row.gate_id.trim(),
    gateName: gateCode,
    gateLabel: resolved.displayName,
    remark: trimOrNull(row.remark),
  };
}

export async function fetchPennuengGateHistory(
  query: PennuengGateHistoryQuery,
): Promise<PennuengGateHistoryResult> {
  const pool = await getSqlServerPool();
  const labels = await loadGateDisplayRegistry('th');
  const page = Math.max(1, query.page);
  const pageSize = Math.min(100, Math.max(1, query.pageSize));
  const offset = (page - 1) * pageSize;

  const countReq = pool.request();
  const where = buildWhereClause(countReq, query);
  const countResult = await countReq.query<{ total: number }>(`
    SELECT COUNT(*) AS total
    ${HISTORY_FROM}
    WHERE ${where}
  `);
  const total = countResult.recordset[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const dataReq = pool.request();
  const dataWhere = buildWhereClause(dataReq, query);
  dataReq.input('offset', sql.Int, offset);
  dataReq.input('pageSize', sql.Int, pageSize);

  const dataResult = await dataReq.query<SqlHistoryRow>(`
    ${HISTORY_SELECT}
    ${HISTORY_FROM}
    WHERE ${dataWhere}
    ORDER BY gs.operate_date DESC, gs.id DESC
    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
  `);

  return {
    rows: dataResult.recordset.map((row) => mapRow(row, labels)),
    total,
    page,
    pageSize,
    totalPages,
  };
}
