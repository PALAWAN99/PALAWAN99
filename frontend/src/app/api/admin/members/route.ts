import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { memberSchema } from '@/lib/validations';
import { logAction } from '@/lib/audit';
import { checkRateLimit } from '@/lib/rate-limit';

// GET: ดึงรายการสมาชิก
export async function GET(req: NextRequest) {
  const session = await auth();

  const rateLimitError = checkRateLimit(req, 100);
  if (rateLimitError) return rateLimitError;

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkAccess(session, 'MEMBER', 'READ')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  try {
    const members = await prisma.member.findMany({
      where: {
        OR: [
          { memberNo: { contains: search, mode: 'insensitive' } },
          { citizenId: { contains: search, mode: 'insensitive' } },
          { firstNameTh: { contains: search, mode: 'insensitive' } },
          { lastNameTh: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: เพิ่มสมาชิกใหม่
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkAccess(session, 'MEMBER', 'CREATE')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    
    // Validate with Zod
    const validation = memberSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const data = validation.data;

    // Check duplicates
    const existingNo = await prisma.member.findUnique({ where: { memberNo: data.memberNo } });
    if (existingNo) {
      return NextResponse.json({ error: 'Member Number already exists' }, { status: 400 });
    }

    if (data.citizenId) {
      const existingId = await prisma.member.findUnique({ where: { citizenId: data.citizenId } });
      if (existingId) {
        return NextResponse.json({ error: 'Citizen ID already exists' }, { status: 400 });
      }
    }

    const member = await prisma.member.create({
      data: {
        ...data,
        citizenId: data.citizenId || null,
        email: data.email || null,
      },
    });

    // บันทึก Audit Log
    await logAction({
      action: 'CREATE',
      resource: 'MEMBER',
      resourceId: member.id,
      after: member,
      req,
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

