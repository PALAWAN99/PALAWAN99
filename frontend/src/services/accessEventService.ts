import { AccessEventRepository } from '@/repositories/accessEventRepository';

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
    decision,
    direction,
    memberType,
  }: {
    search?: string;
    gateId?: string;
    memberId?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    decision?: string;
    direction?: string;
    memberType?: string;
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
    if (decision) where.AND.push({ decision: decision as any });
    if (direction) where.AND.push({ direction: direction as any });
    
    if (memberType) {
      const mappedTypes: any[] = [];
      const label = memberType.trim().toUpperCase();
      
      if (label.includes('STUDENT') || label.includes('นักศึกษา')) {
        mappedTypes.push('STUDENT');
      } else if (
        label.includes('STAFF') ||
        label.includes('FACULTY') ||
        label.includes('อาจารย์') ||
        label.includes('บุคลากร') ||
        label.includes('เจ้าหน้าที่')
      ) {
        mappedTypes.push('STAFF', 'FACULTY');
      } else if (label.includes('EXTERNAL') || label.includes('บุคคลภายนอก') || label.includes('ภายนอก')) {
        mappedTypes.push('EXTERNAL');
      } else if (label.includes('GUEST') || label.includes('ผู้มาติดต่อ') || label.includes('ผู้มาเยือน')) {
        mappedTypes.push('GUEST');
      } else if (['STUDENT', 'STAFF', 'FACULTY', 'EXTERNAL', 'GUEST'].includes(label)) {
        mappedTypes.push(label);
      }
      
      if (mappedTypes.length > 0) {
        where.AND.push({
          member: {
            memberType: {
              in: mappedTypes,
            },
          },
        });
      }
    }
    
    if (startDate || endDate) {
      where.AND.push({
        scannedAt: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      });
    }

    const [events, total] = await Promise.all([
      AccessEventRepository.findMany({
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
      AccessEventRepository.count({ where: where.AND.length > 0 ? where : {} }),
    ]);

    return {
      events,
      total,
      pages: Math.ceil(total / limit),
    };
  }
}
