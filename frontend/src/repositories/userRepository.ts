import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class UserRepository {
  static async findMany(args: Prisma.UserFindManyArgs) {
    return prisma.user.findMany(args);
  }

  static async findUnique(args: Prisma.UserFindUniqueArgs) {
    return prisma.user.findUnique(args);
  }

  static async create(args: Prisma.UserCreateArgs) {
    return prisma.user.create(args);
  }

  static async update(args: Prisma.UserUpdateArgs) {
    return prisma.user.update(args);
  }

  static async delete(args: Prisma.UserDeleteArgs) {
    return prisma.user.delete(args);
  }
}
