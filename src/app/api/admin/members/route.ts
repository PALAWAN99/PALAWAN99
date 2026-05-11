import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { MemberService } from '@/services/memberService';
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
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const result = await MemberService.getMembers(search, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    const { handleApiError } = await import('@/lib/api-error');
    return handleApiError(error);
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

    // Use Service for business logic (duplicate check + creation)
    const member = await MemberService.createMember(data);

    // บันทึก Audit Log
    await logAction({
      action: 'CREATE',
      resource: 'MEMBER',
      resourceId: member.id,
      after: member,
      req,
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error);
    
    // Handle business logic errors
    if (error.message.includes('already exists')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

