import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🌱 Seeding data via API...');

    // 1. Create Branch
    const branch = await prisma.branch.upsert({
      where: { code: 'BKK01' },
      update: {},
      create: {
        code: 'BKK01',
        nameTh: 'สาขากรุงเทพ (สำนักงานใหญ่)',
        nameEn: 'Bangkok Head Office',
        nameZh: '曼谷总部',
      }
    });

    // 2. Create Gate
    const gate = await prisma.gate.upsert({
      where: { gateCode: 'G-MAIN-01' },
      update: {},
      create: {
        gateCode: 'G-MAIN-01',
        nameTh: 'ประตูทางเข้าหลัก A',
        nameEn: 'Main Entrance A',
        nameZh: '主入口 A',
        branchId: branch.id,
        direction: 'BIDIRECTIONAL',
      }
    });

    // 3. Create Device
    await prisma.deviceRegistry.upsert({
      where: { deviceCode: 'SCAN-001' },
      update: { status: 'ONLINE', lastSeenAt: new Date() },
      create: {
        deviceCode: 'SCAN-001',
        name: 'เครื่องสแกนหน้าประตู A1',
        gateId: gate.id,
        deviceType: 'QR_SCANNER',
        secretHash: 'hashed_secret',
        status: 'ONLINE',
        lastSeenAt: new Date(),
      }
    });

    // 4. Create Member
    const member = await prisma.member.upsert({
      where: { memberNo: 'M67001' },
      update: {},
      create: {
        memberNo: 'M67001',
        citizenId: '1234567890123',
        firstNameTh: 'สมชาย',
        lastNameTh: 'ใจดี',
        memberType: 'REGULAR',
        status: 'ACTIVE',
      }
    });

    return NextResponse.json({
      success: true,
      message: '✅ Seed complete!',
      data: {
        branch: branch.code,
        gate: gate.gateCode,
        member: member.memberNo
      }
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
