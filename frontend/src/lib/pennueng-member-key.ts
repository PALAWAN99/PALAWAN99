import 'server-only';
import crypto from 'crypto';
import sql from 'mssql';
import { assertSqlServerReady, getPennuengMemberByNo } from '@/lib/pennueng-members';
import { pennuengSqlDateToIso } from '@/lib/pennueng-datetime';
import { prisma } from '@/lib/prisma';
import { getSqlServerPool } from '@/lib/sqlserver';

export const SMART_ACCESS_TEMP_KEY_REMARK = 'smart-access-qr-temp';

const TEMP_KEY_PREFIX = 'T';
const TEMP_KEY_SUFFIX_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const TEMP_KEY_SUFFIX_LEN = 4;
const MAX_KEY_ATTEMPTS = 12;

export type TemporaryMemberKeyRecord = {
  memberNo: string;
  memberKey: string;
  seqNo: number;
  expireDate: Date;
};

export type PennuengMemberKeyRow = {
  seqNo: number;
  memberKey: string;
  expireDate: string | null;
};

export type PennuengMemberKeyWithMember = PennuengMemberKeyRow & {
  memberNo: string;
  name: string;
  surname: string;
  memberType: string;
  memberTypeLabel: string | null;
  groupDetail: string | null;
};

function randomSuffix(length: number): string {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += TEMP_KEY_SUFFIX_CHARS[bytes[i]! % TEMP_KEY_SUFFIX_CHARS.length];
  }
  return out;
}

async function memberKeyExists(pool: sql.ConnectionPool, memberKey: string): Promise<boolean> {
  const result = await pool
    .request()
    .input('memberKey', sql.VarChar, memberKey)
    .query<{ n: number }>(
      `SELECT COUNT(*) AS n FROM mbmemberkey WITH (NOLOCK) WHERE RTRIM(member_key) = @memberKey`,
    );
  return (result.recordset[0]?.n ?? 0) > 0;
}

async function nextSeqNo(pool: sql.ConnectionPool, memberNo: string): Promise<number> {
  const result = await pool
    .request()
    .input('memberNo', sql.VarChar, memberNo)
    .query<{ mx: number | null }>(
      `SELECT MAX(seq_no) AS mx FROM mbmemberkey WITH (NOLOCK) WHERE RTRIM(member_no) = @memberNo`,
    );
  const mx = result.recordset[0]?.mx;
  return (mx ?? 0) + 1;
}

async function generateUniqueTemporaryKey(
  pool: sql.ConnectionPool,
  memberNo: string,
): Promise<string> {
  const base = `${TEMP_KEY_PREFIX}${memberNo}-`;
  for (let i = 0; i < MAX_KEY_ATTEMPTS; i++) {
    const candidate = `${base}${randomSuffix(TEMP_KEY_SUFFIX_LEN)}`;
    if (!(await memberKeyExists(pool, candidate))) return candidate;
  }
  throw new Error('ไม่สามารถสร้างรหัสคีย์ชั่วคราวที่ไม่ซ้ำได้');
}

/**
 * สร้างคีย์ชั่วคราวใน mbmemberkey (รูปแบบ T{memberNo}-XXXX) สำหรับ QR ที่เครื่อง Pennueng อ่านได้
 */
