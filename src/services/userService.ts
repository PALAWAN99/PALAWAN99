import { UserRepository } from '@/repositories/userRepository';
import { userSchema, UserInput } from '@/validators/userValidator';
import { hash } from 'bcryptjs';

export class UserService {
  /**
   * ดึงข้อมูลรายชื่อผู้ใช้
   */
  static async getUsers() {
    return UserRepository.findMany({
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
    return UserRepository.findUnique({
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
