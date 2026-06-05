import { MemberRepository } from '@/repositories/memberRepository';
import { memberSchema } from '@/validators/memberValidator';
import { z } from 'zod';

export type MemberInput = z.infer<typeof memberSchema>;

export class MemberService {
  /**
   * ดึงรายการสมาชิกพร้อมค้นหาและ Pagination
   */
  static async getMembers(
    search: string = '', 
    page: number = 1, 
    limit: number = 20, 
    memberType?: string | null, 
    status?: string | null
  ) {
    const skip = (page - 1) * limit;
    
    const where: { AND: any[] } = {
      AND: []
    };

    if (search) {
      where.AND.push({
        OR: [
          { memberNo: { contains: search, mode: 'insensitive' as const } },
          { citizenId: { contains: search, mode: 'insensitive' as const } },
          { firstNameTh: { contains: search, mode: 'insensitive' as const } },
          { lastNameTh: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      });
    }

    if (memberType) {
      where.AND.push({ memberType });
    }

    if (status) {
      if (status === 'INACTIVE') {
        where.AND.push({ status: { not: 'ACTIVE' } });
      } else {
        where.AND.push({ status });
      }
    }

    const [members, total] = await Promise.all([
      MemberRepository.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      MemberRepository.count({ where }),
    ]);

    return {
      members,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * สร้างสมาชิกใหม่ พร้อมตรวจสอบความซ้ำซ้อน
   */
  static async createMember(data: MemberInput) {
    // 1. Check duplicates (Business Logic)
    const existingNo = await MemberRepository.findUnique({ where: { memberNo: data.memberNo } });
    if (existingNo) throw new Error('Member Number already exists');

    if (data.citizenId) {
      const existingId = await MemberRepository.findUnique({ where: { citizenId: data.citizenId } });
      if (existingId) throw new Error('Citizen ID already exists');
    }

    // 2. Process Data (Business Logic)
    const processedData = {
      ...data,
      citizenId: data.citizenId || null,
      email: data.email || null,
      photo: data.photo ? Buffer.from(data.photo.split(',')[1] || data.photo, 'base64') : null,
      metadata: (() => {
        const meta =
          data.metadata && typeof data.metadata === 'object'
            ? (data.metadata as Record<string, string | undefined>)
            : {};
        return {
          birthDate: meta.birthDate || '',
          gender: meta.gender || '',
          address: meta.address || '',
          school: meta.school || '',
        };
      })(),
    };

    // 3. Save to DB (Repository Call)
    const member = await MemberRepository.create({
      data: processedData,
    });

    // 4. Post-process (Audit Log)
    const { logAction } = await import('@/lib/audit');
    await logAction({
      action: 'CREATE',
      resource: 'MEMBER',
      resourceId: member.id,
      after: member,
    });

    return member;
  }

  /**
   * ค้นหาสมาชิกด้วย ID
   */
  static async getMemberById(id: string) {
    return MemberRepository.findUnique({
      where: { id },
    });
  }

  /**
   * ดึงประวัติการเข้า-ออกของสมาชิก
   */
  static async getMemberAccessHistory(memberId: string) {
    const { prisma } = await import('@/lib/prisma');
    return prisma.accessEvent.findMany({
      where: { memberId },
      include: {
        gate: {
          select: {
            nameTh: true,
            nameEn: true,
          }
        },
      },
      orderBy: { scannedAt: 'desc' },
      take: 100,
    });
  }
}
