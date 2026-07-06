import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { checkAccess } from '@/lib/rbac';
import { memberSchema } from '@/lib/validations';
import { logAction } from '@/lib/audit';

type Params = {
  params: Promise<{ id: string }>;
};

// GET: ดูรายละเอียดสมาชิกรายบุคคล
export const GET = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkAccess(req.auth, 'MEMBER', 'READ')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const member = await prisma.member.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

// PATCH: แก้ไขข้อมูลสมาชิก
export const PATCH = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!checkAccess(req.auth, 'MEMBER', 'UPDATE')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Partial validation for PATCH
    const validation = memberSchema.partial().safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.flatten().fieldErrors 
      }, { status: 400 });
    }

    const before = await prisma.member.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const updated = await prisma.member.update({
      where: { id },
      data: validation.data,
    });

    // บันทึก Audit Log
    await logAction({
      action: 'UPDATE',
      resource: 'MEMBER',
      resourceId: id,
      before,
      after: updated,
      req,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

// DELETE: ลบสมาชิก (หรือ Deactivate)
export const DELETE = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ใช้สิทธิ์ DELETE ในเมทริกซ์
  if (!checkAccess(req.auth, 'MEMBER', 'DELETE')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    const before = await prisma.member.findUnique({ where: { id } });
    if (!before) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // ลบข้อมูลจริง (หรือจะเปลี่ยนเป็นเปลี่ยน status ก็ได้ตามความเหมาะสม)
    await prisma.member.delete({ where: { id } });

    // บันทึก Audit Log
    await logAction({
      action: 'DELETE',
      resource: 'MEMBER',
      resourceId: id,
      before,
      req,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
