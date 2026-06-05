import 'server-only';
import sql from 'mssql';
import { getSqlServerPool, isSqlServerConfigured } from '@/lib/sqlserver';
import { prisma } from '@/lib/prisma';
import { pennuengSqlDateToIso } from '@/lib/pennueng-datetime';
import type {
  PennuengMember,
  PennuengMemberListResult,
  PennuengMemberSoftDeleteRow,
  PennuengMemberTypeOption,
} from '@/types/pennueng-member';
import type { PennuengMemberInput, PennuengMemberUpdateInput } from '@/validators/pennuengMemberValidator';
import { sanitizeMemberTypeDescription } from '@/lib/sanitizeMemberTypeDescription';

/** Pennueng: 1 = ใช้งาน, 0 = soft delete จากระบบนี้ */
export const PENNUENG_MEMBER_ACTIVE = 1;
export const PENNUENG_MEMBER_SOFT_DELETED = 0;

const MEMBER_FROM = `
  FROM mbmembmaster m WITH (NOLOCK)
  LEFT JOIN mbmembtype t ON RTRIM(m.member_type) = RTRIM(t.member_type)
`;

const MEMBER_SELECT = `
  SELECT
    RTRIM(m.member_no) AS member_no,
    RTRIM(m.member_type) AS member_type,
    NULLIF(RTRIM(t.description), '') AS member_type_label,
    NULLIF(RTRIM(m.group_code), '') AS group_code,
    NULLIF(RTRIM(m.department_code), '') AS department_code,
    NULLIF(RTRIM(m.prename_code), '') AS prename_code,
    RTRIM(m.name) AS name,
    RTRIM(m.surname) AS surname,
    NULLIF(RTRIM(m.sex), '') AS sex,
    NULLIF(RTRIM(m.address), '') AS address,
    NULLIF(RTRIM(m.tel), '') AS tel,
    NULLIF(RTRIM(m.email), '') AS email,
    m.birth_date,
    NULLIF(RTRIM(m.person_id), '') AS person_id,
    m.member_date,
    m.expire_date,
    m.member_status,
    NULLIF(RTRIM(m.descriptionn), '') AS descriptionn
  ${MEMBER_FROM}
`;

type RawMemberRow = {
  member_no: string;
  member_type: string;
  member_type_label: string | null;
  group_code: string | null;
  department_code: string | null;
  prename_code: string | null;
  name: string;
  surname: string;
  sex: string | null;
  address: string | null;
  tel: string | null;
  email: string | null;
  birth_date: Date | null;
  person_id: string | null;
  member_date: Date | null;
  expire_date: Date | null;
  member_status: number | null;
  descriptionn: string | null;
};

function dateToIso(d: Date | null | undefined): string | null {
  if (!d) return null;
  return pennuengSqlDateToIso(new Date(d));
}

function mapRow(row: RawMemberRow): PennuengMember {
  return {
    memberNo: row.member_no?.trim() ?? '',
    memberType: row.member_type?.trim() ?? '',
    memberTypeLabel: row.member_type_label?.trim() || null,
    groupCode: row.group_code,
    departmentCode: row.department_code,
    prenameCode: row.prename_code,
    name: row.name?.trim() ?? '',
    surname: row.surname?.trim() ?? '',
    sex: row.sex,
    address: row.address,
    tel: row.tel,
    email: row.email,
    birthDate: dateToIso(row.birth_date),
    personId: row.person_id,
    memberDate: dateToIso(row.member_date),
    expireDate: dateToIso(row.expire_date),
    memberStatus: row.member_status,
    description: row.descriptionn,
  };
}

function applySearch(req: sql.Request, search: string) {
  const q = `%${search.trim()}%`;
  req.input('search', sql.NVarChar, q);
  return `(
    m.member_no LIKE @search OR
    m.name LIKE @search OR
    m.surname LIKE @search OR
    m.person_id LIKE @search OR
    m.email LIKE @search OR
    m.tel LIKE @search
  )`;
}

export function assertSqlServerReady() {
  if (!isSqlServerConfigured()) {
    throw new Error('SQL Server is not configured (SQLSERVER_* in .env)');
  }
}