export async function createTemporaryMemberKey(options: {
  memberNo: string;
  expiresAt: Date;
  nameOnCard?: string | null;
  adminId?: string | null;
}): Promise<TemporaryMemberKeyRecord> {
  assertSqlServerReady();
  const memberNo = options.memberNo.trim();
  const penn = await getPennuengMemberByNo(memberNo);
  if (!penn) {
    throw new Error('ไม่พบสมาชิกใน Pennueng');
  }

  const pool = await getSqlServerPool();
  const memberKey = await generateUniqueTemporaryKey(pool, memberNo);
  const seqNo = await nextSeqNo(pool, memberNo);
  const expireDate = options.expiresAt;
  const nameOnCard =
    options.nameOnCard?.trim() || `${penn.name} ${penn.surname}`.trim() || null;

  await pool
    .request()
    .input('memberNo', sql.VarChar, memberNo)
    .input('seqNo', sql.Int, seqNo)
    .input('memberKey', sql.VarChar, memberKey)
    .input('keyStatus', sql.TinyInt, 1)
    .input('keyDetail', sql.NVarChar, 'QR ชั่วคราว (Smart Access)')
    .input('nameOnCard', sql.NVarChar, nameOnCard)
    .input('expireDate', sql.DateTime, expireDate)
    .input('remark', sql.VarChar, SMART_ACCESS_TEMP_KEY_REMARK)
    .input('adminId', sql.VarChar, options.adminId?.trim() || null)
    .query(`
      INSERT INTO mbmemberkey (
        member_no, seq_no, member_key, key_status, key_detail,
        name_oncard, modify_date, expire_date, remark, admin_id, created_at, updated_at
      ) VALUES (
        @memberNo, @seqNo, @memberKey, @keyStatus, @keyDetail,
        @nameOnCard, GETDATE(), @expireDate, @remark, @adminId, GETDATE(), GETDATE()
      )
    `);

  return { memberNo, memberKey, seqNo, expireDate };
}

/** สร้าง/บันทึกคีย์เข้าออกด้วย member_key ที่ระบุ (RFID) */
export async function createMemberAccessKey(options: {
  memberNo: string;
  memberKey: string;
  expiresAt: Date;
  nameOnCard?: string | null;
  adminId?: string | null;
  remark?: string;
}): Promise<PennuengMemberKeyRow> {
  assertSqlServerReady();
  const memberNo = options.memberNo.trim();
  const memberKey = options.memberKey.trim();
  if (!memberKey) throw new Error('ต้องระบุ member_key');

  const penn = await getPennuengMemberByNo(memberNo);
  if (!penn) throw new Error('ไม่พบสมาชิกใน Pennueng');

  const pool = await getSqlServerPool();
  if (await memberKeyExists(pool, memberKey)) {
    throw new Error('รหัสคีย์นี้มีในระบบแล้ว');
  }

  const seqNo = await nextSeqNo(pool, memberNo);
  const nameOnCard =
    options.nameOnCard?.trim() || `${penn.name} ${penn.surname}`.trim() || null;

  await pool
    .request()
    .input('memberNo', sql.VarChar, memberNo)
    .input('seqNo', sql.Int, seqNo)
    .input('memberKey', sql.VarChar, memberKey)
    .input('keyStatus', sql.TinyInt, 1)
    .input('keyDetail', sql.NVarChar, 'คีย์เข้าออก (Smart Access)')
    .input('nameOnCard', sql.NVarChar, nameOnCard)
    .input('expireDate', sql.DateTime, options.expiresAt)
    .input('remark', sql.VarChar, options.remark?.trim() || SMART_ACCESS_TEMP_KEY_REMARK)
    .input('adminId', sql.VarChar, options.adminId?.trim() || null)
    .query(`
      INSERT INTO mbmemberkey (
        member_no, seq_no, member_key, key_status, key_detail,
        name_oncard, modify_date, expire_date, remark, admin_id, created_at, updated_at
      ) VALUES (
        @memberNo, @seqNo, @memberKey, @keyStatus, @keyDetail,
        @nameOnCard, GETDATE(), @expireDate, @remark, @adminId, GETDATE(), GETDATE()
      )
    `);

  return {
    seqNo,
    memberKey,
    expireDate: pennuengSqlDateToIso(options.expiresAt),
  };
}

export function memberKeyLookupCandidates(raw: string): string[] {
  const trimmed = raw.trim();
  const hex = trimmed.replace(/\s/g, '').toUpperCase();
  const decimal = trimmed.replace(/\D/g, '');
  const out = new Set<string>();
  if (trimmed) out.add(trimmed);
  if (hex) out.add(hex);
  if (decimal) out.add(decimal);
  if (hex && hex !== trimmed) out.add(hex.toLowerCase());
  return [...out];
}

