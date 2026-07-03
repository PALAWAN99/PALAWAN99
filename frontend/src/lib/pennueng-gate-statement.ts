import 'server-only';

import sql from 'mssql';
import { getSqlServerPool } from '@/lib/sqlserver';
import { assertSqlServerReady } from '@/lib/pennueng-members';
import type { PennuengGateHistoryRow } from '@/types/pennueng-gate-history';
import type { GateHistoryRecordInput } from '@/validators/gateHistoryRecordValidator';

const MANUAL_REMARK_PREFIX = '[Smart Access manual]';

function directionToStatus(direction: 'IN' | 'OUT'): number {
  return direction === 'IN' ? 1 : 0;
}

function decisionToSuccess(decision: 'ALLOWED' | 'DENIED'): number {
  return decision === 'ALLOWED' ? 1 : 0;
}

function normalizeRemark(remark: string | null | undefined): string | null {
  const trimmed = remark?.trim();
  return trimmed ? trimmed : null;
}

function withManualRemark(remark: string | null | undefined): string {
  const base = normalizeRemark(remark);
  if (!base) return MANUAL_REMARK_PREFIX;
  if (base.startsWith(MANUAL_REMARK_PREFIX)) return base;
  return `${MANUAL_REMARK_PREFIX} ${base}`;
}

async function fetchRowById(id: number): Promise<PennuengGateHistoryRow | null> {
  const pool = await getSqlServerPool();
  const rowResult = await pool.request().input('id', sql.Int, id).query<{
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
  }>(`
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
    FROM gatestatement gs WITH (NOLOCK)
    LEFT JOIN gatemaster g ON RTRIM(gs.gate_id) = RTRIM(g.gate_id)
    LEFT JOIN mbmembtype mt ON RTRIM(gs.member_type) = RTRIM(mt.member_type)
    WHERE gs.id = @id
  `);
  const row = rowResult.recordset[0];
  if (!row) return null;

  const { loadGateDisplayRegistry } = await import('@/lib/gate-display-registry');
  const { formatPennuengBangkok, pennuengSqlDateToIso } = await import('@/lib/pennueng-datetime');
  const { pennuengStatusToDirection } = await import('@/lib/pennueng-dashboard');
  const labels = await loadGateDisplayRegistry('th');
  const gateCode = row.gate_name?.trim() || row.gate_id?.trim() || '—';
  const resolved = labels.resolve(gateCode);
  const iso = pennuengSqlDateToIso(new Date(row.operate_date));
  const firstName = row.name?.trim() || '—';
  const lastName = row.surname?.trim() || '';

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
    memberNo: row.member_no?.trim() || null,
    memberKey: row.member_key?.trim() || null,
    memberType: row.member_type?.trim() || null,
    memberTypeLabel: row.member_type_label?.trim() || null,
    personId: row.person_id?.trim() || null,
    firstName,
    lastName,
    fullName: `${firstName}${lastName ? ` ${lastName}` : ''}`.trim(),
    gateId: row.gate_id.trim(),
    gateName: gateCode,
    gateLabel: resolved.displayName,
    remark: row.remark?.trim() || null,
  };
}

export async function createPennuengGateStatement(
  data: GateHistoryRecordInput,
): Promise<PennuengGateHistoryRow> {
  assertSqlServerReady();
  const pool = await getSqlServerPool();
  const req = pool.request();
  req.input('operateDate', sql.DateTime, new Date(data.operateDate));
  req.input('status', sql.Int, directionToStatus(data.direction));
  req.input('success', sql.Int, decisionToSuccess(data.decision));
  req.input('memberNo', sql.VarChar, data.memberNo?.trim() || null);
  req.input('memberKey', sql.VarChar, data.memberKey?.trim() || null);
  req.input('memberType', sql.VarChar, data.memberType?.trim() || null);
  req.input('name', sql.NVarChar, data.name.trim());
  req.input('surname', sql.NVarChar, data.surname?.trim() || null);
  req.input('personId', sql.VarChar, data.personId?.trim() || null);
  req.input('gateId', sql.VarChar, data.gateId.trim());
  req.input('remark', sql.NVarChar, withManualRemark(data.remark));

  const insertResult = await req.query<{ id: number }>(`
    INSERT INTO gatestatement (
      operate_date, status, success, member_no, member_key, member_type,
      name, surname, person_id, gate_id, remark
    )
    OUTPUT INSERTED.id
    VALUES (
      @operateDate, @status, @success, @memberNo, @memberKey, @memberType,
      @name, @surname, @personId, @gateId, @remark
    )
  `);

  const newId = insertResult.recordset[0]?.id;
  if (!newId) throw new Error('Failed to create gate statement record');

  const created = await fetchRowById(newId);
  if (!created) throw new Error('Failed to load created gate statement record');
  return created;
}

export async function updatePennuengGateStatement(
  id: number,
  data: GateHistoryRecordInput,
): Promise<PennuengGateHistoryRow> {
  assertSqlServerReady();
  const pool = await getSqlServerPool();
  const req = pool.request();
  req.input('id', sql.Int, id);
  req.input('operateDate', sql.DateTime, new Date(data.operateDate));
  req.input('status', sql.Int, directionToStatus(data.direction));
  req.input('success', sql.Int, decisionToSuccess(data.decision));
  req.input('memberNo', sql.VarChar, data.memberNo?.trim() || null);
  req.input('memberKey', sql.VarChar, data.memberKey?.trim() || null);
  req.input('memberType', sql.VarChar, data.memberType?.trim() || null);
  req.input('name', sql.NVarChar, data.name.trim());
  req.input('surname', sql.NVarChar, data.surname?.trim() || null);
  req.input('personId', sql.VarChar, data.personId?.trim() || null);
  req.input('gateId', sql.VarChar, data.gateId.trim());
  req.input('remark', sql.NVarChar, withManualRemark(data.remark));

  const updateResult = await req.query(`
    UPDATE gatestatement
    SET
      operate_date = @operateDate,
      status = @status,
      success = @success,
      member_no = @memberNo,
      member_key = @memberKey,
      member_type = @memberType,
      name = @name,
      surname = @surname,
      person_id = @personId,
      gate_id = @gateId,
      remark = @remark
    WHERE id = @id
  `);

  if ((updateResult.rowsAffected[0] ?? 0) === 0) {
    throw new Error('Gate statement record not found');
  }

  const updated = await fetchRowById(id);
  if (!updated) throw new Error('Failed to load updated gate statement record');
  return updated;
}

export async function getPennuengGateStatementById(id: number): Promise<PennuengGateHistoryRow | null> {
  assertSqlServerReady();
  return fetchRowById(id);
}