export async function fetchPennuengMemberTypes(): Promise<PennuengMemberTypeOption[]> {
  assertSqlServerReady();
  const pool = await getSqlServerPool();
  const result = await pool.request().query<{
    member_type: string;
    description: string | null;
    group_detail: string | null;
  }>(`
    SELECT
      RTRIM(member_type) AS member_type,
      NULLIF(RTRIM(description), '') AS description,
      NULLIF(RTRIM(group_detail), '') AS group_detail
    FROM mbmembtype WITH (NOLOCK)
    ORDER BY member_type
  `);
  return result.recordset.map((r) => ({
    memberType: r.member_type,
    description: r.description ? sanitizeMemberTypeDescription(r.description) : null,
    groupDetail: r.group_detail?.trim() || null,
  }));
}

export async function findPennuengMemberByCitizenId(
  citizenId: string,
): Promise<PennuengMember | null> {
  assertSqlServerReady();
  const id = citizenId.trim();
  if (!id) return null;
  const pool = await getSqlServerPool();
  const result = await pool
    .request()
    .input('id', sql.VarChar, id)
    .input('activeStatus', sql.Int, PENNUENG_MEMBER_ACTIVE)
    .query<RawMemberRow>(`
      ${MEMBER_SELECT}
      WHERE m.member_status = @activeStatus
        AND (RTRIM(m.member_no) = @id OR RTRIM(m.person_id) = @id)
    `);

  const row = result.recordset[0];
  return row ? mapRow(row) : null;
}

export async function getPennuengMemberTypeGroupDetail(
  memberType: string,
): Promise<string | null> {
  assertSqlServerReady();
  const pool = await getSqlServerPool();
  const result = await pool
    .request()
    .input('memberType', sql.VarChar, memberType.trim())
    .query<{ group_detail: string | null }>(`
      SELECT NULLIF(RTRIM(group_detail), '') AS group_detail
      FROM mbmembtype WITH (NOLOCK)
      WHERE RTRIM(member_type) = @memberType
    `);
  return result.recordset[0]?.group_detail?.trim() || null;
}

export async function listPennuengMembers(options: {
  search?: string;
  page?: number;
  limit?: number;
  memberType?: string | null;
}): Promise<PennuengMemberListResult> {
  assertSqlServerReady();
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));
  const skip = (page - 1) * limit;
  const pool = await getSqlServerPool();

  const clauses = ['m.member_status = @activeStatus'];
  const countReq = pool.request();
  const dataReq = pool.request();
  countReq.input('activeStatus', sql.Int, PENNUENG_MEMBER_ACTIVE);
  dataReq.input('activeStatus', sql.Int, PENNUENG_MEMBER_ACTIVE);

  if (options.memberType) {
    clauses.push('RTRIM(m.member_type) = @memberType');
    countReq.input('memberType', sql.VarChar, options.memberType);
    dataReq.input('memberType', sql.VarChar, options.memberType);
  }

  if (options.search?.trim()) {
    clauses.push(applySearch(countReq, options.search));
    applySearch(dataReq, options.search);
  }

  const where = `WHERE ${clauses.join(' AND ')}`;

  const countResult = await countReq.query<{ total: number }>(`
    SELECT COUNT(*) AS total ${MEMBER_FROM} ${where}
  `);
  const total = countResult.recordset[0]?.total ?? 0;

  dataReq.input('offset', sql.Int, skip);
  dataReq.input('limit', sql.Int, limit);

  const dataResult = await dataReq.query<RawMemberRow>(`
    ${MEMBER_SELECT}
    ${where}
    ORDER BY m.member_no DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `);

  return {
    members: dataResult.recordset.map(mapRow),
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
    page,
    limit,
  };
}

export async function getPennuengMemberByNo(memberNo: string): Promise<PennuengMember | null> {
  assertSqlServerReady();
  const pool = await getSqlServerPool();
  const result = await pool
    .request()
    .input('memberNo', sql.VarChar, memberNo.trim())
    .query<RawMemberRow>(`${MEMBER_SELECT} WHERE RTRIM(m.member_no) = @memberNo`);

  const row = result.recordset[0];
  return row ? mapRow(row) : null;
}

