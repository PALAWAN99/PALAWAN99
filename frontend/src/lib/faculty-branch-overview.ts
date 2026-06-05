import 'server-only';

import { KKU_GATE_PREFIX_LABELS } from '@/lib/gate-display-label';
import { fetchPennuengGateCatalog, type PennuengGateCatalogRow } from '@/lib/pennueng-gate-catalog';
import { prisma } from '@/lib/prisma';
import { isSqlServerConfigured } from '@/lib/sqlserver';

export type FacultyGateSummary = {
  pennuengCode: string;
  dashboardLabel: string;
  registered: boolean;
  pennuengBranchDesc: string | null;
  gateStatus: 'ACTIVE' | 'INACTIVE';
};

export type FacultyOverviewRow = {
  facultyKey: string;
  nameTh: string;
  nameEn: string;
  nameZh: string;
  suggestedBranchCode: string;
  gates: FacultyGateSummary[];
  gateCount: number;
  registeredGateCount: number;
  pennuengSites: string[];
  systemBranch: {
    id: string;
    code: string;
    nameTh: string;
    gateCount: number;
    isActive: boolean;
  } | null;
};

const FACULTY_DISPLAY_ORDER = [
  'cel',
  'en',
  'nkc',
  'ams',
  'agr',
  'arc',
  'bus',
  'cmu',
  'dt',
  'dent',
  'eco',
  'ed',
  'fine',
  'hum',
  'law',
  'med',
  'nu',
  'ph',
  'pol',
  'sci',
  'social',
  'vm',
  'vet',
] as const;

function facultyKeyFromGateCode(pennuengCode: string): string {
  const segment = pennuengCode.split('-').filter(Boolean)[0]?.toLowerCase() ?? '';
  if (segment && KKU_GATE_PREFIX_LABELS[segment]) return segment;
  return 'other';
}

function facultyLabels(key: string) {
  const known = KKU_GATE_PREFIX_LABELS[key];
  if (known) return known;
  return {
    th: key === 'other' ? 'อื่นๆ / ไม่ระบุคณะ' : key.toUpperCase(),
    en: key === 'other' ? 'Other' : key.toUpperCase(),
    zh: key === 'other' ? '其他' : key.toUpperCase(),
  };
}

function sortFacultyKeys(keys: string[]): string[] {
  const orderIndex = new Map(FACULTY_DISPLAY_ORDER.map((k, i) => [k, i]));
  return [...keys].sort((a, b) => {
    const ai = orderIndex.get(a as (typeof FACULTY_DISPLAY_ORDER)[number]) ?? 999;
    const bi = orderIndex.get(b as (typeof FACULTY_DISPLAY_ORDER)[number]) ?? 999;
    if (ai !== bi) return ai - bi;
    return facultyLabels(a).th.localeCompare(facultyLabels(b).th, 'th');
  });
}

function mapGate(g: PennuengGateCatalogRow): FacultyGateSummary {
  return {
    pennuengCode: g.pennuengCode,
    dashboardLabel: g.dashboardLabel,
    registered: g.registered,
    pennuengBranchDesc: g.pennuengBranchDesc,
    gateStatus: g.gateStatus,
  };
}

function findSystemBranch(
  facultyKey: string,
  branches: Array<{
    id: string;
    code: string;
    nameTh: string;
    nameEn: string;
    isActive: boolean;
    _count: { gates: number };
  }>,
) {
  const codeUpper = facultyKey.toUpperCase();
  const labels = facultyLabels(facultyKey);

  return (
    branches.find(
      (b) =>
        b.code.toUpperCase() === codeUpper ||
        b.nameTh.includes(labels.th) ||
        b.nameEn.toLowerCase().includes(labels.en.toLowerCase()),
    ) ?? null
  );
}

export async function fetchFacultyBranchOverview(): Promise<{
  configured: boolean;
  faculties: FacultyOverviewRow[];
}> {
  if (!isSqlServerConfigured()) {
    return { configured: false, faculties: [] };
  }

  const [pennuengGates, pgBranches] = await Promise.all([
    fetchPennuengGateCatalog(),
    prisma.branch.findMany({
      orderBy: { nameTh: 'asc' },
      include: { _count: { select: { gates: true } } },
    }),
  ]);

  const grouped = new Map<string, PennuengGateCatalogRow[]>();
  for (const gate of pennuengGates) {
    const key = facultyKeyFromGateCode(gate.pennuengCode);
    const list = grouped.get(key) ?? [];
    list.push(gate);
    grouped.set(key, list);
  }

  const faculties: FacultyOverviewRow[] = sortFacultyKeys([...grouped.keys()]).map((facultyKey) => {
    const gateList = grouped.get(facultyKey) ?? [];
    const labels = facultyLabels(facultyKey);
    const sites = [
      ...new Set(
        gateList.map((g) => g.pennuengBranchDesc).filter((s): s is string => Boolean(s?.trim())),
      ),
    ];
    const system = findSystemBranch(facultyKey, pgBranches);

    return {
      facultyKey,
      nameTh: labels.th,
      nameEn: labels.en,
      nameZh: labels.zh,
      suggestedBranchCode: facultyKey === 'other' ? 'OTHER' : facultyKey.toUpperCase(),
      gates: gateList.map(mapGate),
      gateCount: gateList.length,
      registeredGateCount: gateList.filter((g) => g.registered).length,
      pennuengSites: sites,
      systemBranch: system
        ? {
            id: system.id,
            code: system.code,
            nameTh: system.nameTh,
            gateCount: system._count.gates,
            isActive: system.isActive,
          }
        : null,
    };
  });

  return { configured: true, faculties };
}
