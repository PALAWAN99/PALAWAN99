import { prisma } from '../src/lib/prisma';
import { hash } from 'argon2';

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Admin User
  const adminPassword = await hash('admin1234');
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
