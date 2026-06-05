/** Pennueng / legacy gate codes (e.g. cel-b0-1) → readable labels. Admin overrides via Gate.gateCode in infrastructure. */

export type GateLabelLocale = 'th' | 'en' | 'zh';

export const KKU_GATE_PREFIX_LABELS: Record<string, { th: string; en: string; zh: string }> = {
  cel: { th: 'หอสมุดกลาง', en: 'Central Library', zh: '中央图书馆' },
  en: { th: 'วิศวกรรมศาสตร์', en: 'Engineering', zh: '工程学' },
  nkc: { th: 'วิทยาเขตหนองคาย', en: 'Nong Khai Campus', zh: '孔敬大学廊开校区' },
  ph: { th: 'เภสัชศาสตร์', en: 'Pharmacy', zh: '药学' },
  nu: { th: 'พยาบาลศาสตร์', en: 'Nursing', zh: '护理学' },
  dt: { th: 'ทันตแพทยศาสตร์', en: 'Dentistry', zh: '牙医学' },
  social: { th: 'สังคมศาสตร์', en: 'Social Sciences', zh: '社会科学' },
  ed: { th: 'ศึกษาศาสตร์', en: 'Education', zh: '教育学' },
  ams: { th: 'เทคนิคการแพทย์', en: 'Allied Medical Sciences', zh: '医学技术' },
  arc: { th: 'สถาปัตยกรรมศาสตร์', en: 'Architecture', zh: '建筑学' },
  agr: { th: 'เกษตรศาสตร์', en: 'Agriculture', zh: '农学' },
  vm: { th: 'สัตวแพทยศาสตร์', en: 'Veterinary Medicine', zh: '兽医学' },
  law: { th: 'นิติศาสตร์', en: 'Law', zh: '法学' },
  med: { th: 'แพทยศาสตร์', en: 'Medicine', zh: '医学' },
  sci: { th: 'วิทยาศาสตร์', en: 'Science', zh: '理学' },
  hum: { th: 'มนุษยศาสตร์และสังคมศาสตร์', en: 'Humanities and Social Sciences', zh: '人文与社会科学' },
  eco: { th: 'เศรษฐศาสตร์', en: 'Economics', zh: '经济学' },
  bus: { th: 'บริหารธุรกิจ', en: 'Business Administration', zh: '工商管理' },
  fine: { th: 'ศิลปกรรมศาสตร์', en: 'Fine and Applied Arts', zh: '美术与应用艺术' },
  pol: { th: 'รัฐศาสตร์', en: 'Political Science', zh: '政治学' },
  cmu: { th: 'พาณิชยศาสตร์และบัญชี', en: 'Commerce and Accountancy', zh: '商业与会计' },
  dent: { th: 'ทันตแพทยศาสตร์', en: 'Dentistry', zh: '牙医学' },
  vet: { th: 'สัตวแพทยศาสตร์', en: 'Veterinary Medicine', zh: '兽医学' },
  test: { th: 'ทดสอบ', en: 'Test', zh: '测试' },
};

export function normalizeGateCode(code: string): string {
  return code.trim().toLowerCase();
}

function prefixLabel(prefix: string, locale: GateLabelLocale): string {
  const entry = KKU_GATE_PREFIX_LABELS[prefix];
  if (!entry) return prefix.toUpperCase();
  return entry[locale];
}

function formatFloorSegment(segment: string, locale: GateLabelLocale): string {
  const m = segment.match(/^b(\d+)$/i);
  if (!m) return segment;
  if (locale === 'en') return `Floor B${m[1]}`;
  if (locale === 'zh') return `B${m[1]}层`;
  return `ชั้น B${m[1]}`;
}

function formatGateNumber(segment: string, locale: GateLabelLocale): string {
  if (!/^\d+$/.test(segment)) return segment;
  if (locale === 'en') return `Gate ${segment}`;
  if (locale === 'zh') return `门 ${segment}`;
  return `ประตู ${segment}`;
}

function formatMiscSegment(segment: string, locale: GateLabelLocale): string {
  const lower = segment.toLowerCase();
  if (lower === 'back') {
    if (locale === 'en') return 'Rear exit';
    if (locale === 'zh') return '后门';
    return 'ทางออกหลัง';
  }
  return segment;
}

/** Infer readable label from Pennueng-style code when no admin Gate row exists. */
export function formatGateLabelFromCode(rawCode: string, locale: GateLabelLocale = 'th'): string {
  const code = rawCode.trim();
  if (!code) return '—';

  const parts = code.split('-').filter(Boolean);
  if (parts.length === 0) return code;

  const prefix = parts[0].toLowerCase();
  const site = prefixLabel(prefix, locale);
  const rest = parts.slice(1);

  if (rest.length === 0) return site;

  const segments: string[] = [];

  if (/^b\d+$/i.test(rest[0])) {
    segments.push(formatFloorSegment(rest[0], locale));
    const tail = rest.slice(1);
    if (tail.length === 1 && /^\d+$/.test(tail[0])) {
      segments.push(formatGateNumber(tail[0], locale));
    } else if (tail.length > 0) {
      segments.push(...tail.map((s) => formatMiscSegment(s, locale)));
    }
  } else if (rest.length === 1 && /^\d+$/.test(rest[0])) {
    segments.push(formatGateNumber(rest[0], locale));
  } else {
    segments.push(...rest.map((s) => formatMiscSegment(s, locale)));
  }

  return [site, ...segments].join(' · ');
}

export type ResolvedGateLabel = {
  code: string;
  displayName: string;
  source: 'admin' | 'inferred';
};
