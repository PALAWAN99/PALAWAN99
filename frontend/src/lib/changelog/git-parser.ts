import type { ChangelogChangeType } from '@prisma/client';

const GIT_MARKER = (hash: string) => `<!--changelog-git:${hash}-->`;

export function formatChangelogDescription(body: string, gitHash: string): string {
  const marker = GIT_MARKER(gitHash);
  const base = body.trim() || '(ไม่มีรายละเอียดเพิ่มใน commit)';
  return `${base}\n\n${marker}`;
}

export function hasGitMarker(description: string, gitHash: string): boolean {
  return description.includes(GIT_MARKER(gitHash));
}

/** แปลงข้อความ commit (บรรทัดแรก) → ประเภท changelog */
export function inferChangeTypeFromSubject(subject: string): ChangelogChangeType {
  const s = subject.trim().toLowerCase();
  if (/^(feat|feature)(\([^)]*\))?:/.test(s)) return 'FEATURE';
  if (/^fix(\([^)]*\))?:/.test(s)) return 'FIX';
  if (/^(perf|refactor)(\([^)]*\))?:/.test(s)) return 'IMPROVEMENT';
  if (/^(security|sec)(\([^)]*\))?:/.test(s)) return 'SECURITY';
  if (/^(docs|test|chore|build|ci|style)(\([^)]*\))?:/.test(s)) return 'OTHER';
  return 'OTHER';
}

/** ใช้เป็นหัวข้อใน changelog (จำกัดความยาว) */
export function subjectToTitle(subject: string, maxLen = 200): string {
  const t = subject.trim().replace(/\s+/g, ' ');
  return t.length <= maxLen ? t : `${t.slice(0, maxLen - 1)}…`;
}
