import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { generateToken } from '@/lib/qr-engine';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  createTemporaryMemberKey,
  deleteExpiredPennuengMemberKeys,
} from '@/lib/pennueng-member-key';
import { expiresAtFromPolicy, resolveQrPolicy } from '@/lib/qr-policy';
import dayjs from 'dayjs';
import crypto from 'crypto';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiBadRequest,
  ApiServiceUnavailable,
  handleError,
} from '@/lib/api-response';

function computeExpiresAt(duration: string | undefined): Date {
  if (duration === '1H') return dayjs().add(1, 'hour').toDate();
  if (duration === '7D') return dayjs().add(7, 'days').toDate();
  if (duration === '30D') return dayjs().add(30, 'days').toDate();
  if (duration === '1D') return dayjs().add(1, 'day').toDate();

  return dayjs().add(1, 'day').toDate();
}

/**
 * POST /api/qr/issue
 * - temporary=true → คีย์ใน mbmemberkey (QR ชั่วคราว) ใช้ได้แม้สมาชิก EXPIRED
 * - temporary=false → token v1 ใน qr_tokens (สมาชิก ACTIVE เท่านั้น)
 */
export async function POST(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'QR_TOKEN', 'ISSUE')) return ApiForbidden();

  try {
    const body = await req.json();
    const memberId = String(body.memberId ?? '').trim();
    const memberNo = String(body.memberNo ?? '').trim();
    const purpose = body.purpose === 'EXIT' ? 'EXIT' : 'ENTRY';
    const duration = String(body.duration ?? '1D');
    const policyId = body.policyId != null ? String(body.policyId) : undefined;
    const temporary = Boolean(body.temporary);

    if (!memberId) return ApiBadRequest('ต้องระบุ memberId');

    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) return ApiNotFound('ไม่พบสมาชิกที่ระบุ');

    const resolvedMemberNo = memberNo || member.memberNo;
    const issuedDate = dayjs().toDate();

    const policy = await resolveQrPolicy(policyId);
    const expiresAt = policy
      ? expiresAtFromPolicy(policy)
      : computeExpiresAt(duration);

    if (temporary) {
      if (!isSqlServerConfigured()) {
        return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
      }

      await deleteExpiredPennuengMemberKeys();

      const keyRow = await createTemporaryMemberKey({
        memberNo: resolvedMemberNo,
        expiresAt,
        nameOnCard: `${member.firstNameTh} ${member.lastNameTh}`.trim(),
        adminId: session.user.id,
      });

      const hash = crypto.createHash('sha256').update(keyRow.memberKey).digest('hex');

      const qrToken = await prisma.qrToken.create({
        data: {
          tokenHash: hash,
          memberId,
          purpose,
          issuedDate,
          expiresAt: keyRow.expireDate,
          ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
          userAgent: req.headers.get('user-agent') || 'unknown',
        },
      });

      return ApiSuccess(
        {
          tokenId: qrToken.id,
          qrContent: keyRow.memberKey,
          memberKey: keyRow.memberKey,
          seqNo: keyRow.seqNo,
          purpose: qrToken.purpose,
          expiresAt: qrToken.expiresAt,
          temporary: true,
          policyId: policy?.id ?? null,
          policyName: policy?.name ?? null,
          ttlHours: policy ? policy.ttlSeconds / 3600 : null,
        },
        'ออก QR Code ชั่วคราวเรียบร้อย (บันทึกใน mbmemberkey)',
      );
    }

    if (member.status !== 'ACTIVE') {
      return ApiForbidden(
        'สมาชิกหมดอายุหรือไม่ active — ใช้ปุ่ม「สร้าง QR Code ชั่วคราว」แทน',
      );
    }

    const { token, hash } = generateToken(memberId);

    const qrToken = await prisma.qrToken.create({
      data: {
        tokenHash: hash,
        memberId,
        purpose,
        issuedDate,
        expiresAt,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'unknown',
      },
    });

    return ApiSuccess(
      {
        tokenId: qrToken.id,
        qrContent: token,
        purpose: qrToken.purpose,
        expiresAt: qrToken.expiresAt,
        temporary: false,
        policyId: policy?.id ?? null,
        policyName: policy?.name ?? null,
      },
      'ออกรหัส QR Code เรียบร้อยแล้ว',
    );
  } catch (error) {
    return handleError(error);
  }
}
