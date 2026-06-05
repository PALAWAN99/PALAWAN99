import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { checkAccess } from '@/lib/rbac';
import { checkStandardRateLimit } from '@/lib/rate-limit';
import { isSqlServerConfigured } from '@/lib/sqlserver';
import {
  resolveQrMemberByMemberNo,
  searchPennuengMembersForQrAutocomplete,
} from '@/lib/qr-pennueng-member';
import {
  ApiSuccess,
  ApiUnauthorized,
  ApiForbidden,
  ApiBadRequest,
  ApiServiceUnavailable,
  ApiNotFound,
  handleError,
} from '@/lib/api-response';

/**
 * GET /api/qr/member-search
 * - ?q=... (≥3 ตัวอักษร) → autocomplete จาก Pennueng SQL Server
 * - ?memberNo=... → โหลดสมาชิกเต็ม + id สำหรับออก QR (sync ลง PostgreSQL)
 * - ?query=... → ค้นหาแบบตรง (รหัสสมาชิก / เลขบัตร) เหมือน memberNo
 */
export async function GET(req: NextRequest) {
  const rateLimitError = checkStandardRateLimit(req);
  if (rateLimitError) return rateLimitError;

  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'QR_TOKEN', 'READ') && !checkAccess(session, 'MEMBER', 'READ')) {
    return ApiForbidden();
  }

  if (!isSqlServerConfigured()) {
    return ApiServiceUnavailable('ยังไม่ได้ตั้งค่า SQL Server (SQLSERVER_* ใน .env)');
  }

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const memberNo = (searchParams.get('memberNo') ?? searchParams.get('query') ?? '').trim();

    if (memberNo) {
      const member = await resolveQrMemberByMemberNo(memberNo);
      if (!member) return ApiNotFound('ไม่พบสมาชิกในระบบ Pennueng');
      return ApiSuccess({ member });
    }

    if (!q) {
      return ApiBadRequest('ระบุ q (autocomplete) หรือ memberNo');
    }

    if (q.length < 3) {
      return ApiSuccess({ suggestions: [], minChars: 3 });
    }

    const suggestions = await searchPennuengMembersForQrAutocomplete(q);
    return ApiSuccess({ suggestions, minChars: 3 });
  } catch (error) {
    return handleError(error);
  }
}
