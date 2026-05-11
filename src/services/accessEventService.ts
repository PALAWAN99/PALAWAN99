import { prisma } from '@/lib/prisma';

export class AccessEventService {
  /**
   * ดึงรายการเหตุการณ์เข้า-ออก พร้อมค้นหาและ Pagination
   */
  static async getEvents({
    search = '',
    gateId = '',
    memberId = '',
    page = 1,
    limit = 20,
    startDate,
    endDate,
  }: {
    search?: string;
    gateId?: string;
    memberId?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) {
    const skip = (page - 1) * limit;

    const where: any = {
      AND: [],
    };

    if (search) {
      where.AND.push({
        OR: [
          { member: { firstNameTh: { contains: search, mode: 'insensitive' } } },
          { member: { lastNameTh: { contains: search, mode: 'insensitive' } } },
          { member: { memberNo: { contains: search, mode: 'insensitive' } } },
          { gate: { nameTh: { contains: search, mode: 'insensitive' } } },
          { gate: { gateCode: { contains: search, mode: 'insensitive' } } },
        ],
      });
    }

    if (gateId) where.AND.push({ gateId });
    if (memberId) where.AND.push({ memberId });
    
    if (startDate || endDate) {
      where.AND.push({
        scannedAt: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      });
    }

    const [events, total] = await Promise.all([
      prisma.accessEvent.findMany({
        where: where.AND.length > 0 ? where : {},
        include: {
          member: {
            select: {
              firstNameTh: true,
              lastNameTh: true,
              memberNo: true,
              memberType: true,
            }
          },
          gate: {
            select: {
              nameTh: true,
              gateCode: true,
            }
          }
        },
        orderBy: { scannedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.accessEvent.count({ where: where.AND.length > 0 ? where : {} }),
    ]);

    return {
      events,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
