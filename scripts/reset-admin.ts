import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash('admin1234', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@gate.local' },
    update: {
      passwordHash: passwordHash,
      isActive: true,
      role: 'SUPER_ADMIN'
    },
    create: {
      email: 'admin@gate.local',
      passwordHash: passwordHash,
      fullName: 'System Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin password reset to: admin1234');
  console.log('User:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
