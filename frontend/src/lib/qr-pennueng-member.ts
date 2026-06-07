import 'server-only';
import type { Member, MemberStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  PENNUENG_MEMBER_ACTIVE,
  assertSqlServerReady,
  getPennuengMemberByNo,
  listPennuengMembers,
} from '@/lib/pennueng-members';
import type { PennuengMember } from '@/types/pennueng-member';

export type QrMemberSuggestion = {
  memberNo: string;
  label: string;
  name: string;
  surname: string;
  memberTypeLabel: string | null;
};

export type QrMemberForIssue = {
  id: string;
  memberNo: string;
  firstNameTh: string;
  lastNameTh: string;
  status: MemberStatus;
  memberTypeLabel: string | null;
  email: string | null;
};

const AUTOCOMPLETE_MIN_CHARS = 3;
const AUTOCOMPLETE_LIMIT = 20;

function formatSuggestionLabel(m: PennuengMember): string {
  const name = `${m.name} ${m.surname}`.trim();
  const type = m.memberTypeLabel ? ` · ${m.memberTypeLabel}` : '';
  return `${name} · ${m.memberNo}${type}`;
}

function mapPennuengStatus(m: PennuengMember): MemberStatus {
  if (m.memberStatus !== PENNUENG_MEMBER_ACTIVE) return 'SUSPENDED';
  if (m.expireDate) {
    const exp = new Date(m.expireDate);
    if (!Number.isNaN(exp.getTime()) && exp < new Date()) return 'EXPIRED';
  }
  return 'ACTIVE';
}

/** ค้นหา autocomplete จาก Pennueng (อย่างน้อย 3 ตัวอักษร) */
export async function searchPennuengMembersForQrAutocomplete(
  query: string,
): Promise<QrMemberSuggestion[]> {
  const q = query.trim();
  if (q.length < AUTOCOMPLETE_MIN_CHARS) return [];

  assertSqlServerReady();
  const { members } = await listPennuengMembers({
    search: q,
    page: 1,
    limit: AUTOCOMPLETE_LIMIT,
  });

  return members.map((m) => ({
    memberNo: m.memberNo,
    label: formatSuggestionLabel(m),
    name: m.name,
    surname: m.surname,
    memberTypeLabel: m.memberTypeLabel,
  }));
}

/** โหลดสมาชิกจาก Pennueng แล้ว sync ลง PostgreSQL สำหรับออก QR */
export async function resolveQrMemberByMemberNo(
  memberNo: string,
): Promise<QrMemberForIssue | null> {
  assertSqlServerReady();
  const penn = await getPennuengMemberByNo(memberNo.trim());
  if (!penn) return null;

  const member = await ensurePrismaMemberFromPennueng(penn);
  return {
    id: member.id,
    memberNo: member.memberNo,
    firstNameTh: member.firstNameTh,
    lastNameTh: member.lastNameTh,
    status: member.status,
    memberTypeLabel: penn.memberTypeLabel,
    email: member.email,
  };
}

async function ensurePrismaMemberFromPennueng(p: PennuengMember): Promise<Member> {
  const status = mapPennuengStatus(p);
  const expireDate = p.expireDate ? new Date(p.expireDate) : null;
  const personId = p.personId?.trim() || null;

  const existing = await prisma.member.findUnique({
    where: { memberNo: p.memberNo },
  });

  if (existing) {
    return prisma.member.update({
      where: { memberNo: p.memberNo },
      data: {
        firstNameTh: p.name,
        lastNameTh: p.surname,
        email: p.email,
        phone: p.tel,
        status,
        expireDate,
      },
    });
  }

  let citizenId: string | undefined = personId ?? undefined;
  if (citizenId) {
    const taken = await prisma.member.findUnique({ where: { citizenId } });
    if (taken) citizenId = undefined;
  }

  return prisma.member.create({
    data: {
      memberNo: p.memberNo,
      citizenId,
      firstNameTh: p.name,
      lastNameTh: p.surname,
      email: p.email,
      phone: p.tel,
      memberType: 'GUEST',
      status,
      expireDate,
    },
  });
}
