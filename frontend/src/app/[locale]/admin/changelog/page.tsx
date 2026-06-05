import { auth } from '@/auth';
import { ensureChangelogSeed } from '@/lib/changelog/seed';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ChangelogClient, { type ChangelogRow } from './ChangelogClient';

export const dynamic = 'force-dynamic';

const PAGE_LIMIT = 15;

export default async function ChangelogPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  await ensureChangelogSeed();

  const [total, rawRows] = await Promise.all([
    prisma.changelogEntry.count({ where: {} }),
    prisma.changelogEntry.findMany({
      where: {},
      orderBy: [{ releasedAt: 'desc' }, { createdAt: 'desc' }],
      take: PAGE_LIMIT,
      skip: 0,
    }),
  ]);

  const initialRows: ChangelogRow[] = rawRows.map((r) => ({
    id: r.id,
    version: r.version,
    title: r.title,
    description: r.description,
    changeType: r.changeType as ChangelogRow['changeType'],
    releasedAt: r.releasedAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));

  return <ChangelogClient initialRows={initialRows} initialTotal={total} pageLimit={PAGE_LIMIT} />;
}