export async function createPennuengMember(data: PennuengMemberInput): Promise<PennuengMember> {
  assertSqlServerReady();
  const pool = await getSqlServerPool();
  const memberNo = data.memberNo.trim();

  const exists = await getPennuengMemberByNo(memberNo);
  if (exists) {
    throw new Error('Member number already exists');
  }

  const req = pool.request();
  req.input('memberNo', sql.VarChar, memberNo);
  req.input('memberType', sql.VarChar, data.memberType.trim());
  req.input('name', sql.NVarChar, data.name.trim());
  req.input('surname', sql.NVarChar, data.surname.trim());
  req.input('groupCode', sql.VarChar, data.groupCode?.trim() || null);
  req.input('departmentCode', sql.VarChar, data.departmentCode?.trim() || null);
  req.input('prenameCode', sql.Char, data.prenameCode?.trim() || null);
  req.input('sex', sql.VarChar, data.sex?.trim() || null);
  req.input('address', sql.NVarChar, data.address?.trim() || null);
  req.input('tel', sql.VarChar, data.tel?.trim() || null);
  req.input('email', sql.VarChar, data.email?.trim() || null);
  req.input('personId', sql.VarChar, data.personId?.trim() || null);
  req.input('description', sql.NVarChar, data.description?.trim() || null);
  req.input('birthDate', sql.DateTime, data.birthDate ? new Date(data.birthDate) : null);
  req.input('expireDate', sql.DateTime, data.expireDate ? new Date(data.expireDate) : null);

  await req.query(`
    INSERT INTO mbmembmaster (
      member_no, member_type, group_code, department_code, prename_code,
      name, surname, sex, address, tel, email, birth_date, person_id,
      member_date, modify_date, expire_date, member_status, descriptionn,
      created_at, updated_at
    ) VALUES (
      @memberNo, @memberType, @groupCode, @departmentCode, @prenameCode,
      @name, @surname, @sex, @address, @tel, @email, @birthDate, @personId,
      GETDATE(), GETDATE(), @expireDate, ${PENNUENG_MEMBER_ACTIVE}, @description,
      GETDATE(), GETDATE()
    )
  `);

  const created = await getPennuengMemberByNo(memberNo);
  if (!created) throw new Error('Failed to load created member');
  return created;
}

export async function updatePennuengMember(
  memberNo: string,
  data: PennuengMemberUpdateInput,
): Promise<PennuengMember> {
  assertSqlServerReady();
  const existing = await getPennuengMemberByNo(memberNo);
  if (!existing) throw new Error('User not found');

  const pool = await getSqlServerPool();
  const sets: string[] = ['modify_date = GETDATE()', 'updated_at = GETDATE()'];
  const req = pool.request();
  req.input('memberNo', sql.VarChar, memberNo.trim());

  if (data.memberType !== undefined) {
    sets.push('member_type = @memberType');
    req.input('memberType', sql.VarChar, data.memberType.trim());
  }
  if (data.name !== undefined) {
    sets.push('name = @name');
    req.input('name', sql.NVarChar, data.name.trim());
  }
  if (data.surname !== undefined) {
    sets.push('surname = @surname');
    req.input('surname', sql.NVarChar, data.surname.trim());
  }
  if (data.groupCode !== undefined) {
    sets.push('group_code = @groupCode');
    req.input('groupCode', sql.VarChar, data.groupCode?.trim() || null);
  }
  if (data.departmentCode !== undefined) {
    sets.push('department_code = @departmentCode');
    req.input('departmentCode', sql.VarChar, data.departmentCode?.trim() || null);
  }
  if (data.prenameCode !== undefined) {
    sets.push('prename_code = @prenameCode');
    req.input('prenameCode', sql.Char, data.prenameCode?.trim() || null);
  }
  if (data.sex !== undefined) {
    sets.push('sex = @sex');
    req.input('sex', sql.VarChar, data.sex?.trim() || null);
  }
  if (data.address !== undefined) {
    sets.push('address = @address');
    req.input('address', sql.NVarChar, data.address?.trim() || null);
  }
  if (data.tel !== undefined) {
    sets.push('tel = @tel');
    req.input('tel', sql.VarChar, data.tel?.trim() || null);
  }
  if (data.email !== undefined) {
    sets.push('email = @email');
    req.input('email', sql.VarChar, data.email?.trim() || null);
  }
  if (data.personId !== undefined) {
    sets.push('person_id = @personId');
    req.input('personId', sql.VarChar, data.personId?.trim() || null);
  }
  if (data.description !== undefined) {
    sets.push('descriptionn = @description');
    req.input('description', sql.NVarChar, data.description?.trim() || null);
  }
  if (data.birthDate !== undefined) {
    sets.push('birth_date = @birthDate');
    req.input('birthDate', sql.DateTime, data.birthDate ? new Date(data.birthDate) : null);
  }
  if (data.expireDate !== undefined) {
    sets.push('expire_date = @expireDate');
    req.input('expireDate', sql.DateTime, data.expireDate ? new Date(data.expireDate) : null);
  }

  if (sets.length === 2) return existing;

  await req.query(`
    UPDATE mbmembmaster SET ${sets.join(', ')}
    WHERE RTRIM(member_no) = @memberNo
  `);

  const updated = await getPennuengMemberByNo(memberNo);
  if (!updated) throw new Error('User not found');
  return updated;
}

