import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export class GateRepository {
  static async findMany(args: Prisma.GateFindManyArgs) {
    return prisma.gate.findMany(args);
  }

  static async findUnique(args: Prisma.GateFindUniqueArgs) {
    return prisma.gate.findUnique(args);
  }

  static async create(args: Prisma.GateCreateArgs) {
    return prisma.gate.create(args);
  }

  static async update(args: Prisma.GateUpdateArgs) {
    return prisma.gate.update(args);
  }

  static async delete(args: Prisma.GateDeleteArgs) {
    return prisma.gate.delete(args);
  }
}

export class BranchRepository {
  static async findMany(args: Prisma.BranchFindManyArgs) {
    return prisma.branch.findMany(args);
  }

  static async findUnique(args: Prisma.BranchFindUniqueArgs) {
    return prisma.branch.findUnique(args);
  }

  static async create(args: Prisma.BranchCreateArgs) {
    return prisma.branch.create(args);
  }
}
