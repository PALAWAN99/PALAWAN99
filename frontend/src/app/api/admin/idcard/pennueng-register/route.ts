import { NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { createMemberAccessKey } from '@/lib/pennueng-member-key';
import { createPennuengMember } from '@/lib/pennueng-members';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import { pennuengMemberSchema } from '@/validators/pennuengMemberValidator';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiServiceUnavailable,
  ApiValidationError,
  handleError,
} from '@/lib/api-response';

const registerSchema = pennuengMemberSchema.extend({
  accessKey: z.string().max(50).optional().nullable(),
  keyExpireDate: z.string().optional().nullable(),
});

function parseBangkokDateLocal(value: string): Date {
  const [y, mo, d] = value.trim().split('-').map(Number);
  return new Date(Date.UTC(y, mo - 1, d, 23, 59, 59, 999));
}

/** POST /api/admin/idcard/pennueng-register */
export async function POST(req: NextRequest) {
  const rateLimitError = await checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'MEMBER', 'CREATE')) return ApiForbidden();

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server');
  }

  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse({
      ...body,
      email: body.email === '' ? null : body.email,
    });
    if (!parsed.success) return ApiValidationError(parsed.error);

    const { accessKey, keyExpireDate, ...memberInput } = parsed.data;
    const member = await createPennuengMember(memberInput);

    let key = null;
    if (accessKey?.trim() && keyExpireDate?.trim()) {
      key = await createMemberAccessKey({
        memberNo: member.memberNo,
        memberKey: accessKey.trim(),
        expiresAt: parseBangkokDateLocal(keyExpireDate),
        nameOnCard: `${member.name} ${member.surname}`.trim(),
        adminId: session.user.id,
        remark: 'smart-access-idcard-register',
      });
    }

    return ApiSuccess({ member, key }, 'เพิ่มสมาชิก Pennueng เรียบร้อย');
  } catch (error) {
    return handleError(error);
  }
}
