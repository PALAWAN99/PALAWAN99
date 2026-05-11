import { prisma } from '@/lib/prisma';
import { memberSchema } from '@/lib/validations';
import { z } from 'zod';

export type MemberInput = z.infer<typeof memberSchema>;

export class MemberService {
  /**
   * ดึงรายการสมาชิกพร้อมค้นหา
   */
  static async getMembers(search: string = '', limit: number = 100) {
    return prisma.member.findMany({
      where: {
        OR: [
          { memberNo: { contains: search, mode: 'insensitive' } },
          { citizenId: { contains: search, mode: 'insensitive' } },
          { firstNameTh: { contains: search, mode: 'insensitive' } },
          { lastNameTh: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
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

    return prisma.member.create({
      data: {
        ...data,
        citizenId: data.citizenId || null,
        email: data.email || null,
      },
    });
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
