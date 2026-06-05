import { NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import {
  deletePennuengMemberKey,
  updatePennuengMemberKey,
} from '@/lib/pennueng-member-key';
import { getPennuengMemberByNo } from '@/lib/pennueng-members';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiNotFound,
  ApiServiceUnavailable,
  ApiValidationError,
  ApiBadRequest,
  ApiOk,
  handleError,
} from '@/lib/api-response';

type RouteCtx = { params: Promise<{ memberNo: string; seqNo: string }> };

function decodeMemberNo(raw: string) {
  return decodeURIComponent(raw).trim();
}

function parseBangkokDateLocal(value: string): Date {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, mo, d] = trimmed.split('-').map(Number);
    return new Date(Date.UTC(y, mo - 1, d, 23, 59, 59, 999));
  }
  const [datePart, timePart = '00:00'] = trimmed.split('T');
  const [y, mo, d] = datePart.split('-').map(Number);
  const [h, mi] = timePart.split(':').map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h, mi, 0, 0));
}

const patchSchema = z.object({
  memberKey: z.string().min(1).max(50).optional(),
  expireDate: z.string().min(1).optional().nullable(),
});

/** PATCH /api/admin/pennueng-members/[memberNo]/keys/[seqNo] */
export async function PATCH(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'UPDATE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { memberNo: raw, seqNo: seqRaw } = await params;
    const memberNo = decodeMemberNo(raw);
    const seqNo = Number.parseInt(seqRaw, 10);
    if (!Number.isFinite(seqNo)) {
      return ApiBadRequest('seqNo ไม่ถูกต้อง');
    }

    const member = await getPennuengMemberByNo(memberNo);
    if (!member) return ApiNotFound('ไม่พบสมาชิก');

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return ApiValidationError(parsed.error);

    const expireDate =
      parsed.data.expireDate === null
        ? null
        : parsed.data.expireDate
          ? parseBangkokDateLocal(parsed.data.expireDate)
          : undefined;

    const updated = await updatePennuengMemberKey(memberNo, seqNo, {
      memberKey: parsed.data.memberKey,
      expireDate,
    });

    return ApiSuccess(updated, 'บันทึกคีย์เรียบร้อย');
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/admin/pennueng-members/[memberNo]/keys/[seqNo] */
export async function DELETE(req: NextRequest, { params }: RouteCtx) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'DELETE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const { memberNo: raw, seqNo: seqRaw } = await params;
    const memberNo = decodeMemberNo(raw);
    const seqNo = Number.parseInt(seqRaw, 10);
    if (!Number.isFinite(seqNo)) {
      return ApiBadRequest('seqNo ไม่ถูกต้อง');
    }

    const member = await getPennuengMemberByNo(memberNo);
    if (!member) return ApiNotFound('ไม่พบสมาชิก');

    await deletePennuengMemberKey(memberNo, seqNo);
    return ApiOk('ลบคีย์เรียบร้อย');
  } catch (error) {
    return handleError(error);
  }
}
