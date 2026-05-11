import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { UserService } from '@/services/userService';
import { checkAccess } from '@/lib/rbac';
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
    const users = await UserService.getUsers();
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

    // Use Service
    const user = await UserService.createUser({
      email,
      fullName,
      password,
      role,
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
  } catch (error: any) {
    console.error('API Error:', error);
    
    if (error.message.includes('already exists') || error.message.includes('required')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

