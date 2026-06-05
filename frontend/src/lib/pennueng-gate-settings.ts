import 'server-only';

import sql from 'mssql';
import { loadGateDisplayRegistry } from '@/lib/gate-display-registry';
import { getSqlServerPool } from '@/lib/sqlserver';
import type {
  PennuengGateSettingsRow,
  PennuengGateSettingsUpdate,
} from '@/types/pennueng-gate-settings';

type SqlGateRow = {
  gate_id: string;
  gate_name: string;
  branch_id: string | null;
  branch_desc: string | null;
  gate_ip: string | null;
  gate_subnet: string | null;
  gate_gateway: string | null;
  gate_port: string | null;
  server_ip: string | null;
  rfid_ip: string | null;
  input_ip: string | null;
  gate_serial: string | null;
  gate_status: number;
};

function trimOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function mapRow(row: SqlGateRow, labels: Awaited<ReturnType<typeof loadGateDisplayRegistry>>): PennuengGateSettingsRow {
  const gateName = row.gate_name?.trim() || row.gate_id?.trim() || '—';
  const resolved = labels.resolve(gateName);
  return {
    gateId: row.gate_id.trim(),
    gateName,
    displayLabel: resolved.displayName,
    branchId: trimOrNull(row.branch_id),
    branchDesc: trimOrNull(row.branch_desc),
    gateIp: trimOrNull(row.gate_ip),
    gateSubnet: trimOrNull(row.gate_subnet),
    gateGateway: trimOrNull(row.gate_gateway),
    gatePort: trimOrNull(row.gate_port),
    serverIp: trimOrNull(row.server_ip),
    rfidIp: trimOrNull(row.rfid_ip),
    inputIp: trimOrNull(row.input_ip),
    gateSerial: trimOrNull(row.gate_serial),
    gateStatus: row.gate_status ?? 0,
  };
}

const GATE_SELECT = `
  SELECT
    RTRIM(g.gate_id) AS gate_id,
    RTRIM(g.gate_name) AS gate_name,
    RTRIM(g.branch_id) AS branch_id,
    RTRIM(b.branch_desc) AS branch_desc,
    RTRIM(g.gate_ip) AS gate_ip,
    RTRIM(g.gate_subnet) AS gate_subnet,
    RTRIM(g.gate_gateway) AS gate_gateway,
    RTRIM(g.gate_port) AS gate_port,
    RTRIM(g.server_ip) AS server_ip,
    RTRIM(g.rfid_ip) AS rfid_ip,
    RTRIM(g.input_ip) AS input_ip,
    RTRIM(g.gate_serial) AS gate_serial,
    g.gate_status
  FROM gatemaster g WITH (NOLOCK)
  LEFT JOIN branch b ON RTRIM(g.branch_id) = RTRIM(b.branch_id)
`;

export async function fetchPennuengGateSettings(): Promise<PennuengGateSettingsRow[]> {
  const pool = await getSqlServerPool();
  const labels = await loadGateDisplayRegistry('th');
  const result = await pool.request().query<SqlGateRow>(`
    ${GATE_SELECT}
    WHERE RTRIM(g.gate_id) <> ''
      AND LOWER(RTRIM(g.gate_name)) <> 'test'
    ORDER BY g.gate_name, g.gate_id
  `);
  return result.recordset.map((row) => mapRow(row, labels));
}

export async function fetchPennuengGateSettingById(gateId: string): Promise<PennuengGateSettingsRow | null> {
  const pool = await getSqlServerPool();
  const labels = await loadGateDisplayRegistry('th');
  const result = await pool
    .request()
    .input('gateId', sql.VarChar(50), gateId.trim())
    .query<SqlGateRow>(`
      ${GATE_SELECT}
      WHERE RTRIM(g.gate_id) = @gateId
    `);
  const row = result.recordset[0];
  return row ? mapRow(row, labels) : null;
}

export async function updatePennuengGateSettings(
  gateId: string,
  patch: PennuengGateSettingsUpdate,
): Promise<PennuengGateSettingsRow> {
  const pool = await getSqlServerPool();
  const request = pool.request();
  request.input('gateId', sql.VarChar(50), gateId.trim());

  const sets: string[] = [];

  if (patch.gateIp !== undefined) {
    request.input('gateIp', sql.VarChar(50), patch.gateIp ?? '');
    sets.push('gate_ip = @gateIp');
  }
  if (patch.gateSubnet !== undefined) {
    request.input('gateSubnet', sql.VarChar(50), patch.gateSubnet ?? '');
    sets.push('gate_subnet = @gateSubnet');
  }
  if (patch.gateGateway !== undefined) {
    request.input('gateGateway', sql.VarChar(50), patch.gateGateway ?? '');
    sets.push('gate_gateway = @gateGateway');
  }
  if (patch.gatePort !== undefined) {
    request.input('gatePort', sql.VarChar(20), patch.gatePort ?? '');
    sets.push('gate_port = @gatePort');
  }
  if (patch.serverIp !== undefined) {
    request.input('serverIp', sql.VarChar(50), patch.serverIp ?? '');
    sets.push('server_ip = @serverIp');
  }
  if (patch.rfidIp !== undefined) {
    request.input('rfidIp', sql.VarChar(50), patch.rfidIp ?? '');
    sets.push('rfid_ip = @rfidIp');
  }
  if (patch.inputIp !== undefined) {
    request.input('inputIp', sql.VarChar(50), patch.inputIp ?? '');
    sets.push('input_ip = @inputIp');
  }
  if (patch.gateStatus !== undefined) {
    request.input('gateStatus', sql.Int, patch.gateStatus);
    sets.push('gate_status = @gateStatus');
  }

  if (sets.length === 0) {
    const existing = await fetchPennuengGateSettingById(gateId);
    if (!existing) throw new Error('ไม่พบประตูใน gatemaster');
    return existing;
  }

  await request.query(`
    UPDATE gatemaster
    SET ${sets.join(', ')}
    WHERE RTRIM(gate_id) = @gateId
  `);

  const updated = await fetchPennuengGateSettingById(gateId);
  if (!updated) throw new Error('ไม่พบประตูหลังอัปเดต');
  return updated;
}
