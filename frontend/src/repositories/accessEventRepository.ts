import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class AccessEventRepository {
  static async findMany(args: Prisma.AccessEventFindManyArgs) {
    return prisma.accessEvent.findMany(args);
  }

  static async count(args: Prisma.AccessEventCountArgs) {
    return prisma.accessEvent.count(args);
  }

  static async create(args: Prisma.AccessEventCreateArgs) {
    return prisma.accessEvent.create(args);
  }
}
