import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { issueQrToken } from '@/lib/qr-utils';
import { auth } from '@/auth';
import { checkStrictRateLimit } from '@/lib/rate-limit';
import { idCardRegisterSchema } from '@/lib/validations';
import { ApiSuccess, ApiUnauthorized, handleError } from '@/lib/api-response';

/**
 * API สำหรับลงทะเบียนด้วยบัตรประชาชน
 */
export async function POST(req: NextRequest) {
  // 1. Check Rate Limit (30 req/min — strict for registration)
  const rateLimitError = checkStrictRateLimit(req);
  if (rateLimitError) return rateLimitError;

  try {
    // 2. ตรวจสอบสิทธิ์ (ต้องเป็นเจ้าหน้าที่ที่มีสิทธิ์เท่านั้น)
    const session = await auth();
    if (!session) {
      return ApiUnauthorized();
    }

    const body = await req.json();
    
    // 3. Validate with Zod
    const validated = idCardRegisterSchema.parse(body);
    const { citizenId, fullNameTh, fullNameEn, birthDate, deviceId } = validated;

    // 1. ค้นหาสมาชิกเดิม หรือสร้างใหม่
    let member = await prisma.member.findUnique({
      where: { citizenId },
    });

    if (!member) {
      const { first, last } = parseThaiName(fullNameTh);
      const enNames = fullNameEn?.split(' ') || [];
      
      member = await prisma.member.create({
        data: {
          memberNo: await generateMemberNo(),
          citizenId,
          firstNameTh: first,
          lastNameTh: last,
          firstNameEn: enNames[0] || '',
          lastNameEn: enNames.slice(1).join(' ') || '',
          memberType: 'GUEST',
          status: 'ACTIVE',
        },
      });
    }

    // 2. บันทึก Session การอ่านบัตร
    await prisma.idCardSession.create({
      data: {
        memberId: member.id,
        citizenId,
        fullNameTh,
        fullNameEn,
        birthDate: birthDate ? new Date(formatDateString(birthDate)) : null,
        deviceId: deviceId || null,
        status: 'SUCCESS',
        readAt: new Date(),
      },
    });

    // 3. ออก QR Token (รายวัน)
    const qrToken = await issueQrToken(member.id, 'ENTRY');

    return ApiSuccess({
      member: {
        id: member.id,
        fullNameTh: `${member.firstNameTh} ${member.lastNameTh}`,
        memberNo: member.memberNo,
      },
      qrToken: qrToken.rawToken,
      expiresAt: qrToken.expiresAt,
    }, 'ลงทะเบียนและออก QR Code เรียบร้อยแล้ว');

  } catch (error) {
    return handleError(error);
  }
}

/**
 * แยกชื่อและนามสกุลจากสตริงชื่อเต็มไทย
 */
function parseThaiName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return {
    first: parts[0] || '',
    last: parts.slice(1).join(' ') || '',
  };
}

/**
 * สร้างรหาสมาชิกอัตโนมัติ (M-YYYYMM-XXXX)
 */
async function generateMemberNo() {
  const isoString = new Date().toISOString();
  const dateStr = isoString.slice(0, 7).split('-').join('');
  const count = await prisma.member.count();
  return `M-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
}

/**
 * แปลงวันที่จากฟอร์แมตบัตร (YYYYMMDD) เป็น ISO
 */
function formatDateString(dateStr: string) {
  if (dateStr.length !== 8) return dateStr;
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  return `${y}-${m}-${d}`;
}
