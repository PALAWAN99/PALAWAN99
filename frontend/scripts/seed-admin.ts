/**
 * สร้าง/อัปเดตผู้ดูแลระบบใน PostgreSQL จริง
 * ใช้: npm run seed:admin (โหลด `.env` จากราก monorepo)
 */
import '../load-root-env';
import { hash } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, UserRole } from '@prisma/client';
import { Pool } from 'pg';

const ADMIN_EMAIL = 'admin@library.kku.ac.th';
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? 'KkuLib#Qr2026!xR9mP2wK';
const ADMIN_ROLE: UserRole =
  (process.env.ADMIN_SEED_ROLE as UserRole | undefined) ?? 'SUPER_ADMIN';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const passwordHash = await hash(ADMIN_PASSWORD, 12);

    const user = await prisma.user.upsert({
      where: { email: ADMIN_EMAIL },
      update: {
        passwordHash,
        fullName: 'KKU Library Administrator',
        role: ADMIN_ROLE,
        isActive: true,
      },
      create: {
        email: ADMIN_EMAIL,
        passwordHash,
        fullName: 'KKU Library Administrator',
        role: ADMIN_ROLE,
        isActive: true,
      },
    });

    console.log('Admin user ready');
    console.log('  email   :', user.email);
    console.log('  role    :', user.role);
    console.log('  password:', ADMIN_PASSWORD);
    console.log('  (set ADMIN_SEED_PASSWORD in env to override)');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
