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
  status: string;
  expireDate: Date | null;
  createdAt: Date;
  metadata?: MemberMetadata;
}
