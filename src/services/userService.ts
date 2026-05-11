import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { UserRole } from '@prisma/client';

export interface UserInput {
  email: string;
  fullName: string;
  password?: string;
  role: UserRole;
  isActive?: boolean;
}

export class UserService {
  /**
   * ดึงข้อมูลรายชื่อผู้ใช้
   */
  static async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * สร้างผู้ใช้ใหม่
   */
  static async createUser(data: UserInput) {
    if (!data.password) {
      throw new Error('Password is required for new users');
    }

    // เช็คว่ามี email ซ้ำไหม
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email already exists');
    }

    // Hash password
    const passwordHash = await hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash,
        role: data.role,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      }
    });
  }

  /**
   * ค้นหาผู้ใช้ด้วย ID
   */
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      }
    });
  }
}
