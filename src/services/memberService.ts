import { prisma } from '@/lib/prisma';
import { memberSchema } from '@/lib/validations';
import { z } from 'zod';

export type MemberInput = z.infer<typeof memberSchema>;

export class MemberService {
  /**
   * ดึงรายการสมาชิกพร้อมค้นหาและ Pagination
   */
  static async getMembers(search: string = '', page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where = {
      OR: [
        { memberNo: { contains: search, mode: 'insensitive' as const } },
        { citizenId: { contains: search, mode: 'insensitive' as const } },
        { firstNameTh: { contains: search, mode: 'insensitive' as const } },
        { lastNameTh: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
      ],
    };

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.member.count({ where }),
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
    // Check duplicates
    const existingNo = await prisma.member.findUnique({ where: { memberNo: data.memberNo } });
    if (existingNo) {
      throw new Error('Member Number already exists');
    }

    if (data.citizenId) {
      const existingId = await prisma.member.findUnique({ where: { citizenId: data.citizenId } });
      if (existingId) {
        throw new Error('Citizen ID already exists');
      }
    }

    const member = await prisma.member.create({
      data: {
        ...data,
        citizenId: data.citizenId || null,
        email: data.email || null,
      },
    });

    const { createAuditLog } = await import('./loggingService');
    await createAuditLog({
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
    return prisma.member.findUnique({
      where: { id },
    });
  }
}
