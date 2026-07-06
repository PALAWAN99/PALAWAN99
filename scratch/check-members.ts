import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const members = await prisma.member.findMany({
    take: 5,
    select: {
      memberNo: true,
      citizenId: true,
      firstNameTh: true,
      lastNameTh: true,
      status: true
    }
  });
  console.log(JSON.stringify(members, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
