import { prisma } from '@/lib/prisma';
import { Prisma, Member } from '@prisma/client';

export class MemberRepository {
  static async findMany(args: Prisma.MemberFindManyArgs) {
    return prisma.member.findMany(args);
  }

  static async count(args: Prisma.MemberCountArgs) {
    return prisma.member.count(args);
  }

  static async findUnique(args: Prisma.MemberFindUniqueArgs) {
    return prisma.member.findUnique(args);
  }

  static async create(args: Prisma.MemberCreateArgs) {
    return prisma.member.create(args);
  }

  static async update(args: Prisma.MemberUpdateArgs) {
    return prisma.member.update(args);
  }

  static async delete(args: Prisma.MemberDeleteArgs) {
    return prisma.member.delete(args);
  }
}
