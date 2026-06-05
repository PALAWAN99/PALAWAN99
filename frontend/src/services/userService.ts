import { UserRepository } from '@/repositories/userRepository';
import { UserInput, UserUpdateInput } from '@/validators/userValidator';
import { hash } from 'bcryptjs';
import { UserRole } from '@prisma/client';

const userPublicSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  isActive: true,
  createdAt: true,
} as const;

export class UserService {
  /**
   * ดึงข้อมูลรายชื่อผู้ใช้
   */
  static async getUsers() {
    return UserRepository.findMany({
      select: userPublicSelect,
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

    // 1. Business Logic: Check email uniqueness
    const existing = await UserRepository.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email already exists');
    }

    // 2. Business Logic: Secure password
    const passwordHash = await hash(data.password, 10);

    // 3. Repository Call
    return UserRepository.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash,
        role: data.role,
        isActive: data.isActive,
      },
      select: userPublicSelect,
    });
  }

  /**
   * ค้นหาผู้ใช้ด้วย ID
   */
  static async getUserById(id: string) {
    return UserRepository.findUnique({
      where: { id },
      select: userPublicSelect,
    });
  }

  static async updateUser(id: string, data: UserUpdateInput, actorId?: string) {
    const existing = await UserRepository.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('User not found');
    }

    if (actorId === id && data.isActive === false) {
      throw new Error('Cannot deactivate your own account');
    }

    if (data.email && data.email !== existing.email) {
      const dup = await UserRepository.findUnique({ where: { email: data.email } });
      if (dup) {
        throw new Error('Email already exists');
      }
    }

    if (data.role && data.role !== existing.role && actorId === id) {
      throw new Error('Cannot change your own role');
    }

    const updateData: Record<string, unknown> = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.password) {
      updateData.passwordHash = await hash(data.password, 10);
    }

    return UserRepository.update({
      where: { id },
      data: updateData,
      select: userPublicSelect,
    });
  }

  static async deleteUser(id: string, actorId?: string) {
    if (actorId === id) {
      throw new Error('Cannot delete your own account');
    }

    const existing = await UserRepository.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('User not found');
    }

    if (existing.role === UserRole.SUPER_ADMIN) {
      const superCount = await UserRepository.findMany({
        where: { role: UserRole.SUPER_ADMIN, isActive: true },
        select: { id: true },
      });
      if (superCount.length <= 1) {
        throw new Error('Cannot delete the last active Super Admin');
      }
    }

    return UserRepository.delete({ where: { id } });
  }
}
