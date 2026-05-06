import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { hash } from 'argon2';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAction } from '@/lib/audit';

// GET: ดึงข้อมูลรายชื่อผู้ใช้
export async function GET(req: NextRequest) {
  const session = await auth();

  const rateLimitError = checkRateLimit(req, 60);
  if (rateLimitError) return rateLimitError;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkAccess(session, 'USER', 'READ')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
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

    return NextResponse.json(users);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: สร้างผู้ใช้ใหม่ (Super Admin เท่านั้น)
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkAccess(session, 'USER', 'CREATE')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { email, fullName, password, role } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // เช็คว่ามี email ซ้ำไหม
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Hash password
    const passwordHash = await hash(password);

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash,
        role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    });

    // บันทึก Audit Log
    await logAction({
      action: 'CREATE',
      resource: 'USER',
      resourceId: user.id,
      after: user,
      req,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

