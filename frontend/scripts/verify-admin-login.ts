import '../load-root-env';
import { compare } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
  const email = 'admin@library.kku.ac.th';
  const pwd = 'KkuLib#Qr2026!xR9mP2wK';
  const u = await prisma.user.findUnique({ where: { email } });
  console.log('user:', u ? { email: u.email, role: u.role, active: u.isActive } : null);
  if (u) {
    console.log('password ok:', await compare(pwd, u.passwordHash));
  }
  await prisma.$disconnect();
  await pool.end();
}

main();
