import { prisma } from '../src/lib/prisma';
import { ensureChangelogSeed } from '../src/lib/changelog/seed';
import { hash } from 'bcryptjs';

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Admin User
  const adminPassword = await hash('admin1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gate.local' },
    update: {},
    create: {
      email: 'admin@gate.local',
      passwordHash: adminPassword,
      fullName: 'System Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // 2. Create Branches
  const branches = [
    { code: 'MAIN', nameTh: 'อาคารหลัก', nameEn: 'Main Building', nameZh: '主楼' },
    { code: 'LIB',  nameTh: 'ห้องสมุด', nameEn: 'Library', nameZh: '图书馆' },
  ];

  for (const b of branches) {
    const branch = await prisma.branch.upsert({
      where: { code: b.code },
      update: {},
      create: {
        code: b.code,
        nameTh: b.nameTh,
        nameEn: b.nameEn,
        nameZh: b.nameZh,
      },
    });
    console.log(`✅ Branch created: ${branch.nameEn}`);
  }

  // 3. Create QR Policies
  const policies = [
    { name: 'default', ttlSeconds: 86400, oneTimeUse: false, maxUsesPerDay: 10, isDefault: true },
    { name: 'strict',  ttlSeconds: 86400, oneTimeUse: true,  maxUsesPerDay: 2,  isDefault: false },
  ];

  for (const p of policies) {
    await prisma.qrPolicy.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }
  console.log('✅ QR Policies created');

  // 4. Create Test Members
  const members = [
    {
      memberNo: 'MEM-001',
      citizenId: '1100100000001',
      firstNameTh: 'สมชาย',
      lastNameTh: 'ใจดี',
      firstNameEn: 'Somchai',
      lastNameEn: 'Jaidee',
      email: 'somchai@example.com',
      phone: '0812345678',
      memberType: 'STUDENT',
      status: 'ACTIVE',
      expireDate: new Date('2026-12-31'),
    }
  ];

  for (const m of members) {
    await prisma.member.upsert({
      where: { memberNo: m.memberNo },
      update: {},
      create: m,
    });
  }
  console.log('✅ Test members created');

  // 5. Create Gate and Device for Dashboard
  const mainBranch = await prisma.branch.findUnique({ where: { code: 'MAIN' } });
  if (mainBranch) {
    const gate = await prisma.gate.upsert({
      where: { gateCode: 'G-MAIN-01' },
      update: {},
      create: {
        gateCode: 'G-MAIN-01',
        nameTh: 'ประตูทางเข้าหลัก',
        nameEn: 'Main Entrance Gate',
        nameZh: '正门',
        branchId: mainBranch.id,
        direction: 'BIDIRECTIONAL',
        status: 'ACTIVE',
      },
    });
    console.log('✅ Gate created: G-MAIN-01');

    await prisma.deviceRegistry.upsert({
      where: { deviceCode: 'DEV-SCAN-01' },
      update: {},
      create: {
        deviceCode: 'DEV-SCAN-01',
        name: 'Main Scanner 01',
        gateId: gate.id,
        deviceType: 'QR_SCANNER',
        secretHash: 'test-secret-hash',
        status: 'ONLINE',
      },
    });
    console.log('✅ Device created: DEV-SCAN-01');
  }

  await ensureChangelogSeed();
  console.log('✅ Changelog seeded (v1.0.0+)');

  console.log('🌳 Seed complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
