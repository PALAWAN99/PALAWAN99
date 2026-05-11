import { prisma } from './src/lib/prisma.ts';

async function seed() {
  console.log('🌱 Seeding data...');

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
      firstNameTh: 'สมชาย',
      lastNameTh: 'ใจดี',
      memberType: 'REGULAR',
      status: 'ACTIVE',
    }
  });

  console.log('✅ Seed complete!');
  console.log('Branch Code: BKK01');
  console.log('Gate Code: G-MAIN-01');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