export async function softDeletePennuengMember(
  memberNo: string,
  deletedBy?: string | null,
): Promise<void> {
  const member = await getPennuengMemberByNo(memberNo);
  if (!member) throw new Error('User not found');

  const pool = await getSqlServerPool();
  await pool
    .request()
    .input('memberNo', sql.VarChar, memberNo.trim())
    .input('status', sql.Int, PENNUENG_MEMBER_SOFT_DELETED)
    .query(`
      UPDATE mbmembmaster
      SET member_status = @status, modify_date = GETDATE(), updated_at = GETDATE()
      WHERE RTRIM(member_no) = @memberNo
    `);

  await prisma.pennuengMemberSoftDelete.upsert({
    where: { memberNo: member.memberNo },
    create: {
      memberNo: member.memberNo,
      snapshot: member as object,
      deletedBy: deletedBy ?? null,
      restoredAt: null,
    },
    update: {
      snapshot: member as object,
      deletedBy: deletedBy ?? null,
      deletedAt: new Date(),
      restoredAt: null,
    },
  });
}

export async function restorePennuengMember(memberNo: string): Promise<PennuengMember> {
  const pool = await getSqlServerPool();
  await pool
    .request()
    .input('memberNo', sql.VarChar, memberNo.trim())
    .input('status', sql.Int, PENNUENG_MEMBER_ACTIVE)
    .query(`
      UPDATE mbmembmaster
      SET member_status = @status, modify_date = GETDATE(), updated_at = GETDATE()
      WHERE RTRIM(member_no) = @memberNo
    `);

  await prisma.pennuengMemberSoftDelete.updateMany({
    where: { memberNo: memberNo.trim(), restoredAt: null },
    data: { restoredAt: new Date() },
  });

  const restored = await getPennuengMemberByNo(memberNo);
  if (!restored) throw new Error('User not found');
  return restored;
}

export async function listPennuengSoftDeleted(options: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ rows: PennuengMemberSoftDeleteRow[]; total: number; pages: number; page: number }> {
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, Math.max(1, options.limit ?? 20));
  const skip = (page - 1) * limit;
  const search = options.search?.trim();

  const where = {
    restoredAt: null,
    ...(search
      ? {
          OR: [
            { memberNo: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.pennuengMemberSoftDelete.findMany({
      where,
      orderBy: { deletedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.pennuengMemberSoftDelete.count({ where }),
  ]);

  return {
    rows: rows.map((r) => ({
      id: r.id,
      memberNo: r.memberNo,
      snapshot: r.snapshot as PennuengMember,
      deletedBy: r.deletedBy,
      deletedAt: r.deletedAt.toISOString(),
      restoredAt: r.restoredAt?.toISOString() ?? null,
    })),
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
    page,
  };
}
