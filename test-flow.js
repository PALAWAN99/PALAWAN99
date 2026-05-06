const { PrismaClient } = require('./node_modules/@prisma/client');

// ใช้ Prisma แบบมาตรฐานเลยครับ แล้วเราจะส่งค่า URL ผ่าน Command Line แทน
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 กำลังเริ่มเตรียมข้อมูลทดสอบ...');

  // 1. สร้าง Branch
  const branch = await prisma.branch.upsert({
    where: { code: 'TEST01' },
    update: {},
    create: {
      code: 'TEST01',
      nameTh: 'สาขาทดสอบ',
      nameEn: 'Test Branch',
      nameZh: '测试分支',
    },
  });
  console.log('✅ สร้าง Branch สำเร็จ:', branch.id);

  // 2. สร้าง Gate
  const gate = await prisma.gate.upsert({
    where: { gateCode: 'G-TEST' },
    update: {},
    create: {
      gateCode: 'G-TEST',
      nameTh: 'ประตูทดสอบ',
      nameEn: 'Test Gate',
      nameZh: '测试门',
      branchId: branch.id,
      direction: 'IN',
    },
  });
  console.log('✅ สร้าง Gate สำเร็จ:', gate.id);

  // 3. สร้าง Member
  const member = await prisma.member.upsert({
    where: { memberNo: 'MEM-001' },
    update: {},
    create: {
      memberNo: 'MEM-001',
      firstNameTh: 'ทดสอบ',
      lastNameTh: 'ระบบ',
      status: 'ACTIVE',
      expireDate: new Date('2030-12-31'),
    },
  });
  console.log('✅ สร้าง Member สำเร็จ:', member.id);

  // 4. สร้าง QR Token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1);

  const qrToken = await prisma.qrToken.create({
    data: {
      tokenHash: 'TOKEN-TEST-' + Math.floor(Math.random() * 1000000),
      memberId: member.id,
      purpose: 'ENTRY',
      issuedDate: new Date(),
      expiresAt: expiresAt,
    },
  });
  console.log('✅ สร้าง QR Token สำเร็จ:', qrToken.tokenHash);

  console.log('\n--------------------------------------');
  console.log('🎯 สรุปข้อมูลสำหรับการทดสอบ API:');
  console.log('Gate ID:', gate.id);
  console.log('Token:', qrToken.tokenHash);
  console.log('--------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาด:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
