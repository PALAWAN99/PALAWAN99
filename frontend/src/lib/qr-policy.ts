import 'server-only';
import dayjs from 'dayjs';
import type { QrPolicy } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function getQrPolicyById(id: string): Promise<QrPolicy | null> {
  return prisma.qrPolicy.findUnique({ where: { id } });
}

export async function getDefaultQrPolicy(): Promise<QrPolicy | null> {
  const def = await prisma.qrPolicy.findFirst({ where: { isDefault: true } });
  if (def) return def;
  return prisma.qrPolicy.findFirst({ orderBy: { createdAt: 'asc' } });
}

export async function resolveQrPolicy(policyId?: string | null): Promise<QrPolicy | null> {
  const id = policyId?.trim();
  if (id) {
    const p = await getQrPolicyById(id);
    if (p) return p;
  }
  return getDefaultQrPolicy();
}

/** หมดอายุตามนโยบาย (นับจากเวลาออก ตาม ttlSeconds) */
export function expiresAtFromPolicy(policy: QrPolicy, from = new Date()): Date {
  return dayjs(from).add(policy.ttlSeconds, 'second').toDate();
}
