import 'server-only';

import { prisma } from '@/lib/prisma';
import {
  formatGateLabelFromCode,
  normalizeGateCode,
  type GateLabelLocale,
  type ResolvedGateLabel,
} from '@/lib/gate-display-label';

type AdminGateRow = {
  nameTh: string;
  nameEn: string;
  nameZh: string;
};

export type GateDisplayRegistry = {
  resolve: (rawCode: string | null | undefined) => ResolvedGateLabel;
};

export async function loadGateDisplayRegistry(
  locale: GateLabelLocale = 'th',
): Promise<GateDisplayRegistry> {
  const gates = await prisma.gate.findMany({
    select: {
      gateCode: true,
      nameTh: true,
      nameEn: true,
      nameZh: true,
    },
  });

  const byCode = new Map<string, AdminGateRow>();
  for (const gate of gates) {
    byCode.set(normalizeGateCode(gate.gateCode), {
      nameTh: gate.nameTh,
      nameEn: gate.nameEn,
      nameZh: gate.nameZh,
    });
  }

  function pickName(row: AdminGateRow): string {
    if (locale === 'en') return row.nameEn;
    if (locale === 'zh') return row.nameZh;
    return row.nameTh;
  }

  return {
    resolve(rawCode: string | null | undefined): ResolvedGateLabel {
      const code = (rawCode ?? '').trim();
      if (!code) {
        return { code: '—', displayName: '—', source: 'inferred' };
      }

      const admin = byCode.get(normalizeGateCode(code));
      if (admin) {
        return { code, displayName: pickName(admin), source: 'admin' };
      }

      return {
        code,
        displayName: formatGateLabelFromCode(code, locale),
        source: 'inferred',
      };
    },
  };
}
