import { Member as PrismaMember } from '@prisma/client';

export type Member = PrismaMember;

export interface MemberMetadata {
  birthDate?: string;
  gender?: string;
  address?: string;
  school?: string;
  prefixTh?: string;
  prefixEn?: string;
}

export interface MemberWithStats extends Member {
  _count?: {
    accessEvents: number;
  };
}
