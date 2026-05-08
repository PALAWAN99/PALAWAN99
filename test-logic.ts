import { prisma } from './src/lib/prisma.ts';

async function main() {
  console.log('🚀 เริ่มต้นการทดสอบระบบแบบ End-to-End...');

  try {
    // 1. เตรียมข้อมูลพื้นฐาน
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

    // 2. สร้าง QR Token จำลอง
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999); // หมดอายุเที่ยงคืนวันนี้

    const token = 'TEST-QR-' + Math.random().toString(36).substring(7).toUpperCase();
    
    await prisma.qrToken.create({
      data: {
        tokenHash: token,
        memberId: member.id,
        purpose: 'ENTRY',
        issuedDate: new Date(),
        expiresAt: expiresAt,
      },
    });

    console.log('\n✅ [SUCCESS] เตรียมข้อมูลทดสอบเรียบร้อย!');
    console.log('-----------------------------------');
    console.log('สาขา:', branch.nameTh);
    console.log('ประตู:', gate.nameTh + ' (' + gate.id + ')');
    console.log('สมาชิก:', member.firstNameTh + ' ' + member.lastNameTh);
    console.log('QR Token สำหรับทดสอบ:', token);
    console.log('-----------------------------------');
    console.log('\n👉 ขั้นตอนถัดไป: มาสเตอร์P สามารถนำ Token นี้ไปกรอกในหน้า Validate หรือให้ผมรัน API ทดสอบให้ต่อได้เลยครับ');

  } catch (error) {
    console.error('❌ [ERROR]:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
