import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { auth } from '@/auth';
import { ensureChangelogSeed } from '@/lib/changelog/seed';
import { prisma } from '@/lib/prisma';
import {
  ApiBadRequest,
  ApiCreated,
  ApiForbidden,
  ApiPaginated,
  ApiUnauthorized,
  handleError,
} from '@/lib/api-response';
import { checkAccess } from '@/lib/auth-session';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createSchema = z.object({
  version: z.string().min(1).max(20),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  changeType: z.enum(['FEATURE', 'FIX', 'IMPROVEMENT', 'SECURITY', 'OTHER']).default('FEATURE'),
  releasedAt: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();

  try {
    await ensureChangelogSeed();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '15', 10)));
    const q = (searchParams.get('q') || '').trim();
    const version = (searchParams.get('version') || '').trim();
    const changeType = searchParams.get('changeType') || undefined;

    const where: Prisma.ChangelogEntryWhereInput = {
      ...(version && { version }),
      ...(changeType && {
        changeType: changeType as Prisma.EnumChangelogChangeTypeFilter['equals'],
      }),
      ...(q && {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { version: { contains: q, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, rows] = await Promise.all([
      prisma.changelogEntry.count({ where }),
      prisma.changelogEntry.findMany({
        where,
        orderBy: [{ releasedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return ApiPaginated(rows, total, page, limit);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return ApiUnauthorized();
  if (!checkAccess(session, 'SETTING', 'MANAGE')) return ApiForbidden();

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return ApiBadRequest('ข้อมูลไม่ถูกต้อง', parsed.error.flatten());

    const { version, title, description, changeType, releasedAt } = parsed.data;
    const entry = await prisma.changelogEntry.create({
      data: {
        version,
        title,
        description,
        changeType,
        releasedAt: releasedAt ? new Date(releasedAt) : new Date(),
      },
    });

    return ApiCreated(entry, 'บันทึก changelog สำเร็จ');
  } catch (error) {
    return handleError(error);
  }
}
