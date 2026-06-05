import { UserRole, MemberType, MemberStatus, GateDirection, AccessSource, AccessDecision } from '@prisma/client';

export interface BaseMetadata {
  [key: string]: any;
}

export interface MemberDTO {
  id: string;
  memberNo: string;
  firstNameTh: string;
  lastNameTh: string;
  firstNameEn?: string | null;
  lastNameEn?: string | null;
  citizenId?: string | null;
  email?: string | null;
  phone?: string | null;
  memberType: MemberType;
  status: MemberStatus;
  expireDate?: Date | null;
  metadata?: BaseMetadata;
}

export interface AccessEventDTO {
  id: string;
  gateId: string;
  memberId?: string | null;
  qrTokenId?: string | null;
  direction: GateDirection;
  source: AccessSource;
  decision: AccessDecision;
  reasonCode?: string | null;
  scannedAt: Date;
  metadata?: BaseMetadata;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
