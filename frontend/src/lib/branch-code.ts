/** Default series for new branches: BR001, BR002, … */
export const BRANCH_CODE_PREFIX = 'BR';

export function normalizeBranchCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '-');
}

/**
 * Suggest the next branch code in the BR### series from codes already in the DB.
 * Legacy codes (MAIN, BKK01, …) are ignored unless they match the prefix + digits pattern.
 */
export function suggestNextBranchCode(
  existingCodes: string[],
  prefix: string = BRANCH_CODE_PREFIX,
): string {
  const p = prefix.toUpperCase();
  let maxNum = 0;
  const re = new RegExp(`^${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`);

  for (const raw of existingCodes) {
    const m = normalizeBranchCode(raw).match(re);
    if (m) maxNum = Math.max(maxNum, parseInt(m[1], 10));
  }

  const next = maxNum + 1;
  const width = Math.max(3, String(next).length);
  return `${p}${String(next).padStart(width, '0')}`;
}

export function isBranchCodeTaken(code: string, existingCodes: string[]): boolean {
  const normalized = normalizeBranchCode(code);
  return existingCodes.some((c) => normalizeBranchCode(c) === normalized);
}
