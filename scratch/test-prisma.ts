import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'node:path';

async function test() {
  console.log('Testing Prisma connection with CORRECT adapter usage...');
  const dbUrl = 'file:./dev.db';

  try {
    // CORRECT USAGE for Prisma 7: Pass the config object, NOT the database instance
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    const prisma = new PrismaClient({ adapter });

    console.log('Attempting to fetch members...');
    const members = await prisma.member.findMany({ take: 5 });
    console.log('Success! Found members:', members.length);
    if (members.length > 0) {
        console.log('First member:', members[0].firstNameTh);
    }
    
    await prisma.$disconnect();
  } catch (error: any) {
    console.error('FAILED:', error);
    if (error.stack) console.error(error.stack);
  }
}

test();