/** ค้นหา mbmemberkey จาก member_key (ลองหลายรูปแบบ UID) */
export async function findPennuengMemberByAccessKey(
  rawKey: string,
): Promise<PennuengMemberKeyWithMember | null> {
  assertSqlServerReady();
  const candidates = memberKeyLookupCandidates(rawKey);
  if (candidates.length === 0) return null;

  const pool = await getSqlServerPool();
  for (const key of candidates) {
    const result = await pool.request().input('memberKey', sql.VarChar, key).query<{
      seq_no: number;
      member_key: string;
      expire_date: Date | null;
      member_no: string;
      name: string;
      surname: string;
      member_type: string;
      member_type_label: string | null;
      group_detail: string | null;
    }>(`
      SELECT
        k.seq_no,
        RTRIM(k.member_key) AS member_key,
        k.expire_date,
        RTRIM(m.member_no) AS member_no,
        RTRIM(m.name) AS name,
        RTRIM(m.surname) AS surname,
        RTRIM(m.member_type) AS member_type,
        NULLIF(RTRIM(t.description), '') AS member_type_label,
        NULLIF(RTRIM(t.group_detail), '') AS group_detail
      FROM mbmemberkey k WITH (NOLOCK)
      INNER JOIN mbmembmaster m WITH (NOLOCK) ON RTRIM(k.member_no) = RTRIM(m.member_no)
      LEFT JOIN mbmembtype t ON RTRIM(m.member_type) = RTRIM(t.member_type)
      WHERE RTRIM(k.member_key) = @memberKey
    `);

    const row = result.recordset[0];
    if (row) {
      return {
        seqNo: row.seq_no,
        memberKey: row.member_key?.trim() ?? '',
        expireDate: row.expire_date ? pennuengSqlDateToIso(row.expire_date) : null,
        memberNo: row.member_no?.trim() ?? '',
        name: row.name?.trim() ?? '',
        surname: row.surname?.trim() ?? '',
        memberType: row.member_type?.trim() ?? '',
        memberTypeLabel: row.member_type_label?.trim() || null,
        groupDetail: row.group_detail?.trim() || null,
      };
    }
  }
  return null;
}

/** รายการคีย์เข้าออก (mbmemberkey) ของสมาชิก — เรียงวันหมดอายุล่าสุดก่อน */
export async function listPennuengMemberKeys(memberNo: string): Promise<PennuengMemberKeyRow[]> {
  assertSqlServerReady();
  const trimmed = memberNo.trim();
  const pool = await getSqlServerPool();
  const result = await pool.request().input('memberNo', sql.VarChar, trimmed).query<{
    seq_no: number;
    member_key: string;
    expire_date: Date | null;
  }>(`
    SELECT seq_no, RTRIM(member_key) AS member_key, expire_date
    FROM mbmemberkey WITH (NOLOCK)
    WHERE RTRIM(member_no) = @memberNo
    ORDER BY expire_date DESC, seq_no DESC
  `);

  return result.recordset.map((row) => ({
    seqNo: row.seq_no,
    memberKey: row.member_key?.trim() ?? '',
    expireDate: row.expire_date ? pennuengSqlDateToIso(row.expire_date) : null,
  }));
}

async function getMemberKeyRow(
  pool: sql.ConnectionPool,
  memberNo: string,
  seqNo: number,
): Promise<PennuengMemberKeyRow | null> {
  const result = await pool
    .request()
    .input('memberNo', sql.VarChar, memberNo.trim())
    .input('seqNo', sql.Int, seqNo)
    .query<{ seq_no: number; member_key: string; expire_date: Date | null }>(`
      SELECT seq_no, RTRIM(member_key) AS member_key, expire_date
      FROM mbmemberkey WITH (NOLOCK)
      WHERE RTRIM(member_no) = @memberNo AND seq_no = @seqNo
    `);
  const row = result.recordset[0];
  if (!row) return null;
  return {
    seqNo: row.seq_no,
    memberKey: row.member_key?.trim() ?? '',
    expireDate: row.expire_date ? pennuengSqlDateToIso(row.expire_date) : null,
  };
}

