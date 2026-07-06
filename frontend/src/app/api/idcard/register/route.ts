import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { issueQrToken } from '@/lib/qr-utils';

/**
 * API สำหรับลงทะเบียนด้วยบัตรประชาชน
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { citizenId, fullNameTh, fullNameEn, birthDate, deviceId } = body;

    if (!citizenId || !fullNameTh) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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
          memberType: 'GUEST', // กำหนดเป็น Guest สำหรับการลงทะเบียนรายวัน
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

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        fullNameTh: `${member.firstNameTh} ${member.lastNameTh}`,
        memberNo: member.memberNo,
      },
      qrToken: qrToken.tokenHash,
      expiresAt: qrToken.expiresAt,
    });

  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
