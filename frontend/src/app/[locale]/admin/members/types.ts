import { AccessDirection, AccessDecision, MemberStatus } from '@/types/api';

export interface MemberMetadata {
  prefixTh?: string;
  prefixEn?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  school?: string;
}

export interface Member {
  id: string;
  memberNo: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string | null;
  lastNameEn: string | null;
  citizenId: string | null;
  email: string | null;
  phone: string | null;
  memberType: string;
  status: MemberStatus;
  expireDate: Date | null;
  createdAt: Date;
  metadata?: MemberMetadata;
}

export interface AccessEvent {
  id: string;
  gateId: string;
  memberId: string | null;
  scannedAt: string;
  direction: AccessDirection;
  decision: AccessDecision;
  source: string;
  gate: {
    nameTh: string;
    nameEn: string;
  };
}

export interface MemberFormData {
  id?: string;
  memberNo: string;
  citizenId: string;
  prefixTh: string;
  prefixEn: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn: string;
  lastNameEn: string;
  email: string;
  phone: string;
  memberType: string;
  status: string;
  expireDate: string;
  birthDate?: string;
  gender?: string;
  address?: string;
  school?: string;
}