export async function updatePennuengMemberKey(
  memberNo: string,
  seqNo: number,
  data: { memberKey?: string; expireDate?: Date | null },
): Promise<PennuengMemberKeyRow> {
  assertSqlServerReady();
  const trimmedNo = memberNo.trim();
  const pool = await getSqlServerPool();
  const existing = await getMemberKeyRow(pool, trimmedNo, seqNo);
  if (!existing) throw new Error('ไม่พบคีย์ที่ระบุ');

  const nextKey = data.memberKey?.trim() ?? existing.memberKey;
  if (!nextKey) throw new Error('ต้องระบุ member_key');

  if (nextKey !== existing.memberKey && (await memberKeyExists(pool, nextKey))) {
    throw new Error('รหัสคีย์นี้มีในระบบแล้ว');
  }

  const nextExpire =
    data.expireDate !== undefined
      ? data.expireDate
      : existing.expireDate
        ? new Date(existing.expireDate)
        : null;

  await pool
    .request()
    .input('memberNo', sql.VarChar, trimmedNo)
    .input('seqNo', sql.Int, seqNo)
    .input('memberKey', sql.VarChar, nextKey)
    .input('expireDate', sql.DateTime, nextExpire)
    .query(`
      UPDATE mbmemberkey
      SET member_key = @memberKey,
          expire_date = @expireDate,
          modify_date = GETDATE(),
          updated_at = GETDATE()
      WHERE RTRIM(member_no) = @memberNo AND seq_no = @seqNo
    `);

  const updated = await getMemberKeyRow(pool, trimmedNo, seqNo);
  if (!updated) throw new Error('อัปเดตคีย์ไม่สำเร็จ');
  return updated;
}

export async function deletePennuengMemberKey(memberNo: string, seqNo: number): Promise<void> {
  assertSqlServerReady();
  const trimmedNo = memberNo.trim();
  const pool = await getSqlServerPool();
  const existing = await getMemberKeyRow(pool, trimmedNo, seqNo);
  if (!existing) throw new Error('ไม่พบคีย์ที่ระบุ');

  if (existing.memberKey) {
    const hash = crypto.createHash('sha256').update(existing.memberKey).digest('hex');
    await prisma.qrToken.deleteMany({ where: { tokenHash: hash } });
  }

  await pool
    .request()
    .input('memberNo', sql.VarChar, trimmedNo)
    .input('seqNo', sql.Int, seqNo)
    .query(`
      DELETE FROM mbmemberkey
      WHERE RTRIM(member_no) = @memberNo AND seq_no = @seqNo
    `);
}

export type ExpiredMemberKeyCleanupResult = {
  deletedKeys: number;
  deletedQrTokens: number;
};

/**
 * ลบแถว mbmemberkey ที่ Smart Access ออกไว้และหมดอายุแล้ว
 * พร้อมลบ qr_tokens ใน PostgreSQL ที่ผูกกับ member_key นั้น
 */
export async function deleteExpiredPennuengMemberKeys(): Promise<ExpiredMemberKeyCleanupResult> {
  assertSqlServerReady();
  const pool = await getSqlServerPool();

  const expired = await pool
    .request()
    .input('remark', sql.VarChar, SMART_ACCESS_TEMP_KEY_REMARK)
    .query<{ member_key: string }>(`
      SELECT RTRIM(member_key) AS member_key
      FROM mbmemberkey WITH (NOLOCK)
      WHERE RTRIM(remark) = @remark AND expire_date < GETDATE()
    `);

  const keys = expired.recordset
    .map((r) => r.member_key?.trim())
    .filter((k): k is string => Boolean(k));

  let deletedQrTokens = 0;
  for (const memberKey of keys) {
    const hash = crypto.createHash('sha256').update(memberKey).digest('hex');
    const r = await prisma.qrToken.deleteMany({ where: { tokenHash: hash } });
    deletedQrTokens += r.count;
  }

  if (keys.length > 0) {
    await pool
      .request()
      .input('remark', sql.VarChar, SMART_ACCESS_TEMP_KEY_REMARK)
      .query(`
        DELETE FROM mbmemberkey
        WHERE RTRIM(remark) = @remark AND expire_date < GETDATE()
      `);
  }

  return { deletedKeys: keys.length, deletedQrTokens };
}
