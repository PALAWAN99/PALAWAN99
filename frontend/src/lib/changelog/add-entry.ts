import type { ChangelogChangeType, PrismaClient } from '@prisma/client';
import { APP_VERSION } from '@/lib/app-meta';

export type AddChangelogInput = {
  version?: string;
  title: string;
  description: string;
  changeType?: ChangelogChangeType;
  releasedAt?: Date;
};

export async function addChangelogEntry(prisma: PrismaClient, input: AddChangelogInput) {
  return prisma.changelogEntry.create({
    data: {
      version: input.version ?? APP_VERSION,
      title: input.title.slice(0, 200),
      description: input.description,
      changeType: input.changeType ?? 'FEATURE',
      releasedAt: input.releasedAt ?? new Date(),
    },
  });
}
