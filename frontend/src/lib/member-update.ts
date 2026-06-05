import type { Prisma } from '@prisma/client';
import type { memberSchema } from '@/validators/memberValidator';
import type { z } from 'zod';

export type MemberPatchInput = Partial<z.infer<typeof memberSchema>>;

export function memberPatchToPrisma(data: MemberPatchInput): Prisma.MemberUpdateInput {
  const {
    photo,
    metadata,
    expireDate,
    citizenId,
    email,
    phone,
    firstNameEn,
    lastNameEn,
    ...rest
  } = data;

  const update: Prisma.MemberUpdateInput = { ...rest };

  if (citizenId !== undefined) update.citizenId = citizenId || null;
  if (email !== undefined) update.email = email || null;
  if (phone !== undefined) update.phone = phone || null;
  if (firstNameEn !== undefined) update.firstNameEn = firstNameEn || null;
  if (lastNameEn !== undefined) update.lastNameEn = lastNameEn || null;
  if (expireDate !== undefined) update.expireDate = expireDate ?? null;
  if (photo !== undefined) {
    update.photo = photo
      ? Buffer.from(photo.includes(',') ? photo.split(',')[1] : photo, 'base64')
      : null;
  }
  if (metadata !== undefined) update.metadata = metadata;

  return update;
}
