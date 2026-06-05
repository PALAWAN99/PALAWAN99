import 'server-only';

import { formatGateLabelFromCode, normalizeGateCode } from '@/lib/gate-display-label';
import { loadGateDisplayRegistry } from '@/lib/gate-display-registry';
import { getSqlServerPool, isSqlServerConfigured } from '@/lib/sqlserver';
import { prisma } from '@/lib/prisma';

export type PennuengGateCatalogRow = {
  pennuengCode: string;
  suggestedNameTh: string;
  suggestedNameEn: string;
  pennuengBranchId: string | null;
  pennuengBranchDesc: string | null;
  gateStatus: 'ACTIVE' | 'INACTIVE';
  registered: boolean;
  adminNameTh: string | null;
  dashboardLabel: string;
};

export async function fetchPennuengGateCatalog(): Promise<PennuengGateCatalogRow[]> {
  if (!isSqlServerConfigured()) {
    return [];
  }

  const pool = await getSqlServerPool();
  const registry = await loadGateDisplayRegistry('th');

  const sqlRows = await pool.request().query<{
    pennueng_code: string;
    pennueng_branch_id: string | null;
    pennueng_branch_desc: string | null;
    gate_status: number;
  }>(`
    SELECT
      RTRIM(g.gate_name) AS pennueng_code,
      RTRIM(g.branch_id) AS pennueng_branch_id,
      RTRIM(b.branch_desc) AS pennueng_branch_desc,
      g.gate_status
    FROM gatemaster g WITH (NOLOCK)
    LEFT JOIN branch b ON RTRIM(g.branch_id) = RTRIM(b.branch_id)
    WHERE RTRIM(g.gate_name) <> '' AND LOWER(RTRIM(g.gate_name)) <> 'test'
    ORDER BY g.gate_name
  `);

  const adminGates = await prisma.gate.findMany({
    select: { gateCode: true, nameTh: true },
  });
  const adminByCode = new Map(
    adminGates.map((g) => [normalizeGateCode(g.gateCode), g.nameTh]),
  );

  return sqlRows.recordset
    .map((row) => {
      const code = row.pennueng_code?.trim();
      if (!code) return null;

      const resolved = registry.resolve(code);
      const adminNameTh = adminByCode.get(normalizeGateCode(code)) ?? null;

      return {
        pennuengCode: code,
        suggestedNameTh: formatGateLabelFromCode(code, 'th'),
        suggestedNameEn: formatGateLabelFromCode(code, 'en'),
        pennuengBranchId: row.pennueng_branch_id?.trim() || null,
        pennuengBranchDesc: row.pennueng_branch_desc?.trim() || null,
        gateStatus: row.gate_status === 1 ? 'ACTIVE' : 'INACTIVE',
        registered: Boolean(adminNameTh),
        adminNameTh,
        dashboardLabel: adminNameTh ?? resolved.displayName,
      } satisfies PennuengGateCatalogRow;
    })
    .filter((row): row is PennuengGateCatalogRow => row !== null);
}
