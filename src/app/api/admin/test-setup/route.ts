import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // สร้างข้อมูลพื้นฐานผ่านระบบ API ปกติ
    const branch = await prisma.branch.upsert({
      where: { code: 'MAIN01' },
      update: {},
      create: {
        code: 'MAIN01',
        nameTh: 'สำนักงานใหญ่',
        nameEn: 'Headquarters',
        nameZh: '总部',
      },
    });

    const gate = await prisma.gate.upsert({
      where: { gateCode: 'GATE-01' },
      update: {},
      create: {
        gateCode: 'GATE-01',
        nameTh: 'ประตูหน้า',
        nameEn: 'Main Gate',
        nameZh: '大门',
        branchId: branch.id,
      },
    });

    const member = await prisma.member.upsert({
      where: { memberNo: 'MEMBER-001' },
      update: {},
      create: {
        memberNo: 'MEMBER-001',
        firstNameTh: 'มาสเตอร์',
        lastNameTh: 'พี',
        status: 'ACTIVE',
      },
    });

    const token = 'TEST-QR-' + Math.random().toString(36).substring(7).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    await prisma.qrToken.create({
      data: {
        tokenHash: token,
        memberId: member.id,
        purpose: 'ENTRY',
        issuedDate: new Date(),
        expiresAt: expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        branch: branch.nameTh,
        gate: gate.nameTh,
        member: member.firstNameTh + ' ' + member.lastNameTh,
        testToken: token,
        gateId: gate.id
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
